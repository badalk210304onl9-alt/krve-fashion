import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getProducts,
  type ProductCategory,
  type ProductStatus,
} from "@/lib/api";

function getStringParameter(
  request: NextRequest,
  name: string,
) {
  const value =
    request.nextUrl.searchParams.get(
      name,
    );

  if (
    !value ||
    !value.trim()
  ) {
    return undefined;
  }

  return value.trim();
}

function getNumberParameter(
  request: NextRequest,
  name: string,
) {
  const value =
    request.nextUrl.searchParams.get(
      name,
    );

  if (
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number,
    )
  ) {
    return undefined;
  }

  return Math.max(
    0,
    Math.floor(number),
  );
}

function getBooleanParameter(
  request: NextRequest,
  name: string,
) {
  const value =
    request.nextUrl.searchParams.get(
      name,
    );

  if (
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  if (
    value === "true" ||
    value === "1"
  ) {
    return true;
  }

  if (
    value === "false" ||
    value === "0"
  ) {
    return false;
  }

  return undefined;
}

function isProductCategory(
  value:
    | string
    | undefined,
): value is ProductCategory {
  return (
    value ===
      "menswear" ||
    value ===
      "womenswear" ||
    value ===
      "kidswear" ||
    value ===
      "accessories" ||
    value ===
      "footwear"
  );
}

function isProductStatus(
  value:
    | string
    | undefined,
): value is ProductStatus {
  return (
    value ===
      "draft" ||
    value ===
      "published" ||
    value ===
      "archived"
  );
}

export async function GET(
  request: NextRequest,
) {
  try {
    const category =
      getStringParameter(
        request,
        "category",
      );

    const status =
      getStringParameter(
        request,
        "status",
      );

    const search =
      getStringParameter(
        request,
        "search",
      );

    const limit =
      getNumberParameter(
        request,
        "limit",
      );

    const offset =
      getNumberParameter(
        request,
        "offset",
      );

    const featured =
      getBooleanParameter(
        request,
        "featured",
      );

    const newArrival =
      getBooleanParameter(
        request,
        "newArrival",
      );

    if (
      category &&
      !isProductCategory(
        category,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product category.",
          code:
            "INVALID_CATEGORY",
        },
        {
          status: 400,
        },
      );
    }

    if (
      status &&
      !isProductStatus(
        status,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid product status.",
          code:
            "INVALID_STATUS",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await getProducts({
        category:
          category as
            | ProductCategory
            | undefined,

        status:
          status as
            | ProductStatus
            | undefined,

        search,

        featured,

        newArrival,

        limit:
          limit ??
          100,

        offset:
          offset ??
          0,
      });

    return NextResponse.json(
      {
        success: true,

        data: {
          products:
            result.products,

          pagination:
            result.pagination,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error(
      "KRVE_PUBLIC_PRODUCTS_API_ERROR",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to load KRVE products.";

    return NextResponse.json(
      {
        success: false,
        message,
        code:
          "PRODUCTS_FETCH_FAILED",
      },
      {
        status: 502,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}
