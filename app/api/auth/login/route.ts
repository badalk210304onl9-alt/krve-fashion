import { NextResponse } from "next/server";
import crypto from "crypto";

import {
  setSession,
} from "@/lib/auth";

type LoginBody = {
  email?: string;
  password?: string;
};

function normalizeEmail(
  email: string,
) {
  return email
    .trim()
    .toLowerCase();
}

function verifyPassword(
  password: string,
  storedHash: string,
) {
  try {
    const parts =
      storedHash.split(":");

    if (parts.length !== 2) {
      return false;
    }

    const salt =
      Buffer.from(
        parts[0],
        "hex",
      );

    const expectedHash =
      Buffer.from(
        parts[1],
        "hex",
      );

    const actualHash =
      crypto.pbkdf2Sync(
        password,
        salt,
        100000,
        64,
        "sha512",
      );

    if (
      actualHash.length !==
      expectedHash.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      actualHash,
      expectedHash,
    );
  } catch {
    return false;
  }
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as LoginBody;

    const email =
      typeof body.email ===
      "string"
        ? normalizeEmail(
            body.email,
          )
        : "";

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your email.",
        },
        {
          status: 400,
        },
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your password.",
        },
        {
          status: 400,
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
          success: false,
          message:
            "KRVE authentication service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    const response =
      await fetch(
        `${baseUrl}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          cache: "no-store",
        },
      );

    let data:
      | {
          success?: boolean;
          message?: string;
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
          message?: string;
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
      !response.ok ||
      !data?.success ||
      !data.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.message ||
            "Invalid email or password.",
        },
        {
          status:
            response.status >= 400
              ? response.status
              : 401,
        },
      );
    }

    /*
     * KRVE creates its own secure session.
     *
     * The customer does not need to sign in
     * again while the KRVE session remains valid.
     */

    await setSession(
      data.user.id,
      data.user.email ||
        email,
    );

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        message:
          "Welcome back to KRVE.",
        user: {
          id:
            data.user.id,
          name:
            data.user.name ||
            "",
          email:
            data.user.email ||
            email,
          emailVerified:
            data.user.emailVerified ??
            true,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_LOGIN_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to sign in to KRVE.",
      },
      {
        status: 500,
      },
    );
  }
}
