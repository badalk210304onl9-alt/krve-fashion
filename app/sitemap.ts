import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = "https://krve-fashion.vercel.app";
const MERCHANT_FEED_URL =
  "https://krve-fashion.vercel.app/api/google-merchant-feed";

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function getProductUrls(): Promise<string[]> {
  try {
    const response = await fetch(MERCHANT_FEED_URL, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        "Sitemap product feed request failed:",
        response.status,
      );

      return [];
    }

    const xml = await response.text();

    /*
     * Each Google Merchant product is inside an <item>.
     * We extract the normal <link> field from every item.
     */
    const itemMatches =
      xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

    const productUrls = itemMatches
      .map((item) => {
        const linkMatch = item.match(
          /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i,
        );

        if (!linkMatch?.[1]) {
          return null;
        }

        const url = decodeXml(linkMatch[1].trim());

        if (!url.startsWith(`${BASE_URL}/product/`)) {
          return null;
        }

        return url;
      })
      .filter((url): url is string => Boolean(url));

    return Array.from(new Set(productUrls));
  } catch (error) {
    console.error(
      "Unable to load products for sitemap:",
      error,
    );

    return [];
  }
}

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

  const productUrls = await getProductUrls();

  const productPages: MetadataRoute.Sitemap =
    productUrls.map((url) => ({
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

  return [...staticPages, ...productPages];
}
