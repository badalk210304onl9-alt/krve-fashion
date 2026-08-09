import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CASHFREE_API_VERSION = "2026-01-01";

type VerifyOrderBody = {
  orderId?: string;
};

type CashfreeOrderResponse = {
  cf_order_id?: string;

  order_id?: string;

  order_amount?: number;

  order_currency?: string;

  order_status?: string;

  payment_session_id?: string;

  customer_details?: {
    customer_id?: string;

    customer_name?: string;

    customer_email?: string;

    customer_phone?: string;
  };

  order_meta?: {
    return_url?: string;
    notify_url?: string;
  };

  created_at?: string;

  message?: string;

  code?: string;

  type?: string;
};

type CashfreePayment = {
  cf_payment_id?: string | number;

  order_id?: string;

  payment_amount?: number;

  payment_currency?: string;

  payment_status?: string;

  payment_message?: string;

  payment_time?: string;

  bank_reference?: string;

  payment_group?: string;

  payment_method?: Record<
    string,
    unknown
  >;
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

  const production =
    environment === "production";

  return {
    appId,

    secretKey,

    environment:
      production
        ? "production"
        : "sandbox",

    baseUrl:
      production
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg",
  };
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as VerifyOrderBody;

    const orderId =
      body.orderId?.trim();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Cashfree order ID is required.",
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

    /*
      ======================================
      STEP 1
      VERIFY CASHFREE ORDER
      ======================================
    */

    const orderResponse =
      await fetch(
        `${baseUrl}/orders/${encodeURIComponent(
          orderId,
        )}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-api-version":
              CASHFREE_API_VERSION,

            "x-client-id":
              appId,

            "x-client-secret":
              secretKey,
          },

          cache: "no-store",
        },
      );

    let orderData:
      CashfreeOrderResponse | null =
      null;

    try {
      orderData =
        (await orderResponse.json()) as CashfreeOrderResponse;
    } catch {
      orderData = null;
    }

    if (
      !orderResponse.ok ||
      !orderData
    ) {
      console.error(
        "CASHFREE_VERIFY_ORDER_ERROR",
        {
          status:
            orderResponse.status,

          response:
            orderData,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            orderData?.message ||
            "Unable to verify Cashfree order.",
        },
        {
          status:
            orderResponse.status >=
              400
              ? orderResponse.status
              : 500,
        },
      );
    }

    /*
      ======================================
      STEP 2
      FETCH PAYMENT DETAILS
      ======================================

      Cashfree can have multiple payment
      attempts against the same order.

      We fetch them and select the SUCCESS
      payment if available.
    */

    const paymentsResponse =
      await fetch(
        `${baseUrl}/orders/${encodeURIComponent(
          orderId,
        )}/payments`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-api-version":
              CASHFREE_API_VERSION,

            "x-client-id":
              appId,

            "x-client-secret":
              secretKey,
          },

          cache: "no-store",
        },
      );

    let payments:
      CashfreePayment[] = [];

    if (
      paymentsResponse.ok
    ) {
      try {
        const paymentData =
          (await paymentsResponse.json()) as
            | CashfreePayment[]
            | {
                payments?: CashfreePayment[];
              };

        if (
          Array.isArray(
            paymentData,
          )
        ) {
          payments =
            paymentData;
        } else if (
          Array.isArray(
            paymentData.payments,
          )
        ) {
          payments =
            paymentData.payments;
        }
      } catch {
        payments = [];
      }
    }

    const successfulPayment =
      payments.find(
        (payment) =>
          payment.payment_status
            ?.trim()
            .toUpperCase() ===
          "SUCCESS",
      );

    const latestPayment =
      successfulPayment ??
      payments[0] ??
      null;

    const orderStatus =
      (
        orderData.order_status ||
        ""
      )
        .trim()
        .toUpperCase();

    /*
      Cashfree order is considered paid
      only after server-side verification.
    */

    const paid =
      orderStatus === "PAID";

    if (!paid) {
      return NextResponse.json(
        {
          success: true,

          paid: false,

          environment,

          order: {
            id:
              orderData.order_id ||
              orderId,

            cashfreeOrderId:
              orderData.cf_order_id ??
              null,

            status:
              orderStatus ||
              "UNKNOWN",

            amount:
              Number(
                orderData.order_amount ??
                  0,
              ),

            currency:
              orderData.order_currency ||
              "INR",
          },

          payment:
            latestPayment
              ? {
                  id:
                    latestPayment.cf_payment_id
                      ? String(
                          latestPayment.cf_payment_id,
                        )
                      : null,

                  status:
                    latestPayment.payment_status ??
                    null,

                  amount:
                    Number(
                      latestPayment.payment_amount ??
                        0,
                    ),

                  currency:
                    latestPayment.payment_currency ??
                    "INR",

                  bankReference:
                    latestPayment.bank_reference ??
                    null,

                  paymentGroup:
                    latestPayment.payment_group ??
                    null,

                  paymentMethod:
                    latestPayment.payment_method ??
                    null,

                  paymentTime:
                    latestPayment.payment_time ??
                    null,
                }
              : null,
        },
        {
          status: 200,
        },
      );
    }

    /*
      ======================================
      PAID
      ======================================
    */

    return NextResponse.json(
      {
        success: true,

        paid: true,

        environment,

        order: {
          id:
            orderData.order_id ||
            orderId,

          cashfreeOrderId:
            orderData.cf_order_id ??
            null,

          status:
            orderStatus,

          amount:
            Number(
              orderData.order_amount ??
                0,
            ),

          currency:
            orderData.order_currency ||
            "INR",
        },

        payment:
          latestPayment
            ? {
                id:
                  latestPayment.cf_payment_id
                    ? String(
                        latestPayment.cf_payment_id,
                      )
                    : null,

                status:
                  latestPayment.payment_status ||
                  "SUCCESS",

                amount:
                  Number(
                    latestPayment.payment_amount ??
                      orderData.order_amount ??
                      0,
                  ),

                currency:
                  latestPayment.payment_currency ||
                  orderData.order_currency ||
                  "INR",

                bankReference:
                  latestPayment.bank_reference ??
                  null,

                paymentGroup:
                  latestPayment.payment_group ??
                  null,

                paymentMethod:
                  latestPayment.payment_method ??
                  null,

                paymentTime:
                  latestPayment.payment_time ??
                  null,
              }
            : {
                id: null,

                status:
                  "SUCCESS",

                amount:
                  Number(
                    orderData.order_amount ??
                      0,
                  ),

                currency:
                  orderData.order_currency ||
                  "INR",

                bankReference:
                  null,

                paymentGroup:
                  null,

                paymentMethod:
                  null,

                paymentTime:
                  null,
              },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_CASHFREE_VERIFY_ORDER_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        paid: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to verify Cashfree payment.",
      },
      {
        status: 500,
      },
    );
  }
}
