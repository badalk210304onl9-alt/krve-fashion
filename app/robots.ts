import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://krve-fashion.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",

      disallow: [
        "/api/",
        "/account/",
        "/checkout/",
        "/order-success/",
        "/payment/",
      ],
    },

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
