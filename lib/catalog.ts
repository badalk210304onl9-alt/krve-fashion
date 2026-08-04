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

export type Product = {
  id: string;
  slug: string;

  name: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;

  image: string;
  imageUrl: string;
  gallery: string[];

  category: ProductCategory;

  description: string;
  shortDescription: string;

  sizes: string[];
  colours: string[];

  sku: string | null;

  stockQuantity: number;
  inStock: boolean;

  featured: boolean;
  newArrival: boolean;

  status: ProductStatus;

  createdAt?: string;
  updatedAt?: string;
};

type ProductsApiResponse = {
  success: true;
  data: {
    products: Product[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
};

type ProductApiResponse = {
  success: true;
  data: Product;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
};

export type ProductFilters = {
  category?: ProductCategory;
  featured?: boolean;
  newArrival?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
};

/*
  Vercel me environment variable add karenge:

  NEXT_PUBLIC_KRVE_API_URL =
  https://aapka-worker-url.workers.dev
*/

const API_URL =
  process.env.NEXT_PUBLIC_KRVE_API_URL?.replace(
    /\/+$/,
    "",
  ) || "";

/*
  Ye products fallback ke liye hain.

  Jab Central API temporarily unavailable ho,
  website completely empty nahi hogi.
*/

export const products: Product[] = [
  {
    id: "signature-blazer",
    slug: "signature-blazer",

    name: "KrvE Signature Blazer",

    price: 199,
    compareAtPrice: null,
    currency: "INR",

    image: "/images/products/product-1.jpg",
    imageUrl: "/images/products/product-1.jpg",
    gallery: [
      "/images/products/product-1.jpg",
    ],

    category: "menswear",

    description:
      "A structured black blazer with a refined KRVE signature finish.",

    shortDescription:
      "A structured black blazer with a refined KRVE signature finish.",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colours: [
      "Black",
    ],

    sku: "KRVE-BLZ-001",

    stockQuantity: 20,
    inStock: true,

    featured: true,
    newArrival: true,

    status: "published",
  },

  {
    id: "luxe-shirt",
    slug: "luxe-shirt",

    name: "KrvE Luxe Shirt",

    price: 129,
    compareAtPrice: null,
    currency: "INR",

    image: "/images/products/product-2.jpg",
    imageUrl: "/images/products/product-2.jpg",
    gallery: [
      "/images/products/product-2.jpg",
    ],

    category: "menswear",

    description:
      "A sleek black shirt designed for evening sophistication.",

    shortDescription:
      "A sleek black shirt designed for evening sophistication.",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colours: [
      "Black",
    ],

    sku: "KRVE-SHT-001",

    stockQuantity: 25,
    inStock: true,

    featured: true,
    newArrival: true,

    status: "published",
  },

  {
    id: "travel-duffle",
    slug: "travel-duffle",

    name: "KrvE Travel Duffle",

    price: 249,
    compareAtPrice: null,
    currency: "INR",

    image: "/images/products/product-3.jpg",
    imageUrl: "/images/products/product-3.jpg",
    gallery: [
      "/images/products/product-3.jpg",
    ],

    category: "accessories",

    description:
      "A premium black duffle crafted for polished travel.",

    shortDescription:
      "A premium black duffle crafted for polished travel.",

    sizes: [
      "ONE SIZE",
    ],

    colours: [
      "Black",
    ],

    sku: "KRVE-BAG-001",

    stockQuantity: 14,
    inStock: true,

    featured: true,
    newArrival: true,

    status: "published",
  },

  {
    id: "elite-sneakers",
    slug: "elite-sneakers",

    name: "KrvE Elite Sneakers",

    price: 179,
    compareAtPrice: null,
    currency: "INR",

    image: "/images/products/product-4.jpg",
    imageUrl: "/images/products/product-4.jpg",
    gallery: [
      "/images/products/product-4.jpg",
    ],

    category: "footwear",

    description:
      "Minimal black sneakers built for refined everyday wear.",

    shortDescription:
      "Minimal black sneakers built for refined everyday wear.",

    sizes: [
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
    ],

    colours: [
      "Black",
    ],

    sku: "KRVE-SNK-001",

    stockQuantity: 18,
    inStock: true,

    featured: true,
    newArrival: true,

    status: "published",
  },
];

function normalizeProduct(
  product: Partial<Product>,
): Product {
  const id =
    product.id ||
    product.slug ||
    crypto.randomUUID();

  const slug =
    product.slug ||
    product.id ||
    id;

  const image =
    product.image ||
    product.imageUrl ||
    "/images/products/product-1.jpg";

  const description =
    product.description ||
    product.shortDescription ||
    "";

  const shortDescription =
    product.shortDescription ||
    product.description ||
    "";

  const stockQuantity =
    Number.isFinite(
      Number(product.stockQuantity),
    )
      ? Number(product.stockQuantity)
      : 0;

  return {
    id,
    slug,

    name:
      product.name ||
      "KRVE Product",

    price:
      Number.isFinite(
        Number(product.price),
      )
        ? Number(product.price)
        : 0,

    compareAtPrice:
      product.compareAtPrice === null ||
      product.compareAtPrice === undefined
        ? null
        : Number(product.compareAtPrice),

    currency:
      product.currency ||
      "INR",

    image,
    imageUrl: image,

    gallery:
      Array.isArray(product.gallery) &&
      product.gallery.length > 0
        ? product.gallery
        : [image],

    category:
      product.category ||
      "menswear",

    description,
    shortDescription,

    sizes:
      Array.isArray(product.sizes)
        ? product.sizes
        : [],

    colours:
      Array.isArray(product.colours)
        ? product.colours
        : [],

    sku:
      product.sku ?? null,

    stockQuantity,

    inStock:
      typeof product.inStock === "boolean"
        ? product.inStock
        : stockQuantity > 0,

    featured:
      Boolean(product.featured),

    newArrival:
      Boolean(product.newArrival),

    status:
      product.status ||
      "published",

    createdAt:
      product.createdAt,

    updatedAt:
      product.updatedAt,
  };
}

function buildProductsQuery(
  filters: ProductFilters,
) {
  const parameters =
    new URLSearchParams();

  if (filters.category) {
    parameters.set(
      "category",
      filters.category,
    );
  }

  if (
    filters.featured !== undefined
  ) {
    parameters.set(
      "featured",
      String(filters.featured),
    );
  }

  if (
    filters.newArrival !== undefined
  ) {
    parameters.set(
      "newArrival",
      String(filters.newArrival),
    );
  }

  if (filters.search?.trim()) {
    parameters.set(
      "search",
      filters.search.trim(),
    );
  }

  if (
    filters.limit !== undefined
  ) {
    parameters.set(
      "limit",
      String(filters.limit),
    );
  }

  if (
    filters.offset !== undefined
  ) {
    parameters.set(
      "offset",
      String(filters.offset),
    );
  }

  const query =
    parameters.toString();

  return query
    ? `?${query}`
    : "";
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  if (!API_URL) {
    console.warn(
      "NEXT_PUBLIC_KRVE_API_URL is missing. Using fallback products.",
    );

    return filterFallbackProducts(
      filters,
    );
  }

  try {
    const response =
      await fetch(
        `${API_URL}/api/products${buildProductsQuery(filters)}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    const result =
      (await response.json()) as
        | ProductsApiResponse
        | ApiErrorResponse;

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.success
          ? "Unable to load products."
          : result.message,
      );
    }

    return result.data.products.map(
      normalizeProduct,
    );
  } catch (error) {
    console.error(
      "KRVE_PRODUCTS_API_ERROR",
      error,
    );

    return filterFallbackProducts(
      filters,
    );
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const cleanSlug =
    slug.trim();

  if (!cleanSlug) {
    return undefined;
  }

  if (!API_URL) {
    return productBySlug(
      cleanSlug,
    );
  }

  try {
    const response =
      await fetch(
        `${API_URL}/api/products/${encodeURIComponent(cleanSlug)}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    if (response.status === 404) {
      return undefined;
    }

    const result =
      (await response.json()) as
        | ProductApiResponse
        | ApiErrorResponse;

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.success
          ? "Unable to load product."
          : result.message,
      );
    }

    return normalizeProduct(
      result.data,
    );
  } catch (error) {
    console.error(
      "KRVE_PRODUCT_API_ERROR",
      error,
    );

    return productBySlug(
      cleanSlug,
    );
  }
}

function filterFallbackProducts(
  filters: ProductFilters,
) {
  let result =
    [...products];

  if (filters.category) {
    result =
      result.filter(
        (product) =>
          product.category ===
          filters.category,
      );
  }

  if (
    filters.featured !== undefined
  ) {
    result =
      result.filter(
        (product) =>
          product.featured ===
          filters.featured,
      );
  }

  if (
    filters.newArrival !== undefined
  ) {
    result =
      result.filter(
        (product) =>
          product.newArrival ===
          filters.newArrival,
      );
  }

  if (filters.search?.trim()) {
    const query =
      filters.search
        .trim()
        .toLowerCase();

    result =
      result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query) ||
          product.description
            .toLowerCase()
            .includes(query),
      );
  }

  const offset =
    Math.max(
      0,
      filters.offset || 0,
    );

  const limit =
    Math.max(
      1,
      filters.limit ||
        result.length,
    );

  return result.slice(
    offset,
    offset + limit,
  );
}

/*
  Purane pages ke saath compatibility ke liye
  synchronous function abhi rakha gaya hai.
*/

export function productBySlug(
  slug: string,
) {
  return products.find(
    (product) =>
      product.slug === slug ||
      product.id === slug,
  );
}
