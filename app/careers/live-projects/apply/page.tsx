"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import styles from "./apply.module.css";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  yearSemester: string;
  linkedinUrl: string;
  departmentPreference: string;
  skills: string;
  experience: string;
  motivation: string;
  weeklyAvailability: string;
  resumeUrl: string;
};

const departments = [
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Operations",
  "Product & Fashion Research",
  "Technology & E-Commerce",
  "Customer Experience",
];

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  yearSemester: "",
  linkedinUrl: "",
  departmentPreference: "",
  skills: "",
  experience: "",
  motivation: "",
  weeklyAvailability: "",
  resumeUrl: "",
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
  const now = new Date();

  if (now < LIVE_PROJECT_OPEN_AT) {
    return "upcoming";
  }

  if (now >= LIVE_PROJECT_CLOSE_AT) {
    return "closed";
  }

  return "open";
}

function formatWindowDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    },
  ).format(date);
}

export default function LiveProjectApplyPage() {
  const [form, setForm] =
    useState<FormData>(
      initialForm,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [
    applicationNumber,
    setApplicationNumber,
  ] = useState("");


  const [
    applicationStatus,
    setApplicationStatus,
  ] =
    useState<LiveProjectStatus>(
      getLiveProjectStatus(),
    );

  const [
    currentTime,
    setCurrentTime,
  ] =
    useState(
      new Date(),
    );

  useEffect(() => {
    const updateStatus =
      () => {
        setApplicationStatus(
          getLiveProjectStatus(),
        );

        setCurrentTime(
          new Date(),
        );
      };

    updateStatus();

    const timer =
      window.setInterval(
        updateStatus,
        60_000,
      );

    return () =>
      window.clearInterval(
        timer,
      );
  }, []);

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const liveStatus =
      getLiveProjectStatus();

    if (
      liveStatus !==
      "open"
    ) {
      setApplicationStatus(
        liveStatus,
      );

      setError(
        liveStatus ===
          "upcoming"
          ? "Applications are not open yet. The application window opens on 22 August 2026."
          : "Applications for this Live Project cohort closed on 15 September 2026.",
      );

      return;
    }

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.college.trim() ||
      !form.course.trim() ||
      !form.departmentPreference ||
      !form.weeklyAvailability.trim() ||
      !form.motivation.trim()
    ) {
      setError(
        "Please complete all required fields.",
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/live-project/apply",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form,
            ),
          },
        );

      const payload =
        await response.json();

      if (
        !response.ok ||
        payload.success === false
      ) {
        throw new Error(
          payload.message ||
            "Application could not be submitted.",
        );
      }

      setApplicationNumber(
        payload.applicationNumber ||
          payload.data
            ?.applicationNumber ||
          "",
      );

      setSuccess(true);

      setForm(initialForm);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Application could not be submitted.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.successSection}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              ✓
            </div>

            <p className={styles.eyebrow}>
              KRVE Live Business Project
            </p>

            <h1 className={styles.successTitle}>
              Application Submitted
            </h1>

            <p className={styles.successText}>
              Your application has been received successfully.
              The KRVE team will review your profile and update
              your application status after evaluation.
            </p>

            {applicationNumber ? (
              <div className={styles.applicationNumberBox}>
                <span className={styles.applicationNumberLabel}>
                  Application Number
                </span>

                <strong className={styles.applicationNumber}>
                  {applicationNumber}
                </strong>

                <span className={styles.applicationNumberHint}>
                  Save this number for future reference.
                </span>
              </div>
            ) : null}

            <div className={styles.successActions}>
              {applicationStatus ===
              "open" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setApplicationNumber("");
                  }}
                  className={styles.primaryButton}
                >
                  Submit Another Application
                </button>
              ) : null}

              <Link
                href="/careers/live-projects"
                className={styles.secondaryButton}
              >
                Back to Live Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (
    applicationStatus !==
    "open"
  ) {
    const upcoming =
      applicationStatus ===
      "upcoming";

    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <Link
              href="/careers/live-projects"
              className={styles.backLink}
            >
              ← Back to Live Projects
            </Link>

            <div className={styles.heroContent}>
              <div className={styles.eyebrow}>
                {upcoming
                  ? "Applications Opening Soon"
                  : "Applications Closed"}
              </div>

              <h1 className={styles.heroTitle}>
                KRVE Live Business Project
                <span className={styles.gold}>
                  {upcoming
                    ? " Applications Open 22 August"
                    : " Application Window Closed"}
                </span>
              </h1>

              <p className={styles.heroText}>
                {upcoming
                  ? "Applications for the KRVE Live Business Project Program will open on 22 August 2026 and remain available through 15 September 2026."
                  : "The application window for this KRVE Live Business Project cohort closed on 15 September 2026. Please check the Careers page for future opportunities."}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.container}>
            <div className={styles.layout}>
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <p className={styles.sectionTag}>
                    Application Window
                  </p>

                  <h2 className={styles.formTitle}>
                    {upcoming
                      ? "Applications Are Not Open Yet"
                      : "Applications Are Closed"}
                  </h2>

                  <p className={styles.formIntro}>
                    {upcoming
                      ? `Opening date: ${formatWindowDate(
                          LIVE_PROJECT_OPEN_AT,
                        )}`
                      : "Closing date: 15 September 2026"}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    padding: "24px",
                    border:
                      "1px solid rgba(218, 165, 32, 0.25)",
                    background:
                      "rgba(218, 165, 32, 0.05)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#b9932f",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Application Window
                  </p>

                  <p
                    style={{
                      margin: "10px 0 0",
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: 800,
                    }}
                  >
                    22 August 2026 – 15 September 2026
                  </p>

                  <p
                    style={{
                      margin: "10px 0 0",
                      color:
                        "rgba(255,255,255,0.65)",
                      fontSize: "13px",
                      lineHeight: 1.7,
                    }}
                  >
                    {upcoming
                      ? `Current status checked at ${currentTime.toLocaleTimeString(
                          "en-IN",
                          {
                            timeZone:
                              "Asia/Kolkata",
                          },
                        )} IST. The form will become available automatically when the window opens.`
                      : "This form has been disabled automatically because the application deadline has passed."}
                  </p>
                </div>

                <div className={styles.submitArea}>
                  <Link
                    href="/careers"
                    className={styles.secondaryButton}
                  >
                    Back to Careers
                  </Link>
                </div>
              </div>

              <aside className={styles.sidebar}>
                <div className={styles.infoCard}>
                  <p className={styles.sectionTag}>
                    Program Summary
                  </p>

                  <h2 className={styles.infoTitle}>
                    KRVE Live Business Project
                  </h2>

                  <div className={styles.infoRows}>
                    <InfoRow
                      label="Applications Open"
                      value="22 Aug 2026"
                    />

                    <InfoRow
                      label="Applications Close"
                      value="15 Sept 2026"
                    />

                    <InfoRow
                      label="Duration"
                      value="4–6 Weeks"
                    />

                    <InfoRow
                      label="Certificate"
                      value="Verified ID"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link
            href="/careers/live-projects"
            className={styles.backLink}
          >
            ← Back to Live Projects
          </Link>

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              Applications Open • Until 15 Sept 2026
            </div>

            <h1 className={styles.heroTitle}>
              Apply for KRVE
              <span className={styles.gold}>
                Live Business Project
              </span>
            </h1>

            <p className={styles.heroText}>
              Submit your profile and preferred business function.
              Selected candidates will receive project allocation,
              weekly tasks and performance evaluation through KRVE.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <form
              onSubmit={handleSubmit}
              className={styles.formCard}
            >
              <div className={styles.formHeader}>
                <p className={styles.sectionTag}>
                  Candidate Application
                </p>

                <h2 className={styles.formTitle}>
                  Personal & Academic Details
                </h2>

                <p className={styles.formIntro}>
                  Fields marked with * are required.
                </p>
              </div>

              <div className={styles.formGrid}>
                <Field
                  label="Full Name *"
                  value={form.fullName}
                  onChange={(value) =>
                    updateField(
                      "fullName",
                      value,
                    )
                  }
                  placeholder="Your full name"
                />

                <Field
                  label="Email Address *"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    updateField(
                      "email",
                      value,
                    )
                  }
                  placeholder="you@example.com"
                />

                <Field
                  label="Mobile Number *"
                  type="tel"
                  value={form.phone}
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value,
                    )
                  }
                  placeholder="+91 9876543210"
                />

                <Field
                  label="College / University *"
                  value={form.college}
                  onChange={(value) =>
                    updateField(
                      "college",
                      value,
                    )
                  }
                  placeholder="College or university"
                />

                <Field
                  label="Course / Program *"
                  value={form.course}
                  onChange={(value) =>
                    updateField(
                      "course",
                      value,
                    )
                  }
                  placeholder="Example: MBA"
                />

                <Field
                  label="Year / Semester"
                  value={form.yearSemester}
                  onChange={(value) =>
                    updateField(
                      "yearSemester",
                      value,
                    )
                  }
                  placeholder="Example: 2nd Year / Semester 3"
                />

                <label className={styles.field}>
                  <span className={styles.label}>
                    Preferred Department *
                  </span>

                  <select
                    required
                    value={
                      form.departmentPreference
                    }
                    onChange={(event) =>
                      updateField(
                        "departmentPreference",
                        event.target.value,
                      )
                    }
                    className={styles.select}
                  >
                    <option value="">
                      Select department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <Field
                  label="Weekly Availability *"
                  value={
                    form.weeklyAvailability
                  }
                  onChange={(value) =>
                    updateField(
                      "weeklyAvailability",
                      value,
                    )
                  }
                  placeholder="Example: 10–12 hours/week"
                />

                <div className={styles.fullWidth}>
                  <Field
                    label="LinkedIn Profile"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(value) =>
                      updateField(
                        "linkedinUrl",
                        value,
                      )
                    }
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className={styles.fullWidth}>
                  <Field
                    label="Resume / CV Link"
                    type="url"
                    value={form.resumeUrl}
                    onChange={(value) =>
                      updateField(
                        "resumeUrl",
                        value,
                      )
                    }
                    placeholder="Google Drive or portfolio link"
                  />
                </div>

                <div className={styles.fullWidth}>
                  <TextArea
                    label="Skills"
                    value={form.skills}
                    onChange={(value) =>
                      updateField(
                        "skills",
                        value,
                      )
                    }
                    placeholder="Example: Digital marketing, Excel, market research, sales, finance, UI/UX..."
                  />
                </div>

                <div className={styles.fullWidth}>
                  <TextArea
                    label="Experience / Certifications"
                    value={form.experience}
                    onChange={(value) =>
                      updateField(
                        "experience",
                        value,
                      )
                    }
                    placeholder="Internships, projects, certifications or relevant experience..."
                  />
                </div>

                <div className={styles.fullWidth}>
                  <TextArea
                    label="Why do you want to join KRVE Live Project? *"
                    value={form.motivation}
                    onChange={(value) =>
                      updateField(
                        "motivation",
                        value,
                      )
                    }
                    placeholder="Tell us why you want to work on a real KRVE business project..."
                    required
                  />
                </div>
              </div>

              {error ? (
                <div className={styles.error}>
                  {error}
                </div>
              ) : null}

              <div className={styles.submitArea}>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    applicationStatus !==
                      "open"
                  }
                  className={styles.submitButton}
                >
                  {loading
                    ? "Submitting..."
                    : applicationStatus ===
                        "open"
                      ? "Submit Application →"
                      : "Applications Closed"}
                </button>
              </div>
            </form>

            <aside className={styles.sidebar}>
              <div className={styles.infoCard}>
                <p className={styles.sectionTag}>
                  Program Summary
                </p>

                <h2 className={styles.infoTitle}>
                  KRVE Live Business Project
                </h2>

                <p className={styles.infoText}>
                  Work on real business challenges and gain
                  practical exposure through a structured
                  project experience.
                </p>

                <div className={styles.infoRows}>
                  <InfoRow
                    label="Duration"
                    value="4–6 Weeks"
                  />

                  <InfoRow
                    label="Application Window"
                    value="22 Aug – 15 Sept 2026"
                  />

                  <InfoRow
                    label="Mode"
                    value="Project Based"
                  />

                  <InfoRow
                    label="Evaluation"
                    value="100-Point Framework"
                  />

                  <InfoRow
                    label="Certificate"
                    value="Verified ID"
                  />
                </div>
              </div>

              <div className={styles.stepsCard}>
                <p className={styles.sectionTag}>
                  Application Process
                </p>

                <Step
                  number="01"
                  title="Submit Application"
                  text="Complete your academic and professional profile."
                />

                <Step
                  number="02"
                  title="Profile Review"
                  text="KRVE reviews your skills, interest and availability."
                />

                <Step
                  number="03"
                  title="Selection"
                  text="Shortlisted candidates move to selection and project allocation."
                />

                <Step
                  number="04"
                  title="Project Start"
                  text="Selected candidates begin their structured Live Project."
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        required={label.includes("*")}
        className={styles.input}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        required={required}
        rows={4}
        className={styles.textarea}
      />
    </label>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={styles.infoRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className={styles.step}>
      <span className={styles.stepNumber}>
        {number}
      </span>

      <div>
        <strong className={styles.stepTitle}>
          {title}
        </strong>

        <p className={styles.stepText}>
          {text}
        </p>
      </div>
    </div>
  );
}
