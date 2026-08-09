import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateOrderRequest = {
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  customerEmail?: string;
  customerPhone?: string;

  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total?: number;

  currency?: string;

  couponCode?: string | null;

  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;

  notes?: string | null;

  items?: Array<{
    productId?: string | null;
    productName?: string;
    productImageUrl?: string | null;
    sku?: string | null;
    size?: string | null;
    colour?: string | null;
    unitPrice?: number;
    quantity?: number;
    lineTotal?: number;
  }>;

  payment?: {
    provider?: string;

    providerOrderId?: string | null;
    providerPaymentId?: string | null;
    providerSignature?: string | null;

    amount?: number;
    currency?: string;

    status?: string;

    rawResponse?: unknown;
  };
};

function getCentralApiUrl() {
  const value =
    process.env.KRVE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_API_URL?.trim();

  if (!value) {
    throw new Error(
      "KRVE_API_URL is missing in Vercel Environment Variables.",
    );
  }

  return value.replace(/\/+$/, "");
}

function getWebsiteSecret() {
  const value =
    process.env.KRVE_WEBSITE_SECRET?.trim();

  if (!value) {
    throw new Error(
      "KRVE_WEBSITE_SECRET is missing in Vercel Environment Variables.",
    );
  }

  return value;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as CreateOrderRequest;

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order items are required.",
        },
        {
          status: 400,
        },
      );
    }

    const total =
      Number(body.total ?? 0);

    if (
      !Number.isFinite(total) ||
      total <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid order total.",
        },
        {
          status: 400,
        },
      );
    }

    const provider =
      (
        body.payment?.provider ||
        ""
      )
        .trim()
        .toLowerCase();

    const paymentStatus =
      (
        body.payment?.status ||
        "pending"
      )
        .trim()
        .toLowerCase();

    /*
      CASHFREE PAID ORDER

      Paid online order must contain
      Cashfree order/payment identifiers.
    */

    if (
      provider === "cashfree" &&
      paymentStatus === "paid"
    ) {
      const providerOrderId =
        body.payment
          ?.providerOrderId
          ?.trim();

      const providerPaymentId =
        body.payment
          ?.providerPaymentId
          ?.trim();

      if (
        !providerOrderId ||
        !providerPaymentId
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Verified Cashfree payment details are required.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
      COD ORDER

      No gateway payment ID is required.
    */

    if (
      provider === "cod" &&
      paymentStatus !== "pending"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cash on Delivery order must have pending payment status.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      provider !== "cashfree" &&
      provider !== "cod" &&
      provider !== "razorpay"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unsupported payment provider.",
        },
        {
          status: 400,
        },
      );
    }

    const apiUrl =
      getCentralApiUrl();

    const websiteSecret =
      getWebsiteSecret();

    const upstreamResponse =
      await fetch(
        `${apiUrl}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "X-KRVE-Website-Key":
              websiteSecret,
          },

          body:
            JSON.stringify(body),

          cache:
            "no-store",
        },
      );

    let upstreamData:
      | {
          success?: boolean;

          message?: string;

          data?: {
            duplicate?: boolean;

            order?: {
              id?: string;
              orderNumber?: string;
              status?: string;
              paymentStatus?: string;
              total?: number;
              currency?: string;
              createdAt?: string;
            };

            payment?: {
              id?: string;

              provider?: string;

              providerOrderId?: string | null;

              providerPaymentId?: string | null;

              status?: string;
            };
          };
        }
      | null = null;

    try {
      upstreamData =
        await upstreamResponse.json();
    } catch {
      upstreamData = null;
    }

    if (
      !upstreamResponse.ok ||
      !upstreamData?.success
    ) {
      console.error(
        "KRVE_CENTRAL_API_ORDER_ERROR",
        {
          status:
            upstreamResponse.status,

          response:
            upstreamData,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            upstreamData?.message ||
            "KRVE order could not be saved.",
        },
        {
          status:
            upstreamResponse.status >= 400 &&
            upstreamResponse.status < 600
              ? upstreamResponse.status
              : 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        duplicate:
          upstreamData.data
            ?.duplicate ??
          false,

        message:
          "Order created successfully.",

        order:
          upstreamData.data
            ?.order ??
          null,

        payment:
          upstreamData.data
            ?.payment ??
          null,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_CREATE_ORDER_ROUTE_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to save KRVE order.",
      },
      {
        status: 500,
      },
    );
  }
}
