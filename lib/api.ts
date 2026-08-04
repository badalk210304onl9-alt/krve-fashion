import "server-only";

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

export type ProductFilters = {
  category?: ProductCategory;
  featured?: boolean;
  newArrival?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

export type ProductPagination = {
  total: number;
  limit: number;
  offset: number;
};

export type ProductListData = {
  products: KrveProduct[];
  pagination: ProductPagination;
};

export type KrveApiHealth = {
  application: string;
  environment: string;
  database: string;
  products: number;
  timestamp: string;
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

type ApiResponse<T> =
  | ApiSuccess<T>
  | ApiFailure;

type PublicRequestOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export class KrvePublicApiError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
  ) {
    super(message);

    this.name = "KrvePublicApiError";
    this.status = status;
    this.code = code;
  }
}

function getApiBaseUrl() {
  const value =
    process.env.KRVE_API_URL?.trim();

  if (!value) {
    throw new Error(
      "KRVE_API_URL environment variable is missing.",
    );
  }

  return value.replace(/\/+$/, "");
}

function createQueryString(
  values: Record<
    string,
    string | number | boolean | undefined
  >,
) {
  const searchParams =
    new URLSearchParams();

  Object.entries(values).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === ""
      ) {
        return;
      }

      searchParams.set(
        key,
        String(value),
      );
    },
  );

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
}

function safeStringArray(
  value: unknown,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (
      item,
    ): item is string =>
      typeof item === "string" &&
      item.trim().length > 0,
  );
}

function normalizeCategory(
  value: unknown,
): ProductCategory {
  if (
    value === "womenswear" ||
    value === "kidswear" ||
    value === "accessories" ||
    value === "footwear"
  ) {
    return value;
  }

  return "menswear";
}

function normalizeStatus(
  value: unknown,
): ProductStatus {
  if (
    value === "draft" ||
    value === "archived"
  ) {
    return value;
  }

  return "published";
}

function normalizeProduct(
  input: Partial<KrveProduct>,
): KrveProduct {
  const id =
    typeof input.id === "string" &&
    input.id.trim()
      ? input.id.trim()
      : crypto.randomUUID();

  const slug =
    typeof input.slug === "string" &&
    input.slug.trim()
      ? input.slug.trim()
      : id;

  const image =
    typeof input.image === "string" &&
    input.image.trim()
      ? input.image.trim()
      : typeof input.imageUrl === "string" &&
          input.imageUrl.trim()
        ? input.imageUrl.trim()
        : "/images/products/product-1.jpg";

  const price =
    Number.isFinite(
      Number(input.price),
    )
      ? Math.max(
          0,
          Number(input.price),
        )
      : 0;

  const compareAtPrice =
    input.compareAtPrice === null ||
    input.compareAtPrice === undefined
      ? null
      : Number.isFinite(
            Number(
              input.compareAtPrice,
            ),
          )
        ? Math.max(
            0,
            Number(
              input.compareAtPrice,
            ),
          )
        : null;

  const stockQuantity =
    Number.isFinite(
      Number(
        input.stockQuantity,
      ),
    )
      ? Math.max(
          0,
          Math.floor(
            Number(
              input.stockQuantity,
            ),
          ),
        )
      : 0;

  return {
    id,
    slug,

    name:
      typeof input.name === "string" &&
      input.name.trim()
        ? input.name.trim()
        : "KRVE Product",

    shortDescription:
      typeof input.shortDescription ===
        "string"
        ? input.shortDescription
        : null,

    description:
      typeof input.description ===
        "string"
        ? input.description
        : null,

    category:
      normalizeCategory(
        input.category,
      ),

    price,
    compareAtPrice,

    currency:
      typeof input.currency === "string" &&
      input.currency.trim()
        ? input.currency
            .trim()
            .toUpperCase()
        : "INR",

    imageUrl: image,
    image,

    gallery:
      safeStringArray(
        input.gallery,
      ).length > 0
        ? safeStringArray(
            input.gallery,
          )
        : [image],

    sizes:
      safeStringArray(
        input.sizes,
      ),

    colours:
      safeStringArray(
        input.colours,
      ),

    sku:
      typeof input.sku === "string" &&
      input.sku.trim()
        ? input.sku.trim()
        : null,

    stockQuantity,

    inStock:
      typeof input.inStock ===
        "boolean"
        ? input.inStock
        : stockQuantity > 0,

    featured:
      Boolean(
        input.featured,
      ),

    newArrival:
      Boolean(
        input.newArrival,
      ),

    status:
      normalizeStatus(
        input.status,
      ),

    createdAt:
      typeof input.createdAt === "string"
        ? input.createdAt
        : "",

    updatedAt:
      typeof input.updatedAt === "string"
        ? input.updatedAt
        : "",
  };
}

async function parseApiResponse<T>(
  response: Response,
): Promise<T> {
  let result:
    | ApiResponse<T>
    | undefined;

  try {
    result =
      (await response.json()) as
        ApiResponse<T>;
  } catch {
    throw new KrvePublicApiError(
      "KRVE API returned an invalid response.",
      response.status,
      "INVALID_API_RESPONSE",
    );
  }

  if (
    !response.ok ||
    !result.success
  ) {
    const message =
      result.success
        ? "The request could not be completed."
        : result.message;

    const code =
      result.success
        ? undefined
        : result.code;

    throw new KrvePublicApiError(
      message,
      response.status,
      code,
    );
  }

  return result.data;
}

async function publicRequest<T>(
  endpoint: string,
  options: PublicRequestOptions = {},
): Promise<T> {
  const revalidate =
    options.revalidate ??
    30;

  const response =
    await fetch(
      `${getApiBaseUrl()}${endpoint}`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },

        cache:
          revalidate === false
            ? "no-store"
            : "force-cache",

        next:
          revalidate === false
            ? undefined
            : {
                revalidate,
                tags:
                  options.tags,
              },
      },
    );

  return parseApiResponse<T>(
    response,
  );
}

/* =========================================================
   API HEALTH
========================================================= */

export async function getKrveApiHealth() {
  return publicRequest<KrveApiHealth>(
    "/api/health",
    {
      revalidate: false,
    },
  );
}

/* =========================================================
   PRODUCTS
========================================================= */

export async function getProducts(
  filters: ProductFilters = {},
) {
  const query =
    createQueryString({
      category:
        filters.category,

      featured:
        filters.featured,

      newArrival:
        filters.newArrival,

      search:
        filters.search?.trim(),

      limit:
        filters.limit ?? 100,

      offset:
        filters.offset ?? 0,
    });

  const result =
    await publicRequest<ProductListData>(
      `/api/products${query}`,
      {
        revalidate: 30,
        tags: [
          "krve-products",
        ],
      },
    );

  return {
    products:
      result.products.map(
        normalizeProduct,
      ),

    pagination:
      result.pagination,
  };
}

export async function getAllProducts() {
  const result =
    await getProducts({
      limit: 100,
      offset: 0,
    });

  return result.products;
}

export async function getFeaturedProducts(
  limit = 8,
) {
  const result =
    await getProducts({
      featured: true,
      limit,
      offset: 0,
    });

  return result.products;
}

export async function getNewArrivalProducts(
  limit = 8,
) {
  const result =
    await getProducts({
      newArrival: true,
      limit,
      offset: 0,
    });

  return result.products;
}

export async function getProductsByCategory(
  category: ProductCategory,
  limit = 100,
) {
  const result =
    await getProducts({
      category,
      limit,
      offset: 0,
    });

  return result.products;
}

export async function searchProducts(
  search: string,
  limit = 30,
) {
  const query =
    search.trim();

  if (!query) {
    return [];
  }

  const result =
    await getProducts({
      search: query,
      limit,
      offset: 0,
    });

  return result.products;
}

export async function getProductBySlug(
  idOrSlug: string,
) {
  const value =
    idOrSlug.trim();

  if (!value) {
    return null;
  }

  try {
    const result =
      await publicRequest<KrveProduct>(
        `/api/products/${encodeURIComponent(value)}`,
        {
          revalidate: 30,
          tags: [
            "krve-products",
            `krve-product-${value}`,
          ],
        },
      );

    return normalizeProduct(
      result,
    );
  } catch (error) {
    if (
      error instanceof
        KrvePublicApiError &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }
}

/* =========================================================
   PRODUCT HELPERS
========================================================= */

export function formatPrice(
  price: number,
  currency = "INR",
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(price);
}

export function getCategoryLabel(
  category: ProductCategory,
) {
  if (
    category === "womenswear"
  ) {
    return "Womenswear";
  }

  if (
    category === "kidswear"
  ) {
    return "Kidswear";
  }

  if (
    category === "accessories"
  ) {
    return "Accessories";
  }

  if (
    category === "footwear"
  ) {
    return "Footwear";
  }

  return "Menswear";
}

export function getStockLabel(
  stockQuantity: number,
) {
  if (stockQuantity <= 0) {
    return "Out of stock";
  }

  if (stockQuantity <= 5) {
    return "Only a few left";
  }

  return "In stock";
}

export function getPrimaryImage(
  product: KrveProduct,
) {
  return (
    product.image ||
    product.imageUrl ||
    product.gallery[0] ||
    "/images/products/product-1.jpg"
  );
}
