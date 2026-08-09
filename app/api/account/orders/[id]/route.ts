import {
  NextResponse,
} from "next/server";

import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

type OrderItem = {
  id: string;
  name: string;
  image?: string | null;
  size?: string | null;
  colour?: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status:
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus:
    | "paid"
    | "pending"
    | "failed"
    | "refunded";
  paymentMethod: string;
  total: number;
  currency: string;
  itemCount: number;
  items: OrderItem[];
};

type OrdersResponse = {
  success?: boolean;
  message?: string;
  orders?: Order[];
};

export async function GET(
  _request: Request,
  context: {
    params:
      Promise<{
        id: string;
      }>;
  },
) {
  try {
    const {
      id,
    } =
      await context.params;

    const cookieStore =
      await cookies();

    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const publishableKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (
      !supabaseUrl ||
      !publishableKey
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Supabase configuration is missing.",
        },
        {
          status: 500,
        },
      );
    }

    const supabase =
      createServerClient(
        supabaseUrl,
        publishableKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },

            setAll(
              cookiesToSet,
            ) {
              try {
                cookiesToSet.forEach(
                  ({
                    name,
                    value,
                    options,
                  }) => {
                    cookieStore.set(
                      name,
                      value,
                      options,
                    );
                  },
                );
              } catch {}
            },
          },
        },
      );

    const {
      data,
    } =
      await supabase.auth.getUser();

    if (
      !data.user
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please sign in to view this order.",
        },
        {
          status: 401,
        },
      );
    }

    /*
      Reuse the already-working
      customer orders route.

      This guarantees the customer
      can only access an order that
      belongs to their own account.
    */

    const origin =
      process.env
        .NEXT_PUBLIC_SITE_URL ||
      "https://krve-fashion.vercel.app";

    const ordersResponse =
      await fetch(
        `${origin}/api/account/orders`,
        {
          method:
            "GET",
          headers: {
            cookie:
              cookieStore
                .getAll()
                .map(
                  (
                    cookie,
                  ) =>
                    `${cookie.name}=${cookie.value}`,
                )
                .join("; "),
          },
          cache:
            "no-store",
        },
      );

    let ordersData:
      OrdersResponse | null =
      null;

    try {
      ordersData =
        (await ordersResponse.json()) as OrdersResponse;
    } catch {
      ordersData = null;
    }

    if (
      !ordersResponse.ok ||
      !ordersData?.success
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            ordersData?.message ||
            "Orders could not be loaded.",
        },
        {
          status:
            ordersResponse.status ||
            500,
        },
      );
    }

    const order =
      (
        ordersData.orders ??
        []
      ).find(
        (
          item,
        ) =>
          item.id === id ||
          item.orderNumber === id,
      );

    if (
      !order
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This KRVE order could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (
    error
  ) {
    console.error(
      "KRVE_ORDER_DETAILS_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Order details could not be loaded.",
      },
      {
        status: 500,
      },
    );
  }
}
