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

  return apiUrl.replace(
    /\/+$/,
    "",
  );
}

/* =========================================================
   HELPERS
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
    Number.isFinite(query.limit)
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
    Number.isFinite(query.offset)
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

    throw new Error(message);
  }

  return result.data;
}

function normaliseProduct(
  product:
    Partial<KrveProduct>,
): KrveProduct {
  const imageUrl =
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    "";

  const gallery =
    Array.isArray(
      product.gallery,
    )
      ? product.gallery.filter(
          (
            image,
          ): image is string =>
            typeof image ===
              "string" &&
            image.trim().length >
              0,
        )
      : [];

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

  return {
    id:
      product.id || "",

    slug:
      product.slug ||
      product.id ||
      "",

    name:
      product.name ||
      "KRVE Product",

    shortDescription:
      product.shortDescription ??
      null,

    description:
      product.description ??
      null,

    category:
      product.category ||
      "menswear",

    price:
      Number.isFinite(
        Number(
          product.price,
        ),
      )
        ? Number(
            product.price,
          )
        : 0,

    compareAtPrice:
      product.compareAtPrice ===
        null ||
      product.compareAtPrice ===
        undefined
        ? null
        : Number.isFinite(
              Number(
                product.compareAtPrice,
              ),
            )
          ? Number(
              product.compareAtPrice,
            )
          : null,

    currency:
      product.currency ||
      "INR",

    imageUrl,

    image:
      imageUrl,

    gallery,

    sizes:
      Array.isArray(
        product.sizes,
      )
        ? product.sizes.filter(
            (
              size,
            ): size is string =>
              typeof size ===
                "string" &&
              size.trim().length >
                0,
          )
        : [],

    colours:
      Array.isArray(
        product.colours,
      )
        ? product.colours.filter(
            (
              colour,
            ): colour is string =>
              typeof colour ===
                "string" &&
              colour.trim().length >
                0,
          )
        : [],

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
      product.status ||
      "draft",

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
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache: "no-store",
      },
    );

  const data =
    await readApiResponse<ProductsResult>(
      response,
    );

  return {
    products:
      Array.isArray(
        data.products,
      )
        ? data.products.map(
            normaliseProduct,
          )
        : [],

    pagination: {
      total:
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
          : 0,

      limit:
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
            100,

      offset:
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
            0,
    },
  };
}

/* =========================================================
   ALL PUBLISHED PRODUCTS
========================================================= */

export async function getAllProducts() {
  const result =
    await getProducts({
      status: "published",
      limit: 100,
      offset: 0,
    });

  return result.products;
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
      status: "published",
      newArrival: true,
      limit: safeLimit,
      offset: 0,
    });

  /*
    Safety filtering is added here too,
    so only published New Arrival
    products reach the homepage.
  */

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
      status: "published",
      featured: true,
      limit: safeLimit,
      offset: 0,
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
  category: ProductCategory,
  limit = 100,
) {
  const result =
    await getProducts({
      category,
      status: "published",
      limit,
      offset: 0,
    });

  return result.products;
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

      offset: 0,
    });

  return result.products;
}

/* =========================================================
   SINGLE PRODUCT BY SLUG
========================================================= */

export async function getProductBySlug(
  slug: string,
) {
  const cleanedSlug =
    slug.trim();

  if (!cleanedSlug) {
    throw new Error(
      "Product slug is required.",
    );
  }

  const response =
    await fetch(
      `${getApiUrl()}/api/products/${encodeURIComponent(
        cleanedSlug,
      )}`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache: "no-store",
      },
    );

  const product =
    await readApiResponse<KrveProduct>(
      response,
    );

  return normaliseProduct(
    product,
  );
}

/* =========================================================
   SINGLE PRODUCT BY ID OR SLUG
   Alias for compatibility with old pages
========================================================= */

export async function getProduct(
  idOrSlug: string,
) {
  return getProductBySlug(
    idOrSlug,
  );
}
