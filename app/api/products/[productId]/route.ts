import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getProduct,
} from "@/lib/api";

type RouteContext = {
  params: Promise<{
    productId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const {
      productId,
    } = await context.params;

    if (
      !productId ||
      !productId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID or slug is required.",
          code:
            "PRODUCT_ID_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    const product =
      await getProduct(
        productId.trim(),
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
          code:
            "PRODUCT_NOT_FOUND",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,

        data: {
          product,
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
      "KRVE_PRODUCT_API_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load product.",
        code:
          "PRODUCT_FETCH_FAILED",
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
