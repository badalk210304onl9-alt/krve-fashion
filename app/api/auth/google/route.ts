import { NextResponse } from "next/server";

const GOOGLE_STATE_COOKIE = "__Host-krve_google_state";
const GOOGLE_STATE_MAX_AGE = 10 * 60;

function getGoogleClientId() {
  return (
    process.env.KRVE_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    ""
  ).trim();
}

function getGoogleRedirectUri(request: Request) {
  return (
    process.env.KRVE_GOOGLE_REDIRECT_URI ||
    new URL("/api/auth/google/callback", request.url).toString()
  ).trim();
}

function getGoogleAuthorizationUrl(
  request: Request,
  state: string,
) {
  const clientId = getGoogleClientId();

  if (!clientId) {
    return null;
  }

  const redirectUri = getGoogleRedirectUri(request);

  const url = new URL(
    "https://accounts.google.com/o/oauth2/v2/auth",
  );

  url.searchParams.set(
    "client_id",
    clientId,
  );

  url.searchParams.set(
    "redirect_uri",
    redirectUri,
  );

  url.searchParams.set(
    "response_type",
    "code",
  );

  url.searchParams.set(
    "scope",
    "openid email profile",
  );

  url.searchParams.set(
    "state",
    state,
  );

  url.searchParams.set(
    "prompt",
    "select_account",
  );

  return url;
}

export async function GET(request: Request) {
  const state = crypto.randomUUID();

  const authorizationUrl =
    getGoogleAuthorizationUrl(
      request,
      state,
    );

  if (!authorizationUrl) {
    return NextResponse.redirect(
      new URL(
        "/account?google=not-configured",
        request.url,
      ),
    );
  }

  const response =
    NextResponse.redirect(
      authorizationUrl,
    );

  response.cookies.set({
    name: GOOGLE_STATE_COOKIE,
    value: state,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: GOOGLE_STATE_MAX_AGE,
  });

  return response;
}
