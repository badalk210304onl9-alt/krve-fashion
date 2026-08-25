import {
  NextResponse,
} from "next/server";

import {
  getProducts,
} from "@/lib/api";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const SITE_URL =
  "https://krve-fashion.vercel.app";

function escapeXml(
  value: string,
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(
  value: string,
) {
  const cleaned =
    String(value || "").trim();

  if (!cleaned) {
    return "";
  }

  if (
    cleaned.startsWith(
      "http://",
    ) ||
    cleaned.startsWith(
      "https://",
    )
  ) {
    return cleaned;
  }

  return `${SITE_URL}${
    cleaned.startsWith("/")
      ? cleaned
      : `/${cleaned}`
  }`;
}

export async function GET() {
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

    const products =
      result.products.filter(
        (product) =>
          product.status ===
          "published",
      );

    const items =
      products
        .map(
          (product) => {
            const id =
              product.sku ||
              product.id ||
              product.slug;

            const title =
              product.name;

            const description =
              product.description ||
              product.shortDescription ||
              product.name;

            const link =
              `${SITE_URL}/product/${encodeURIComponent(
                product.slug,
              )}`;

            const image =
              absoluteUrl(
                product.imageUrl ||
                  product.image ||
                  product.gallery?.[0] ||
                  "",
              );

            const currency =
              product.currency ||
              "INR";

            const price =
              Number(
                product.price,
              ).toFixed(2);

            const availability =
              product.inStock &&
              product.stockQuantity > 0
                ? "in_stock"
                : "out_of_stock";

            return `
    <item>
      <g:id>${escapeXml(
        String(id),
      )}</g:id>

      <title>${escapeXml(
        title,
      )}</title>

      <description>${escapeXml(
        description,
      )}</description>

      <link>${escapeXml(
        link,
      )}</link>

      <g:image_link>${escapeXml(
        image,
      )}</g:image_link>

      <g:availability>${availability}</g:availability>

      <g:price>${price} ${escapeXml(
        currency,
      )}</g:price>

      <g:condition>new</g:condition>

      <g:brand>KRVE</g:brand>
    </item>`;
          },
        )
        .join("");

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>
<rss
  version="2.0"
  xmlns:g="http://base.google.com/ns/1.0"
>
  <channel>
    <title>KRVE - The Fashion Studio</title>
    <link>${SITE_URL}</link>
    <description>KRVE Fashion Studio Product Feed</description>
${items}
  </channel>
</rss>`;

    return new NextResponse(
      xml,
      {
        status:
          200,

        headers: {
          "Content-Type":
            "application/xml; charset=utf-8",

          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "GOOGLE_MERCHANT_FEED_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          "Unable to generate Google Merchant product feed.",
      },
      {
        status:
          500,
      },
    );
  }
}
