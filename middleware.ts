import {
  NextRequest,
  NextResponse,
} from "next/server";

const REFERRAL_COOKIE =
  "krve_referral_code";

const REFERRAL_MAX_AGE =
  60 * 60 * 24 * 30;

function cleanReferralCode(
  value: string | null,
) {
  const code =
    String(value || "")
      .trim()
      .toUpperCase();

  if (!code) {
    return "";
  }

  if (
    !/^KRVE-[A-Z0-9-]{3,64}$/.test(
      code,
    )
  ) {
    return "";
  }

  return code;
}

export function middleware(
  request: NextRequest,
) {
  const incomingRef =
    cleanReferralCode(
      request.nextUrl.searchParams.get(
        "ref",
      ),
    );

  if (!incomingRef) {
    return NextResponse.next();
  }

  const cleanUrl =
    request.nextUrl.clone();

  cleanUrl.searchParams.delete(
    "ref",
  );

  const response =
    NextResponse.redirect(
      cleanUrl,
    );

  response.cookies.set({
    name:
      REFERRAL_COOKIE,

    value:
      incomingRef,

    path:
      "/",

    maxAge:
      REFERRAL_MAX_AGE,

    sameSite:
      "lax",

    secure:
      request.nextUrl.protocol ===
      "https:",

    httpOnly:
      false,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
