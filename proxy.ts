import {
  clerkMiddleware,
} from "@clerk/nextjs/server";

import {
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

export default clerkMiddleware(
  async (
    auth,
    request,
  ) => {
    const referralCode =
      cleanReferralCode(
        request.nextUrl
          .searchParams
          .get("ref"),
      );

    /*
      Agar referral code nahi hai,
      Clerk normal tarike se kaam karega.
    */
    if (!referralCode) {
      return;
    }

    /*
      Example incoming URL:

      https://krve-fashion.vercel.app/?ref=KRVE-LP-FD8BEA

      Referral code cookie me
      30 days ke liye save hoga.
    */

    const cleanUrl =
      request.nextUrl.clone();

    /*
      Referral capture hone ke baad
      URL se ?ref=... hata denge.
    */
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
        referralCode,

      path:
        "/",

      maxAge:
        REFERRAL_MAX_AGE,

      sameSite:
        "lax",

      secure:
        request.nextUrl
          .protocol ===
        "https:",

      httpOnly:
        false,
    });

    return response;
  },
);

export const config = {
  matcher: [
    /*
      Next.js internal files aur
      static assets skip honge.

      Baaki website pages par
      Clerk + referral tracking
      available rahega.
    */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    /*
      API aur TRPC routes par bhi
      Clerk authentication state
      available rahegi.
    */
    "/(api|trpc)(.*)",
  ],
};
