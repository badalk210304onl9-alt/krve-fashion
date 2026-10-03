import {
  NextRequest,
  NextResponse,
} from "next/server";

export const dynamic =
  "force-dynamic";

function getCentralApiUrl() {
  return (
    process.env
      .KRVE_CENTRAL_API_URL ||
    ""
  ).replace(
    /\/+$/,
    "",
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const url =
      new URL(
        request.url,
      );

    const orderNumber =
      url.searchParams.get(
        "orderNumber",
      ) || "";

    const email =
      url.searchParams.get(
        "email",
      ) || "";

    if (
      !orderNumber ||
      !email
    ) {
      return NextResponse.json(
        {
          error:
            "Order ID and email address are required.",
        },
        {
          status: 400,
        },
      );
    }

    const baseUrl =
      getCentralApiUrl();

    if (!baseUrl) {
      return NextResponse.json(
        {
          error:
            "KRVE Central API URL is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const response =
      await fetch(
        `${baseUrl}/orders/returns?orderNumber=${encodeURIComponent(
          orderNumber,
        )}&email=${encodeURIComponent(
          email,
        )}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept:
              "application/json",
          },
        },
      );

    const data =
      await response
        .json()
        .catch(() => null);

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      },
    );
  } catch (error) {
    console.error(
      "RETURNS_GET_ERROR",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to connect to KRVE Central API.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const baseUrl =
      getCentralApiUrl();

    if (!baseUrl) {
      return NextResponse.json(
        {
          error:
            "KRVE Central API URL is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const response =
      await fetch(
        `${baseUrl}/orders/returns/request`,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              body,
            ),

          cache: "no-store",
        },
      );

    const data =
      await response
        .json()
        .catch(() => null);

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      },
    );
  } catch (error) {
    console.error(
      "RETURNS_POST_ERROR",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit return request.",
      },
      {
        status: 500,
      },
    );
  }
}
