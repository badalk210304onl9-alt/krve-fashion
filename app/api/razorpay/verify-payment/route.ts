import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VerifyPaymentRequest = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  order?: Record<string, unknown>;
};

function compareSignatures(
  expectedSignature: string,
  receivedSignature: string,
) {
  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8",
  );

  const receivedBuffer = Buffer.from(
    receivedSignature,
    "utf8",
  );

  if (
    expectedBuffer.length !== receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  );
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as VerifyPaymentRequest;

    const paymentId =
      body.razorpay_payment_id?.trim();

    const orderId =
      body.razorpay_order_id?.trim();

    const receivedSignature =
      body.razorpay_signature?.trim();

    if (
      !paymentId ||
      !orderId ||
      !receivedSignature
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Incomplete payment verification information.",
        },
        {
          status: 400,
        },
      );
    }

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error(
        "RAZORPAY_KEY_SECRET is missing.",
      );
    }

    /*
      Razorpay signature payload:

      razorpay_order_id
      +
      "|"
      +
      razorpay_payment_id
    */

    const signaturePayload =
      `${orderId}|${paymentId}`;

    const expectedSignature = createHmac(
      "sha256",
      keySecret,
    )
      .update(signaturePayload)
      .digest("hex");

    const verified = compareSignatures(
      expectedSignature,
      receivedSignature,
    );

    if (!verified) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Payment signature verification failed.",
        },
        {
          status: 400,
        },
      );
    }

    let centralOrder: unknown = null;
    if (body.order) {
      const apiUrl = (process.env.KRVE_API_URL || process.env.NEXT_PUBLIC_KRVE_API_URL || "").replace(/\/+$/, "");
      if (!apiUrl) throw new Error("KRVE_API_URL is missing.");
      const centralResponse = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.KRVE_WEBSITE_SECRET ? { "X-KRVE-Website-Key": process.env.KRVE_WEBSITE_SECRET } : {}),
        },
        body: JSON.stringify({ ...body.order, paymentId, providerOrderId: orderId }),
        cache: "no-store",
      });
      const centralPayload = await centralResponse.json();
      if (!centralResponse.ok || !centralPayload.success) {
        throw new Error(centralPayload.message || "Payment succeeded, but the KRVE order could not be recorded.");
      }
      centralOrder = centralPayload.data;
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Payment verified successfully.",

        paymentId,
        orderId,
        centralOrder,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_RAZORPAY_VERIFY_PAYMENT_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to verify payment.",
      },
      {
        status: 500,
      },
    );
  }
}
