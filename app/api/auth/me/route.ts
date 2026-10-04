import { NextResponse } from "next/server";

import {
  getSession,
} from "@/lib/auth";

export async function GET() {
  try {
    const session =
      await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          user: null,
        },
        {
          status: 401,
        },
      );
    }

    const baseUrl =
      process.env.KRVE_CENTRAL_API_URL?.replace(
        /\/$/,
        "",
      );

    if (!baseUrl) {
      return NextResponse.json(
        {
          success: true,
          authenticated: true,
          user: {
            id: session.userId,
            email: session.email,
          },
        },
        {
          status: 200,
        },
      );
    }

    const response =
      await fetch(
        `${baseUrl}/api/auth/me?userId=${encodeURIComponent(
          session.userId,
        )}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
          },
          cache: "no-store",
        },
      );

    let data:
      | {
          success?: boolean;
          user?: {
            id?: string;
            name?: string;
            email?: string;
            emailVerified?: boolean;
          };
        }
      | null = null;

    try {
      data =
        (await response.json()) as {
          success?: boolean;
          user?: {
            id?: string;
            name?: string;
            email?: string;
            emailVerified?: boolean;
          };
        };
    } catch {
      data = null;
    }

    if (
      response.ok &&
      data?.success &&
      data.user
    ) {
      return NextResponse.json(
        {
          success: true,
          authenticated: true,
          user: data.user,
        },
        {
          status: 200,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: session.userId,
          email: session.email,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_AUTH_ME_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        message:
          "Unable to verify KRVE session.",
      },
      {
        status: 500,
      },
    );
  }
}
