import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "krve_session";

const SESSION_SECRET =
  process.env.KRVE_SESSION_SECRET ||
  "krve-development-session-secret-change-this";

type SessionPayload = {
  userId: string;
  email: string;
  expiresAt: number;
};

function base64UrlEncode(
  value: string,
) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(
  value: string,
) {
  return Buffer.from(
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/"),
    "base64",
  ).toString("utf8");
}

function createSignature(
  payload: string,
) {
  return crypto
    .createHmac(
      "sha256",
      SESSION_SECRET,
    )
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function createSessionToken(
  userId: string,
  email: string,
) {
  const payload: SessionPayload = {
    userId,
    email,
    expiresAt:
      Date.now() +
      1000 *
        60 *
        60 *
        24 *
        30,
  };

  const encodedPayload =
    base64UrlEncode(
      JSON.stringify(payload),
    );

  const signature =
    createSignature(
      encodedPayload,
    );

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(
  token: string,
): SessionPayload | null {
  try {
    const parts =
      token.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [
      encodedPayload,
      signature,
    ] = parts;

    const expectedSignature =
      createSignature(
        encodedPayload,
      );

    const signatureBuffer =
      Buffer.from(
        signature,
      );

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
      );

    if (
      signatureBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer,
      )
    ) {
      return null;
    }

    const payload =
      JSON.parse(
        base64UrlDecode(
          encodedPayload,
        ),
      ) as SessionPayload;

    if (
      !payload.userId ||
      !payload.email ||
      !payload.expiresAt
    ) {
      return null;
    }

    if (
      payload.expiresAt <=
      Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setSession(
  userId: string,
  email: string,
) {
  const token =
    createSessionToken(
      userId,
      email,
    );

  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge:
        60 *
        60 *
        24 *
        30,
    },
  );
}

export async function getSession() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE_NAME,
    )?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(
    token,
  );
}

export async function requireSession() {
  const session =
    await getSession();

  if (!session) {
    throw new Error(
      "UNAUTHORIZED",
    );
  }

  return session;
}

export async function clearSession() {
  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    },
  );
}

export {
  SESSION_COOKIE_NAME,
};
