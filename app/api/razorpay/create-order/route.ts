import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

type CreateOrderRequest = {
  amount?: number;
  receipt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

function getRazorpayCredentials() {
  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ??
    process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay environment variables are missing.",
    );
  }

  return {
    keyId,
    keySecret,
  };
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as CreateOrderRequest;

    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        {
          status: 400,
        },
      );
    }

    /*
      Frontend sends amount in rupees.
      Razorpay needs amount in paise.

      ₹1 = 100 paise
    */

    const amountInPaise = Math.round(amount * 100);

    if (amountInPaise < 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum payment amount is ₹1.",
        },
        {
          status: 400,
        },
      );
    }

    const { keyId, keySecret } =
      getRazorpayCredentials();

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const generatedReceipt =
      body.receipt?.trim() ||
      `krve_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",

      receipt: generatedReceipt.slice(0, 40),

      notes: {
        brand: "KRVE",

        customer_name:
          body.customerName?.slice(0, 100) ?? "",

        customer_email:
          body.customerEmail?.slice(0, 100) ?? "",

        customer_phone:
          body.customerPhone?.slice(0, 30) ?? "",
      },
    });

    return NextResponse.json(
      {
        success: true,

        keyId,

        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_RAZORPAY_CREATE_ORDER_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to create Razorpay order.",
      },
      {
        status: 500,
      },
    );
  }
}
