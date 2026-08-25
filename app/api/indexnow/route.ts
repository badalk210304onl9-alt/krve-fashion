import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDEXNOW_KEY = "0609cf6af1344b5db6579eab650b9a9e";

const SITE_URL = "https://krve-fashion.vercel.app";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function normalizeUrl(url: string) {
  try {
    const parsedUrl = new URL(url, SITE_URL);

    if (parsedUrl.origin !== SITE_URL) {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

async function getUrlsFromSitemap() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  const response = await fetch(sitemapUrl, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Unable to fetch sitemap. Status: ${response.status}`,
    );
  }

  const xml = await response.text();

  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];

  const urls = matches
    .map((match) => match[1]?.trim())
    .filter((url): url is string => Boolean(url))
    .map(normalizeUrl)
    .filter((url): url is string => Boolean(url));

  return [...new Set(urls)];
}

async function submitToIndexNow(urlList: string[]) {
  if (urlList.length === 0) {
    throw new Error("No valid URLs found for IndexNow submission.");
  }

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",

    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },

    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `IndexNow rejected the request. Status: ${
        response.status
      }. Response: ${
        responseText || "No response body"
      }`,
    );
  }

  return {
    status: response.status,
    response: responseText || null,
  };
}

export async function GET() {
  try {
    const urls = await getUrlsFromSitemap();

    return NextResponse.json(
      {
        success: true,

        message:
          "IndexNow API is ready. Use POST to submit sitemap URLs.",

        site: SITE_URL,

        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,

        sitemap: `${SITE_URL}/sitemap.xml`,

        totalUrlsFound: urls.length,

        urls,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("IndexNow GET error:", error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to read sitemap.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let manuallyProvidedUrls: string[] = [];

    try {
      const body = await request.json();

      if (Array.isArray(body?.urls)) {
        manuallyProvidedUrls = body.urls
          .filter(
            (url: unknown): url is string =>
              typeof url === "string",
          )
          .map(normalizeUrl)
          .filter(
            (url: string | null): url is string =>
              Boolean(url),
          );
      }
    } catch {
      // Empty request body is allowed.
      // In that case all sitemap URLs will be submitted.
    }

    let urls: string[];

    if (manuallyProvidedUrls.length > 0) {
      urls = [...new Set(manuallyProvidedUrls)];
    } else {
      urls = await getUrlsFromSitemap();
    }

    if (urls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No valid URLs were found for submission.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await submitToIndexNow(urls);

    return NextResponse.json(
      {
        success: true,

        message:
          "URLs successfully submitted to IndexNow.",

        submittedUrls: urls.length,

        urls,

        indexNowStatus: result.status,

        indexNowResponse: result.response,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("IndexNow POST error:", error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "IndexNow submission failed.",
      },
      {
        status: 500,
      },
    );
  }
}
