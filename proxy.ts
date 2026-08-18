import {
  clerkMiddleware,
} from "@clerk/nextjs/server";

import {
  NextResponse,
  type NextRequest,
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

const clerkProxy =
  clerkMiddleware(
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
        Normal visit:
        Clerk works exactly as before.
      */
      if (!referralCode) {
        return;
      }

      /*
        Referral link example:
        /?ref=KRVE-LP-FD8BEA

        Save referral in a cookie.
      */

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
          referralCode,

        path: "/",

        maxAge:
          REFERRAL_MAX_AGE,

        sameSite: "lax",

        secure:
          request.nextUrl
            .protocol ===
          "https:",

        httpOnly: false,
      });

      return response;
    },
  );

export default function proxy(
  request: NextRequest,
) {
  return clerkProxy(
    request,
    {} as any,
  );
}

export const config = {
  matcher: [
    /*
      Next.js internal files aur
      static assets skip honge.
    */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    /*
      API aur TRPC routes par
      Clerk authentication state
      available rahegi.
    */
    "/(api|trpc)(.*)",
  ],
};
