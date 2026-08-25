import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = "https://krve-fashion.vercel.app";

export async function GET() {
  try {
    const response = await fetch(
      `${SITE_URL}/api/indexnow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "IndexNow submission failed.",
          details: data,
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "KRVE sitemap URLs were successfully submitted to IndexNow.",
        submittedUrls:
          data.submittedUrls ?? 0,
        urls:
          data.urls ?? [],
        indexNowStatus:
          data.indexNowStatus ?? null,
        indexNowResponse:
          data.indexNowResponse ?? null,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "IndexNow manual submission error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit URLs to IndexNow.",
      },
      {
        status: 500,
      },
    );
  }
}
