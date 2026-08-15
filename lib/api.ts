/* =========================================================
   KRVE CENTRAL API CLIENT
   Used by the KRVE customer-facing website
========================================================= */

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

  shortDescription: string | null;
  description: string | null;

  category: ProductCategory;

  price: number;
  compareAtPrice: number | null;

  currency: string;

  imageUrl: string;
  image: string;

  gallery: string[];

  sizes: string[];
  colours: string[];

  sku: string | null;

  stockQuantity: number;
  inStock: boolean;

  featured: boolean;
  newArrival: boolean;

  status: ProductStatus;

  createdAt: string;
  updatedAt: string;
};

export type ProductsPagination = {
  total: number;
  limit: number;
  offset: number;
};

export type ProductsResult = {
  products: KrveProduct[];
  pagination: ProductsPagination;
};

export type ProductQuery = {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  limit?: number;
  offset?: number;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
  code?: string;
};

export type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure;

/* =========================================================
   API URL
========================================================= */

function getApiUrl() {
  const apiUrl =
    process.env.KRVE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_API_URL?.trim();

  if (!apiUrl) {
    throw new Error(
      "KRVE API URL is missing. Add KRVE_API_URL in the Vercel environment variables.",
    );
  }

  return apiUrl.replace(/\/+$/, "");
}

/* =========================================================
   QUERY HELPERS
========================================================= */

function createQueryString(
  query: ProductQuery,
) {
  const parameters =
    new URLSearchParams();

  if (query.category) {
    parameters.set(
      "category",
      query.category,
    );
  }

  if (query.status) {
    parameters.set(
      "status",
      query.status,
    );
  }

  if (query.search?.trim()) {
    parameters.set(
      "search",
      query.search.trim(),
    );
  }

  if (
    typeof query.featured ===
    "boolean"
  ) {
    parameters.set(
      "featured",
      query.featured
        ? "true"
        : "false",
    );
  }

  if (
    typeof query.newArrival ===
    "boolean"
  ) {
    parameters.set(
      "newArrival",
      query.newArrival
        ? "true"
        : "false",
    );
  }

  if (
    typeof query.limit ===
      "number" &&
    Number.isFinite(
      query.limit,
    )
  ) {
    parameters.set(
      "limit",
      String(
        Math.max(
          1,
          Math.floor(
            query.limit,
          ),
        ),
      ),
    );
  }

  if (
    typeof query.offset ===
      "number" &&
    Number.isFinite(
      query.offset,
    )
  ) {
    parameters.set(
      "offset",
      String(
        Math.max(
          0,
          Math.floor(
            query.offset,
          ),
        ),
      ),
    );
  }

  return parameters.toString();
}

/* =========================================================
   RESPONSE HELPERS
========================================================= */

async function readApiResponse<T>(
  response: Response,
): Promise<T> {
  let result:
    | ApiResponse<T>
    | null = null;

  try {
    result =
      (await response.json()) as
        ApiResponse<T>;
  } catch {
    throw new Error(
      "KRVE Central API returned an invalid response.",
    );
  }

  if (
    !response.ok ||
    !result.success
  ) {
    const message =
      result &&
      !result.success
        ? result.message
        : `KRVE API request failed with status ${response.status}.`;

    throw new Error(
      message,
    );
  }

  return result.data;
}

/* =========================================================
   NORMALISATION HELPERS
========================================================= */

function normaliseStringArray(
  value: unknown,
) {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ): item is string =>
        typeof item ===
          "string" &&
        item.trim().length >
          0,
    )
    .map(
      (item) =>
        item.trim(),
    );
}

function normaliseCategory(
  category: unknown,
): ProductCategory {
  switch (category) {
    case "womenswear":
      return "womenswear";

    case "kidswear":
      return "kidswear";

    case "accessories":
      return "accessories";

    case "footwear":
      return "footwear";

    case "menswear":
    default:
      return "menswear";
  }
}

function normaliseStatus(
  status: unknown,
): ProductStatus {
  switch (status) {
    case "published":
      return "published";

    case "archived":
      return "archived";

    case "draft":
    default:
      return "draft";
  }
}

function normaliseProduct(
  product:
    Partial<KrveProduct>,
): KrveProduct {
  const rawGallery =
    normaliseStringArray(
      product.gallery,
    );

  const imageUrl =
    (
      product.imageUrl ||
      product.image ||
      rawGallery[0] ||
      ""
    ).trim();

  const gallery =
    [...rawGallery];

  if (
    imageUrl &&
    !gallery.includes(
      imageUrl,
    )
  ) {
    gallery.unshift(
      imageUrl,
    );
  }

  const stockQuantity =
    Number.isFinite(
      Number(
        product.stockQuantity,
      ),
    )
      ? Math.max(
          0,
          Math.floor(
            Number(
              product.stockQuantity,
            ),
          ),
        )
      : 0;

  const price =
    Number.isFinite(
      Number(
        product.price,
      ),
    )
      ? Number(
          product.price,
        )
      : 0;

  let compareAtPrice:
    | number
    | null =
    null;

  if (
    product.compareAtPrice !==
      null &&
    product.compareAtPrice !==
      undefined &&
    Number.isFinite(
      Number(
        product.compareAtPrice,
      ),
    )
  ) {
    compareAtPrice =
      Number(
        product.compareAtPrice,
      );
  }

  const id =
    String(
      product.id || "",
    ).trim();

  const slug =
    String(
      product.slug ||
        product.id ||
        "",
    ).trim();

  return {
    id,

    slug,

    name:
      String(
        product.name ||
          "KRVE Product",
      ).trim(),

    shortDescription:
      product.shortDescription ??
      null,

    description:
      product.description ??
      null,

    category:
      normaliseCategory(
        product.category,
      ),

    price,

    compareAtPrice,

    currency:
      String(
        product.currency ||
          "INR",
      )
        .trim()
        .toUpperCase(),

    imageUrl,

    image:
      imageUrl,

    gallery,

    sizes:
      normaliseStringArray(
        product.sizes,
      ),

    colours:
      normaliseStringArray(
        product.colours,
      ),

    sku:
      product.sku ??
      null,

    stockQuantity,

    inStock:
      typeof product.inStock ===
      "boolean"
        ? product.inStock
        : stockQuantity > 0,

    featured:
      Boolean(
        product.featured,
      ),

    newArrival:
      Boolean(
        product.newArrival,
      ),

    status:
      normaliseStatus(
        product.status,
      ),

    createdAt:
      product.createdAt ||
      "",

    updatedAt:
      product.updatedAt ||
      "",
  };
}

/* =========================================================
   PRODUCT LIST
========================================================= */

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductsResult> {
  const queryString =
    createQueryString(
      query,
    );

  const endpoint =
    `${getApiUrl()}/api/products${
      queryString
        ? `?${queryString}`
        : ""
    }`;

  const response =
    await fetch(
      endpoint,
      {
        method:
          "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache:
          "no-store",
      },
    );

  const data =
    await readApiResponse<ProductsResult>(
      response,
    );

  const products =
    Array.isArray(
      data.products,
    )
      ? data.products.map(
          normaliseProduct,
        )
      : [];

  const total =
    Number.isFinite(
      Number(
        data.pagination
          ?.total,
      ),
    )
      ? Number(
          data.pagination
            .total,
        )
      : products.length;

  const limit =
    Number.isFinite(
      Number(
        data.pagination
          ?.limit,
      ),
    )
      ? Number(
          data.pagination
            .limit,
        )
      : query.limit ||
        100;

  const offset =
    Number.isFinite(
      Number(
        data.pagination
          ?.offset,
      ),
    )
      ? Number(
          data.pagination
            .offset,
        )
      : query.offset ||
        0;

  return {
    products,

    pagination: {
      total,
      limit,
      offset,
    },
  };
}

/* =========================================================
   ALL PUBLISHED PRODUCTS
========================================================= */

export async function getAllProducts() {
  const result =
    await getProducts({
      status:
        "published",

      limit:
        100,

      offset:
        0,
    });

  return result.products.filter(
    (product) =>
      product.status ===
      "published",
  );
}

/* =========================================================
   NEW ARRIVALS
========================================================= */

export async function getNewArrivalProducts(
  limit = 4,
) {
  const safeLimit =
    Math.max(
      1,
      Math.floor(
        limit,
      ),
    );

  const result =
    await getProducts({
      status:
        "published",

      newArrival:
        true,

      limit:
        safeLimit,

      offset:
        0,
    });

  return result.products
    .filter(
      (product) =>
        product.status ===
          "published" &&
        product.newArrival,
    )
    .slice(
      0,
      safeLimit,
    );
}

/* =========================================================
   FEATURED PRODUCTS
========================================================= */

export async function getFeaturedProducts(
  limit = 8,
) {
  const safeLimit =
    Math.max(
      1,
      Math.floor(
        limit,
      ),
    );

  const result =
    await getProducts({
      status:
        "published",

      featured:
        true,

      limit:
        safeLimit,

      offset:
        0,
    });

  return result.products
    .filter(
      (product) =>
        product.status ===
          "published" &&
        product.featured,
    )
    .slice(
      0,
      safeLimit,
    );
}

/* =========================================================
   CATEGORY PRODUCTS
========================================================= */

export async function getProductsByCategory(
  category:
    ProductCategory,
  limit = 100,
) {
  const result =
    await getProducts({
      category,

      status:
        "published",

      limit,

      offset:
        0,
    });

  return result.products.filter(
    (product) =>
      product.status ===
      "published",
  );
}

/* =========================================================
   SEARCH PRODUCTS
========================================================= */

export async function searchProducts(
  search: string,
  limit = 20,
) {
  const cleanedSearch =
    search.trim();

  if (!cleanedSearch) {
    return [];
  }

  const result =
    await getProducts({
      search:
        cleanedSearch,

      status:
        "published",

      limit,

      offset:
        0,
    });

  return result.products.filter(
    (product) =>
      product.status ===
      "published",
  );
}

/* =========================================================
   PRODUCT MATCH HELPER
========================================================= */

function productMatchesIdentifier(
  product: KrveProduct,
  identifier: string,
) {
  const expected =
    identifier
      .trim()
      .toLowerCase();

  const productSlug =
    String(
      product.slug || "",
    )
      .trim()
      .toLowerCase();

  const productId =
    String(
      product.id || "",
    )
      .trim()
      .toLowerCase();

  return (
    productSlug ===
      expected ||
    productId ===
      expected
  );
}

/* =========================================================
   SINGLE PRODUCT BY SLUG

   IMPORTANT:
   1. First tries the Central API's direct product endpoint.
   2. If the backend accepts only IDs instead of slugs,
      it falls back to the published-products list.
   3. The fallback then finds the exact slug or ID.
========================================================= */

export async function getProductBySlug(
  slug: string,
): Promise<KrveProduct | null> {
  const cleanedSlug =
    decodeURIComponent(
      slug,
    ).trim();

  if (!cleanedSlug) {
    return null;
  }

  /*
   * -------------------------------------------------------
   * ATTEMPT 1
   * Direct endpoint.
   *
   * This continues to support the Central API if
   * /api/products/:identifier supports the product slug.
   * -------------------------------------------------------
   */

  try {
    const endpoint =
      `${getApiUrl()}/api/products/${encodeURIComponent(
        cleanedSlug,
      )}`;

    const response =
      await fetch(
        endpoint,
        {
          method:
            "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache:
            "no-store",
        },
      );

    if (
      response.ok
    ) {
      try {
        const product =
          await readApiResponse<KrveProduct>(
            response,
          );

        const normalised =
          normaliseProduct(
            product,
          );

        if (
          normalised.id ||
          normalised.slug
        ) {
          return normalised;
        }
      } catch (
        error
      ) {
        console.warn(
          "KRVE_DIRECT_PRODUCT_PARSE_FAILED",
          {
            slug:
              cleanedSlug,

            error,
          },
        );
      }
    } else {
      console.warn(
        "KRVE_DIRECT_PRODUCT_LOOKUP_FAILED",
        {
          slug:
            cleanedSlug,

          status:
            response.status,
        },
      );
    }
  } catch (
    error
  ) {
    console.warn(
      "KRVE_DIRECT_PRODUCT_REQUEST_FAILED",
      {
        slug:
          cleanedSlug,

        error,
      },
    );
  }

  /*
   * -------------------------------------------------------
   * ATTEMPT 2
   * Guaranteed fallback.
   *
   * Collection page already receives products from
   * /api/products, so we use the same working endpoint
   * and find the exact product locally.
   * -------------------------------------------------------
   */

  try {
    const result =
      await getProducts({
        status:
          "published",

        limit:
          100,

        offset:
          0,
      });

    const exactProduct =
      result.products.find(
        (product) =>
          productMatchesIdentifier(
            product,
            cleanedSlug,
          ),
      );

    if (
      exactProduct
    ) {
      return exactProduct;
    }
  } catch (
    error
  ) {
    console.error(
      "KRVE_PRODUCT_LIST_FALLBACK_FAILED",
      {
        slug:
          cleanedSlug,

        error,
      },
    );
  }

  /*
   * -------------------------------------------------------
   * ATTEMPT 3
   * Some API implementations may not properly honour
   * status filtering. Therefore try one broad list.
   * -------------------------------------------------------
   */

  try {
    const result =
      await getProducts({
        limit:
          100,

        offset:
          0,
      });

    const exactProduct =
      result.products.find(
        (product) =>
          productMatchesIdentifier(
            product,
            cleanedSlug,
          ),
      );

    if (
      exactProduct
    ) {
      return exactProduct;
    }
  } catch (
    error
  ) {
    console.error(
      "KRVE_PRODUCT_FINAL_FALLBACK_FAILED",
      {
        slug:
          cleanedSlug,

        error,
      },
    );
  }

  console.error(
    "KRVE_PRODUCT_NOT_FOUND",
    {
      slug:
        cleanedSlug,
    },
  );

  return null;
}

/* =========================================================
   SINGLE PRODUCT BY ID OR SLUG
   Compatibility alias
========================================================= */

export async function getProduct(
  idOrSlug: string,
) {
  return getProductBySlug(
    idOrSlug,
  );
}
