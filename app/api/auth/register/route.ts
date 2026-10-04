import { NextResponse } from "next/server";
import crypto from "crypto";

import {
  setSession,
} from "@/lib/auth";

type RegisterBody = {
  name?: string;
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

function hashPassword(
  password: string,
) {
  const salt =
    crypto.randomBytes(16);

  const hash =
    crypto.pbkdf2Sync(
      password,
      salt,
      100000,
      64,
      "sha512",
    );

  return `${salt.toString(
    "hex",
  )}:${hash.toString("hex")}`;
}

function createUserId() {
  return `usr_${crypto
    .randomBytes(16)
    .toString("hex")}`;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as RegisterBody;

    const name =
      typeof body.name ===
      "string"
        ? body.name.trim()
        : "";

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

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your name.",
        },
        {
          status: 400,
        },
      );
    }

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

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * IMPORTANT
     *
     * This route creates the local KRVE session.
     *
     * The actual customer record must be created
     * in the KRVE backend/database.
     *
     * If KRVE_CENTRAL_API_URL is configured,
     * we send the customer there.
     */

    const baseUrl =
      process.env.KRVE_CENTRAL_API_URL?.replace(
        /\/$/,
        "",
      );

    let userId = createUserId();

    if (baseUrl) {
      const response =
        await fetch(
          `${baseUrl}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              passwordHash:
                hashPassword(
                  password,
                ),
              emailVerified:
                true,
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
              email?: string;
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
              email?: string;
            };
          };
      } catch {
        data = null;
      }

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message:
              data?.message ||
              "Unable to create your KRVE account.",
          },
          {
            status:
              response.status >= 400
                ? response.status
                : 500,
          },
        );
      }

      if (data?.user?.id) {
        userId =
          data.user.id;
      }
    }

    /*
     * KRVE automatically verifies the email
     * during account creation, as requested.
     *
     * No third-party authentication provider
     * is used here.
     */

    await setSession(
      userId,
      email,
    );

    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        message:
          "KRVE account created successfully.",
        user: {
          id: userId,
          name,
          email,
          emailVerified: true,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_REGISTER_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create your KRVE account.",
      },
      {
        status: 500,
      },
    );
  }
}
