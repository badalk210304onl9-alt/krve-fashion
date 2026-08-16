"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Award,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Send,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type StudentEvaluation = {
  taskQuality: number;
  timeliness: number;
  initiative: number;
  teamwork: number;
  businessImpact: number;
  finalPresentation: number;
  totalScore: number;
  grade?: string | null;
  evaluatorName?: string | null;
  remarks?: string | null;
};

type StudentProfile = {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  college?: string | null;
  course?: string | null;
  yearSemester?: string | null;
  status: string;

  projectCode?: string | null;
  assignedDepartment?: string | null;
  projectTitle?: string | null;
  coordinatorName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  referralCode?: string | null;

  evaluation?: StudentEvaluation | null;

  certificateId?: string | null;
  certificateIssueDate?: string | null;
};

type StudentTask = {
  id: string;
  applicationId: string;
  weekNumber: number;
  title: string;
  description?: string | null;
  priority?: string | null;
  dueDate?: string | null;
  status: string;

  score?: number | null;
  reviewerComment?: string | null;

  submissionUrl?: string | null;
  submissionSummary?: string | null;
  studentRemarks?: string | null;
  submittedAt?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

type StudentPortalSummary = {
  assignedTasks: number;
  submittedTasks: number;
  approvedTasks: number;
  pendingTasks: number;
};

type StudentPortalData = {
  student: StudentProfile;
  tasks: StudentTask[];
  summary: StudentPortalSummary;
};

type LoginCredentials = {
  applicationNumber: string;
  email: string;
  phone: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;

  data?: StudentPortalData;

  student?: StudentProfile;
  tasks?: StudentTask[];
  summary?: StudentPortalSummary;

  submitted?: boolean;
  status?: string;
  submittedAt?: string;
};

type PortalTab =
  | "overview"
  | "project"
  | "tasks"
  | "feedback"
  | "performance"
  | "certificate";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY =
  "krve-live-project-student-session";

const tabs: Array<{
  id: PortalTab;
  label: string;
  icon: React.ElementType;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "project",
    label: "My Project",
    icon: BookOpen,
  },
  {
    id: "tasks",
    label: "My Tasks",
    icon: ClipboardList,
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: FileText,
  },
  {
    id: "performance",
    label: "Performance",
    icon: BarChart3,
  },
  {
    id: "certificate",
    label: "Certificate",
    icon: Award,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "Not assigned";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function statusLabel(
  value?: string | null,
) {
  const status =
    String(
      value || "",
    )
      .replace(
        /_/g,
        " ",
      )
      .trim();

  if (!status) {
    return "Pending";
  }

  return status.replace(
    /\b\w/g,
    (letter) =>
      letter.toUpperCase(),
  );
}

function getStatusClass(
  status?: string | null,
) {
  switch (
    String(
      status || "",
    ).toLowerCase()
  ) {
    case "approved":
    case "completed":
    case "active":
      return "success";

    case "submitted":
    case "under_review":
      return "review";

    case "revision_requested":
      return "warning";

    case "rejected":
      return "danger";

    default:
      return "neutral";
  }
}

function getPriorityClass(
  priority?: string | null,
) {
  const value =
    String(
      priority || "",
    ).toLowerCase();

  if (
    value === "high"
  ) {
    return "high";
  }

  if (
    value === "low"
  ) {
    return "low";
  }

  return "medium";
}

function extractPortalData(
  response: ApiResponse,
): StudentPortalData | null {
  if (
    response.data?.student
  ) {
    return response.data;
  }

  if (
    response.student &&
    response.tasks &&
    response.summary
  ) {
    return {
      student:
        response.student,

      tasks:
        response.tasks,

      summary:
        response.summary,
    };
  }

  return null;
}

function calculateProgress(
  summary: StudentPortalSummary,
) {
  if (
    summary.assignedTasks <=
    0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (summary.approvedTasks /
        summary.assignedTasks) *
        100,
    ),
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function LiveProjectStudentPage() {
  const [
    credentials,
    setCredentials,
  ] =
    useState<LoginCredentials>({
      applicationNumber:
        "",
      email: "",
      phone: "",
    });

  const [
    portal,
    setPortal,
  ] =
    useState<StudentPortalData | null>(
      null,
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<PortalTab>(
      "overview",
    );

  const [
    loginLoading,
    setLoginLoading,
  ] =
    useState(false);

  const [
    portalLoading,
    setPortalLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);

  const [
    submissionTask,
    setSubmissionTask,
  ] =
    useState<StudentTask | null>(
      null,
    );

  const [
    submissionUrl,
    setSubmissionUrl,
  ] =
    useState("");

  const [
    submissionSummary,
    setSubmissionSummary,
  ] =
    useState("");

  const [
    studentRemarks,
    setStudentRemarks,
  ] =
    useState("");

  const [
    submissionLoading,
    setSubmissionLoading,
  ] =
    useState(false);

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

  /* =======================================================
     AUTO RESTORE SESSION
  ======================================================= */

  useEffect(() => {
    async function restoreSession() {
      try {
        const saved =
          window.localStorage.getItem(
            STORAGE_KEY,
          );

        if (!saved) {
          setPortalLoading(
            false,
          );

          return;
        }

        const parsed =
          JSON.parse(
            saved,
          ) as LoginCredentials;

        if (
          !parsed.applicationNumber ||
          !parsed.email ||
          !parsed.phone
        ) {
          setPortalLoading(
            false,
          );

          return;
        }

        setCredentials(
          parsed,
        );

        await loadPortal(
          parsed,
          false,
        );
      } catch {
        window.localStorage.removeItem(
          STORAGE_KEY,
        );
      } finally {
        setPortalLoading(
          false,
        );
      }
    }

    restoreSession();
  }, []);

  /* =======================================================
     PORTAL LOAD
  ======================================================= */

  async function loadPortal(
    login:
      LoginCredentials,
    saveSession = true,
  ) {
    setError("");

    const response =
      await fetch(
        "/api/live-project/student",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              action:
                "login",

              applicationNumber:
                login.applicationNumber,

              email:
                login.email,

              phone:
                login.phone,
            }),

          cache:
            "no-store",
        },
      );

    const data =
      (await response.json()) as ApiResponse;

    if (
      !response.ok
    ) {
      throw new Error(
        data.message ||
          "Unable to open your Live Project portal.",
      );
    }

    const nextPortal =
      extractPortalData(
        data,
      );

    if (!nextPortal) {
      throw new Error(
        "Student portal data was not returned by the server.",
      );
    }

    setPortal(
      nextPortal,
    );

    if (saveSession) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          login,
        ),
      );
    }
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  async function handleLogin(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoginLoading(
      true,
    );

    setError("");

    try {
      await loadPortal(
        credentials,
      );
    } catch (loginError) {
      setError(
        loginError instanceof
          Error
          ? loginError.message
          : "Unable to sign in.",
      );
    } finally {
      setLoginLoading(
        false,
      );
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  function logout() {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );

    setPortal(
      null,
    );

    setCredentials({
      applicationNumber:
        "",
      email: "",
      phone: "",
    });

    setActiveTab(
      "overview",
    );

    setMobileMenuOpen(
      false,
    );
  }

  /* =======================================================
     OPEN SUBMISSION
  ======================================================= */

  function openSubmission(
    task: StudentTask,
  ) {
    setSubmissionTask(
      task,
    );

    setSubmissionUrl(
      task.submissionUrl ||
        "",
    );

    setSubmissionSummary(
      task.submissionSummary ||
        "",
    );

    setStudentRemarks(
      task.studentRemarks ||
        "",
    );

    setSuccessMessage(
      "",
    );

    setError(
      "",
    );
  }

  /* =======================================================
     SUBMIT TASK
  ======================================================= */

  async function handleTaskSubmission(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !submissionTask ||
      !portal
    ) {
      return;
    }

    setSubmissionLoading(
      true,
    );

    setError("");
    setSuccessMessage(
      "",
    );

    try {
      const response =
        await fetch(
          "/api/live-project/student",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action:
                  "submit",

                applicationNumber:
                  credentials.applicationNumber,

                email:
                  credentials.email,

                phone:
                  credentials.phone,

                taskId:
                  submissionTask.id,

                submissionUrl,

                submissionSummary,

                studentRemarks,
              }),
          },
        );

      const data =
        (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to submit task.",
        );
      }

      setSuccessMessage(
        "Your work has been submitted successfully and is now available for review.",
      );

      await loadPortal(
        credentials,
        false,
      );

      window.setTimeout(
        () => {
          setSubmissionTask(
            null,
          );

          setSuccessMessage(
            "",
          );
        },
        1600,
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof
          Error
          ? submissionError.message
          : "Unable to submit work.",
      );
    } finally {
      setSubmissionLoading(
        false,
      );
    }
  }

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const progress =
    useMemo(() => {
      if (!portal) {
        return 0;
      }

      return calculateProgress(
        portal.summary,
      );
    }, [portal]);

  const pendingReviewTasks =
    useMemo(() => {
      if (!portal) {
        return [];
      }

      return portal.tasks.filter(
        (task) =>
          [
            "submitted",
            "under_review",
          ].includes(
            task.status,
          ),
      );
    }, [portal]);

  const feedbackTasks =
    useMemo(() => {
      if (!portal) {
        return [];
      }

      return portal.tasks.filter(
        (task) =>
          Boolean(
            task.reviewerComment,
          ) ||
          task.score !==
            null,
      );
    }, [portal]);

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (portalLoading) {
    return (
      <main className="krve-student-loading">
        <div>
          <div className="krve-loading-logo">
            KRVÉ
          </div>

          <Loader2
            size={28}
            className="krve-spin"
          />

          <p>
            Preparing your Live
            Project workspace...
          </p>
        </div>

        <style jsx global>{`
          body {
            margin: 0;
            background: #f5f7fb;
          }

          .krve-student-loading {
            display: grid;
            min-height: 100vh;
            place-items: center;
            background:
              radial-gradient(
                circle at
                  50% 20%,
                rgba(
                  39,
                  82,
                  255,
                  0.08
                ),
                transparent
                  30%
              ),
              #f7f9fc;
            color: #0b1220;
          }

          .krve-student-loading
            > div {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 18px;
          }

          .krve-loading-logo {
            color: #0e2a6b;
            font-size: 25px;
            font-weight: 900;
            letter-spacing:
              0.18em;
          }

          .krve-student-loading
            p {
            margin: 0;
            color: #77839a;
            font-size: 13px;
          }

          .krve-spin {
            animation:
              krve-spin
              0.85s linear
              infinite;
          }

          @keyframes krve-spin {
            to {
              transform:
                rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  /* =======================================================
     LOGIN SCREEN
  ======================================================= */

  if (!portal) {
    return (
      <main className="krve-login-page">
        <div className="krve-login-left">
          <div className="krve-login-brand">
            <div className="krve-brand-mark">
              K
            </div>

            <div>
              <strong>
                KRVÉ
              </strong>

              <span>
                LIVE PROJECTS
              </span>
            </div>
          </div>

          <div className="krve-login-copy">
            <p className="krve-kicker">
              STUDENT WORKSPACE
            </p>

            <h1>
              Turn assignments
              <br />
              into{" "}
              <em>
                real business
                work.
              </em>
            </h1>

            <p>
              Access your
              assigned project,
              weekly tasks,
              submissions,
              feedback,
              performance and
              certificate from
              one professional
              workspace.
            </p>
          </div>

          <div className="krve-login-feature-grid">
            <article>
              <ClipboardList
                size={20}
              />

              <strong>
                Weekly Tasks
              </strong>

              <span>
                View work
                assigned by the
                KRVE project
                team.
              </span>
            </article>

            <article>
              <Send
                size={20}
              />

              <strong>
                Submit Work
              </strong>

              <span>
                Share your
                project evidence
                for evaluation.
              </span>
            </article>

            <article>
              <BarChart3
                size={20}
              />

              <strong>
                Performance
              </strong>

              <span>
                Track scores,
                feedback and
                project
                progress.
              </span>
            </article>
          </div>

          <p className="krve-login-footer">
            KRVÉ — The Fashion
            Studio · Live
            Business Project
            Program
          </p>
        </div>

        <div className="krve-login-right">
          <div className="krve-login-card">
            <div className="krve-login-card-head">
              <div className="krve-login-icon">
                <GraduationCap
                  size={23}
                />
              </div>

              <p>
                STUDENT PORTAL
              </p>

              <h2>
                Welcome back.
              </h2>

              <span>
                Sign in using
                the details
                submitted in
                your Live
                Project
                application.
              </span>
            </div>

            <form
              onSubmit={
                handleLogin
              }
            >
              <div className="krve-field">
                <label>
                  APPLICATION
                  NUMBER
                </label>

                <input
                  type="text"
                  value={
                    credentials.applicationNumber
                  }
                  onChange={(
                    event,
                  ) =>
                    setCredentials(
                      (
                        current,
                      ) => ({
                        ...current,
                        applicationNumber:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="KRVE-LP-APP-..."
                  required
                />
              </div>

              <div className="krve-field">
                <label>
                  REGISTERED
                  EMAIL
                </label>

                <input
                  type="email"
                  value={
                    credentials.email
                  }
                  onChange={(
                    event,
                  ) =>
                    setCredentials(
                      (
                        current,
                      ) => ({
                        ...current,
                        email:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="krve-field">
                <label>
                  REGISTERED
                  MOBILE
                  NUMBER
                </label>

                <input
                  type="tel"
                  value={
                    credentials.phone
                  }
                  onChange={(
                    event,
                  ) =>
                    setCredentials(
                      (
                        current,
                      ) => ({
                        ...current,
                        phone:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="+91"
                  required
                />
              </div>

              {error && (
                <div className="krve-login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="krve-login-button"
                disabled={
                  loginLoading
                }
              >
                {loginLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="krve-spin"
                    />

                    VERIFYING...
                  </>
                ) : (
                  <>
                    ENTER MY
                    WORKSPACE

                    <ChevronRight
                      size={18}
                    />
                  </>
                )}
              </button>
            </form>

            <div className="krve-login-help">
              <span>
                Need help?
              </span>

              <Link href="/contact">
                Contact KRVÉ
                Support
              </Link>
            </div>
          </div>
        </div>

        <style jsx global>{`
          * {
            box-sizing:
              border-box;
          }

          html,
          body {
            margin: 0;
            min-height: 100%;
            font-family:
              Inter,
              Arial,
              sans-serif;
            background: #f6f8fc;
          }

          button,
          input,
          textarea {
            font: inherit;
          }

          .krve-login-page {
            display: grid;
            min-height: 100vh;
            grid-template-columns:
              minmax(
                0,
                1.1fr
              )
              minmax(
                420px,
                0.9fr
              );
          }

          .krve-login-left {
            display: flex;
            min-height: 100vh;
            flex-direction:
              column;
            justify-content:
              space-between;
            padding:
              46px 58px;
            background:
              radial-gradient(
                circle at
                  80% 15%,
                rgba(
                  53,
                  102,
                  255,
                  0.3
                ),
                transparent
                  28%
              ),
              linear-gradient(
                145deg,
                #071735,
                #0a2563 56%,
                #133e9e
              );
            color: white;
          }

          .krve-login-brand {
            display: flex;
            align-items:
              center;
            gap: 13px;
          }

          .krve-brand-mark {
            display: grid;
            width: 48px;
            height: 48px;
            place-items:
              center;
            border-radius:
              14px;
            background: #fff;
            color: #0c2c73;
            font-size: 18px;
            font-weight: 900;
          }

          .krve-login-brand
            strong {
            display: block;
            font-size: 18px;
            letter-spacing:
              0.08em;
          }

          .krve-login-brand
            span {
            display: block;
            margin-top: 4px;
            color:
              rgba(
                255,
                255,
                255,
                0.6
              );
            font-size: 9px;
            font-weight: 800;
            letter-spacing:
              0.2em;
          }

          .krve-login-copy {
            max-width:
              740px;
            margin:
              90px 0
              60px;
          }

          .krve-kicker {
            margin: 0 0
              24px;
            color: #9ebcff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing:
              0.25em;
          }

          .krve-login-copy
            h1 {
            margin: 0;
            font-size:
              clamp(
                48px,
                5vw,
                78px
              );
            font-weight: 750;
            line-height: 1;
            letter-spacing:
              -0.05em;
          }

          .krve-login-copy
            h1 em {
            color: #a9c3ff;
            font-style:
              normal;
            font-weight: 500;
          }

          .krve-login-copy
            > p:last-child {
            max-width:
              650px;
            margin:
              30px 0 0;
            color:
              rgba(
                255,
                255,
                255,
                0.68
              );
            font-size: 15px;
            line-height: 1.8;
          }

          .krve-login-feature-grid {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                1fr
              );
            gap: 14px;
          }

          .krve-login-feature-grid
            article {
            min-height:
              155px;
            padding: 23px;
            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.12
              );
            border-radius:
              18px;
            background:
              rgba(
                255,
                255,
                255,
                0.055
              );
            backdrop-filter:
              blur(10px);
          }

          .krve-login-feature-grid
            svg {
            margin-bottom:
              22px;
            color: #9fbaff;
          }

          .krve-login-feature-grid
            strong {
            display: block;
            font-size: 13px;
          }

          .krve-login-feature-grid
            span {
            display: block;
            margin-top: 7px;
            color:
              rgba(
                255,
                255,
                255,
                0.58
              );
            font-size: 11px;
            line-height: 1.6;
          }

          .krve-login-footer {
            margin:
              38px 0 0;
            color:
              rgba(
                255,
                255,
                255,
                0.42
              );
            font-size: 10px;
            letter-spacing:
              0.08em;
          }

          .krve-login-right {
            display: grid;
            min-height:
              100vh;
            place-items:
              center;
            padding: 45px;
            background:
              #f7f9fd;
          }

          .krve-login-card {
            width: min(
              100%,
              500px
            );
            padding:
              42px;
            border:
              1px solid
              #e2e8f2;
            border-radius:
              24px;
            background: #fff;
            box-shadow:
              0 26px
              80px
              rgba(
                16,
                42,
                98,
                0.12
              );
          }

          .krve-login-icon {
            display: grid;
            width: 48px;
            height: 48px;
            margin-bottom:
              25px;
            place-items:
              center;
            border-radius:
              14px;
            background:
              #eef3ff;
            color: #1b4ed8;
          }

          .krve-login-card-head
            > p {
            margin: 0;
            color: #2759e8;
            font-size: 9px;
            font-weight: 900;
            letter-spacing:
              0.2em;
          }

          .krve-login-card-head
            h2 {
            margin:
              10px 0 7px;
            color: #0a1730;
            font-size: 31px;
            letter-spacing:
              -0.035em;
          }

          .krve-login-card-head
            > span {
            display: block;
            margin-bottom:
              32px;
            color: #77849a;
            font-size: 13px;
            line-height: 1.7;
          }

          .krve-field {
            margin-bottom:
              19px;
          }

          .krve-field label {
            display: block;
            margin-bottom:
              8px;
            color: #52627d;
            font-size: 9px;
            font-weight: 900;
            letter-spacing:
              0.12em;
          }

          .krve-field input {
            width: 100%;
            height: 54px;
            padding:
              0 16px;
            border:
              1px solid
              #dbe2ee;
            border-radius:
              13px;
            outline: none;
            background:
              #fbfcff;
            color: #101b31;
            transition:
              0.2s ease;
          }

          .krve-field input:focus {
            border-color:
              #3970ff;
            box-shadow:
              0 0 0
              4px
              rgba(
                57,
                112,
                255,
                0.08
              );
          }

          .krve-login-error {
            margin:
              4px 0
              18px;
            padding:
              13px 14px;
            border:
              1px solid
              #ffd0d3;
            border-radius:
              11px;
            background:
              #fff5f5;
            color: #b4232f;
            font-size: 12px;
            line-height: 1.5;
          }

          .krve-login-button {
            display: flex;
            width: 100%;
            height: 56px;
            align-items:
              center;
            justify-content:
              center;
            gap: 10px;
            border: 0;
            border-radius:
              13px;
            background:
              linear-gradient(
                135deg,
                #103fa9,
                #2159ec
              );
            color: white;
            cursor: pointer;
            font-size: 11px;
            font-weight: 900;
            letter-spacing:
              0.12em;
          }

          .krve-login-button:disabled {
            cursor:
              not-allowed;
            opacity: 0.7;
          }

          .krve-login-help {
            display: flex;
            justify-content:
              center;
            gap: 5px;
            margin-top:
              23px;
            color: #8a96aa;
            font-size: 11px;
          }

          .krve-login-help
            a {
            color: #1f54d7;
            font-weight: 700;
            text-decoration:
              none;
          }

          .krve-spin {
            animation:
              krve-spin
              0.85s linear
              infinite;
          }

          @keyframes krve-spin {
            to {
              transform:
                rotate(360deg);
            }
          }

          @media (
            max-width:
              980px
          ) {
            .krve-login-page {
              grid-template-columns:
                1fr;
            }

            .krve-login-left {
              min-height:
                auto;
              padding:
                35px 28px
                45px;
            }

            .krve-login-copy {
              margin:
                70px 0
                45px;
            }

            .krve-login-feature-grid {
              grid-template-columns:
                1fr;
            }

            .krve-login-feature-grid
              article {
              min-height:
                auto;
            }

            .krve-login-right {
              min-height:
                auto;
              padding:
                50px 20px;
            }
          }

          @media (
            max-width:
              560px
          ) {
            .krve-login-copy
              h1 {
              font-size:
                45px;
            }

            .krve-login-card {
              padding:
                28px 20px;
            }
          }
        `}</style>
      </main>
    );
  }

  /* =======================================================
     MAIN PORTAL
  ======================================================= */

  const {
    student,
    tasks,
    summary,
  } = portal;

  return (
    <main className="krve-portal">
      {/* MOBILE HEADER */}

      <header className="krve-mobile-topbar">
        <div className="krve-mobile-brand">
          KRVÉ
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              true,
            )
          }
        >
          <Menu size={22} />
        </button>
      </header>

      {/* SIDEBAR */}

      <aside
        className={`krve-sidebar ${
          mobileMenuOpen
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="krve-sidebar-brand">
          <div className="krve-sidebar-logo">
            K
          </div>

          <div>
            <strong>
              KRVÉ
            </strong>

            <span>
              LIVE PROJECTS
            </span>
          </div>

          <button
            type="button"
            className="krve-mobile-close"
            onClick={() =>
              setMobileMenuOpen(
                false,
              )
            }
          >
            <X size={20} />
          </button>
        </div>

        <div className="krve-student-mini">
          <div className="krve-student-avatar">
            {student.fullName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {student.fullName}
            </strong>

            <span>
              {student.assignedDepartment ||
                "Live Project Student"}
            </span>
          </div>
        </div>

        <nav className="krve-sidebar-nav">
          {tabs.map(
            (tab) => {
              const Icon =
                tab.icon;

              return (
                <button
                  key={
                    tab.id
                  }
                  type="button"
                  className={
                    activeTab ===
                    tab.id
                      ? "active"
                      : ""
                  }
                  onClick={() => {
                    setActiveTab(
                      tab.id,
                    );

                    setMobileMenuOpen(
                      false,
                    );
                  }}
                >
                  <Icon
                    size={18}
                  />

                  <span>
                    {
                      tab.label
                    }
                  </span>
                </button>
              );
            },
          )}
        </nav>

        <div className="krve-sidebar-footer">
          <div>
            <span>
              Application ID
            </span>

            <strong>
              {
                student.applicationNumber
              }
            </strong>
          </div>

          <button
            type="button"
            onClick={
              logout
            }
          >
            <LogOut
              size={17}
            />

            Sign Out
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="krve-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(
              false,
            )
          }
        />
      )}

      {/* CONTENT */}

      <section className="krve-main-content">
        <header className="krve-portal-header">
          <div>
            <p>
              KRVE LIVE
              BUSINESS PROJECT
            </p>

            <h1>
              {activeTab ===
                "overview" &&
                "Student Dashboard"}

              {activeTab ===
                "project" &&
                "My Project"}

              {activeTab ===
                "tasks" &&
                "My Tasks"}

              {activeTab ===
                "feedback" &&
                "Feedback & Reviews"}

              {activeTab ===
                "performance" &&
                "Performance"}

              {activeTab ===
                "certificate" &&
                "Certificate"}
            </h1>
          </div>

          <div className="krve-header-user">
            <div>
              <span>
                Logged in as
              </span>

              <strong>
                {
                  student.fullName
                }
              </strong>
            </div>

            <div className="krve-header-avatar">
              {student.fullName
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab ===
          "overview" && (
          <>
            <section className="krve-welcome-card">
              <div>
                <p>
                  WELCOME BACK
                </p>

                <h2>
                  Hello,{" "}
                  {
                    student.fullName
                  }
                  .
                </h2>

                <span>
                  Continue your
                  Live Project
                  journey and
                  stay on top of
                  your assigned
                  work.
                </span>
              </div>

              <div className="krve-project-status-card">
                <span>
                  PROJECT STATUS
                </span>

                <strong>
                  {statusLabel(
                    student.status,
                  )}
                </strong>

                <small>
                  {student.projectCode ||
                    "Project code pending"}
                </small>
              </div>
            </section>

            <section className="krve-stat-grid">
              <article>
                <div className="krve-stat-icon blue">
                  <ClipboardList
                    size={20}
                  />
                </div>

                <span>
                  Assigned Tasks
                </span>

                <strong>
                  {
                    summary.assignedTasks
                  }
                </strong>
              </article>

              <article>
                <div className="krve-stat-icon violet">
                  <Send
                    size={20}
                  />
                </div>

                <span>
                  Submitted
                </span>

                <strong>
                  {
                    summary.submittedTasks
                  }
                </strong>
              </article>

              <article>
                <div className="krve-stat-icon green">
                  <CheckCircle2
                    size={20}
                  />
                </div>

                <span>
                  Approved
                </span>

                <strong>
                  {
                    summary.approvedTasks
                  }
                </strong>
              </article>

              <article>
                <div className="krve-stat-icon orange">
                  <Target
                    size={20}
                  />
                </div>

                <span>
                  Overall Score
                </span>

                <strong>
                  {student.evaluation
                    ?.totalScore ??
                    "—"}
                </strong>
              </article>
            </section>

            <section className="krve-overview-grid">
              <article className="krve-panel">
                <div className="krve-panel-heading">
                  <div>
                    <p>
                      PROJECT
                      PROGRESS
                    </p>

                    <h3>
                      Overall
                      completion
                    </h3>
                  </div>

                  <strong>
                    {progress}%
                  </strong>
                </div>

                <div className="krve-progress-track">
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="krve-progress-meta">
                  <span>
                    {
                      summary.approvedTasks
                    }{" "}
                    approved
                  </span>

                  <span>
                    {
                      summary.pendingTasks
                    }{" "}
                    remaining
                  </span>
                </div>
              </article>

              <article className="krve-panel">
                <div className="krve-panel-heading">
                  <div>
                    <p>
                      PROJECT
                    </p>

                    <h3>
                      Current
                      assignment
                    </h3>
                  </div>

                  <BookOpen
                    size={22}
                  />
                </div>

                <div className="krve-project-mini-details">
                  <div>
                    <span>
                      Department
                    </span>

                    <strong>
                      {student.assignedDepartment ||
                        "Pending allocation"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Project
                    </span>

                    <strong>
                      {student.projectTitle ||
                        "Pending allocation"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Coordinator
                    </span>

                    <strong>
                      {student.coordinatorName ||
                        "Not assigned"}
                    </strong>
                  </div>
                </div>
              </article>
            </section>

            <section className="krve-panel krve-recent-panel">
              <div className="krve-panel-heading">
                <div>
                  <p>
                    TASKS
                  </p>

                  <h3>
                    Recent
                    assignments
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      "tasks",
                    )
                  }
                >
                  View All
                  <ChevronRight
                    size={16}
                  />
                </button>
              </div>

              {tasks.length ===
              0 ? (
                <EmptyState
                  icon={
                    ClipboardList
                  }
                  title="No tasks assigned yet"
                  text="Your assigned weekly tasks will appear here once your project coordinator publishes them."
                />
              ) : (
                <div className="krve-task-list">
                  {tasks
                    .slice(0, 4)
                    .map(
                      (
                        task,
                      ) => (
                        <TaskRow
                          key={
                            task.id
                          }
                          task={
                            task
                          }
                          onOpen={
                            openSubmission
                          }
                        />
                      ),
                    )}
                </div>
              )}
            </section>

            {pendingReviewTasks.length >
              0 && (
              <section className="krve-review-note">
                <Sparkles
                  size={19}
                />

                <div>
                  <strong>
                    {
                      pendingReviewTasks.length
                    }{" "}
                    submission
                    {pendingReviewTasks.length >
                    1
                      ? "s are"
                      : " is"}{" "}
                    currently
                    awaiting
                    review.
                  </strong>

                  <span>
                    Evaluation
                    and comments
                    will appear
                    automatically
                    after review.
                  </span>
                </div>
              </section>
            )}
          </>
        )}

        {/* =================================================
            MY PROJECT
        ================================================= */}

        {activeTab ===
          "project" && (
          <section className="krve-project-layout">
            <article className="krve-panel krve-project-main-card">
              <p className="krve-section-kicker">
                PROJECT
                ALLOCATION
              </p>

              <h2>
                {student.projectTitle ||
                  "Your project is awaiting allocation."}
              </h2>

              <p className="krve-project-description">
                This workspace
                contains your
                official KRVÉ
                Live Business
                Project
                allocation.
                Complete all
                assigned tasks
                within the
                project
                timeline and
                submit evidence
                through the My
                Tasks section.
              </p>

              <div className="krve-project-info-grid">
                <InfoBlock
                  label="Project Code"
                  value={
                    student.projectCode ||
                    "Pending"
                  }
                />

                <InfoBlock
                  label="Department"
                  value={
                    student.assignedDepartment ||
                    "Pending"
                  }
                />

                <InfoBlock
                  label="Coordinator"
                  value={
                    student.coordinatorName ||
                    "Not assigned"
                  }
                />

                <InfoBlock
                  label="Project Status"
                  value={statusLabel(
                    student.status,
                  )}
                />

                <InfoBlock
                  label="Start Date"
                  value={formatDate(
                    student.startDate,
                  )}
                />

                <InfoBlock
                  label="End Date"
                  value={formatDate(
                    student.endDate,
                  )}
                />

                <InfoBlock
                  label="Referral Code"
                  value={
                    student.referralCode ||
                    "Not assigned"
                  }
                />

                <InfoBlock
                  label="College / Institute"
                  value={
                    student.college ||
                    "—"
                  }
                />
              </div>
            </article>

            <article className="krve-panel krve-project-side-card">
              <UserRound
                size={23}
              />

              <p>
                STUDENT PROFILE
              </p>

              <h3>
                {
                  student.fullName
                }
              </h3>

              <div>
                <span>
                  Application
                </span>

                <strong>
                  {
                    student.applicationNumber
                  }
                </strong>
              </div>

              <div>
                <span>
                  Course
                </span>

                <strong>
                  {student.course ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Semester /
                  Year
                </span>

                <strong>
                  {student.yearSemester ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {
                    student.email
                  }
                </strong>
              </div>
            </article>
          </section>
        )}

        {/* =================================================
            TASKS
        ================================================= */}

        {activeTab ===
          "tasks" && (
          <section className="krve-panel">
            <div className="krve-panel-heading">
              <div>
                <p>
                  WEEKLY WORK
                </p>

                <h3>
                  Assigned Tasks
                </h3>

                <span>
                  Open a task to
                  submit or
                  update your
                  project work.
                </span>
              </div>

              <div className="krve-task-count">
                {
                  tasks.length
                }{" "}
                TASK
                {tasks.length !==
                1
                  ? "S"
                  : ""}
              </div>
            </div>

            {tasks.length ===
            0 ? (
              <EmptyState
                icon={
                  ClipboardList
                }
                title="No tasks assigned"
                text="Your project coordinator has not assigned any tasks yet."
              />
            ) : (
              <div className="krve-full-task-list">
                {tasks.map(
                  (task) => (
                    <article
                      key={
                        task.id
                      }
                      className="krve-task-card"
                    >
                      <div className="krve-task-week">
                        <span>
                          WEEK
                        </span>

                        <strong>
                          {
                            task.weekNumber
                          }
                        </strong>
                      </div>

                      <div className="krve-task-card-main">
                        <div className="krve-task-card-top">
                          <div>
                            <div className="krve-task-badges">
                              <span
                                className={`krve-status ${getStatusClass(
                                  task.status,
                                )}`}
                              >
                                {statusLabel(
                                  task.status,
                                )}
                              </span>

                              <span
                                className={`krve-priority ${getPriorityClass(
                                  task.priority,
                                )}`}
                              >
                                {statusLabel(
                                  task.priority ||
                                    "Medium",
                                )}{" "}
                                Priority
                              </span>
                            </div>

                            <h3>
                              {
                                task.title
                              }
                            </h3>
                          </div>

                          {task.score !==
                            null &&
                            task.score !==
                              undefined && (
                            <div className="krve-task-score">
                              <span>
                                SCORE
                              </span>

                              <strong>
                                {
                                  task.score
                                }
                              </strong>
                            </div>
                          )}
                        </div>

                        {task.description && (
                          <p className="krve-task-description">
                            {
                              task.description
                            }
                          </p>
                        )}

                        <div className="krve-task-meta">
                          <div>
                            <span>
                              Due Date
                            </span>

                            <strong>
                              {formatDate(
                                task.dueDate,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Submission
                            </span>

                            <strong>
                              {task.submittedAt
                                ? formatDate(
                                    task.submittedAt,
                                  )
                                : "Not submitted"}
                            </strong>
                          </div>
                        </div>

                        {task.reviewerComment && (
                          <div className="krve-inline-feedback">
                            <strong>
                              Reviewer
                              Feedback
                            </strong>

                            <p>
                              {
                                task.reviewerComment
                              }
                            </p>
                          </div>
                        )}

                        <div className="krve-task-actions">
                          {task.submissionUrl && (
                            <a
                              href={
                                task.submissionUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink
                                size={
                                  15
                                }
                              />

                              View
                              Submitted
                              Work
                            </a>
                          )}

                          {task.status !==
                            "approved" &&
                          student.status ===
                            "active" ? (
                            <button
                              type="button"
                              onClick={() =>
                                openSubmission(
                                  task,
                                )
                              }
                            >
                              <Send
                                size={
                                  15
                                }
                              />

                              {task.submissionUrl
                                ? "Update Submission"
                                : "Submit Work"}
                            </button>
                          ) : (
                            task.status ===
                              "approved" && (
                              <span className="krve-approved-lock">
                                <Check
                                  size={
                                    15
                                  }
                                />

                                Approved
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            FEEDBACK
        ================================================= */}

        {activeTab ===
          "feedback" && (
          <section className="krve-panel">
            <div className="krve-panel-heading">
              <div>
                <p>
                  REVIEWS
                </p>

                <h3>
                  Feedback &
                  Task Scores
                </h3>

                <span>
                  Comments and
                  scores issued
                  by your
                  evaluator will
                  appear here.
                </span>
              </div>
            </div>

            {feedbackTasks.length ===
            0 ? (
              <EmptyState
                icon={
                  FileText
                }
                title="No feedback yet"
                text="Once your submitted tasks are reviewed, scores and comments will be displayed here."
              />
            ) : (
              <div className="krve-feedback-list">
                {feedbackTasks.map(
                  (task) => (
                    <article
                      key={
                        task.id
                      }
                    >
                      <div className="krve-feedback-number">
                        {
                          task.weekNumber
                        }
                      </div>

                      <div className="krve-feedback-main">
                        <span>
                          WEEK{" "}
                          {
                            task.weekNumber
                          }
                        </span>

                        <h3>
                          {
                            task.title
                          }
                        </h3>

                        <p>
                          {task.reviewerComment ||
                            "No written feedback provided."}
                        </p>
                      </div>

                      <div className="krve-feedback-score">
                        <span>
                          SCORE
                        </span>

                        <strong>
                          {task.score ??
                            "—"}
                        </strong>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        )}

        {/* =================================================
            PERFORMANCE
        ================================================= */}

        {activeTab ===
          "performance" && (
          <>
            <section className="krve-performance-hero">
              <div>
                <p>
                  OVERALL
                  EVALUATION
                </p>

                <h2>
                  {student.evaluation
                    ?.totalScore ??
                    "—"}
                  <span>
                    /100
                  </span>
                </h2>

                <strong>
                  Grade:{" "}
                  {student.evaluation
                    ?.grade ||
                    "Pending"}
                </strong>
              </div>

              <div>
                <span>
                  Evaluated by
                </span>

                <strong>
                  {student.evaluation
                    ?.evaluatorName ||
                    "Evaluation pending"}
                </strong>

                <p>
                  {student.evaluation
                    ?.remarks ||
                    "Your final evaluation will be published here once reviewed by the KRVÉ project team."}
                </p>
              </div>
            </section>

            <section className="krve-performance-grid">
              <PerformanceCard
                label="Task Quality"
                value={
                  student.evaluation
                    ?.taskQuality
                }
                max={20}
              />

              <PerformanceCard
                label="Timeliness"
                value={
                  student.evaluation
                    ?.timeliness
                }
                max={15}
              />

              <PerformanceCard
                label="Initiative"
                value={
                  student.evaluation
                    ?.initiative
                }
                max={15}
              />

              <PerformanceCard
                label="Teamwork"
                value={
                  student.evaluation
                    ?.teamwork
                }
                max={15}
              />

              <PerformanceCard
                label="Business Impact"
                value={
                  student.evaluation
                    ?.businessImpact
                }
                max={20}
              />

              <PerformanceCard
                label="Final Presentation"
                value={
                  student.evaluation
                    ?.finalPresentation
                }
                max={15}
              />
            </section>
          </>
        )}

        {/* =================================================
            CERTIFICATE
        ================================================= */}

        {activeTab ===
          "certificate" && (
          <section className="krve-certificate-wrap">
            {student.certificateId ? (
              <article className="krve-certificate-card">
                <div className="krve-certificate-top">
                  <div className="krve-certificate-brand">
                    KRVÉ
                  </div>

                  <Award
                    size={43}
                  />
                </div>

                <p>
                  CERTIFICATE OF
                  COMPLETION
                </p>

                <h2>
                  {
                    student.fullName
                  }
                </h2>

                <span>
                  has
                  successfully
                  completed the
                  KRVÉ Live
                  Business
                  Project
                  Program.
                </span>

                <div className="krve-certificate-details">
                  <div>
                    <span>
                      Project
                    </span>

                    <strong>
                      {student.projectTitle ||
                        "KRVÉ Live Business Project"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Department
                    </span>

                    <strong>
                      {student.assignedDepartment ||
                        "General"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Certificate
                      ID
                    </span>

                    <strong>
                      {
                        student.certificateId
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Issue Date
                    </span>

                    <strong>
                      {formatDate(
                        student.certificateIssueDate,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="krve-certificate-verified">
                  <CheckCircle2
                    size={17}
                  />

                  Verified by
                  KRVÉ
                </div>
              </article>
            ) : (
              <article className="krve-panel">
                <EmptyState
                  icon={Award}
                  title="Certificate not issued yet"
                  text="Your certificate will be made available here after successful project completion and final evaluation."
                />
              </article>
            )}
          </section>
        )}
      </section>

      {/* ===================================================
          SUBMISSION MODAL
      =================================================== */}

      {submissionTask && (
        <div className="krve-submit-layer">
          <button
            type="button"
            className="krve-submit-backdrop"
            onClick={() =>
              setSubmissionTask(
                null,
              )
            }
            aria-label="Close submission form"
          />

          <aside className="krve-submit-panel">
            <div className="krve-submit-head">
              <div>
                <p>
                  WEEK{" "}
                  {
                    submissionTask.weekNumber
                  }
                </p>

                <h2>
                  Submit Your
                  Work
                </h2>

                <span>
                  {
                    submissionTask.title
                  }
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSubmissionTask(
                    null,
                  )
                }
              >
                <X size={21} />
              </button>
            </div>

            <form
              onSubmit={
                handleTaskSubmission
              }
            >
              <div className="krve-submit-task-note">
                <ClipboardList
                  size={18}
                />

                <div>
                  <strong>
                    Task
                    Instructions
                  </strong>

                  <p>
                    {submissionTask.description ||
                      "Complete the assigned task and submit your work evidence below."}
                  </p>
                </div>
              </div>

              <div className="krve-submit-field">
                <label>
                  WORK /
                  SUBMISSION LINK *
                </label>

                <input
                  type="url"
                  value={
                    submissionUrl
                  }
                  onChange={(
                    event,
                  ) =>
                    setSubmissionUrl(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="https://drive.google.com/... or Canva / GitHub / Docs link"
                  required
                />

                <small>
                  Make sure the
                  link is
                  accessible to
                  the evaluator.
                </small>
              </div>

              <div className="krve-submit-field">
                <label>
                  WORK SUMMARY
                </label>

                <textarea
                  rows={6}
                  value={
                    submissionSummary
                  }
                  onChange={(
                    event,
                  ) =>
                    setSubmissionSummary(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Explain what you completed, your approach, key findings and business outcome..."
                />
              </div>

              <div className="krve-submit-field">
                <label>
                  STUDENT REMARKS
                </label>

                <textarea
                  rows={4}
                  value={
                    studentRemarks
                  }
                  onChange={(
                    event,
                  ) =>
                    setStudentRemarks(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Optional notes for your evaluator..."
                />
              </div>

              {error && (
                <div className="krve-submit-error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="krve-submit-success">
                  <CheckCircle2
                    size={18}
                  />

                  {
                    successMessage
                  }
                </div>
              )}

              <button
                type="submit"
                className="krve-final-submit"
                disabled={
                  submissionLoading
                }
              >
                {submissionLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="krve-spin"
                    />

                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Send
                      size={17}
                    />

                    {submissionTask.submissionUrl
                      ? "UPDATE SUBMISSION"
                      : "SUBMIT TASK"}
                  </>
                )}
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* ===================================================
          GLOBAL CSS
      =================================================== */}

      <style jsx global>{`
        * {
          box-sizing:
            border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #f4f7fb;
          font-family:
            Inter,
            Arial,
            sans-serif;
          color: #101a2d;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .krve-portal {
          min-height:
            100vh;
          background:
            #f5f7fb;
        }

        /* SIDEBAR */

        .krve-sidebar {
          position: fixed;
          inset:
            0 auto 0 0;
          z-index: 300;
          display: flex;
          width: 260px;
          flex-direction:
            column;
          border-right:
            1px solid
            #dde4ef;
          background: #fff;
        }

        .krve-sidebar-brand {
          display: flex;
          height: 86px;
          align-items:
            center;
          gap: 12px;
          padding:
            0 24px;
          border-bottom:
            1px solid
            #edf1f6;
        }

        .krve-sidebar-logo {
          display: grid;
          width: 45px;
          height: 45px;
          place-items:
            center;
          border-radius:
            13px;
          background:
            linear-gradient(
              135deg,
              #071a40,
              #123a8e
            );
          color: #fff;
          font-weight: 900;
        }

        .krve-sidebar-brand
          strong {
          display: block;
          font-size: 16px;
          letter-spacing:
            0.07em;
        }

        .krve-sidebar-brand
          span {
          display: block;
          margin-top: 3px;
          color: #8a97ab;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.16em;
        }

        .krve-mobile-close {
          display: none;
          margin-left:
            auto;
          border: 0;
          background:
            transparent;
          color: #42516a;
        }

        .krve-student-mini {
          display: flex;
          align-items:
            center;
          gap: 11px;
          margin:
            18px;
          padding: 14px;
          border:
            1px solid
            #e5ebf4;
          border-radius:
            14px;
          background:
            #f8faff;
        }

        .krve-student-avatar,
        .krve-header-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0
            38px;
          place-items:
            center;
          border-radius:
            11px;
          background:
            #0c2c72;
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .krve-student-mini
          strong {
          display: block;
          max-width:
            150px;
          overflow:
            hidden;
          color: #172138;
          font-size: 11px;
          text-overflow:
            ellipsis;
          white-space:
            nowrap;
        }

        .krve-student-mini
          span {
          display: block;
          margin-top: 4px;
          color: #8c98aa;
          font-size: 9px;
        }

        .krve-sidebar-nav {
          display: flex;
          flex: 1;
          flex-direction:
            column;
          gap: 5px;
          padding:
            2px 15px;
        }

        .krve-sidebar-nav
          button {
          display: flex;
          width: 100%;
          height: 48px;
          align-items:
            center;
          gap: 12px;
          padding:
            0 15px;
          border: 0;
          border-radius:
            12px;
          background:
            transparent;
          color: #5d6c83;
          font-size: 11px;
          font-weight: 700;
          text-align: left;
          transition:
            0.18s ease;
        }

        .krve-sidebar-nav
          button:hover {
          background:
            #f4f7fc;
          color: #1b3267;
        }

        .krve-sidebar-nav
          button.active {
          background:
            #0a1835;
          color: #fff;
          box-shadow:
            0 7px
            22px
            rgba(
              11,
              39,
              94,
              0.18
            );
        }

        .krve-sidebar-footer {
          padding:
            18px;
          border-top:
            1px solid
            #edf1f6;
        }

        .krve-sidebar-footer
          > div {
          margin-bottom:
            14px;
        }

        .krve-sidebar-footer
          span {
          display: block;
          color: #99a4b5;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.1em;
        }

        .krve-sidebar-footer
          strong {
          display: block;
          margin-top: 5px;
          overflow:
            hidden;
          color: #30405b;
          font-size: 9px;
          text-overflow:
            ellipsis;
          white-space:
            nowrap;
        }

        .krve-sidebar-footer
          button {
          display: flex;
          width: 100%;
          height: 42px;
          align-items:
            center;
          gap: 10px;
          padding:
            0 13px;
          border:
            1px solid
            #e1e7f0;
          border-radius:
            10px;
          background: #fff;
          color: #66758d;
          font-size: 10px;
          font-weight: 700;
        }

        /* MAIN */

        .krve-main-content {
          min-height:
            100vh;
          margin-left:
            260px;
          padding:
            0 38px
            55px;
        }

        .krve-portal-header {
          display: flex;
          min-height:
            108px;
          align-items:
            center;
          justify-content:
            space-between;
          gap: 25px;
          border-bottom:
            1px solid
            #e2e8f1;
        }

        .krve-portal-header
          p,
        .krve-section-kicker {
          margin: 0;
          color: #2759db;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.18em;
        }

        .krve-portal-header
          h1 {
          margin:
            7px 0 0;
          color: #101a2d;
          font-size: 25px;
          letter-spacing:
            -0.025em;
        }

        .krve-header-user {
          display: flex;
          align-items:
            center;
          gap: 12px;
        }

        .krve-header-user
          > div:first-child {
          text-align:
            right;
        }

        .krve-header-user
          span {
          display: block;
          color: #9aa6b7;
          font-size: 8px;
        }

        .krve-header-user
          strong {
          display: block;
          margin-top: 3px;
          color: #34435c;
          font-size: 11px;
        }

        /* WELCOME */

        .krve-welcome-card {
          display: flex;
          min-height:
            210px;
          align-items:
            center;
          justify-content:
            space-between;
          gap: 40px;
          margin-top:
            30px;
          padding:
            38px 42px;
          overflow:
            hidden;
          border-radius:
            22px;
          background:
            radial-gradient(
              circle at
                85% 25%,
              rgba(
                88,
                136,
                255,
                0.5
              ),
              transparent
                25%
            ),
            linear-gradient(
              135deg,
              #071a3f,
              #0b317f
            );
          color: white;
          box-shadow:
            0 18px
            50px
            rgba(
              12,
              42,
              98,
              0.17
            );
        }

        .krve-welcome-card
          > div:first-child
          p {
          margin: 0;
          color: #9fbaff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.19em;
        }

        .krve-welcome-card
          h2 {
          margin:
            10px 0 8px;
          font-size: 31px;
          letter-spacing:
            -0.035em;
        }

        .krve-welcome-card
          > div:first-child
          span {
          color:
            rgba(
              255,
              255,
              255,
              0.66
            );
          font-size: 12px;
        }

        .krve-project-status-card {
          min-width:
            235px;
          padding: 24px;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.14
            );
          border-radius:
            16px;
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );
          backdrop-filter:
            blur(12px);
        }

        .krve-project-status-card
          span {
          display: block;
          color: #a9c0f2;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.14em;
        }

        .krve-project-status-card
          strong {
          display: block;
          margin:
            8px 0 7px;
          font-size: 19px;
        }

        .krve-project-status-card
          small {
          color:
            rgba(
              255,
              255,
              255,
              0.54
            );
          font-size: 9px;
        }

        /* STATS */

        .krve-stat-grid {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              1fr
            );
          gap: 16px;
          margin-top:
            20px;
        }

        .krve-stat-grid
          article {
          position:
            relative;
          min-height:
            145px;
          padding:
            21px;
          border:
            1px solid
            #e0e6ef;
          border-radius:
            17px;
          background: #fff;
          box-shadow:
            0 8px
            28px
            rgba(
              18,
              47,
              94,
              0.05
            );
        }

        .krve-stat-grid
          article
          > span {
          display: block;
          margin-top:
            17px;
          color: #7e8ba0;
          font-size: 10px;
          font-weight: 700;
        }

        .krve-stat-grid
          article
          > strong {
          display: block;
          margin-top: 5px;
          color: #111c30;
          font-size: 27px;
        }

        .krve-stat-icon {
          display: grid;
          width: 40px;
          height: 40px;
          place-items:
            center;
          border-radius:
            11px;
        }

        .krve-stat-icon.blue {
          background:
            #edf3ff;
          color: #3466e5;
        }

        .krve-stat-icon.violet {
          background:
            #f2edff;
          color: #6d49d9;
        }

        .krve-stat-icon.green {
          background:
            #eaf9f1;
          color: #24935a;
        }

        .krve-stat-icon.orange {
          background:
            #fff3e6;
          color: #d87818;
        }

        /* PANELS */

        .krve-overview-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 18px;
          margin-top:
            20px;
        }

        .krve-panel {
          border:
            1px solid
            #e0e6ef;
          border-radius:
            18px;
          background: #fff;
          box-shadow:
            0 7px
            24px
            rgba(
              18,
              47,
              94,
              0.045
            );
        }

        .krve-overview-grid
          .krve-panel {
          padding:
            25px;
        }

        .krve-panel-heading {
          display: flex;
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 25px;
        }

        .krve-panel-heading
          p {
          margin: 0;
          color: #3261d6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.15em;
        }

        .krve-panel-heading
          h3 {
          margin:
            7px 0 0;
          color: #162238;
          font-size: 18px;
        }

        .krve-panel-heading
          > div
          > span {
          display: block;
          margin-top: 7px;
          color: #8a96a9;
          font-size: 10px;
        }

        .krve-panel-heading
          > strong {
          color: #2057da;
          font-size: 25px;
        }

        .krve-panel-heading
          > button {
          display: flex;
          align-items:
            center;
          gap: 5px;
          border: 0;
          background:
            transparent;
          color: #2458d3;
          font-size: 10px;
          font-weight: 800;
        }

        .krve-progress-track {
          height: 9px;
          margin-top:
            30px;
          overflow:
            hidden;
          border-radius:
            50px;
          background:
            #edf1f7;
        }

        .krve-progress-track
          > div {
          height: 100%;
          border-radius:
            inherit;
          background:
            linear-gradient(
              90deg,
              #174fd5,
              #5d87ff
            );
        }

        .krve-progress-meta {
          display: flex;
          justify-content:
            space-between;
          margin-top:
            11px;
          color: #7f8a9c;
          font-size: 9px;
        }

        .krve-project-mini-details {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 14px;
          margin-top:
            22px;
        }

        .krve-project-mini-details
          > div {
          padding:
            13px;
          border-radius:
            11px;
          background:
            #f8faff;
        }

        .krve-project-mini-details
          span,
        .krve-project-info-grid
          span,
        .krve-project-side-card
          span {
          display: block;
          color: #99a4b5;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.07em;
          text-transform:
            uppercase;
        }

        .krve-project-mini-details
          strong {
          display: block;
          margin-top: 5px;
          color: #374760;
          font-size: 10px;
        }

        .krve-recent-panel {
          margin-top:
            20px;
          padding:
            25px;
        }

        /* TASK ROW */

        .krve-task-list {
          margin-top:
            20px;
        }

        .krve-task-row {
          display: grid;
          grid-template-columns:
            58px
            minmax(
              0,
              1fr
            )
            auto
            auto;
          align-items:
            center;
          gap: 18px;
          padding:
            17px 0;
          border-top:
            1px solid
            #edf0f5;
        }

        .krve-task-row-week {
          display: grid;
          width: 46px;
          height: 46px;
          place-items:
            center;
          border-radius:
            12px;
          background:
            #eff4ff;
          color: #2c5dd7;
          font-size: 12px;
          font-weight: 900;
        }

        .krve-task-row-main
          strong {
          display: block;
          color: #26344c;
          font-size: 11px;
        }

        .krve-task-row-main
          span {
          display: block;
          margin-top: 5px;
          color: #939eaf;
          font-size: 9px;
        }

        .krve-task-row
          > button {
          padding:
            9px 13px;
          border:
            1px solid
            #d9e1ef;
          border-radius:
            9px;
          background: #fff;
          color: #2d5cd2;
          font-size: 9px;
          font-weight: 800;
        }

        /* STATUS */

        .krve-status,
        .krve-priority {
          display: inline-flex;
          align-items:
            center;
          width: fit-content;
          border-radius:
            50px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.05em;
          text-transform:
            uppercase;
        }

        .krve-status {
          padding:
            6px 9px;
        }

        .krve-status.success {
          background:
            #e9f8ef;
          color: #178549;
        }

        .krve-status.review {
          background:
            #eaf1ff;
          color: #2459d1;
        }

        .krve-status.warning {
          background:
            #fff3dd;
          color: #bd7015;
        }

        .krve-status.danger {
          background:
            #fff0f0;
          color: #c23843;
        }

        .krve-status.neutral {
          background:
            #f0f3f7;
          color: #69788d;
        }

        .krve-priority {
          padding:
            6px 9px;
        }

        .krve-priority.high {
          background:
            #fff0f0;
          color: #c2404a;
        }

        .krve-priority.medium {
          background:
            #fff4e3;
          color: #b8731d;
        }

        .krve-priority.low {
          background:
            #ebf8f1;
          color: #27855a;
        }

        /* REVIEW NOTE */

        .krve-review-note {
          display: flex;
          align-items:
            flex-start;
          gap: 12px;
          margin-top:
            20px;
          padding:
            17px 19px;
          border:
            1px solid
            #d7e4ff;
          border-radius:
            14px;
          background:
            #f1f6ff;
          color: #2553bb;
        }

        .krve-review-note
          strong {
          display: block;
          font-size: 10px;
        }

        .krve-review-note
          span {
          display: block;
          margin-top: 4px;
          color: #6480b6;
          font-size: 9px;
        }

        /* PROJECT */

        .krve-project-layout {
          display: grid;
          grid-template-columns:
            minmax(
              0,
              1.5fr
            )
            minmax(
              280px,
              0.5fr
            );
          gap: 20px;
          margin-top:
            30px;
        }

        .krve-project-main-card {
          padding:
            34px;
        }

        .krve-project-main-card
          h2 {
          max-width:
            760px;
          margin:
            14px 0 0;
          color: #13203a;
          font-size: 31px;
          letter-spacing:
            -0.035em;
        }

        .krve-project-description {
          max-width:
            800px;
          margin:
            18px 0 0;
          color: #778398;
          font-size: 12px;
          line-height: 1.8;
        }

        .krve-project-info-grid {
          display: grid;
          grid-template-columns:
            repeat(
              2,
              1fr
            );
          gap: 13px;
          margin-top:
            30px;
        }

        .krve-project-info-grid
          > div {
          padding:
            17px;
          border:
            1px solid
            #e6ebf3;
          border-radius:
            12px;
          background:
            #fafcff;
        }

        .krve-project-info-grid
          strong,
        .krve-project-side-card
          strong {
          display: block;
          margin-top: 6px;
          color: #34435a;
          font-size: 11px;
        }

        .krve-project-side-card {
          padding:
            28px;
        }

        .krve-project-side-card
          > svg {
          color: #245bd8;
        }

        .krve-project-side-card
          > p {
          margin:
            23px 0 7px;
          color: #2b5bd0;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.15em;
        }

        .krve-project-side-card
          h3 {
          margin:
            0 0 24px;
          font-size: 21px;
        }

        .krve-project-side-card
          > div {
          padding:
            14px 0;
          border-top:
            1px solid
            #edf0f5;
        }

        /* FULL TASKS */

        .krve-main-content
          > .krve-panel {
          margin-top:
            30px;
          padding:
            28px;
        }

        .krve-task-count {
          padding:
            8px 11px;
          border-radius:
            9px;
          background:
            #f0f4fb;
          color: #5d6e88;
          font-size: 8px;
          font-weight: 900;
        }

        .krve-full-task-list {
          display: flex;
          flex-direction:
            column;
          gap: 14px;
          margin-top:
            25px;
        }

        .krve-task-card {
          display: grid;
          grid-template-columns:
            100px
            minmax(
              0,
              1fr
            );
          overflow:
            hidden;
          border:
            1px solid
            #e2e8f0;
          border-radius:
            15px;
          background: #fff;
        }

        .krve-task-week {
          display: flex;
          align-items:
            center;
          justify-content:
            center;
          flex-direction:
            column;
          background:
            #f4f7fd;
        }

        .krve-task-week
          span {
          color: #8491a5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.13em;
        }

        .krve-task-week
          strong {
          margin-top: 4px;
          color: #2254cd;
          font-size: 28px;
        }

        .krve-task-card-main {
          padding:
            22px;
        }

        .krve-task-card-top {
          display: flex;
          justify-content:
            space-between;
          gap: 20px;
        }

        .krve-task-badges {
          display: flex;
          flex-wrap:
            wrap;
          gap: 7px;
        }

        .krve-task-card-top
          h3 {
          margin:
            12px 0 0;
          color: #1a2941;
          font-size: 16px;
        }

        .krve-task-score {
          min-width:
            60px;
          text-align:
            right;
        }

        .krve-task-score
          span {
          display: block;
          color: #9ba5b5;
          font-size: 8px;
        }

        .krve-task-score
          strong {
          display: block;
          margin-top: 4px;
          color: #1556d2;
          font-size: 24px;
        }

        .krve-task-description {
          max-width:
            880px;
          margin:
            14px 0 0;
          color: #778397;
          font-size: 11px;
          line-height: 1.75;
        }

        .krve-task-meta {
          display: flex;
          gap: 35px;
          margin-top:
            18px;
          padding:
            14px 0;
          border-top:
            1px solid
            #edf1f6;
          border-bottom:
            1px solid
            #edf1f6;
        }

        .krve-task-meta
          span {
          display: block;
          color: #99a4b5;
          font-size: 8px;
          font-weight: 700;
        }

        .krve-task-meta
          strong {
          display: block;
          margin-top: 4px;
          color: #42516a;
          font-size: 9px;
        }

        .krve-inline-feedback {
          margin-top:
            16px;
          padding:
            14px;
          border-radius:
            10px;
          background:
            #f6f8fc;
        }

        .krve-inline-feedback
          strong {
          font-size: 9px;
        }

        .krve-inline-feedback
          p {
          margin:
            5px 0 0;
          color: #707e93;
          font-size: 10px;
          line-height: 1.6;
        }

        .krve-task-actions {
          display: flex;
          flex-wrap:
            wrap;
          justify-content:
            flex-end;
          gap: 9px;
          margin-top:
            17px;
        }

        .krve-task-actions
          a,
        .krve-task-actions
          button,
        .krve-approved-lock {
          display: inline-flex;
          min-height:
            38px;
          align-items:
            center;
          justify-content:
            center;
          gap: 7px;
          padding:
            0 14px;
          border-radius:
            9px;
          font-size: 9px;
          font-weight: 800;
          text-decoration:
            none;
        }

        .krve-task-actions
          a {
          border:
            1px solid
            #dce3ee;
          background: #fff;
          color: #53657e;
        }

        .krve-task-actions
          button {
          border:
            1px solid
            #174ec5;
          background:
            #174ec5;
          color: white;
        }

        .krve-approved-lock {
          background:
            #eaf8f0;
          color: #208050;
        }

        /* FEEDBACK */

        .krve-feedback-list {
          display: flex;
          flex-direction:
            column;
          margin-top:
            25px;
        }

        .krve-feedback-list
          article {
          display: grid;
          grid-template-columns:
            48px
            1fr
            70px;
          gap: 16px;
          padding:
            20px 0;
          border-top:
            1px solid
            #edf0f5;
        }

        .krve-feedback-number {
          display: grid;
          width: 42px;
          height: 42px;
          place-items:
            center;
          border-radius:
            11px;
          background:
            #edf3ff;
          color: #2860dd;
          font-weight: 900;
        }

        .krve-feedback-main
          > span {
          color: #7790bf;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.11em;
        }

        .krve-feedback-main
          h3 {
          margin:
            5px 0 7px;
          font-size: 13px;
        }

        .krve-feedback-main
          p {
          margin: 0;
          color: #768397;
          font-size: 10px;
          line-height: 1.65;
        }

        .krve-feedback-score {
          text-align:
            right;
        }

        .krve-feedback-score
          span {
          display: block;
          color: #99a5b6;
          font-size: 8px;
        }

        .krve-feedback-score
          strong {
          display: block;
          margin-top: 5px;
          color: #1e57d2;
          font-size: 23px;
        }

        /* PERFORMANCE */

        .krve-performance-hero {
          display: grid;
          grid-template-columns:
            0.7fr 1.3fr;
          gap: 40px;
          margin-top:
            30px;
          padding:
            35px;
          border-radius:
            19px;
          background:
            linear-gradient(
              135deg,
              #071b42,
              #0e367f
            );
          color: white;
        }

        .krve-performance-hero
          p {
          color:
            rgba(
              255,
              255,
              255,
              0.63
            );
          font-size: 9px;
          line-height: 1.6;
        }

        .krve-performance-hero
          > div:first-child
          > p {
          margin: 0;
          color: #9cb8f7;
          font-weight: 900;
          letter-spacing:
            0.15em;
        }

        .krve-performance-hero
          h2 {
          margin:
            10px 0 4px;
          font-size: 55px;
          letter-spacing:
            -0.05em;
        }

        .krve-performance-hero
          h2
          span {
          color: #87a5e8;
          font-size: 22px;
          font-weight: 500;
        }

        .krve-performance-hero
          > div:last-child {
          align-self:
            center;
          padding-left:
            35px;
          border-left:
            1px solid
            rgba(
              255,
              255,
              255,
              0.16
            );
        }

        .krve-performance-hero
          > div:last-child
          span {
          display: block;
          color: #8fa9df;
          font-size: 8px;
        }

        .krve-performance-hero
          > div:last-child
          strong {
          display: block;
          margin-top: 5px;
          font-size: 13px;
        }

        .krve-performance-grid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              1fr
            );
          gap: 15px;
          margin-top:
            20px;
        }

        .krve-performance-card {
          padding:
            23px;
          border:
            1px solid
            #e1e7f0;
          border-radius:
            15px;
          background: white;
        }

        .krve-performance-card
          > div:first-child {
          display: flex;
          justify-content:
            space-between;
          gap: 15px;
        }

        .krve-performance-card
          span {
          color: #7d899b;
          font-size: 10px;
          font-weight: 700;
        }

        .krve-performance-card
          strong {
          color: #1d53ca;
          font-size: 15px;
        }

        .krve-performance-bar {
          height: 7px;
          margin-top:
            20px;
          overflow:
            hidden;
          border-radius:
            30px;
          background:
            #edf1f6;
        }

        .krve-performance-bar
          div {
          height: 100%;
          border-radius:
            inherit;
          background:
            linear-gradient(
              90deg,
              #2156d1,
              #6f96ff
            );
        }

        /* CERTIFICATE */

        .krve-certificate-wrap {
          margin-top:
            30px;
        }

        .krve-certificate-card {
          max-width:
            920px;
          margin: 0 auto;
          padding:
            55px;
          border:
            8px solid
            #f3f5f8;
          outline:
            1px solid
            #dbe2ec;
          background: white;
          text-align:
            center;
          box-shadow:
            0 20px
            70px
            rgba(
              17,
              44,
              91,
              0.08
            );
        }

        .krve-certificate-top {
          display: flex;
          align-items:
            center;
          justify-content:
            space-between;
          color: #174bbd;
        }

        .krve-certificate-brand {
          font-size: 23px;
          font-weight: 900;
          letter-spacing:
            0.14em;
        }

        .krve-certificate-card
          > p {
          margin:
            48px 0 0;
          color: #3159ab;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.22em;
        }

        .krve-certificate-card
          > h2 {
          margin:
            13px 0;
          font-family:
            Georgia,
            serif;
          font-size: 44px;
          font-weight: 400;
          color: #182338;
        }

        .krve-certificate-card
          > span {
          color: #737f90;
          font-size: 12px;
        }

        .krve-certificate-details {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 13px;
          margin-top:
            40px;
          text-align:
            left;
        }

        .krve-certificate-details
          > div {
          padding:
            16px;
          border:
            1px solid
            #e4e9f0;
          background:
            #fbfcfe;
        }

        .krve-certificate-details
          span {
          display: block;
          color: #929cad;
          font-size: 8px;
          font-weight: 800;
          text-transform:
            uppercase;
        }

        .krve-certificate-details
          strong {
          display: block;
          margin-top: 5px;
          color: #34435b;
          font-size: 10px;
        }

        .krve-certificate-verified {
          display: inline-flex;
          align-items:
            center;
          gap: 6px;
          margin-top:
            35px;
          padding:
            9px 13px;
          border-radius:
            30px;
          background:
            #eaf8f0;
          color: #227a4e;
          font-size: 9px;
          font-weight: 800;
        }

        /* EMPTY */

        .krve-empty-state {
          display: flex;
          min-height:
            250px;
          align-items:
            center;
          justify-content:
            center;
          flex-direction:
            column;
          padding:
            30px;
          text-align:
            center;
        }

        .krve-empty-state
          > div {
          display: grid;
          width: 52px;
          height: 52px;
          place-items:
            center;
          border-radius:
            14px;
          background:
            #eff4fc;
          color: #5471ab;
        }

        .krve-empty-state
          h3 {
          margin:
            15px 0 7px;
          font-size: 14px;
        }

        .krve-empty-state
          p {
          max-width:
            460px;
          margin: 0;
          color: #8793a6;
          font-size: 10px;
          line-height: 1.7;
        }

        /* SUBMISSION */

        .krve-submit-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
        }

        .krve-submit-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          background:
            rgba(
              7,
              15,
              31,
              0.64
            );
          backdrop-filter:
            blur(5px);
        }

        .krve-submit-panel {
          position: absolute;
          top: 0;
          right: 0;
          width: min(
            610px,
            94vw
          );
          height: 100%;
          overflow-y:
            auto;
          background: #fff;
          box-shadow:
            -20px 0
            60px
            rgba(
              7,
              23,
              52,
              0.2
            );
        }

        .krve-submit-head {
          display: flex;
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 20px;
          padding:
            35px;
          border-bottom:
            1px solid
            #e5eaf1;
        }

        .krve-submit-head
          p {
          margin: 0;
          color: #2d5bd1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.16em;
        }

        .krve-submit-head
          h2 {
          margin:
            8px 0 5px;
          font-size: 26px;
        }

        .krve-submit-head
          span {
          color: #8692a5;
          font-size: 10px;
        }

        .krve-submit-head
          button {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0
            42px;
          place-items:
            center;
          border:
            1px solid
            #dde4ed;
          border-radius:
            12px;
          background: #fff;
          color: #5d6b80;
        }

        .krve-submit-panel
          form {
          padding:
            30px 35px
            45px;
        }

        .krve-submit-task-note {
          display: flex;
          gap: 12px;
          padding:
            16px;
          border:
            1px solid
            #dce7ff;
          border-radius:
            12px;
          background:
            #f4f7ff;
          color: #2454c4;
        }

        .krve-submit-task-note
          strong {
          font-size: 10px;
        }

        .krve-submit-task-note
          p {
          margin:
            5px 0 0;
          color: #6980b0;
          font-size: 10px;
          line-height: 1.65;
        }

        .krve-submit-field {
          margin-top:
            22px;
        }

        .krve-submit-field
          label {
          display: block;
          margin-bottom:
            8px;
          color: #526078;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.09em;
        }

        .krve-submit-field
          input,
        .krve-submit-field
          textarea {
          width: 100%;
          padding:
            14px 15px;
          border:
            1px solid
            #dbe2ec;
          border-radius:
            11px;
          outline: none;
          background:
            #fbfcfe;
          color: #1a273d;
          font-size: 11px;
          resize:
            vertical;
        }

        .krve-submit-field
          input {
          height: 50px;
        }

        .krve-submit-field
          input:focus,
        .krve-submit-field
          textarea:focus {
          border-color:
            #3464da;
          box-shadow:
            0 0 0
            4px
            rgba(
              52,
              100,
              218,
              0.08
            );
        }

        .krve-submit-field
          small {
          display: block;
          margin-top: 6px;
          color: #9aa4b3;
          font-size: 8px;
        }

        .krve-submit-error,
        .krve-submit-success {
          margin-top:
            18px;
          padding:
            12px 13px;
          border-radius:
            10px;
          font-size: 10px;
          line-height: 1.55;
        }

        .krve-submit-error {
          border:
            1px solid
            #ffd0d4;
          background:
            #fff4f4;
          color: #b32b36;
        }

        .krve-submit-success {
          display: flex;
          align-items:
            flex-start;
          gap: 8px;
          border:
            1px solid
            #cdebd9;
          background:
            #effbf4;
          color: #22794c;
        }

        .krve-final-submit {
          display: flex;
          width: 100%;
          height: 53px;
          align-items:
            center;
          justify-content:
            center;
          gap: 9px;
          margin-top:
            24px;
          border: 0;
          border-radius:
            11px;
          background:
            linear-gradient(
              135deg,
              #123f9f,
              #235de7
            );
          color: white;
          font-size: 10px;
          font-weight: 900;
          letter-spacing:
            0.1em;
        }

        .krve-final-submit:disabled {
          opacity: 0.7;
          cursor:
            not-allowed;
        }

        .krve-mobile-topbar {
          display: none;
        }

        .krve-mobile-overlay {
          display: none;
        }

        .krve-spin {
          animation:
            krve-spin
            0.85s linear
            infinite;
        }

        @keyframes krve-spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* RESPONSIVE */

        @media (
          max-width:
            1100px
        ) {
          .krve-stat-grid {
            grid-template-columns:
              repeat(
                2,
                1fr
              );
          }

          .krve-overview-grid {
            grid-template-columns:
              1fr;
          }

          .krve-performance-grid {
            grid-template-columns:
              repeat(
                2,
                1fr
              );
          }

          .krve-project-layout {
            grid-template-columns:
              1fr;
          }
        }

        @media (
          max-width:
            820px
        ) {
          .krve-mobile-topbar {
            position:
              sticky;
            top: 0;
            z-index: 250;
            display: flex;
            height: 65px;
            align-items:
              center;
            justify-content:
              space-between;
            padding:
              0 20px;
            border-bottom:
              1px solid
              #e3e8f0;
            background:
              rgba(
                255,
                255,
                255,
                0.94
              );
            backdrop-filter:
              blur(12px);
          }

          .krve-mobile-brand {
            color: #0a2d70;
            font-size: 17px;
            font-weight: 900;
            letter-spacing:
              0.1em;
          }

          .krve-mobile-topbar
            button {
            display: grid;
            width: 40px;
            height: 40px;
            place-items:
              center;
            border:
              1px solid
              #dce3ed;
            border-radius:
              10px;
            background: #fff;
            color: #34445e;
          }

          .krve-sidebar {
            z-index: 1001;
            width: 280px;
            transform:
              translateX(
                -100%
              );
            transition:
              transform
              0.28s ease;
          }

          .krve-sidebar.mobile-open {
            transform:
              translateX(0);
          }

          .krve-mobile-close {
            display: grid;
            place-items:
              center;
          }

          .krve-mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: block;
            width: 100%;
            height: 100%;
            border: 0;
            background:
              rgba(
                9,
                17,
                32,
                0.5
              );
          }

          .krve-main-content {
            margin-left: 0;
            padding:
              0 18px
              40px;
          }

          .krve-portal-header {
            min-height:
              90px;
          }

          .krve-header-user
            > div:first-child {
            display: none;
          }

          .krve-welcome-card {
            align-items:
              flex-start;
            flex-direction:
              column;
          }

          .krve-project-status-card {
            width: 100%;
            min-width: 0;
          }

          .krve-task-row {
            grid-template-columns:
              50px 1fr;
          }

          .krve-task-row
            > .krve-status,
          .krve-task-row
            > button {
            grid-column: 2;
            justify-self:
              flex-start;
          }

          .krve-task-card {
            grid-template-columns:
              1fr;
          }

          .krve-task-week {
            min-height:
              62px;
            flex-direction:
              row;
            gap: 7px;
          }

          .krve-task-week
            strong {
            font-size: 18px;
          }

          .krve-performance-hero {
            grid-template-columns:
              1fr;
          }

          .krve-performance-hero
            > div:last-child {
            padding:
              25px 0 0;
            border-top:
              1px solid
              rgba(
                255,
                255,
                255,
                0.16
              );
            border-left: 0;
          }
        }

        @media (
          max-width:
            560px
        ) {
          .krve-stat-grid,
          .krve-performance-grid,
          .krve-project-info-grid,
          .krve-certificate-details {
            grid-template-columns:
              1fr;
          }

          .krve-welcome-card {
            padding:
              27px 22px;
          }

          .krve-welcome-card
            h2 {
            font-size: 25px;
          }

          .krve-panel {
            border-radius:
              14px;
          }

          .krve-main-content
            > .krve-panel,
          .krve-overview-grid
            .krve-panel {
            padding:
              20px;
          }

          .krve-project-main-card {
            padding:
              22px;
          }

          .krve-project-main-card
            h2 {
            font-size: 24px;
          }

          .krve-task-meta {
            flex-direction:
              column;
            gap: 11px;
          }

          .krve-task-actions {
            justify-content:
              flex-start;
          }

          .krve-feedback-list
            article {
            grid-template-columns:
              42px
              1fr;
          }

          .krve-feedback-score {
            grid-column: 2;
            text-align:
              left;
          }

          .krve-certificate-card {
            padding:
              30px 20px;
          }

          .krve-certificate-card
            > h2 {
            font-size: 32px;
          }

          .krve-submit-panel {
            width: 100%;
          }

          .krve-submit-head {
            padding:
              26px 20px;
          }

          .krve-submit-panel
            form {
            padding:
              24px 20px
              35px;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function PerformanceCard({
  label,
  value,
  max,
}: {
  label: string;
  value?:
    | number
    | null;
  max: number;
}) {
  const score =
    Number(
      value ?? 0,
    );

  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        (score / max) *
          100,
      ),
    );

  return (
    <article className="krve-performance-card">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value ===
            null ||
          value ===
            undefined
            ? "—"
            : `${score}/${max}`}
        </strong>
      </div>

      <div className="krve-performance-bar">
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </article>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="krve-empty-state">
      <div>
        <Icon size={23} />
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </div>
  );
}

function TaskRow({
  task,
  onOpen,
}: {
  task: StudentTask;

  onOpen: (
    task: StudentTask,
  ) => void;
}) {
  return (
    <div className="krve-task-row">
      <div className="krve-task-row-week">
        {task.weekNumber}
      </div>

      <div className="krve-task-row-main">
        <strong>
          {task.title}
        </strong>

        <span>
          Due{" "}
          {formatDate(
            task.dueDate,
          )}
        </span>
      </div>

      <span
        className={`krve-status ${getStatusClass(
          task.status,
        )}`}
      >
        {statusLabel(
          task.status,
        )}
      </span>

      {task.status !==
        "approved" && (
        <button
          type="button"
          onClick={() =>
            onOpen(task)
          }
        >
          {task.submissionUrl
            ? "UPDATE"
            : "SUBMIT"}
        </button>
      )}
    </div>
  );
}
