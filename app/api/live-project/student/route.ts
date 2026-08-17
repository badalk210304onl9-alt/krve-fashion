import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PortalAction =
  | "login"
  | "submit";

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
  const value =
    process.env.KRVE_CENTRAL_API_URL?.trim() ||
    process.env.KRVE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_API_URL?.trim() ||
    "";

  if (!value) {
    throw new Error(
      "KRVE Central API URL is missing in Vercel Environment Variables.",
    );
  }

  return value.replace(/\/+$/, "");
}

function normalizePhone(
  value: unknown,
) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(-10);
}

async function readUpstream(
  response: Response,
) {
  const contentType =
    response.headers.get(
      "content-type",
    ) || "";

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    try {
      return await response.json();
    } catch {
      return {
        success: false,
        message:
          "KRVE Central API returned invalid JSON.",
      };
    }
  }

  const text =
    await response.text();

  return {
    success: false,
    message:
      text ||
      `KRVE Central API returned HTTP ${response.status}.`,
  };
}

async function callCentralApi(
  endpoint: string,
  body: unknown,
) {
  const response =
    await fetch(
      `${getApiBase()}${endpoint}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(body),

        cache:
          "no-store",
      },
    );

  const payload =
    await readUpstream(
      response,
    );

  return NextResponse.json(
    payload,
    {
      status:
        response.status,
    },
  );
}

async function handleRequest(
  request: Request,
  forcedAction?:
    PortalAction,
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const action =
      forcedAction ||
      body.action ||
      "login";

    const applicationNumber =
      String(
        body.applicationNumber ||
          "",
      ).trim();

    const email =
      String(
        body.email || "",
      )
        .trim()
        .toLowerCase();

    const phone =
      normalizePhone(
        body.phone,
      );

    if (
      !applicationNumber ||
      !email ||
      phone.length !== 10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Application number, registered email and valid 10-digit mobile number are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      action === "login"
    ) {
      return callCentralApi(
        "/live-projects/student",
        {
          applicationNumber,
          email,
          phone,
        },
      );
    }

    if (
      action === "submit"
    ) {
      const taskId =
        String(
          body.taskId || "",
        ).trim();

      const submissionUrl =
        String(
          body.submissionUrl ||
            "",
        ).trim();

      const submissionSummary =
        String(
          body.submissionSummary ||
            "",
        ).trim();

      const studentRemarks =
        String(
          body.studentRemarks ||
            "",
        ).trim();

      if (
        !taskId ||
        !submissionUrl
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Task ID and submission link are required.",
          },
          {
            status: 400,
          },
        );
      }

      let parsedUrl: URL;

      try {
        parsedUrl =
          new URL(
            submissionUrl,
          );
      } catch {
        return NextResponse.json(
          {
            success: false,

            message:
              "Please enter a valid submission URL.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        ![
          "http:",
          "https:",
        ].includes(
          parsedUrl.protocol,
        )
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Submission URL must use http or https.",
          },
          {
            status: 400,
          },
        );
      }

      return callCentralApi(
        "/live-projects/student/submit",
        {
          applicationNumber,
          email,
          phone,

          taskId,
          submissionUrl,
          submissionSummary,
          studentRemarks,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Invalid student portal action.",
      },
      {
        status: 400,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_STUDENT_PORTAL_PROXY_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to KRVE Live Project service.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
  POST now supports BOTH:
  { action: "login", ... }
  { action: "submit", ... }

  This avoids 405 errors between the separate
  Student Portal and the main KRVE website.
*/
export async function POST(
  request: Request,
) {
  return handleRequest(
    request,
  );
}

/*
  Keep PATCH for backward compatibility.
  Older portal code can still submit using PATCH.
*/
export async function PATCH(
  request: Request,
) {
  return handleRequest(
    request,
    "submit",
  );
}
