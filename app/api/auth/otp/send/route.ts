import { NextResponse } from "next/server";

const CENTRAL_API_URL =
  process.env.KRVE_CENTRAL_API_URL ||
  "https://krve-central-api.badalk210304-online.workers.dev";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      phone?: string;
    };

    const phone = String(body.phone || "").replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    const upstream = await fetch(
      `${CENTRAL_API_URL.replace(/\/$/, "")}/customer/otp/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phone: `+91${phone}`,
        }),
        cache: "no-store",
      }
    );

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.error?.message ||
            data?.message ||
            "Unable to send OTP. Please try again.",
        },
        { status: upstream.status || 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("KRVE_OTP_SEND_PROXY_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to KRVE OTP service.",
      },
      { status: 502 }
    );
  }
}
