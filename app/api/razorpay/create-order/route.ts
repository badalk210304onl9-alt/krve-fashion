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

  shippingAddress?: {
    recipientName?: string;
    phone?: string;

    addressLine1?: string;
    addressLine2?: string;

    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  billingAddress?: {
    recipientName?: string;
    phone?: string;

    addressLine1?: string;
    addressLine2?: string;

    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

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
  const url =
    process.env.KRVE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_API_URL?.trim();

  if (!url) {
    throw new Error(
      "KRVE_API_URL is missing in Vercel Environment Variables.",
    );
  }

  return url.replace(/\/+$/, "");
}

function getWebsiteSecret() {
  const secret =
    process.env.KRVE_WEBSITE_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "KRVE_WEBSITE_SECRET is missing in Vercel Environment Variables.",
    );
  }

  return secret;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as CreateOrderRequest;

    if (
      !body.items ||
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

    const paymentId =
      body.payment
        ?.providerPaymentId
        ?.trim();

    const razorpayOrderId =
      body.payment
        ?.providerOrderId
        ?.trim();

    if (
      !paymentId ||
      !razorpayOrderId
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Verified Razorpay payment information is required.",
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

    const centralApiResponse =
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

          cache: "no-store",
        },
      );

    let centralApiData:
      | {
          success?: boolean;

          message?: string;

          data?: {
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
      centralApiData =
        await centralApiResponse.json();
    } catch {
      centralApiData = null;
    }

    if (
      !centralApiResponse.ok ||
      !centralApiData?.success
    ) {
      console.error(
        "KRVE_CENTRAL_API_ORDER_ERROR",
        {
          status:
            centralApiResponse.status,

          response:
            centralApiData,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            centralApiData?.message ||
            "Payment succeeded, but KRVE could not save the order. Please contact KRVE support.",
        },
        {
          status:
            centralApiResponse.status >=
              400 &&
            centralApiResponse.status <
              600
              ? centralApiResponse.status
              : 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order:
          centralApiData.data
            ?.order ?? null,

        payment:
          centralApiData.data
            ?.payment ?? null,
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
