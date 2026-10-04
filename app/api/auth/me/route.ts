import { NextResponse } from "next/server";

import {
  getSession,
} from "@/lib/auth";

export const dynamic =
  "force-dynamic";

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
          message:
            "Not authenticated.",
        },
        {
          status: 401,
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
      "KRVE_ME_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        message:
          "Unable to load account.",
      },
      {
        status: 500,
      },
    );
  }
}
