import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type Certificate = {
  certificateId: string;
  studentName: string;
  projectTitle: string;
  department: string;
  startDate?: string | null;
  endDate?: string | null;
  issueDate?: string | null;
  status?: string | null;
};

type CertificateResponse = {
  success?: boolean;
  message?: string;

  data?: {
    certificate?: Certificate;
  };

  certificate?: Certificate;
};

function getApiUrl() {
  const value =
    process.env.KRVE_API_URL?.trim() ||
    process.env
      .NEXT_PUBLIC_KRVE_API_URL
      ?.trim() ||
    "";

  return value.replace(
    /\/+$/,
    "",
  );
}

function formatDate(
  value?:
    | string
    | null,
) {
  if (!value) {
    return "—";
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
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function normalizeCertificate(
  response: CertificateResponse,
) {
  return (
    response.data
      ?.certificate ||
    response.certificate ||
    null
  );
}

async function getCertificate(
  certificateId: string,
) {
  const apiUrl =
    getApiUrl();

  if (!apiUrl) {
    return {
      certificate:
        null as Certificate | null,

      error:
        "KRVE API URL is not configured on the website.",
    };
  }

  try {
    const response =
      await fetch(
        `${apiUrl}/live-projects/certificates/${encodeURIComponent(
          certificateId,
        )}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache:
            "no-store",
        },
      );

    const contentType =
      response.headers.get(
        "content-type",
      ) || "";

    if (
      !contentType.includes(
        "application/json",
      )
    ) {
      const text =
        await response.text();

      return {
        certificate:
          null as Certificate | null,

        error:
          text ||
          "Unexpected response from KRVE Central API.",
      };
    }

    const data =
      (await response.json()) as CertificateResponse;

    if (
      !response.ok ||
      data.success === false
    ) {
      return {
        certificate:
          null as Certificate | null,

        error:
          data.message ||
          "Certificate not found.",
      };
    }

    const certificate =
      normalizeCertificate(
        data,
      );

    if (!certificate) {
      return {
        certificate:
          null as Certificate | null,

        error:
          "Certificate data was not returned.",
      };
    }

    return {
      certificate,
      error: "",
    };
  } catch (
    error
  ) {
    return {
      certificate:
        null as Certificate | null,

      error:
        error instanceof
        Error
          ? error.message
          : "Unable to verify certificate.",
    };
  }
}

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{
    certificateId: string;
  }>;
}) {
  const {
    certificateId:
      rawCertificateId,
  } = await params;

  const certificateId =
    decodeURIComponent(
      rawCertificateId ||
        "",
    )
      .trim()
      .toUpperCase();

  const {
    certificate,
    error,
  } =
    await getCertificate(
      certificateId,
    );

  if (
    !certificate
  ) {
    return (
      <main className="verify-page">
        <section className="verify-shell">
          <header className="brand-header">
            <div className="brand-mark">
              K
            </div>

            <div>
              <strong>
                KRVÉ
              </strong>

              <span>
                THE FASHION
                STUDIO
              </span>
            </div>
          </header>

          <div className="not-found-card">
            <div className="error-icon">
              <CircleAlert
                size={32}
              />
            </div>

            <p className="eyebrow error">
              VERIFICATION
              FAILED
            </p>

            <h1>
              Certificate could
              not be verified.
            </h1>

            <p className="lead">
              We could not find a
              valid KRVÉ Live
              Project certificate
              for the supplied
              Certificate ID.
            </p>

            <div className="certificate-id-box">
              <span>
                CERTIFICATE ID
              </span>

              <strong>
                {certificateId ||
                  "Not supplied"}
              </strong>
            </div>

            {error ? (
              <p className="technical-note">
                {error}
              </p>
            ) : null}

            <a
              href="/"
              className="home-button"
            >
              Return to KRVÉ
            </a>
          </div>

          <footer>
            <ShieldCheck
              size={14}
            />

            Official KRVÉ
            certificate
            verification
          </footer>
        </section>

        <VerificationStyles />
      </main>
    );
  }

  const verified =
    String(
      certificate.status ||
        "",
    )
      .trim()
      .toLowerCase() ===
    "verified";

  return (
    <main className="verify-page">
      <section className="verify-shell">
        <header className="brand-header">
          <div className="brand-mark">
            K
          </div>

          <div>
            <strong>
              KRVÉ
            </strong>

            <span>
              THE FASHION
              STUDIO
            </span>
          </div>
        </header>

        <section className="verification-card">
          <div
            className={
              verified
                ? "status-icon verified"
                : "status-icon pending"
            }
          >
            {verified ? (
              <BadgeCheck
                size={38}
              />
            ) : (
              <CircleAlert
                size={38}
              />
            )}
          </div>

          <p
            className={
              verified
                ? "eyebrow"
                : "eyebrow pending"
            }
          >
            {verified
              ? "VERIFIED CERTIFICATE"
              : "CERTIFICATE STATUS"}
          </p>

          <h1>
            {verified
              ? "Certificate authenticity confirmed."
              : "Certificate record found."}
          </h1>

          <p className="lead">
            This record is
            retrieved directly
            from the KRVÉ Central
            Platform.
          </p>

          <div className="student-block">
            <span>
              CERTIFICATE HOLDER
            </span>

            <h2>
              {
                certificate.studentName
              }
            </h2>

            <p>
              {
                certificate.projectTitle
              }
            </p>
          </div>

          <div className="detail-grid">
            <article>
              <GraduationCap
                size={19}
              />

              <span>
                DEPARTMENT
              </span>

              <strong>
                {
                  certificate.department
                }
              </strong>
            </article>

            <article>
              <CalendarDays
                size={19}
              />

              <span>
                PROJECT PERIOD
              </span>

              <strong>
                {formatDate(
                  certificate.startDate,
                )}
                {" – "}
                {formatDate(
                  certificate.endDate,
                )}
              </strong>
            </article>

            <article>
              <CheckCircle2
                size={19}
              />

              <span>
                ISSUE DATE
              </span>

              <strong>
                {formatDate(
                  certificate.issueDate,
                )}
              </strong>
            </article>

            <article>
              <ShieldCheck
                size={19}
              />

              <span>
                STATUS
              </span>

              <strong
                className={
                  verified
                    ? "verified-text"
                    : ""
                }
              >
                {String(
                  certificate.status ||
                    "Unknown",
                )
                  .replaceAll(
                    "_",
                    " ",
                  )
                  .replace(
                    /\b\w/g,
                    (
                      char,
                    ) =>
                      char.toUpperCase(),
                  )}
              </strong>
            </article>
          </div>

          <div className="certificate-id-box verified-box">
            <span>
              VERIFIED
              CERTIFICATE ID
            </span>

            <strong>
              {
                certificate.certificateId
              }
            </strong>
          </div>

          <div className="verification-note">
            <ShieldCheck
              size={18}
            />

            <p>
              This page confirms
              that the Certificate
              ID above exists in
              the official KRVÉ
              Live Project
              certificate
              registry.
            </p>
          </div>
        </section>

        <footer>
          <ShieldCheck
            size={14}
          />

          KRVÉ Live Business
          Project Program •
          Public Verification
        </footer>
      </section>

      <VerificationStyles />
    </main>
  );
}

function VerificationStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            min-height: 100%;
            background: #f4f7fb;
            color: #10203a;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .verify-page {
            min-height: 100vh;
            padding: 42px 20px;
            background:
              radial-gradient(
                circle at 10% 10%,
                rgba(31, 86, 203, 0.08),
                transparent 28%
              ),
              radial-gradient(
                circle at 90% 15%,
                rgba(197, 157, 78, 0.10),
                transparent 24%
              ),
              #f4f7fb;
          }

          .verify-shell {
            width: min(100%, 930px);
            margin: 0 auto;
          }

          .brand-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 13px;
            margin-bottom: 27px;
          }

          .brand-mark {
            display: grid;
            width: 48px;
            height: 48px;
            place-items: center;
            border-radius: 14px;
            background: #09275d;
            color: white;
            font-size: 20px;
            font-weight: 900;
          }

          .brand-header strong {
            display: block;
            font-size: 22px;
            letter-spacing: 0.1em;
          }

          .brand-header span {
            display: block;
            margin-top: 3px;
            color: #9b7b3c;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.18em;
          }

          .verification-card,
          .not-found-card {
            border: 1px solid #dfe6ef;
            border-radius: 26px;
            background: rgba(255,255,255,0.98);
            padding: 46px;
            box-shadow:
              0 24px 70px rgba(24, 51, 88, 0.09);
            text-align: center;
          }

          .status-icon,
          .error-icon {
            display: grid;
            width: 74px;
            height: 74px;
            margin: 0 auto;
            place-items: center;
            border-radius: 50%;
          }

          .status-icon.verified {
            background: #e9f9ef;
            color: #158552;
          }

          .status-icon.pending {
            background: #fff5df;
            color: #b87612;
          }

          .error-icon {
            background: #fff0f1;
            color: #c83c47;
          }

          .eyebrow {
            margin: 20px 0 0;
            color: #158552;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.18em;
          }

          .eyebrow.pending {
            color: #a86a13;
          }

          .eyebrow.error {
            color: #c83c47;
          }

          h1 {
            margin: 11px auto 0;
            max-width: 650px;
            color: #0d1c34;
            font-size: clamp(28px, 5vw, 42px);
            line-height: 1.14;
          }

          .lead {
            max-width: 620px;
            margin: 13px auto 0;
            color: #76849a;
            font-size: 14px;
            line-height: 1.75;
          }

          .student-block {
            margin-top: 34px;
            padding: 27px 20px;
            border-top: 1px solid #e5eaf1;
            border-bottom: 1px solid #e5eaf1;
          }

          .student-block span,
          .detail-grid span,
          .certificate-id-box span {
            display: block;
            color: #8390a4;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.12em;
          }

          .student-block h2 {
            margin: 10px 0 0;
            color: #0b285d;
            font-size: clamp(26px, 4vw, 36px);
            text-transform: uppercase;
          }

          .student-block p {
            margin: 8px 0 0;
            color: #56657a;
            font-size: 14px;
            line-height: 1.6;
          }

          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 13px;
            margin-top: 26px;
            text-align: left;
          }

          .detail-grid article {
            min-height: 120px;
            padding: 20px;
            border: 1px solid #e2e7ee;
            border-radius: 16px;
            background: #f8fafc;
          }

          .detail-grid article svg {
            color: #315eaa;
          }

          .detail-grid article span {
            margin-top: 16px;
          }

          .detail-grid article strong {
            display: block;
            margin-top: 8px;
            color: #20304a;
            font-size: 14px;
            line-height: 1.55;
          }

          .verified-text {
            color: #158552 !important;
          }

          .certificate-id-box {
            margin-top: 25px;
            padding: 21px;
            border-radius: 16px;
            background: #f8fafc;
          }

          .certificate-id-box.verified-box {
            border: 1px solid #c6ead5;
            background: #effbf4;
          }

          .certificate-id-box strong {
            display: block;
            margin-top: 9px;
            color: #0b285d;
            font-family:
              "Courier New",
              monospace;
            font-size: clamp(13px, 3vw, 18px);
            overflow-wrap: anywhere;
          }

          .verification-note {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-top: 23px;
            padding: 16px;
            border-radius: 14px;
            background: #f4f7fb;
            color: #65748a;
            text-align: left;
          }

          .verification-note svg {
            flex: 0 0 auto;
            color: #158552;
          }

          .verification-note p {
            margin: 0;
            font-size: 11px;
            line-height: 1.7;
          }

          .technical-note {
            margin: 15px auto 0;
            max-width: 650px;
            color: #a04b54;
            font-size: 11px;
            line-height: 1.6;
          }

          .home-button {
            display: inline-flex;
            min-height: 46px;
            align-items: center;
            justify-content: center;
            margin-top: 24px;
            padding: 0 22px;
            border-radius: 12px;
            background: #0b285d;
            color: white;
            font-size: 12px;
            font-weight: 900;
            text-decoration: none;
          }

          footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            margin-top: 21px;
            color: #8793a5;
            font-size: 9px;
            text-align: center;
          }

          @media (max-width: 650px) {
            .verify-page {
              padding:
                24px 12px;
            }

            .verification-card,
            .not-found-card {
              padding:
                32px 18px;
              border-radius:
                20px;
            }

            .detail-grid {
              grid-template-columns:
                1fr;
            }
          }
        `,
      }}
    />
  );
}
