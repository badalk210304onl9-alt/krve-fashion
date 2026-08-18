import {
  NextResponse,
} from "next/server";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type ApplicationBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  course?: string;
  yearSemester?: string;
  linkedinUrl?: string;
  departmentPreference?: string;
  skills?: string;
  experience?: string;
  motivation?: string;
  weeklyAvailability?: string;
  resumeUrl?: string;
};

const LIVE_PROJECT_OPEN_AT =
  new Date(
    "2026-08-22T00:00:00+05:30",
  );

const LIVE_PROJECT_CLOSE_AT =
  new Date(
    "2026-09-16T00:00:00+05:30",
  );

type LiveProjectStatus =
  | "upcoming"
  | "open"
  | "closed";

function getLiveProjectStatus(): LiveProjectStatus {
  const now =
    new Date();

  if (
    now <
    LIVE_PROJECT_OPEN_AT
  ) {
    return "upcoming";
  }

  if (
    now >=
    LIVE_PROJECT_CLOSE_AT
  ) {
    return "closed";
  }

  return "open";
}

function getApiUrl() {
  const value =
    process.env
      .KRVE_API_URL
      ?.trim() ||
    process.env
      .NEXT_PUBLIC_KRVE_API_URL
      ?.trim() ||
    "";

  if (!value) {
    throw new Error(
      "KRVE_API_URL is missing in Vercel Environment Variables.",
    );
  }

  return value.replace(
    /\/+$/,
    "",
  );
}

function cleanText(
  value: unknown,
) {
  return String(
    value ?? "",
  ).trim();
}

function normalizeEmail(
  value: unknown,
) {
  return cleanText(
    value,
  ).toLowerCase();
}

function normalizePhone(
  value: unknown,
) {
  return cleanText(
    value,
  )
    .replace(
      /\D/g,
      "",
    )
    .slice(-10);
}

function isValidEmail(
  value: string,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );
}

function isHttpUrl(
  value: string,
) {
  if (!value) {
    return true;
  }

  try {
    const parsed =
      new URL(value);

    return (
      parsed.protocol ===
        "http:" ||
      parsed.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

async function readResponse(
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

  if (
    contentType.includes(
      "text/html",
    ) ||
    text
      .trim()
      .toLowerCase()
      .startsWith(
        "<!doctype",
      )
  ) {
    return {
      success: false,
      message:
        `KRVE Central API route was not found (HTTP ${response.status}).`,
    };
  }

  return {
    success: false,
    message:
      text ||
      `KRVE Central API returned HTTP ${response.status}.`,
  };
}

function windowClosedResponse(
  status:
    | "upcoming"
    | "closed",
) {
  if (
    status ===
    "upcoming"
  ) {
    return NextResponse.json(
      {
        success: false,

        code:
          "APPLICATIONS_NOT_OPEN",

        message:
          "Applications are not open yet. The KRVE Live Business Project application window opens on 22 August 2026.",

        applicationWindow: {
          opensAt:
            LIVE_PROJECT_OPEN_AT.toISOString(),

          closesAt:
            LIVE_PROJECT_CLOSE_AT.toISOString(),

          timezone:
            "Asia/Kolkata",
        },
      },
      {
        status: 403,
      },
    );
  }

  return NextResponse.json(
    {
      success: false,

      code:
        "APPLICATIONS_CLOSED",

      message:
        "Applications for this KRVE Live Business Project cohort closed on 15 September 2026.",

      applicationWindow: {
        opensAt:
          LIVE_PROJECT_OPEN_AT.toISOString(),

        closesAt:
          LIVE_PROJECT_CLOSE_AT.toISOString(),

        timezone:
          "Asia/Kolkata",
      },
    },
    {
      status: 403,
    },
  );
}

export async function POST(
  request: Request,
) {
  try {
    /*
      ======================================================
      SERVER-SIDE APPLICATION WINDOW LOCK
      ======================================================

      OPEN:
      22 Aug 2026, 12:00 AM IST

      CLOSE:
      16 Sep 2026, 12:00 AM IST

      Therefore:
      15 Sep 2026 remains fully open.
    */

    const liveProjectStatus =
      getLiveProjectStatus();

    if (
      liveProjectStatus !==
      "open"
    ) {
      return windowClosedResponse(
        liveProjectStatus,
      );
    }

    const body =
      (await request.json()) as ApplicationBody;

    const fullName =
      cleanText(
        body.fullName,
      );

    const email =
      normalizeEmail(
        body.email,
      );

    const phone =
      normalizePhone(
        body.phone,
      );

    const college =
      cleanText(
        body.college,
      );

    const course =
      cleanText(
        body.course,
      );

    const yearSemester =
      cleanText(
        body.yearSemester,
      );

    const linkedinUrl =
      cleanText(
        body.linkedinUrl,
      );

    const departmentPreference =
      cleanText(
        body.departmentPreference,
      );

    const skills =
      cleanText(
        body.skills,
      );

    const experience =
      cleanText(
        body.experience,
      );

    const motivation =
      cleanText(
        body.motivation,
      );

    const weeklyAvailability =
      cleanText(
        body.weeklyAvailability,
      );

    const resumeUrl =
      cleanText(
        body.resumeUrl,
      );

    if (
      !fullName ||
      !email ||
      !phone ||
      !college ||
      !course ||
      !departmentPreference ||
      !weeklyAvailability ||
      !motivation
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Please complete all required application fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidEmail(
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

    if (
      phone.length !== 10
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Please enter a valid 10-digit mobile number.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isHttpUrl(
        linkedinUrl,
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "LinkedIn Profile must be a valid http or https URL.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isHttpUrl(
        resumeUrl,
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Resume / CV Link must be a valid http or https URL.",
        },
        {
          status: 400,
        },
      );
    }

    /*
      Keep payload structure compatible with the existing
      KRVE Central API application endpoint.
    */

    const applicationPayload = {
      fullName,
      email,
      phone,
      college,
      course,
      yearSemester,
      linkedinUrl,
      departmentPreference,
      skills,
      experience,
      motivation,
      weeklyAvailability,
      resumeUrl,
    };

    const apiUrl =
      getApiUrl();

    const response =
      await fetch(
        `${apiUrl}/live-projects/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              applicationPayload,
            ),

          cache:
            "no-store",
        },
      );

    const data =
      await readResponse(
        response,
      );

    if (
      !response.ok
    ) {
      console.error(
        "KRVE_LIVE_PROJECT_APPLICATION_API_FAILED",
        {
          status:
            response.status,

          data,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            data?.message ||
            `KRVE Central API returned HTTP ${response.status}.`,

          ...(data &&
          typeof data ===
            "object"
            ? data
            : {}),
        },
        {
          status:
            response.status >=
              400 &&
            response.status <
              600
              ? response.status
              : 502,
        },
      );
    }

    return NextResponse.json(
      data,
      {
        status: 200,
      },
    );
  } catch (
    error
  ) {
    console.error(
      "KRVE_LIVE_PROJECT_APPLICATION_ROUTE_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof
          Error
            ? error.message
            : "Application could not be submitted.",
      },
      {
        status: 500,
      },
    );
  }
}
