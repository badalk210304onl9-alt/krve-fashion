import {
  NextRequest,
  NextResponse,
} from "next/server";

type LiveProjectApplication = {
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

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
) {
  try {
    const centralApiUrl =
      process.env.KRVE_CENTRAL_API_URL?.trim();

    const websiteSecret =
      process.env.KRVE_WEBSITE_SECRET?.trim();

    if (!centralApiUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Central API URL is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    if (!websiteSecret) {
      return NextResponse.json(
        {
          success: false,
          message:
            "KRVE website security key is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    let body: LiveProjectApplication;

    try {
      body =
        (await request.json()) as LiveProjectApplication;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid application data.",
        },
        {
          status: 400,
        },
      );
    }

    const fullName =
      body.fullName?.trim() ?? "";

    const email =
      body.email
        ?.trim()
        .toLowerCase() ?? "";

    const phone =
      body.phone?.trim() ?? "";

    const college =
      body.college?.trim() ?? "";

    const course =
      body.course?.trim() ?? "";

    const departmentPreference =
      body.departmentPreference?.trim() ??
      "";

    const motivation =
      body.motivation?.trim() ?? "";

    if (
      !fullName ||
      !email ||
      !phone ||
      !college ||
      !course ||
      !departmentPreference ||
      !motivation
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    const apiBase =
      centralApiUrl.replace(
        /\/+$/,
        "",
      );

    const centralResponse =
      await fetch(
        `${apiBase}/api/live-projects/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "X-KRVE-Website-Key":
              websiteSecret,
          },

          body: JSON.stringify({
            fullName,
            email,
            phone,
            college,
            course,

            yearSemester:
              body.yearSemester?.trim() ||
              "",

            linkedinUrl:
              body.linkedinUrl?.trim() ||
              "",

            departmentPreference,

            skills:
              body.skills?.trim() ||
              "",

            experience:
              body.experience?.trim() ||
              "",

            motivation,

            weeklyAvailability:
              body.weeklyAvailability?.trim() ||
              "",

            resumeUrl:
              body.resumeUrl?.trim() ||
              "",
          }),

          cache: "no-store",
        },
      );

    const responseText =
      await centralResponse.text();

    let result: any = {};

    try {
      result =
        responseText
          ? JSON.parse(responseText)
          : {};
    } catch {
      result = {};
    }

    if (!centralResponse.ok) {
      console.error(
        "KRVE_LIVE_PROJECT_API_ERROR",
        {
          status:
            centralResponse.status,
          result,
          responseText,
        },
      );

      return NextResponse.json(
        {
          success: false,

          message:
            result?.message ||
            result?.error?.message ||
            "Application could not be submitted.",
        },
        {
          status:
            centralResponse.status,
        },
      );
    }

    const application =
      result?.data?.application ??
      result?.application ??
      result?.data ??
      {};

    const applicationNumber =
      application?.applicationNumber ??
      result?.applicationNumber ??
      "";

    return NextResponse.json(
      {
        success: true,

        message:
          "Application submitted successfully.",

        applicationNumber,

        data: {
          applicationNumber,

          application,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "KRVE_LIVE_PROJECT_SUBMIT_ERROR",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Something went wrong while submitting your application. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
