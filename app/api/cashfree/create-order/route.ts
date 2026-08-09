import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CASHFREE_API_VERSION = "2026-01-01";

type CreateCashfreeOrderBody = {
  amount?: number;

  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

function getCashfreeConfig() {
  const appId =
    process.env.CASHFREE_APP_ID?.trim();

  const secretKey =
    process.env.CASHFREE_SECRET_KEY?.trim();

  const environment =
    (
      process.env.CASHFREE_ENV ||
      "sandbox"
    )
      .trim()
      .toLowerCase();

  if (!appId) {
    throw new Error(
      "CASHFREE_APP_ID is missing in Vercel Environment Variables.",
    );
  }

  if (!secretKey) {
    throw new Error(
      "CASHFREE_SECRET_KEY is missing in Vercel Environment Variables.",
    );
  }

  const isProduction =
    environment === "production";

  return {
    appId,
    secretKey,

    environment:
      isProduction
        ? "production"
        : "sandbox",

    baseUrl:
      isProduction
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg",
  };
}

function generateOrderId() {
  const timestamp =
    Date.now();

  const random =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

  return `KRVE_${timestamp}_${random}`;
}

function generateCustomerId() {
  const timestamp =
    Date.now();

  const random =
    Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

  return `KRVE_CUSTOMER_${timestamp}_${random}`;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as CreateCashfreeOrderBody;

    const amount =
      Number(
        body.amount,
      );

    if (
      !Number.isFinite(
        amount,
      ) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid order amount.",
        },
        {
          status: 400,
        },
      );
    }

    const customerName =
      (
        body.customer?.name ||
        "KRVE Customer"
      ).trim();

    const customerEmail =
      (
        body.customer?.email ||
        ""
      )
        .trim()
        .toLowerCase();

    const customerPhone =
      (
        body.customer?.phone ||
        ""
      ).replace(
        /\D/g,
        "",
      );

    if (
      customerPhone.length <
      10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Valid customer phone number is required.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      appId,
      secretKey,
      environment,
      baseUrl,
    } =
      getCashfreeConfig();

    const orderId =
      generateOrderId();

    const customerId =
      generateCustomerId();

    const origin =
      new URL(
        request.url,
      ).origin;

    const returnUrl =
      `${origin}/payment/cashfree` +
      `?order_id=${encodeURIComponent(
        orderId,
      )}`;

    const payload = {
      order_id:
        orderId,

      order_amount:
        Number(
          amount.toFixed(2),
        ),

      order_currency:
        "INR",

      customer_details: {
        customer_id:
          customerId,

        customer_name:
          customerName,

        customer_email:
          customerEmail ||
          undefined,

        customer_phone:
          customerPhone,
      },

      order_meta: {
        return_url:
          returnUrl,
      },

      order_note:
        "KRVE Fashion order",

      order_tags: {
        brand:
          "KRVE",

        source:
          "krve-fashion",
      },
    };

    const cashfreeResponse =
      await fetch(
        `${baseUrl}/orders`,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-api-version":
              CASHFREE_API_VERSION,

            "x-client-id":
              appId,

            "x-client-secret":
              secretKey,

            "x-request-id":
              crypto.randomUUID(),

            "x-idempotency-key":
              crypto.randomUUID(),
          },

          body:
            JSON.stringify(
              payload,
            ),

          cache:
            "no-store",
        },
      );

    const cashfreeData =
      (await cashfreeResponse.json()) as {
        cf_order_id?: string;

        order_id?: string;

        order_status?: string;

        payment_session_id?: string;

        order_amount?: number;

        order_currency?: string;

        message?: string;

        code?: string;

        type?: string;
      };

    if (
      !cashfreeResponse.ok
    ) {
      console.error(
        "CASHFREE_CREATE_ORDER_FAILED",
        {
          status:
            cashfreeResponse.status,

          response:
            cashfreeData,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            cashfreeData.message ||
            "Cashfree order could not be created.",
        },
        {
          status:
            cashfreeResponse.status,
        },
      );
    }

    if (
      !cashfreeData.payment_session_id ||
      !cashfreeData.order_id
    ) {
      console.error(
        "CASHFREE_PAYMENT_SESSION_MISSING",
        cashfreeData,
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Cashfree payment session was not returned.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        environment,

        order: {
          id:
            cashfreeData.order_id,

          cashfreeOrderId:
            cashfreeData.cf_order_id ??
            null,

          paymentSessionId:
            cashfreeData.payment_session_id,

          status:
            cashfreeData.order_status ??
            "ACTIVE",

          amount:
            Number(
              cashfreeData.order_amount ??
              amount,
            ),

          currency:
            cashfreeData.order_currency ??
            "INR",
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_CASHFREE_CREATE_ORDER_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to create Cashfree payment order.",
      },
      {
        status: 500,
      },
    );
  }
}
