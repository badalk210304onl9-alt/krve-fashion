export type ProductCategory =
  | "menswear"
  | "womenswear"
  | "kidswear"
  | "accessories"
  | "footwear";

export type ProductStatus =
  | "draft"
  | "published"
  | "archived";

export type KrveProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  images?: string[];
  sku?: string;
  status?: ProductStatus | string;
  featured?: boolean;
  newArrival?: boolean;
  inventory?: number;
  sizes?: string[];
  colors?: string[];
};

type ProductsResponse = {
  success?: boolean;
  data?: {
    products?: KrveProduct[];
    pagination?: {
      total?: number;
      limit?: number;
      offset?: number;
      hasMore?: boolean;
    };
  };
  products?: KrveProduct[];
  pagination?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasMore?: boolean;
  };
  message?: string;
};

type GetProductsOptions = {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  limit?: number;
  offset?: number;
};

function getCentralApiUrl() {
  const value =
    process.env.KRVE_CENTRAL_API_URL ||
    process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL ||
    "";

  return value.replace(
    /\/+$/,
    "",
  );
}

function normalizeImage(
  image:
    | string
    | null
    | undefined,
) {
  if (
    !image ||
    !image.trim()
  ) {
    return "/images/placeholder-product.jpg";
  }

  const value =
    image.trim();

  if (
    value.startsWith(
      "http://",
    ) ||
    value.startsWith(
      "https://",
    ) ||
    value.startsWith(
      "/",
    ) ||
    value.startsWith(
      "data:",
    )
  ) {
    return value;
  }

  return `/${value.replace(
    /^\/+/,
    "",
  )}`;
}

function normalizeProduct(
  product: KrveProduct,
): KrveProduct {
  return {
    ...product,

    id: String(
      product.id,
    ),

    slug:
      product.slug ||
      String(product.id),

    name:
      product.name ||
      "KRVE Product",

    category:
      product.category ||
      "Collection",

    price:
      Number(
        product.price,
      ) || 0,

    image:
      normalizeImage(
        product.image,
      ),

    images:
      Array.isArray(
        product.images,
      )
        ? product.images.map(
            normalizeImage,
          )
        : undefined,
  };
}

async function requestProducts(
  options: GetProductsOptions = {},
) {
  const baseUrl =
    getCentralApiUrl();

  if (!baseUrl) {
    throw new Error(
      "KRVE_CENTRAL_API_URL is not configured.",
    );
  }

  const params =
    new URLSearchParams();

  if (options.category) {
    params.set(
      "category",
      options.category,
    );
  }

  if (options.status) {
    params.set(
      "status",
      options.status,
    );
  }

  if (
    options.search &&
    options.search.trim()
  ) {
    params.set(
      "search",
      options.search.trim(),
    );
  }

  if (
    typeof options.featured ===
    "boolean"
  ) {
    params.set(
      "featured",
      String(
        options.featured,
      ),
    );
  }

  if (
    typeof options.newArrival ===
    "boolean"
  ) {
    params.set(
      "newArrival",
      String(
        options.newArrival,
      ),
    );
  }

  params.set(
    "limit",
    String(
      Math.min(
        Math.max(
          options.limit ?? 100,
          1,
        ),
        100,
      ),
    ),
  );

  params.set(
    "offset",
    String(
      Math.max(
        options.offset ?? 0,
        0,
      ),
    ),
  );

  const url =
    `${baseUrl}/api/products?${params.toString()}`;

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    throw new Error(
      `KRVE Central API returned ${response.status}.`,
    );
  }

  const payload =
    (await response.json()) as ProductsResponse;

  if (
    payload.success === false
  ) {
    throw new Error(
      payload.message ||
        "KRVE Central API returned an error.",
    );
  }

  const rawProducts =
    payload.data?.products ??
    payload.products ??
    [];

  const products =
    rawProducts.map(
      normalizeProduct,
    );

  const pagination =
    payload.data?.pagination ??
    payload.pagination ??
    {
      total:
        products.length,
      limit:
        options.limit ?? 100,
      offset:
        options.offset ?? 0,
      hasMore: false,
    };

  return {
    products,
    pagination: {
      total:
        pagination.total ??
        products.length,

      limit:
        pagination.limit ??
        options.limit ??
        100,

      offset:
        pagination.offset ??
        options.offset ??
        0,

      hasMore:
        pagination.hasMore ??
        false,
    },
  };
}

export async function getProducts(
  options: GetProductsOptions = {},
) {
  return requestProducts(
    options,
  );
}

export async function getProduct(
  productIdOrSlug: string,
) {
  const baseUrl =
    getCentralApiUrl();

  if (!baseUrl) {
    throw new Error(
      "KRVE_CENTRAL_API_URL is not configured.",
    );
  }

  const value =
    encodeURIComponent(
      productIdOrSlug,
    );

  const response =
    await fetch(
      `${baseUrl}/api/products/${value}`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache:
          "no-store",
      },
    );

  if (
    response.status ===
    404
  ) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `KRVE Central API returned ${response.status}.`,
    );
  }

  const payload =
    (await response.json()) as {
      success?: boolean;
      data?: {
        product?: KrveProduct;
      };
      product?: KrveProduct;
      message?: string;
    };

  if (
    payload.success === false
  ) {
    throw new Error(
      payload.message ||
        "Unable to load KRVE product.",
    );
  }

  const product =
    payload.data?.product ??
    payload.product;

  if (!product) {
    return null;
  }

  return normalizeProduct(
    product,
  );
}
