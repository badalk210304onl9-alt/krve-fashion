import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type CentralApiOrderItem = {
  id?: string;
  name?: string;
  productName?: string;
  product_name?: string;
  image?: string | null;
  productImageUrl?: string | null;
  product_image_url?: string | null;
  size?: string | null;
  colour?: string | null;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  unit_price?: number;
};

type CentralApiOrder = {
  id?: string;
  orderNumber?: string;
  order_number?: string;
  createdAt?: string;
  created_at?: string;
  status?: string;
  paymentStatus?: string;
  payment_status?: string;
  paymentMethod?: string;
  payment_method?: string;
  total?: number;
  currency?: string;
  itemCount?: number;
  item_count?: number;
  items?: CentralApiOrderItem[];
  payment?: {
    provider?: string;
  } | null;
};

type CentralApiResponse = {
  success?: boolean;
  message?: string;
  orders?: CentralApiOrder[];
  data?: {
    orders?: CentralApiOrder[];
  };
};

function normalizeStatus(value?: string):
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled" {
  const status = (value ?? "").trim().toLowerCase();

  if (status === "processing") return "processing";
  if (status === "shipped") return "shipped";
  if (status === "delivered") return "delivered";
  if (status === "cancelled" || status === "canceled") return "cancelled";

  return "confirmed";
}

function normalizePaymentStatus(value?: string):
  | "paid"
  | "pending"
  | "failed"
  | "refunded" {
  const status = (value ?? "").trim().toLowerCase();

  if (status === "paid") return "paid";
  if (status === "failed") return "failed";
  if (status === "refunded" || status === "partially_refunded") return "refunded";

  return "pending";
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase configuration is missing.",
        },
        { status: 500 },
      );
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Cookie writes are not required for this GET response.
            }
          },
        },
      },
    );

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please sign in to view your orders.",
        },
        { status: 401 },
      );
    }

    const customerEmail = data.user.email?.trim().toLowerCase();

    if (!customerEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Your KRVE account does not have a valid email address.",
        },
        { status: 400 },
      );
    }

    const centralApiBaseUrl = (
      process.env.KRVE_CENTRAL_API_URL ??
      "https://krve-central-api.badalk210304-onl9.workers.dev"
    ).replace(/\/+$/, "");

    const websiteSecret = process.env.KRVE_WEBSITE_SECRET?.trim();

    if (!websiteSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "KRVE website authentication is not configured.",
        },
        { status: 500 },
      );
    }

    const url = new URL(`${centralApiBaseUrl}/customer/orders`);
    url.searchParams.set("customerEmail", customerEmail);
    url.searchParams.set("limit", "100");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-KRVE-Website-Key": websiteSecret,
      },
      cache: "no-store",
    });

    let centralData: CentralApiResponse | null = null;

    try {
      centralData = (await response.json()) as CentralApiResponse;
    } catch {
      centralData = null;
    }

    if (!response.ok || !centralData?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            centralData?.message ||
            `KRVE Central API returned ${response.status}.`,
        },
        { status: response.status || 502 },
      );
    }

    const rawOrders = Array.isArray(centralData.orders)
      ? centralData.orders
      : Array.isArray(centralData.data?.orders)
        ? centralData.data!.orders!
        : [];

    const orders = rawOrders.map((order, orderIndex) => {
      const rawItems = Array.isArray(order.items) ? order.items : [];

      const items = rawItems.map((item, index) => ({
        id: item.id || `${order.id || orderIndex}-item-${index}`,
        name:
          item.name ||
          item.productName ||
          item.product_name ||
          "KRVE Product",
        image:
          item.image ??
          item.productImageUrl ??
          item.product_image_url ??
          null,
        size: item.size ?? null,
        colour: item.colour ?? null,
        quantity: Math.max(1, Number(item.quantity ?? 1)),
        price: Math.max(
          0,
          Number(item.price ?? item.unitPrice ?? item.unit_price ?? 0),
        ),
      }));

      return {
        id:
          order.id ||
          order.orderNumber ||
          order.order_number ||
          `krve-order-${orderIndex}`,
        orderNumber:
          order.orderNumber ||
          order.order_number ||
          "KRVE ORDER",
        createdAt:
          order.createdAt ||
          order.created_at ||
          new Date().toISOString(),
        status: normalizeStatus(order.status),
        paymentStatus: normalizePaymentStatus(
          order.paymentStatus || order.payment_status,
        ),
        paymentMethod: (
          order.paymentMethod ||
          order.payment_method ||
          order.payment?.provider ||
          "KRVE"
        )
          .toString()
          .toUpperCase(),
        total: Math.max(0, Number(order.total ?? 0)),
        currency: (order.currency ?? "INR").toString().toUpperCase(),
        itemCount: Number(
          order.itemCount ??
            order.item_count ??
            items.reduce((sum, item) => sum + item.quantity, 0),
        ),
        items,
      };
    });

    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: data.user.id,
          email: customerEmail,
        },
        orders,
        count: orders.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("KRVE_ACCOUNT_ORDERS_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Your KRVE orders could not be loaded.",
      },
      { status: 500 },
    );
  }
}
