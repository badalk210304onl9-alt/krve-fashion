import {
  NextResponse,
} from "next/server";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

/* =========================================================
   TYPES
========================================================= */

type StudentPortalAction =
  | "login"
  | "submit";

type StudentPortalRequestBody = {
  action?: StudentPortalAction;

  applicationNumber?: string;
  email?: string;
  phone?: string;

  taskId?: string;
  submissionUrl?: string;
  submissionSummary?: string;
  studentRemarks?: string;
};

/* =========================================================
   CONFIG
========================================================= */

function getCentralApiConfig() {
  const apiUrl =
    (
      process.env
        .KRVE_API_URL ||
      process.env
        .NEXT_PUBLIC_KRVE_API_URL ||
      ""
    )
      .trim()
      .replace(
        /\/+$/,
        "",
      );

  if (!apiUrl) {
    throw new Error(
      "KRVE_API_URL or NEXT_PUBLIC_KRVE_API_URL is missing in Vercel Environment Variables.",
    );
  }

  return {
    apiUrl,
  };
}

/* =========================================================
   HELPERS
========================================================= */

function normalizePhone(
  value: unknown,
) {
  return String(
    value ?? "",
  ).replace(
    /\D/g,
    "",
  );
}

async function readResponseBody(
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
    return response.json();
  }

  const text =
    await response.text();

  return {
    success: false,
    message:
      text ||
      "Unexpected response from KRVE Central API.",
  };
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as StudentPortalRequestBody;

    const action =
      String(
        body.action ||
          "login",
      )
        .trim()
        .toLowerCase() as StudentPortalAction;

    const applicationNumber =
      String(
        body.applicationNumber ||
          "",
      ).trim();

    const email =
      String(
        body.email ||
          "",
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
      phone.length < 10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Application number, registered email and mobile number are required.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      apiUrl,
    } =
      getCentralApiConfig();

    /* =====================================================
       STUDENT LOGIN / PORTAL LOAD
    ===================================================== */

    if (
      action ===
      "login"
    ) {
      const response =
        await fetch(
          `${apiUrl}/live-projects/student`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  applicationNumber,
                  email,
                  phone,
                },
              ),

            cache:
              "no-store",
          },
        );

      const data =
        await readResponseBody(
          response,
        );

      return NextResponse.json(
        data,
        {
          status:
            response.status,
        },
      );
    }

    /* =====================================================
       TASK SUBMISSION
    ===================================================== */

    if (
      action ===
      "submit"
    ) {
      const taskId =
        String(
          body.taskId ||
            "",
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

      const response =
        await fetch(
          `${apiUrl}/live-projects/student/submit`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  applicationNumber,
                  email,
                  phone,

                  taskId,

                  submissionUrl,

                  submissionSummary,

                  studentRemarks,
                },
              ),

            cache:
              "no-store",
          },
        );

      const data =
        await readResponseBody(
          response,
        );

      return NextResponse.json(
        data,
        {
          status:
            response.status,
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
      "KRVE_STUDENT_PORTAL_API_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to KRVE Live Project portal.",
      },
      {
        status: 500,
      },
    );
  }
}
