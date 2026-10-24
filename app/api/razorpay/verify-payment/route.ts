import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VerifyPaymentRequest = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  order?: Record<string, unknown>;
};

function compareSignatures(
  expected: string,
  received: string,
) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPaymentRequest;

    const paymentId = body.razorpay_payment_id?.trim();
    const orderId = body.razorpay_order_id?.trim();
    const receivedSignature = body.razorpay_signature?.trim();

    if (!paymentId || !orderId || !receivedSignature) {
      return NextResponse.json(
        {
          success: false,
          message: "Incomplete payment verification information.",
        },
        { status: 400 },
      );
    }

    const keyId =
      process.env.RAZORPAY_KEY_ID?.trim() ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay credentials are missing in Vercel Environment Variables.",
      );
    }

    // Verify Razorpay's order/payment signature.
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (!compareSignatures(expectedSignature, receivedSignature)) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment signature verification failed.",
        },
        { status: 400 },
      );
    }

    // Confirm payment details directly with Razorpay.
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        cache: "no-store",
      },
    );

    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error("Razorpay payment lookup failed:", payment);
      return NextResponse.json(
        {
          success: false,
          message: "Unable to confirm payment with Razorpay.",
        },
        { status: 502 },
      );
    }

    if (
      payment.id !== paymentId ||
      payment.order_id !== orderId ||
      payment.currency !== "INR" ||
      payment.status !== "captured"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment is not confirmed as captured.",
        },
        { status: 400 },
      );
    }

    let centralOrder: unknown = null;

    if (body.order) {
      const apiUrl = (
        process.env.KRVE_API_URL ||
        process.env.NEXT_PUBLIC_KRVE_API_URL ||
        ""
      ).replace(/\/+$/, "");

      if (!apiUrl) {
        throw new Error("KRVE_API_URL is missing.");
      }

      const centralResponse = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.KRVE_WEBSITE_SECRET
            ? {
                "X-KRVE-Website-Key":
                  process.env.KRVE_WEBSITE_SECRET,
              }
            : {}),
        },
        body: JSON.stringify({
          ...body.order,
          paymentId,
          providerOrderId: orderId,
        }),
        cache: "no-store",
      });

      const centralPayload = await centralResponse.json();

      if (!centralResponse.ok || !centralPayload.success) {
        throw new Error(
          centralPayload.message ||
            "Payment succeeded, but the KRVE order could not be recorded.",
        );
      }

      centralOrder = centralPayload.data;
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      paymentId,
      orderId,
      centralOrder,
    });
  } catch (error) {
    console.error("KRVE_RAZORPAY_VERIFY_PAYMENT_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify payment.",
      },
      { status: 500 },
    );
  }
}
