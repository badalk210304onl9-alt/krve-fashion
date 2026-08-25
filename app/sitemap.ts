import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/api";

export const revalidate = 3600;

const BASE_URL = "https://krve-fashion.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ai-stylist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/virtual-try-on`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/careers/live-projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/size-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const allProducts: Array<{
      slug: string;
      status?: string;
    }> = [];

    const limit = 100;
    let offset = 0;

    /*
     * Products are loaded in batches so the sitemap
     * continues to work even after KRVE has more
     * than 100 products.
     */
    for (let page = 0; page < 50; page += 1) {
      const result = await getProducts({
        status: "published",
        limit,
        offset,
      });

      const products = Array.isArray(result.products)
        ? result.products
        : [];

      allProducts.push(
        ...products
          .filter(
            (product) =>
              product &&
              typeof product.slug === "string" &&
              product.slug.trim().length > 0 &&
              product.status === "published",
          )
          .map((product) => ({
            slug: product.slug,
            status: product.status,
          })),
      );

      if (products.length < limit) {
        break;
      }

      offset += limit;
    }

    /*
     * Remove duplicate slugs if the API ever
     * returns the same product more than once.
     */
    const uniqueProductSlugs = Array.from(
      new Set(
        allProducts.map((product) =>
          product.slug.trim(),
        ),
      ),
    );

    const productPages: MetadataRoute.Sitemap =
      uniqueProductSlugs.map((slug) => ({
        url: `${BASE_URL}/product/${encodeURIComponent(
          slug,
        )}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("SITEMAP_PRODUCT_ERROR", error);

    /*
     * Even if the product API is temporarily down,
     * Google will still receive the static pages
     * instead of sitemap.xml completely failing.
     */
    return staticPages;
  }
}import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/api";

export const revalidate = 3600;

const BASE_URL = "https://krve-fashion.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ai-stylist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/virtual-try-on`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/careers/live-projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/size-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const allProducts: Array<{
      slug: string;
      status?: string;
    }> = [];

    const limit = 100;
    let offset = 0;

    /*
     * Products are loaded in batches so the sitemap
     * continues to work even after KRVE has more
     * than 100 products.
     */
    for (let page = 0; page < 50; page += 1) {
      const result = await getProducts({
        status: "published",
        limit,
        offset,
      });

      const products = Array.isArray(result.products)
        ? result.products
        : [];

      allProducts.push(
        ...products
          .filter(
            (product) =>
              product &&
              typeof product.slug === "string" &&
              product.slug.trim().length > 0 &&
              product.status === "published",
          )
          .map((product) => ({
            slug: product.slug,
            status: product.status,
          })),
      );

      if (products.length < limit) {
        break;
      }

      offset += limit;
    }

    /*
     * Remove duplicate slugs if the API ever
     * returns the same product more than once.
     */
    const uniqueProductSlugs = Array.from(
      new Set(
        allProducts.map((product) =>
          product.slug.trim(),
        ),
      ),
    );

    const productPages: MetadataRoute.Sitemap =
      uniqueProductSlugs.map((slug) => ({
        url: `${BASE_URL}/product/${encodeURIComponent(
          slug,
        )}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("SITEMAP_PRODUCT_ERROR", error);

    /*
     * Even if the product API is temporarily down,
     * Google will still receive the static pages
     * instead of sitemap.xml completely failing.
     */
    return staticPages;
  }
}
