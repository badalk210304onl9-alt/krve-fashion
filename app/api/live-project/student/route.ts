import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PortalAction = "login" | "submit";

type RequestBody = {
  action?: PortalAction;
  applicationNumber?: string;
  email?: string;
  phone?: string;
  taskId?: string;
  submissionUrl?: string;
  submissionSummary?: string;
  studentRemarks?: string;
};

function getApiBase() {
  const url =
    process.env.KRVE_CENTRAL_API_URL ||
    process.env.KRVE_API_URL ||
    process.env.NEXT_PUBLIC_KRVE_API_URL;

  if (!url) {
    throw new Error("KRVE Central API URL is missing.");
  }

  return url.replace(/\/+$/, "");
}

function getWebsiteSecret() {
  const secret = process.env.KRVE_WEBSITE_SECRET;

  if (!secret) {
    throw new Error(
      "KRVE_WEBSITE_SECRET is missing in Vercel Environment Variables."
    );
  }

  return secret;
}

function normalizePhone(value: unknown) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(-10);
}

async function readResponse(res: Response) {
  const type = res.headers.get("content-type") || "";

  if (type.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return {
        success: false,
        message: "Invalid JSON received from Central API.",
      };
    }
  }

  return {
    success: false,
    message: await res.text(),
  };
}

async function callCentralApi(endpoint: string, body: unknown) {
  const res = await fetch(`${getApiBase()}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",

      /* ===== WEBSITE AUTH ===== */
      Authorization: `Bearer ${getWebsiteSecret()}`,
      "x-website-key": getWebsiteSecret(),
      "x-website-origin": "krve-fashion",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await readResponse(res);

  return NextResponse.json(data, {
    status: res.status,
  });
}

async function handleRequest(
  request: Request,
  forcedAction?: PortalAction
) {
  try {
    const body = (await request.json()) as RequestBody;

    const action = forcedAction || body.action || "login";

    const applicationNumber = String(
      body.applicationNumber || ""
    ).trim();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const phone = normalizePhone(body.phone);

    if (!applicationNumber || !email || phone.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Application number, email and valid mobile number are required.",
        },
        { status: 400 }
      );
    }

    if (action === "login") {
      return callCentralApi("/live-projects/student", {
        applicationNumber,
        email,
        phone,
      });
    }

    const taskId = String(body.taskId || "").trim();
    const submissionUrl = String(body.submissionUrl || "").trim();

    if (!taskId || !submissionUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Task ID and submission URL are required.",
        },
        { status: 400 }
      );
    }

    return callCentralApi("/live-projects/student/submit", {
      applicationNumber,
      email,
      phone,
      taskId,
      submissionUrl,
      submissionSummary: body.submissionSummary || "",
      studentRemarks: body.studentRemarks || "",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to KRVE service.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleRequest(request);
}

export async function PATCH(request: Request) {
  return handleRequest(request, "submit");
}
