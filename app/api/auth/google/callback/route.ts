import { NextResponse } from "next/server";

const GOOGLE_STATE_COOKIE = "__Host-krve_google_state";

function getGoogleClientId() {
  return (
    process.env.KRVE_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    ""
  ).trim();
}

function getGoogleClientSecret() {
  return (
    process.env.KRVE_GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    ""
  ).trim();
}

function getGoogleRedirectUri(request: Request) {
  return (
    process.env.KRVE_GOOGLE_REDIRECT_URI ||
    new URL("/api/auth/google/callback", request.url).toString()
  ).trim();
}

function accountUrl(
  request: Request,
  status: string,
) {
  const url = new URL(
    "/account",
    request.url,
  );

  url.searchParams.set(
    "google",
    status,
  );

  return url;
}

export async function GET(
  request: Request,
) {
  const url = new URL(
    request.url,
  );

  const code =
    url.searchParams.get(
      "code",
    );

  const state =
    url.searchParams.get(
      "state",
    );

  const error =
    url.searchParams.get(
      "error",
    );

  if (error) {
    return NextResponse.redirect(
      accountUrl(
        request,
        "cancelled",
      ),
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      accountUrl(
        request,
        "invalid",
      ),
    );
  }

  const savedState =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((item) =>
        item.trim(),
      )
      .find((item) =>
        item.startsWith(
          `${GOOGLE_STATE_COOKIE}=`,
        ),
      )
      ?.split("=")
      .slice(1)
      .join("=");

  if (
    !savedState ||
    savedState !== state
  ) {
    return NextResponse.redirect(
      accountUrl(
        request,
        "invalid-state",
      ),
    );
  }

  const clientId =
    getGoogleClientId();

  const clientSecret =
    getGoogleClientSecret();

  const redirectUri =
    getGoogleRedirectUri(
      request,
    );

  if (
    !clientId ||
    !clientSecret
  ) {
    return NextResponse.redirect(
      accountUrl(
        request,
        "not-configured",
      ),
    );
  }

  try {
    const tokenResponse =
      await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            new URLSearchParams({
              code,
              client_id:
                clientId,
              client_secret:
                clientSecret,
              redirect_uri:
                redirectUri,
              grant_type:
                "authorization_code",
            }),
          cache: "no-store",
        },
      );

    if (
      !tokenResponse.ok
    ) {
      console.error(
        "KRVE_GOOGLE_TOKEN_ERROR",
        await tokenResponse
          .text(),
      );

      return NextResponse.redirect(
        accountUrl(
          request,
          "token-error",
        ),
      );
    }

    const tokens =
      await tokenResponse.json();

    const accessToken =
      tokens?.access_token;

    if (!accessToken) {
      return NextResponse.redirect(
        accountUrl(
          request,
          "no-access-token",
        ),
      );
    }

    const userResponse =
      await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
          cache: "no-store",
        },
      );

    if (
      !userResponse.ok
    ) {
      console.error(
        "KRVE_GOOGLE_USERINFO_ERROR",
        await userResponse.text(),
      );

      return NextResponse.redirect(
        accountUrl(
          request,
          "userinfo-error",
        ),
      );
    }

    const googleUser =
      await userResponse.json();

    const googleId =
      String(
        googleUser?.sub ??
          "",
      ).trim();

    const email =
      String(
        googleUser?.email ??
          "",
      )
        .trim()
        .toLowerCase();

    const name =
      String(
        googleUser?.name ??
          "",
      ).trim();

    const firstName =
      String(
        googleUser?.given_name ??
          "",
      ).trim();

    const lastName =
      String(
        googleUser?.family_name ??
          "",
      ).trim();

    const picture =
      String(
        googleUser?.picture ??
          "",
      ).trim();

    if (
      !googleId ||
      !email
    ) {
      return NextResponse.redirect(
        accountUrl(
          request,
          "missing-user",
        ),
      );
    }

    /*
     * =====================================================
     * KRVE CENTRAL API
     * =====================================================
     *
     * Google user data is now ready.
     *
     * We send it to the KRVE Central API so the same
     * customer account system is used by KRVE.
     */

    const centralApiUrl =
      (
        process.env.KRVE_CENTRAL_API_URL ||
        ""
      ).trim();

    if (!centralApiUrl) {
      console.error(
        "KRVE_CENTRAL_API_URL is not configured.",
      );

      return NextResponse.redirect(
        accountUrl(
          request,
          "api-not-configured",
        ),
      );
    }

    const googleLoginEndpoint =
      `${centralApiUrl.replace(
        /\/$/,
        "",
      )}/customer/google`;

    const centralResponse =
      await fetch(
        googleLoginEndpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            provider:
              "google",

            providerId:
              googleId,

            googleId,

            email,

            name,

            firstName,

            lastName,

            picture,

            avatar:
              picture,
          }),

          cache: "no-store",
        },
      );

    if (
      !centralResponse.ok
    ) {
      const errorText =
        await centralResponse
          .text();

      console.error(
        "KRVE_GOOGLE_CENTRAL_API_ERROR",
        centralResponse.status,
        errorText,
      );

      return NextResponse.redirect(
        accountUrl(
          request,
          "login-failed",
        ),
      );
    }

    const customer =
      await centralResponse.json();

    /*
     * =====================================================
     * CREATE KRVE LOGIN SESSION
     * =====================================================
     */

    const response =
      NextResponse.redirect(
        new URL(
          "/account",
          request.url,
        ),
      );

    /*
     * Remove Google OAuth state cookie
     */
    response.cookies.set({
      name:
        GOOGLE_STATE_COOKIE,

      value: "",

      httpOnly: true,

      secure: true,

      sameSite: "lax",

      path: "/",

      maxAge: 0,
    });

    /*
     * Store the KRVE customer session.
     *
     * If the Central API returns a session token,
     * use that token.
     */

    const sessionToken =
      customer?.sessionToken ||
      customer?.session_token ||
      customer?.token ||
      customer?.accessToken ||
      customer?.access_token ||
      "";

    if (sessionToken) {
      response.cookies.set({
        name:
          "krve_customer_token",

        value:
          String(
            sessionToken,
          ),

        httpOnly: true,

        secure: true,

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 24 * 30,
      });
    }

    /*
     * Store customer information so the Account page
     * can immediately show the logged-in Google account.
     */

    const customerId =
      customer?.customer?.id ||
      customer?.customer?.customerId ||
      customer?.customer?.customer_id ||
      customer?.id ||
      customer?.customerId ||
      customer?.customer_id ||
      "";

    if (customerId) {
      response.cookies.set({
        name:
          "krve_customer_id",

        value:
          String(
            customerId,
          ),

        httpOnly: true,

        secure: true,

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error(
      "KRVE_GOOGLE_CALLBACK_ERROR",
      error,
    );

    return NextResponse.redirect(
      accountUrl(
        request,
        "error",
      ),
    );
  }
}
