import { NextResponse } from "next/server";

import {
  clearSession,
} from "@/lib/auth";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json(
      {
        success: true,
        message:
          "Logged out successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_LOGOUT_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to log out.",
      },
      {
        status: 500,
      },
    );
  }
}
