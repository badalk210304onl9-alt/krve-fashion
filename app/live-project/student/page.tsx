"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  type LucideIcon,
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
};

type PortalTab =
  | "overview"
  | "project"
  | "tasks"
  | "feedback"
  | "performance"
  | "certificate";

type PortalTabItem = {
  id: PortalTab;
  label: string;
  icon: LucideIcon;
};

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY =
  "krve-live-project-student-session";

const portalTabs: PortalTabItem[] = [
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
  const text =
    String(value || "")
      .replace(/_/g, " ")
      .trim();

  if (!text) {
    return "Pending";
  }

  return text.replace(
    /\b\w/g,
    (character) =>
      character.toUpperCase(),
  );
}

function getStatusClass(
  value?: string | null,
) {
  const status =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    [
      "approved",
      "completed",
      "active",
    ].includes(status)
  ) {
    return "success";
  }

  if (
    [
      "submitted",
      "under_review",
    ].includes(status)
  ) {
    return "review";
  }

  if (
    status ===
    "revision_requested"
  ) {
    return "warning";
  }

  if (
    status ===
    "rejected"
  ) {
    return "danger";
  }

  return "neutral";
}

function getPriorityClass(
  value?: string | null,
) {
  const priority =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    priority ===
    "high"
  ) {
    return "high";
  }

  if (
    priority ===
    "low"
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
    summary.assignedTasks <= 0
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
    <div className="info-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={24} />
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

function PerformanceCard({
  label,
  value,
  max,
}: {
  label: string;
  value?: number | null;
  max: number;
}) {
  const score =
    Number(value ?? 0);

  const percentage =
    Math.max(
      0,
      Math.min(
        100,
        (score / max) * 100,
      ),
    );

  return (
    <article className="performance-card">
      <div className="performance-card-head">
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

      <div className="performance-track">
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </article>
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
    <div className="task-row">
      <div className="task-week-box">
        {task.weekNumber}
      </div>

      <div className="task-row-main">
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
        className={`status-badge ${getStatusClass(
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
          className="small-action"
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

/* =========================================================
   MAIN PAGE
========================================================= */

export default function LiveProjectStudentPage() {
  const [
    credentials,
    setCredentials,
  ] =
    useState<LoginCredentials>({
      applicationNumber: "",
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
    portalLoading,
    setPortalLoading,
  ] =
    useState(true);

  const [
    loginLoading,
    setLoginLoading,
  ] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState("");

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

  /* =======================================================
     LOAD STUDENT PORTAL
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
          method: "POST",

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

    if (!response.ok) {
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
        JSON.stringify(login),
      );
    }
  }

  /* =======================================================
     RESTORE SESSION
  ======================================================= */

  useEffect(() => {
    async function restoreSession() {
      try {
        const stored =
          window.localStorage.getItem(
            STORAGE_KEY,
          );

        if (!stored) {
          return;
        }

        const savedCredentials =
          JSON.parse(
            stored,
          ) as LoginCredentials;

        if (
          !savedCredentials.applicationNumber ||
          !savedCredentials.email ||
          !savedCredentials.phone
        ) {
          window.localStorage.removeItem(
            STORAGE_KEY,
          );

          return;
        }

        setCredentials(
          savedCredentials,
        );

        await loadPortal(
          savedCredentials,
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
        loginError instanceof Error
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
      applicationNumber: "",
      email: "",
      phone: "",
    });

    setActiveTab(
      "overview",
    );

    setMobileMenuOpen(
      false,
    );

    setError("");
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

    setError("");
    setSuccessMessage("");
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
    setSuccessMessage("");

    try {
      const response =
        await fetch(
          "/api/live-project/student",
          {
            method: "POST",

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
        "Your work has been submitted successfully. It is now waiting for evaluation.",
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
        1500,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
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
            String(
              task.status,
            ).toLowerCase(),
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
            null &&
            task.score !==
              undefined,
      );
    }, [portal]);

  /* =======================================================
     LOADING PAGE
  ======================================================= */

  if (portalLoading) {
    return (
      <main className="initial-loading">
        <div>
          <div className="initial-logo">
            KRVÉ
          </div>

          <Loader2
            size={30}
            className="spin"
          />

          <p>
            Preparing your Live
            Project workspace...
          </p>
        </div>

        <style jsx global>{`
          html,
          body {
            margin: 0;
            background: #f5f7fb;
            font-family:
              Arial,
              sans-serif;
          }

          .initial-loading {
            display: grid;
            min-height: 100vh;
            place-items: center;
            color: #13244c;
          }

          .initial-loading > div {
            display: flex;
            align-items: center;
            flex-direction: column;
            gap: 18px;
          }

          .initial-logo {
            font-size: 25px;
            font-weight: 900;
            letter-spacing: 0.17em;
          }

          .initial-loading p {
            color: #8390a5;
            font-size: 12px;
          }

          .spin {
            animation:
              spin 0.8s linear
              infinite;
          }

          @keyframes spin {
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
     LOGIN PAGE
  ======================================================= */

  if (!portal) {
    return (
      <main className="login-page">
        <section className="login-brand-side">
          <div className="brand">
            <div className="brand-logo">
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

          <div className="login-intro">
            <p>
              STUDENT WORKSPACE
            </p>

            <h1>
              Your work.
              <br />

              Your progress.
              <br />

              <em>
                Your impact.
              </em>
            </h1>

            <span>
              Access your KRVÉ
              Live Business
              Project,
              assignments,
              submissions,
              evaluations and
              certificate from
              one professional
              workspace.
            </span>
          </div>

          <div className="login-feature-grid">
            <article>
              <ClipboardList
                size={21}
              />

              <strong>
                Weekly Tasks
              </strong>

              <span>
                Receive project
                assignments
                directly from
                your
                coordinator.
              </span>
            </article>

            <article>
              <Send
                size={21}
              />

              <strong>
                Submit Work
              </strong>

              <span>
                Submit project
                evidence for
                review and
                evaluation.
              </span>
            </article>

            <article>
              <BarChart3
                size={21}
              />

              <strong>
                Evaluation
              </strong>

              <span>
                Track feedback,
                scores and
                overall
                performance.
              </span>
            </article>
          </div>
        </section>

        <section className="login-form-side">
          <form
            className="login-card"
            onSubmit={
              handleLogin
            }
          >
            <div className="login-icon">
              <GraduationCap
                size={23}
              />
            </div>

            <p className="eyebrow">
              STUDENT PORTAL
            </p>

            <h2>
              Welcome back.
            </h2>

            <p className="login-description">
              Enter the same
              details used in
              your Live Project
              application.
            </p>

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

            <label>
              REGISTERED EMAIL
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

            <label>
              REGISTERED MOBILE
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

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={
                loginLoading
              }
            >
              {loginLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
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

            <p className="support-line">
              Need help?{" "}
              <Link href="/contact">
                Contact KRVÉ
                Support
              </Link>
            </p>
          </form>
        </section>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            min-height: 100%;
            font-family:
              Arial,
              sans-serif;
            background: #f6f8fc;
          }

          button,
          input,
          textarea {
            font: inherit;
          }

          .login-page {
            display: grid;
            min-height: 100vh;
            grid-template-columns:
              1.1fr 0.9fr;
          }

          .login-brand-side {
            display: flex;
            flex-direction: column;
            justify-content:
              space-between;
            padding: 48px 58px;
            color: #fff;
            background:
              radial-gradient(
                circle at 85%
                  15%,
                rgba(
                  76,
                  123,
                  255,
                  0.36
                ),
                transparent
                  28%
              ),
              linear-gradient(
                145deg,
                #06142f,
                #0a2767 58%,
                #1747a8
              );
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .brand-logo {
            display: grid;
            width: 48px;
            height: 48px;
            place-items: center;
            border-radius: 14px;
            background: #fff;
            color: #0b2c72;
            font-weight: 900;
          }

          .brand strong {
            display: block;
            font-size: 18px;
            letter-spacing:
              0.08em;
          }

          .brand span {
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
            letter-spacing:
              0.18em;
          }

          .login-intro {
            margin: 80px 0
              55px;
          }

          .login-intro > p,
          .eyebrow {
            margin: 0;
            color: #9db9ff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing:
              0.2em;
          }

          .login-intro h1 {
            margin: 20px 0 0;
            font-size:
              clamp(
                50px,
                5vw,
                76px
              );
            line-height: 0.98;
            letter-spacing:
              -0.05em;
          }

          .login-intro h1 em {
            color: #a9c3ff;
            font-style: normal;
            font-weight: 500;
          }

          .login-intro > span {
            display: block;
            max-width: 660px;
            margin-top: 28px;
            color:
              rgba(
                255,
                255,
                255,
                0.68
              );
            font-size: 14px;
            line-height: 1.8;
          }

          .login-feature-grid {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                1fr
              );
            gap: 14px;
          }

          .login-feature-grid article {
            min-height: 150px;
            padding: 22px;
            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.13
              );
            border-radius: 17px;
            background:
              rgba(
                255,
                255,
                255,
                0.055
              );
          }

          .login-feature-grid svg {
            margin-bottom: 20px;
            color: #a5bdff;
          }

          .login-feature-grid strong {
            display: block;
            font-size: 13px;
          }

          .login-feature-grid span {
            display: block;
            margin-top: 7px;
            color:
              rgba(
                255,
                255,
                255,
                0.55
              );
            font-size: 11px;
            line-height: 1.6;
          }

          .login-form-side {
            display: grid;
            place-items: center;
            padding: 40px;
          }

          .login-card {
            width: min(
              100%,
              490px
            );
            padding: 40px;
            border:
              1px solid
              #e0e6f0;
            border-radius: 24px;
            background: #fff;
            box-shadow:
              0 25px 80px
              rgba(
                14,
                42,
                91,
                0.12
              );
          }

          .login-icon {
            display: grid;
            width: 48px;
            height: 48px;
            margin-bottom: 24px;
            place-items: center;
            border-radius: 14px;
            background: #edf3ff;
            color: #2056d7;
          }

          .login-card .eyebrow {
            color: #285bdd;
          }

          .login-card h2 {
            margin: 9px 0 7px;
            color: #101b31;
            font-size: 30px;
          }

          .login-description {
            margin:
              0 0 27px;
            color: #7d899c;
            font-size: 12px;
            line-height: 1.6;
          }

          .login-card label {
            display: block;
            margin:
              18px 0 7px;
            color: #52617b;
            font-size: 9px;
            font-weight: 900;
            letter-spacing:
              0.1em;
          }

          .login-card input {
            width: 100%;
            height: 53px;
            padding: 0 15px;
            border:
              1px solid
              #dce3ee;
            border-radius: 12px;
            outline: none;
            background: #fbfcff;
          }

          .login-card input:focus {
            border-color: #376bff;
            box-shadow:
              0 0 0 4px
              rgba(
                55,
                107,
                255,
                0.08
              );
          }

          .error-box {
            margin-top: 18px;
            padding: 12px 14px;
            border:
              1px solid
              #ffd2d5;
            border-radius: 10px;
            background: #fff5f5;
            color: #b62e39;
            font-size: 11px;
          }

          .primary-button {
            display: flex;
            width: 100%;
            height: 55px;
            align-items: center;
            justify-content:
              center;
            gap: 10px;
            margin-top: 22px;
            border: 0;
            border-radius: 12px;
            background:
              linear-gradient(
                135deg,
                #123f9f,
                #245de5
              );
            color: #fff;
            font-size: 10px;
            font-weight: 900;
            letter-spacing:
              0.1em;
            cursor: pointer;
          }

          .primary-button:disabled {
            opacity: 0.65;
            cursor:
              not-allowed;
          }

          .support-line {
            margin:
              20px 0 0;
            color: #8a96a9;
            font-size: 11px;
            text-align: center;
          }

          .support-line a {
            color: #2054d0;
            font-weight: 700;
            text-decoration: none;
          }

          .spin {
            animation:
              spin 0.8s linear
              infinite;
          }

          @keyframes spin {
            to {
              transform:
                rotate(360deg);
            }
          }

          @media (
            max-width: 950px
          ) {
            .login-page {
              grid-template-columns:
                1fr;
            }

            .login-brand-side {
              padding:
                35px 26px
                45px;
            }

            .login-feature-grid {
              grid-template-columns:
                1fr;
            }

            .login-form-side {
              padding:
                45px 20px;
            }
          }

          @media (
            max-width: 560px
          ) {
            .login-intro h1 {
              font-size: 45px;
            }

            .login-card {
              padding: 28px 20px;
            }
          }
        `}</style>
      </main>
    );
  }

  /* =======================================================
     PORTAL VARIABLES
  ======================================================= */

  const {
    student,
    tasks,
    summary,
  } = portal;

  /* =======================================================
     MAIN PORTAL
  ======================================================= */

  return (
    <main className="portal-page">
      <header className="mobile-header">
        <strong>
          KRVÉ
        </strong>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              true,
            )
          }
        >
          <Menu size={21} />
        </button>
      </header>

      <aside
        className={`sidebar ${
          mobileMenuOpen
            ? "open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
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
            className="mobile-close"
            onClick={() =>
              setMobileMenuOpen(
                false,
              )
            }
          >
            <X size={19} />
          </button>
        </div>

        <div className="student-mini">
          <div className="student-avatar">
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

        <nav>
          {portalTabs.map(
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
                    strokeWidth={
                      2
                    }
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

        <div className="sidebar-bottom">
          <span>
            APPLICATION ID
          </span>

          <strong>
            {
              student.applicationNumber
            }
          </strong>

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
          className="mobile-backdrop"
          onClick={() =>
            setMobileMenuOpen(
              false,
            )
          }
          aria-label="Close menu"
        />
      )}

      <section className="portal-content">
        <header className="portal-heading">
          <div>
            <p>
              KRVÉ LIVE BUSINESS
              PROJECT
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

          <div className="heading-user">
            <div>
              <span>
                LOGGED IN AS
              </span>

              <strong>
                {
                  student.fullName
                }
              </strong>
            </div>

            <div className="header-avatar">
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
            <section className="welcome-panel">
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
                  KRVÉ Live
                  Project and
                  complete your
                  assigned work
                  within the
                  project
                  timeline.
                </span>
              </div>

              <div className="project-state">
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

            <section className="stats">
              <article>
                <ClipboardList
                  size={21}
                />

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
                <Send
                  size={21}
                />

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
                <CheckCircle2
                  size={21}
                />

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
                <Target
                  size={21}
                />

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

            <section className="two-columns">
              <article className="panel">
                <div className="panel-heading">
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

                <div className="progress-track">
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="progress-meta">
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

              <article className="panel">
                <div className="panel-heading">
                  <div>
                    <p>
                      CURRENT
                      PROJECT
                    </p>

                    <h3>
                      Project
                      allocation
                    </h3>
                  </div>

                  <BookOpen
                    size={22}
                  />
                </div>

                <div className="mini-project-grid">
                  <InfoBlock
                    label="Department"
                    value={
                      student.assignedDepartment ||
                      "Pending"
                    }
                  />

                  <InfoBlock
                    label="Project"
                    value={
                      student.projectTitle ||
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
                    label="Project Code"
                    value={
                      student.projectCode ||
                      "Pending"
                    }
                  />
                </div>
              </article>
            </section>

            <section className="panel recent-panel">
              <div className="panel-heading">
                <div>
                  <p>
                    WEEKLY TASKS
                  </p>

                  <h3>
                    Recent
                    assignments
                  </h3>
                </div>

                <button
                  type="button"
                  className="text-action"
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
                  text="Your weekly project tasks will appear here once your coordinator assigns them."
                />
              ) : (
                <div className="task-list">
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
              <section className="review-notice">
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
                    awaiting review.
                  </strong>

                  <span>
                    Your score
                    and evaluator
                    comments will
                    appear after
                    review.
                  </span>
                </div>
              </section>
            )}
          </>
        )}

        {/* =================================================
            PROJECT
        ================================================= */}

        {activeTab ===
          "project" && (
          <section className="project-layout">
            <article className="panel project-main">
              <p className="blue-label">
                PROJECT
                ALLOCATION
              </p>

              <h2>
                {student.projectTitle ||
                  "Project allocation pending"}
              </h2>

              <p className="project-description">
                This is your
                official KRVÉ
                Live Business
                Project
                workspace.
                Complete the
                assigned tasks,
                submit supporting
                evidence and
                maintain
                professional
                communication
                throughout the
                project.
              </p>

              <div className="project-details">
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
                  label="Status"
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
                  label="Institute"
                  value={
                    student.college ||
                    "—"
                  }
                />
              </div>
            </article>

            <article className="panel profile-card">
              <UserRound
                size={25}
              />

              <p>
                STUDENT PROFILE
              </p>

              <h3>
                {
                  student.fullName
                }
              </h3>

              <InfoBlock
                label="Application"
                value={
                  student.applicationNumber
                }
              />

              <InfoBlock
                label="Course"
                value={
                  student.course ||
                  "—"
                }
              />

              <InfoBlock
                label="Semester / Year"
                value={
                  student.yearSemester ||
                  "—"
                }
              />

              <InfoBlock
                label="Email"
                value={
                  student.email
                }
              />
            </article>
          </section>
        )}

        {/* =================================================
            TASKS
        ================================================= */}

        {activeTab ===
          "tasks" && (
          <section className="panel page-panel">
            <div className="panel-heading">
              <div>
                <p>
                  WEEKLY WORK
                </p>

                <h3>
                  Assigned Tasks
                </h3>

                <span>
                  Open a task to
                  submit your
                  work for
                  evaluation.
                </span>
              </div>

              <strong className="task-total">
                {
                  tasks.length
                }{" "}
                TASK
                {tasks.length !==
                1
                  ? "S"
                  : ""}
              </strong>
            </div>

            {tasks.length ===
            0 ? (
              <EmptyState
                icon={
                  ClipboardList
                }
                title="No tasks assigned"
                text="Your coordinator has not assigned any tasks yet."
              />
            ) : (
              <div className="full-task-list">
                {tasks.map(
                  (task) => (
                    <article
                      className="task-card"
                      key={
                        task.id
                      }
                    >
                      <div className="task-card-week">
                        <span>
                          WEEK
                        </span>

                        <strong>
                          {
                            task.weekNumber
                          }
                        </strong>
                      </div>

                      <div className="task-card-body">
                        <div className="task-card-head">
                          <div>
                            <div className="badges">
                              <span
                                className={`status-badge ${getStatusClass(
                                  task.status,
                                )}`}
                              >
                                {statusLabel(
                                  task.status,
                                )}
                              </span>

                              <span
                                className={`priority-badge ${getPriorityClass(
                                  task.priority,
                                )}`}
                              >
                                {statusLabel(
                                  task.priority ||
                                    "Medium",
                                )}
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
                            <div className="score-box">
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
                          <p className="task-description">
                            {
                              task.description
                            }
                          </p>
                        )}

                        <div className="task-meta">
                          <InfoBlock
                            label="Due Date"
                            value={formatDate(
                              task.dueDate,
                            )}
                          />

                          <InfoBlock
                            label="Submission"
                            value={
                              task.submittedAt
                                ? formatDate(
                                    task.submittedAt,
                                  )
                                : "Not submitted"
                            }
                          />
                        </div>

                        {task.reviewerComment && (
                          <div className="reviewer-feedback">
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

                        <div className="task-actions">
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
                              <span className="approved-label">
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
          <section className="panel page-panel">
            <div className="panel-heading">
              <div>
                <p>
                  EVALUATION
                </p>

                <h3>
                  Feedback &
                  Scores
                </h3>

                <span>
                  Reviewer
                  comments and
                  task scores
                  appear here.
                </span>
              </div>
            </div>

            {feedbackTasks.length ===
            0 ? (
              <EmptyState
                icon={FileText}
                title="No feedback yet"
                text="Feedback will appear after your submitted tasks are reviewed."
              />
            ) : (
              <div className="feedback-list">
                {feedbackTasks.map(
                  (task) => (
                    <article
                      key={
                        task.id
                      }
                    >
                      <div className="feedback-week">
                        {
                          task.weekNumber
                        }
                      </div>

                      <div>
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

                      <div className="feedback-score">
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
            <section className="performance-hero">
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
                  EVALUATED BY
                </span>

                <strong>
                  {student.evaluation
                    ?.evaluatorName ||
                    "Evaluation pending"}
                </strong>

                <p>
                  {student.evaluation
                    ?.remarks ||
                    "Your final evaluation will be published here after review by the KRVÉ project team."}
                </p>
              </div>
            </section>

            <section className="performance-grid">
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
          <section className="certificate-section">
            {student.certificateId ? (
              <article className="certificate-card">
                <div className="certificate-top">
                  <strong>
                    KRVÉ
                  </strong>

                  <Award
                    size={44}
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

                <div className="certificate-grid">
                  <InfoBlock
                    label="Project"
                    value={
                      student.projectTitle ||
                      "KRVÉ Live Business Project"
                    }
                  />

                  <InfoBlock
                    label="Department"
                    value={
                      student.assignedDepartment ||
                      "General"
                    }
                  />

                  <InfoBlock
                    label="Certificate ID"
                    value={
                      student.certificateId
                    }
                  />

                  <InfoBlock
                    label="Issue Date"
                    value={formatDate(
                      student.certificateIssueDate,
                    )}
                  />
                </div>

                <div className="verified-label">
                  <CheckCircle2
                    size={17}
                  />

                  Verified by
                  KRVÉ
                </div>
              </article>
            ) : (
              <article className="panel page-panel">
                <EmptyState
                  icon={Award}
                  title="Certificate not issued yet"
                  text="Your certificate will appear here after successful project completion and final evaluation."
                />
              </article>
            )}
          </section>
        )}
      </section>

      {/* ===================================================
          SUBMISSION DRAWER
      =================================================== */}

      {submissionTask && (
        <div className="submission-layer">
          <button
            type="button"
            className="submission-backdrop"
            onClick={() =>
              setSubmissionTask(
                null,
              )
            }
            aria-label="Close submission"
          />

          <aside className="submission-panel">
            <header>
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
            </header>

            <form
              onSubmit={
                handleTaskSubmission
              }
            >
              <div className="instruction-box">
                <ClipboardList
                  size={19}
                />

                <div>
                  <strong>
                    Task
                    Instructions
                  </strong>

                  <p>
                    {submissionTask.description ||
                      "Complete the assigned task and submit your supporting work below."}
                  </p>
                </div>
              </div>

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
                    event.target
                      .value,
                  )
                }
                placeholder="Google Drive / Docs / Canva / GitHub link"
                required
              />

              <small>
                Make sure the
                evaluator has
                permission to
                open the link.
              </small>

              <label>
                WORK SUMMARY
              </label>

              <textarea
                rows={7}
                value={
                  submissionSummary
                }
                onChange={(
                  event,
                ) =>
                  setSubmissionSummary(
                    event.target
                      .value,
                  )
                }
                placeholder="Explain what you completed, your methodology, findings and business outcome..."
              />

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
                    event.target
                      .value,
                  )
                }
                placeholder="Optional remarks for your evaluator..."
              />

              {error && (
                <div className="submission-error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="submission-success">
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
                className="submit-button"
                disabled={
                  submissionLoading
                }
              >
                {submissionLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="spin"
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
          PORTAL CSS
      =================================================== */}

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          min-height: 100%;
          background: #f5f7fb;
          color: #142039;
          font-family:
            Arial,
            sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .portal-page {
          min-height: 100vh;
        }

        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 300;
          display: flex;
          width: 260px;
          flex-direction:
            column;
          border-right:
            1px solid
            #dfe5ef;
          background: #fff;
        }

        .sidebar-brand {
          display: flex;
          height: 84px;
          align-items: center;
          gap: 12px;
          padding: 0 22px;
          border-bottom:
            1px solid
            #edf1f6;
        }

        .sidebar-brand-icon {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              #071a40,
              #164393
            );
          color: #fff;
          font-weight: 900;
        }

        .sidebar-brand strong {
          display: block;
          font-size: 16px;
          letter-spacing:
            0.08em;
        }

        .sidebar-brand span {
          display: block;
          margin-top: 3px;
          color: #8d99ab;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.16em;
        }

        .mobile-close {
          display: none;
          margin-left: auto;
          border: 0;
          background:
            transparent;
        }

        .student-mini {
          display: flex;
          align-items: center;
          gap: 11px;
          margin: 17px;
          padding: 13px;
          border:
            1px solid
            #e4eaf3;
          border-radius: 13px;
          background: #f8faff;
        }

        .student-avatar,
        .header-avatar {
          display: grid;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          place-items: center;
          border-radius: 10px;
          background: #0c2d71;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
        }

        .student-mini strong {
          display: block;
          max-width: 150px;
          overflow: hidden;
          font-size: 11px;
          text-overflow:
            ellipsis;
          white-space: nowrap;
        }

        .student-mini span {
          display: block;
          margin-top: 4px;
          color: #8995a8;
          font-size: 9px;
        }

        .sidebar nav {
          display: flex;
          flex: 1;
          flex-direction:
            column;
          gap: 5px;
          padding: 0 14px;
        }

        .sidebar nav button {
          display: flex;
          width: 100%;
          height: 47px;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border: 0;
          border-radius: 11px;
          background:
            transparent;
          color: #607087;
          font-size: 11px;
          font-weight: 700;
          text-align: left;
        }

        .sidebar nav button:hover {
          background: #f4f7fc;
        }

        .sidebar nav button.active {
          background: #09172f;
          color: #fff;
        }

        .sidebar-bottom {
          padding: 17px;
          border-top:
            1px solid
            #edf1f6;
        }

        .sidebar-bottom > span {
          display: block;
          color: #98a3b4;
          font-size: 8px;
          font-weight: 800;
        }

        .sidebar-bottom > strong {
          display: block;
          margin: 5px 0 13px;
          overflow: hidden;
          color: #44536b;
          font-size: 9px;
          text-overflow:
            ellipsis;
          white-space: nowrap;
        }

        .sidebar-bottom button {
          display: flex;
          width: 100%;
          height: 40px;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border:
            1px solid
            #dfe5ee;
          border-radius: 9px;
          background: #fff;
          color: #627188;
          font-size: 10px;
        }

        .portal-content {
          min-height: 100vh;
          margin-left: 260px;
          padding: 0 38px 50px;
        }

        .portal-heading {
          display: flex;
          min-height: 105px;
          align-items: center;
          justify-content:
            space-between;
          gap: 20px;
          border-bottom:
            1px solid
            #e1e7ef;
        }

        .portal-heading p,
        .panel-heading p,
        .blue-label {
          margin: 0;
          color: #2658d3;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.17em;
        }

        .portal-heading h1 {
          margin: 7px 0 0;
          font-size: 25px;
        }

        .heading-user {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .heading-user > div:first-child {
          text-align: right;
        }

        .heading-user span {
          color: #99a4b5;
          font-size: 8px;
        }

        .heading-user strong {
          display: block;
          margin-top: 3px;
          font-size: 11px;
        }

        .welcome-panel {
          display: flex;
          min-height: 200px;
          align-items: center;
          justify-content:
            space-between;
          gap: 30px;
          margin-top: 28px;
          padding: 35px 40px;
          border-radius: 20px;
          color: #fff;
          background:
            radial-gradient(
              circle at 85%
                20%,
              rgba(
                92,
                139,
                255,
                0.48
              ),
              transparent
                25%
            ),
            linear-gradient(
              135deg,
              #071a3e,
              #0c347f
            );
        }

        .welcome-panel p {
          margin: 0;
          color: #9fbaff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.18em;
        }

        .welcome-panel h2 {
          margin: 10px 0 8px;
          font-size: 30px;
        }

        .welcome-panel > div:first-child > span {
          color:
            rgba(
              255,
              255,
              255,
              0.67
            );
          font-size: 12px;
        }

        .project-state {
          min-width: 225px;
          padding: 22px;
          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.14
            );
          border-radius: 15px;
          background:
            rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .project-state span {
          color: #a9bee9;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            0.12em;
        }

        .project-state strong {
          display: block;
          margin: 8px 0 6px;
          font-size: 18px;
        }

        .project-state small {
          color:
            rgba(
              255,
              255,
              255,
              0.55
            );
          font-size: 9px;
        }

        .stats {
          display: grid;
          grid-template-columns:
            repeat(
              4,
              1fr
            );
          gap: 15px;
          margin-top: 18px;
        }

        .stats article {
          min-height: 140px;
          padding: 21px;
          border:
            1px solid
            #e0e6ef;
          border-radius: 16px;
          background: #fff;
        }

        .stats svg {
          color: #2559d5;
        }

        .stats span {
          display: block;
          margin-top: 17px;
          color: #7e8a9c;
          font-size: 10px;
        }

        .stats strong {
          display: block;
          margin-top: 5px;
          font-size: 26px;
        }

        .two-columns {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 17px;
          margin-top: 18px;
        }

        .panel {
          border:
            1px solid
            #dfe5ee;
          border-radius: 17px;
          background: #fff;
          box-shadow:
            0 6px 22px
            rgba(
              15,
              43,
              90,
              0.045
            );
        }

        .two-columns .panel,
        .page-panel,
        .recent-panel {
          padding: 25px;
        }

        .panel-heading {
          display: flex;
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 20px;
        }

        .panel-heading h3 {
          margin: 7px 0 0;
          font-size: 18px;
        }

        .panel-heading > div > span {
          display: block;
          margin-top: 6px;
          color: #8a96a9;
          font-size: 10px;
        }

        .panel-heading > strong {
          color: #2358d6;
          font-size: 24px;
        }

        .progress-track {
          height: 8px;
          margin-top: 28px;
          overflow: hidden;
          border-radius: 50px;
          background: #edf1f6;
        }

        .progress-track div {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #1951d2,
              #638cff
            );
        }

        .progress-meta {
          display: flex;
          justify-content:
            space-between;
          margin-top: 10px;
          color: #7d899c;
          font-size: 9px;
        }

        .mini-project-grid,
        .project-details {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }

        .info-block {
          padding: 13px;
          border:
            1px solid
            #e8ecf2;
          border-radius: 10px;
          background: #fafcff;
        }

        .info-block span {
          display: block;
          color: #96a2b4;
          font-size: 8px;
          font-weight: 800;
          text-transform:
            uppercase;
        }

        .info-block strong {
          display: block;
          margin-top: 5px;
          color: #394960;
          font-size: 10px;
          word-break:
            break-word;
        }

        .recent-panel {
          margin-top: 18px;
        }

        .text-action {
          display: flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background:
            transparent;
          color: #2459d0;
          font-size: 10px;
          font-weight: 800;
        }

        .task-list {
          margin-top: 18px;
        }

        .task-row {
          display: grid;
          grid-template-columns:
            52px
            minmax(
              0,
              1fr
            )
            auto auto;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-top:
            1px solid
            #edf0f5;
        }

        .task-week-box {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 11px;
          background: #eff4ff;
          color: #295bd2;
          font-weight: 900;
        }

        .task-row-main strong {
          display: block;
          font-size: 11px;
        }

        .task-row-main span {
          display: block;
          margin-top: 4px;
          color: #929daf;
          font-size: 9px;
        }

        .status-badge,
        .priority-badge {
          display:
            inline-flex;
          width: fit-content;
          align-items: center;
          padding: 6px 9px;
          border-radius: 50px;
          font-size: 8px;
          font-weight: 900;
          text-transform:
            uppercase;
        }

        .status-badge.success {
          background: #e8f8ef;
          color: #17854a;
        }

        .status-badge.review {
          background: #eaf1ff;
          color: #255bd1;
        }

        .status-badge.warning {
          background: #fff3dd;
          color: #b97013;
        }

        .status-badge.danger {
          background: #fff0f1;
          color: #c13c47;
        }

        .status-badge.neutral {
          background: #f0f3f7;
          color: #69768a;
        }

        .priority-badge.high {
          background: #fff0f0;
          color: #c23d48;
        }

        .priority-badge.medium {
          background: #fff3df;
          color: #b8721a;
        }

        .priority-badge.low {
          background: #eaf8f0;
          color: #278357;
        }

        .small-action {
          padding: 9px 12px;
          border:
            1px solid
            #dce3ed;
          border-radius: 8px;
          background: #fff;
          color: #2858c8;
          font-size: 8px;
          font-weight: 900;
        }

        .review-notice {
          display: flex;
          gap: 11px;
          margin-top: 18px;
          padding: 16px 18px;
          border:
            1px solid
            #d8e5ff;
          border-radius: 13px;
          background: #f2f6ff;
          color: #2453bb;
        }

        .review-notice strong {
          display: block;
          font-size: 10px;
        }

        .review-notice span {
          display: block;
          margin-top: 4px;
          color: #6680b4;
          font-size: 9px;
        }

        .project-layout {
          display: grid;
          grid-template-columns:
            1.5fr 0.5fr;
          gap: 18px;
          margin-top: 28px;
        }

        .project-main {
          padding: 32px;
        }

        .project-main h2 {
          margin: 13px 0 0;
          font-size: 29px;
        }

        .project-description {
          margin-top: 18px;
          color: #758297;
          font-size: 11px;
          line-height: 1.8;
        }

        .profile-card {
          padding: 27px;
        }

        .profile-card > svg {
          color: #2558d0;
        }

        .profile-card > p {
          margin: 21px 0 7px;
          color: #2959d0;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.14em;
        }

        .profile-card > h3 {
          margin: 0 0 20px;
          font-size: 20px;
        }

        .profile-card .info-block {
          margin-top: 9px;
        }

        .page-panel {
          margin-top: 28px;
        }

        .task-total {
          padding: 8px 11px;
          border-radius: 8px;
          background: #f0f4fa;
          color: #637189 !important;
          font-size: 8px !important;
        }

        .full-task-list {
          display: flex;
          flex-direction:
            column;
          gap: 13px;
          margin-top: 23px;
        }

        .task-card {
          display: grid;
          grid-template-columns:
            95px 1fr;
          overflow: hidden;
          border:
            1px solid
            #e1e7ef;
          border-radius: 14px;
        }

        .task-card-week {
          display: flex;
          align-items: center;
          justify-content:
            center;
          flex-direction:
            column;
          background: #f4f7fd;
        }

        .task-card-week span {
          color: #8591a4;
          font-size: 8px;
          font-weight: 900;
        }

        .task-card-week strong {
          margin-top: 4px;
          color: #2458d0;
          font-size: 27px;
        }

        .task-card-body {
          padding: 21px;
        }

        .task-card-head {
          display: flex;
          justify-content:
            space-between;
          gap: 20px;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .task-card-head h3 {
          margin: 11px 0 0;
          font-size: 16px;
        }

        .score-box {
          text-align: right;
        }

        .score-box span {
          color: #96a1b2;
          font-size: 8px;
        }

        .score-box strong {
          display: block;
          margin-top: 4px;
          color: #1f55cd;
          font-size: 23px;
        }

        .task-description {
          margin: 14px 0 0;
          color: #758296;
          font-size: 11px;
          line-height: 1.7;
        }

        .task-meta {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 12px;
          margin-top: 15px;
        }

        .reviewer-feedback {
          margin-top: 14px;
          padding: 14px;
          border-radius: 10px;
          background: #f5f7fb;
        }

        .reviewer-feedback strong {
          font-size: 9px;
        }

        .reviewer-feedback p {
          margin: 5px 0 0;
          color: #738095;
          font-size: 10px;
          line-height: 1.6;
        }

        .task-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content:
            flex-end;
          gap: 8px;
          margin-top: 15px;
        }

        .task-actions a,
        .task-actions button,
        .approved-label {
          display: inline-flex;
          min-height: 37px;
          align-items: center;
          gap: 7px;
          padding: 0 13px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .task-actions a {
          border:
            1px solid
            #dce3ec;
          color: #596b83;
        }

        .task-actions button {
          border: 0;
          background: #174ec3;
          color: #fff;
        }

        .approved-label {
          background: #eaf8f0;
          color: #1e7f4f;
        }

        .feedback-list {
          margin-top: 22px;
        }

        .feedback-list article {
          display: grid;
          grid-template-columns:
            45px 1fr
            65px;
          gap: 15px;
          padding: 18px 0;
          border-top:
            1px solid
            #edf0f5;
        }

        .feedback-week {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border-radius: 10px;
          background: #edf3ff;
          color: #2860dc;
          font-weight: 900;
        }

        .feedback-list article > div:nth-child(2) > span {
          color: #7890bc;
          font-size: 8px;
          font-weight: 900;
        }

        .feedback-list h3 {
          margin: 5px 0;
          font-size: 13px;
        }

        .feedback-list p {
          margin: 0;
          color: #758296;
          font-size: 10px;
          line-height: 1.6;
        }

        .feedback-score {
          text-align: right;
        }

        .feedback-score span {
          color: #98a3b4;
          font-size: 8px;
        }

        .feedback-score strong {
          display: block;
          margin-top: 4px;
          color: #1f58d0;
          font-size: 22px;
        }

        .performance-hero {
          display: grid;
          grid-template-columns:
            0.7fr 1.3fr;
          gap: 35px;
          margin-top: 28px;
          padding: 33px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #071a3f,
              #0d357d
            );
          color: #fff;
        }

        .performance-hero p {
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

        .performance-hero > div:first-child > p {
          margin: 0;
          color: #9fb8ef;
          font-weight: 900;
          letter-spacing:
            0.15em;
        }

        .performance-hero h2 {
          margin: 9px 0 4px;
          font-size: 52px;
        }

        .performance-hero h2 span {
          color: #8aa6e4;
          font-size: 21px;
        }

        .performance-hero > div:last-child {
          align-self: center;
          padding-left: 30px;
          border-left:
            1px solid
            rgba(
              255,
              255,
              255,
              0.15
            );
        }

        .performance-hero > div:last-child > span {
          color: #91a8da;
          font-size: 8px;
        }

        .performance-hero > div:last-child > strong {
          display: block;
          margin-top: 4px;
          font-size: 13px;
        }

        .performance-grid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              1fr
            );
          gap: 14px;
          margin-top: 18px;
        }

        .performance-card {
          padding: 22px;
          border:
            1px solid
            #e0e6ef;
          border-radius: 14px;
          background: #fff;
        }

        .performance-card-head {
          display: flex;
          justify-content:
            space-between;
          gap: 12px;
        }

        .performance-card-head span {
          color: #7c899b;
          font-size: 10px;
        }

        .performance-card-head strong {
          color: #2257d0;
          font-size: 14px;
        }

        .performance-track {
          height: 7px;
          margin-top: 18px;
          overflow: hidden;
          border-radius: 50px;
          background: #edf1f6;
        }

        .performance-track div {
          height: 100%;
          background:
            linear-gradient(
              90deg,
              #2257d0,
              #7499ff
            );
        }

        .certificate-section {
          margin-top: 28px;
        }

        .certificate-card {
          max-width: 900px;
          margin: 0 auto;
          padding: 50px;
          border:
            8px solid
            #f3f5f8;
          outline:
            1px solid
            #dbe2ea;
          background: #fff;
          text-align: center;
        }

        .certificate-top {
          display: flex;
          justify-content:
            space-between;
          color: #174bbc;
        }

        .certificate-top strong {
          font-size: 22px;
          letter-spacing:
            0.13em;
        }

        .certificate-card > p {
          margin: 42px 0 0;
          color: #315aac;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            0.2em;
        }

        .certificate-card > h2 {
          margin: 12px 0;
          font-family:
            Georgia,
            serif;
          font-size: 42px;
          font-weight: 400;
        }

        .certificate-card > span {
          color: #758092;
          font-size: 12px;
        }

        .certificate-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 12px;
          margin-top: 35px;
          text-align: left;
        }

        .verified-label {
          display:
            inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 30px;
          padding: 9px 13px;
          border-radius: 30px;
          background: #eaf8f0;
          color: #227a4d;
          font-size: 9px;
          font-weight: 800;
        }

        .empty-state {
          display: flex;
          min-height: 240px;
          align-items: center;
          justify-content:
            center;
          flex-direction:
            column;
          padding: 25px;
          text-align: center;
        }

        .empty-icon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border-radius: 13px;
          background: #eff4fc;
          color: #5471aa;
        }

        .empty-state h3 {
          margin: 14px 0 6px;
          font-size: 14px;
        }

        .empty-state p {
          max-width: 450px;
          margin: 0;
          color: #8793a5;
          font-size: 10px;
          line-height: 1.6;
        }

        .submission-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
        }

        .submission-backdrop {
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

        .submission-panel {
          position: absolute;
          inset: 0 0 0 auto;
          width: min(
            610px,
            95vw
          );
          overflow-y: auto;
          background: #fff;
        }

        .submission-panel header {
          display: flex;
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 20px;
          padding: 32px;
          border-bottom:
            1px solid
            #e4e9f0;
        }

        .submission-panel header p {
          margin: 0;
          color: #2b59cf;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            0.16em;
        }

        .submission-panel header h2 {
          margin: 7px 0 5px;
          font-size: 25px;
        }

        .submission-panel header span {
          color: #8793a5;
          font-size: 10px;
        }

        .submission-panel header button {
          display: grid;
          width: 41px;
          height: 41px;
          place-items: center;
          border:
            1px solid
            #dce3ec;
          border-radius: 10px;
          background: #fff;
        }

        .submission-panel form {
          padding:
            28px 32px
            45px;
        }

        .instruction-box {
          display: flex;
          gap: 11px;
          padding: 15px;
          border:
            1px solid
            #dbe6ff;
          border-radius: 11px;
          background: #f4f7ff;
          color: #2553bf;
        }

        .instruction-box strong {
          font-size: 10px;
        }

        .instruction-box p {
          margin: 5px 0 0;
          color: #6a80ae;
          font-size: 10px;
          line-height: 1.6;
        }

        .submission-panel label {
          display: block;
          margin: 21px 0 7px;
          color: #526078;
          font-size: 9px;
          font-weight: 900;
        }

        .submission-panel input,
        .submission-panel textarea {
          width: 100%;
          padding: 14px;
          border:
            1px solid
            #dbe2ec;
          border-radius: 10px;
          outline: none;
          background: #fbfcfe;
          resize: vertical;
        }

        .submission-panel input {
          height: 50px;
        }

        .submission-panel small {
          display: block;
          margin-top: 6px;
          color: #98a3b4;
          font-size: 8px;
        }

        .submission-error,
        .submission-success {
          margin-top: 17px;
          padding: 12px;
          border-radius: 9px;
          font-size: 10px;
          line-height: 1.5;
        }

        .submission-error {
          background: #fff3f4;
          color: #b42b37;
        }

        .submission-success {
          display: flex;
          gap: 8px;
          background: #effbf4;
          color: #22794c;
        }

        .submit-button {
          display: flex;
          width: 100%;
          height: 52px;
          align-items: center;
          justify-content:
            center;
          gap: 8px;
          margin-top: 22px;
          border: 0;
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              #123e9c,
              #235de5
            );
          color: #fff;
          font-size: 10px;
          font-weight: 900;
        }

        .submit-button:disabled {
          opacity: 0.7;
        }

        .mobile-header,
        .mobile-backdrop {
          display: none;
        }

        .spin {
          animation:
            spin 0.8s linear
            infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        @media (
          max-width: 1100px
        ) {
          .stats {
            grid-template-columns:
              1fr 1fr;
          }

          .two-columns {
            grid-template-columns:
              1fr;
          }

          .performance-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .project-layout {
            grid-template-columns:
              1fr;
          }
        }

        @media (
          max-width: 820px
        ) {
          .mobile-header {
            position: sticky;
            top: 0;
            z-index: 250;
            display: flex;
            height: 64px;
            align-items: center;
            justify-content:
              space-between;
            padding: 0 19px;
            border-bottom:
              1px solid
              #e2e7ef;
            background:
              rgba(
                255,
                255,
                255,
                0.95
              );
          }

          .mobile-header strong {
            color: #0b2c70;
            letter-spacing:
              0.1em;
          }

          .mobile-header button {
            display: grid;
            width: 39px;
            height: 39px;
            place-items: center;
            border:
              1px solid
              #dce2eb;
            border-radius: 9px;
            background: #fff;
          }

          .sidebar {
            z-index: 1001;
            width: 280px;
            transform:
              translateX(
                -100%
              );
            transition:
              0.25s ease;
          }

          .sidebar.open {
            transform:
              translateX(0);
          }

          .mobile-close {
            display: grid;
            place-items: center;
          }

          .mobile-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: block;
            width: 100%;
            height: 100%;
            border: 0;
            background:
              rgba(
                7,
                15,
                30,
                0.5
              );
          }

          .portal-content {
            margin-left: 0;
            padding:
              0 18px
              40px;
          }

          .heading-user > div:first-child {
            display: none;
          }

          .welcome-panel {
            align-items:
              flex-start;
            flex-direction:
              column;
          }

          .project-state {
            width: 100%;
          }

          .task-row {
            grid-template-columns:
              50px 1fr;
          }

          .task-row > .status-badge,
          .task-row > .small-action {
            grid-column: 2;
            justify-self:
              flex-start;
          }

          .task-card {
            grid-template-columns:
              1fr;
          }

          .task-card-week {
            min-height: 60px;
            flex-direction: row;
            gap: 7px;
          }

          .task-card-week strong {
            font-size: 18px;
          }

          .performance-hero {
            grid-template-columns:
              1fr;
          }

          .performance-hero > div:last-child {
            padding:
              24px 0 0;
            border-top:
              1px solid
              rgba(
                255,
                255,
                255,
                0.15
              );
            border-left: 0;
          }
        }

        @media (
          max-width: 560px
        ) {
          .stats,
          .performance-grid,
          .mini-project-grid,
          .project-details,
          .task-meta,
          .certificate-grid {
            grid-template-columns:
              1fr;
          }

          .welcome-panel {
            padding: 26px 21px;
          }

          .welcome-panel h2 {
            font-size: 24px;
          }

          .project-main,
          .page-panel,
          .recent-panel,
          .two-columns .panel {
            padding: 20px;
          }

          .task-card-head {
            flex-direction:
              column;
          }

          .score-box {
            text-align: left;
          }

          .task-actions {
            justify-content:
              flex-start;
          }

          .feedback-list article {
            grid-template-columns:
              42px 1fr;
          }

          .feedback-score {
            grid-column: 2;
            text-align: left;
          }

          .certificate-card {
            padding: 30px 20px;
          }

          .certificate-card > h2 {
            font-size: 31px;
          }

          .submission-panel {
            width: 100%;
          }

          .submission-panel header,
          .submission-panel form {
            padding-left: 20px;
            padding-right: 20px;
          }
        }
      `}</style>
    </main>
  );
}
