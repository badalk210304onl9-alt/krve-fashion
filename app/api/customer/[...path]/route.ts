import {
  NextRequest,
  NextResponse,
} from "next/server";

const CENTRAL_API_URL =
  process.env.KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-online.workers.dev";

async function proxyCustomerRequest(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  try {
    const { path } =
      await context.params;

    const endpoint =
      path.join("/");

    const search =
      request.nextUrl.search;

    const url =
      `${CENTRAL_API_URL.replace(
        /\/$/,
        "",
      )}/customer/${endpoint}${search}`;

    const headers =
      new Headers();

    const contentType =
      request.headers.get(
        "content-type",
      );

    if (contentType) {
      headers.set(
        "content-type",
        contentType,
      );
    }

    const authorization =
      request.headers.get(
        "authorization",
      );

    if (authorization) {
      headers.set(
        "authorization",
        authorization,
      );
    }

    const body =
      request.method === "GET" ||
      request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const response =
      await fetch(url, {
        method:
          request.method,

        headers,

        body,

        cache: "no-store",
      });

    const responseText =
      await response.text();

    return new NextResponse(
      responseText,
      {
        status:
          response.status,

        headers: {
          "Content-Type":
            response.headers.get(
              "content-type",
            ) ||
            "application/json",
        },
      },
    );
  } catch (error) {
    console.error(
      "CUSTOMER_API_PROXY_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            "Unable to connect to KRVE Customer API.",
        },
      },
      {
        status: 502,
      },
    );
  }
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  return proxyCustomerRequest(
    request,
    context,
  );
}

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  return proxyCustomerRequest(
    request,
    context,
  );
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  return proxyCustomerRequest(
    request,
    context,
  );
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  return proxyCustomerRequest(
    request,
    context,
  );
}

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  return proxyCustomerRequest(
    request,
    context,
  );
}
