import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";

export async function GET(
  request: Request,
) {
  const requestUrl =
    new URL(
      request.url,
    );

  const code =
    requestUrl.searchParams.get(
      "code",
    );

  const next =
    requestUrl.searchParams.get(
      "next",
    ) || "/account";

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/account?error=missing_auth_code",
        requestUrl.origin,
      ),
    );
  }

  const cookieStore =
    await cookies();

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (
    !supabaseUrl ||
    !publishableKey
  ) {
    return NextResponse.redirect(
      new URL(
        "/account?error=supabase_configuration_missing",
        requestUrl.origin,
      ),
    );
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      publishableKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          },
        },
      },
    );

  const {
    error,
  } =
    await supabase.auth
      .exchangeCodeForSession(
        code,
      );

  if (error) {
    console.error(
      "KRVE_SUPABASE_CALLBACK_ERROR",
      error,
    );

    return NextResponse.redirect(
      new URL(
        `/account?error=${encodeURIComponent(
          error.message,
        )}`,
        requestUrl.origin,
      ),
    );
  }

  const safeNext =
    next.startsWith("/")
      ? next
      : "/account";

  return NextResponse.redirect(
    new URL(
      safeNext,
      requestUrl.origin,
    ),
  );
}
