import type { Metadata } from "next";
import Link from "next/link";

import styles from "./careers.module.css";

export const metadata: Metadata = {
  title: "Careers & Live Projects",

  description:
    "Explore careers, internships and live business projects at KRVE — The Fashion Studio. Gain practical exposure across marketing, sales, finance, HR, operations, technology, fashion and e-commerce.",

  keywords: [
    "KRVE careers",
    "KRVE live project",
    "KRVE internship",
    "KRVE The Fashion Studio careers",
    "KRVE Live Business Project",
    "live business project India",
    "MBA live project",
    "MBA live project India",
    "student live projects",
    "fashion internship India",
    "ecommerce internship India",
    "marketing live project",
    "finance live project",
    "HR live project",
    "sales live project",
    "business development live project",
    "fashion ecommerce careers",
  ],

  alternates: {
    canonical: "/careers",
  },

  openGraph: {
    title: "Careers & Live Projects | KRVE",
    description:
      "Explore live business projects, internships and future career opportunities with KRVE — The Fashion Studio.",
    url: "/careers",
    type: "website",
    siteName: "KRVE — The Fashion Studio",
  },

  twitter: {
    card: "summary_large_image",
    title: "Careers & Live Projects | KRVE",
    description:
      "Explore live business projects, internships and career opportunities with KRVE — The Fashion Studio.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/*
  ==========================================================
  KRVE LIVE PROJECT APPLICATION WINDOW
  ==========================================================

  OPEN:
  22 August 2026, 12:00 AM IST

  CLOSE:
  After 15 September 2026
  i.e. 16 September 2026, 12:00 AM IST

  IMPORTANT:
  This page is forced dynamic so the date status does not
  get permanently frozen during a Vercel build.
*/

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

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

export default function CareersPage() {
  const liveProjectStatus =
    getLiveProjectStatus();

  const liveProjectIsOpen =
    liveProjectStatus ===
    "open";

  const liveProjectBadge =
    liveProjectStatus ===
    "upcoming"
      ? "Opens 22 Aug"
      : liveProjectStatus ===
          "open"
        ? "Open"
        : "Closed";

  const liveProjectBadgeClass =
    liveProjectStatus ===
    "open"
      ? styles.badgeOpen
      : liveProjectStatus ===
          "upcoming"
        ? styles.badgeSoon
        : styles.badgeFuture;

  const opportunities = [
    {
      id: "live-projects",

      icon: "◇",

      title:
        "Live Business Projects",

      badge:
        liveProjectBadge,

      badgeClass:
        liveProjectBadgeClass,

      description:
        "Work on real KRVE business challenges across marketing, sales, finance, HR, operations, product research, technology and customer experience.",

      primary: true,

      duration:
        "4–6 Weeks",

      outcome:
        "Verified Certificate",
    },

    {
      id: "internships",

      icon: "▣",

      title:
        "Internships",

      badge:
        "Coming Soon",

      badgeClass:
        styles.badgeSoon,

      description:
        "Structured internship opportunities for students and early-career professionals who want practical exposure to fashion and e-commerce operations.",

      primary: false,
    },

    {
      id: "careers",

      icon: "◎",

      title:
        "Full-Time Careers",

      badge:
        "Future",

      badgeClass:
        styles.badgeFuture,

      description:
        "Future opportunities to join KRVE's core team across business, fashion, technology, customer experience and enterprise operations.",

      primary: false,
    },
  ];

  const features = [
    {
      number: "01",

      title:
        "Real Business Projects",

      text:
        "Work on practical KRVE challenges instead of classroom-only assignments.",
    },

    {
      number: "02",

      title:
        "Structured Evaluation",

      text:
        "Performance is assessed through tasks, initiative, teamwork and business impact.",
    },

    {
      number: "03",

      title:
        "Cross-Functional Exposure",

      text:
        "Understand how marketing, finance, operations, sales and technology connect.",
    },

    {
      number: "04",

      title:
        "Growth Opportunities",

      text:
        "Strong performers may be considered for internships or future KRVE opportunities.",
    },
  ];

  return (
    <main
      className={
        styles.page
      }
    >
      {/* =========================
          HERO
      ========================== */}

      <section
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.eyebrow
            }
          >
            <span>✦</span>

            Careers at KRVE
          </div>

          <h1
            className={
              styles.heroTitle
            }
          >
            Build, Learn &
            Grow

            <span
              className={
                styles.gold
              }
            >
              With KRVE
            </span>
          </h1>

          <p
            className={
              styles.heroText
            }
          >
            Explore live
            business projects,
            internships and
            future career
            opportunities
            across fashion,
            e-commerce,
            technology,
            marketing,
            finance and
            business
            operations.
          </p>
        </div>
      </section>

      {/* =========================
          OPPORTUNITIES
      ========================== */}

      <section
        className={
          styles.section
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.sectionHeader
            }
          >
            <p
              className={
                styles.sectionTag
              }
            >
              Opportunities
            </p>

            <h2
              className={
                styles.sectionTitle
              }
            >
              Choose Your Path
              at KRVE
            </h2>

            <p
              className={
                styles.sectionText
              }
            >
              Start with an
              opportunity that
              matches your
              current
              experience,
              skills and career
              goals.
            </p>
          </div>

          <div
            className={
              styles.cards
            }
          >
            {opportunities.map(
              (
                opportunity,
              ) => (
                <article
                  key={
                    opportunity.id
                  }
                  className={`${styles.card} ${
                    opportunity.primary
                      ? styles.primaryCard
                      : ""
                  }`}
                >
                  <div
                    className={
                      styles.iconBox
                    }
                  >
                    <span>
                      {
                        opportunity.icon
                      }
                    </span>
                  </div>

                  <div
                    className={
                      styles.badgeRow
                    }
                  >
                    <h3
                      className={
                        styles.cardTitle
                      }
                    >
                      {
                        opportunity.title
                      }
                    </h3>

                    <span
                      className={
                        opportunity.badgeClass
                      }
                    >
                      {
                        opportunity.badge
                      }
                    </span>
                  </div>

                  <p
                    className={
                      styles.cardText
                    }
                  >
                    {
                      opportunity.description
                    }
                  </p>

                  {opportunity.primary ? (
                    <>
                      <div
                        className={
                          styles.metrics
                        }
                      >
                        <div
                          className={
                            styles.metric
                          }
                        >
                          <span
                            className={
                              styles.metricLabel
                            }
                          >
                            Duration
                          </span>

                          <span
                            className={
                              styles.metricValue
                            }
                          >
                            {
                              opportunity.duration
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.metric
                          }
                        >
                          <span
                            className={
                              styles.metricLabel
                            }
                          >
                            Outcome
                          </span>

                          <span
                            className={
                              styles.metricValue
                            }
                          >
                            {
                              opportunity.outcome
                            }
                          </span>
                        </div>
                      </div>

                      {/* APPLICATION WINDOW */}

                      <div
                        style={{
                          marginTop:
                            "16px",

                          padding:
                            "12px 14px",

                          border:
                            "1px solid rgba(217, 168, 37, 0.25)",

                          background:
                            "rgba(217, 168, 37, 0.05)",
                        }}
                      >
                        <span
                          style={{
                            display:
                              "block",

                            marginBottom:
                              "4px",

                            color:
                              "#8f7442",

                            fontSize:
                              "9px",

                            fontWeight:
                              800,

                            letterSpacing:
                              "0.14em",

                            textTransform:
                              "uppercase",
                          }}
                        >
                          Application
                          Window
                        </span>

                        <strong
                          style={{
                            color:
                              "#ffffff",

                            fontSize:
                              "13px",
                          }}
                        >
                          22 Aug
                          2026 – 15
                          Sept 2026
                        </strong>
                      </div>
                    </>
                  ) : null}

                  <div
                    className={
                      styles.cardBottom
                    }
                  >
                    {opportunity.primary ? (
                      liveProjectIsOpen ? (
                        <Link
                          href="/careers/live-projects"
                          className={
                            styles.primaryButton
                          }
                        >
                          Explore Live
                          Projects

                          <span>
                            →
                          </span>
                        </Link>
                      ) : liveProjectStatus ===
                        "upcoming" ? (
                        <button
                          type="button"
                          disabled
                          className={
                            styles.disabledButton
                          }
                        >
                          Opens 22 Aug
                          2026
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className={
                            styles.disabledButton
                          }
                        >
                          Applications
                          Closed
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        disabled
                        className={
                          styles.disabledButton
                        }
                      >
                        Applications
                        Not Open
                      </button>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =========================
          WHY KRVE
      ========================== */}

      <section
        className={
          styles.whySection
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.whyGrid
            }
          >
            <div>
              <p
                className={
                  styles.sectionTag
                }
              >
                Why KRVE
              </p>

              <h2
                className={
                  styles.sectionTitle
                }
              >
                Experience a
                Real Business
                Environment
              </h2>

              <p
                className={
                  styles.sectionText
                }
              >
                KRVE
                opportunities
                are designed to
                give candidates
                structured,
                practical
                exposure to how
                an early-stage
                fashion and
                e-commerce
                venture
                operates.
              </p>
            </div>

            <div
              className={
                styles.featureGrid
              }
            >
              {features.map(
                (
                  feature,
                ) => (
                  <article
                    key={
                      feature.number
                    }
                    className={
                      styles.feature
                    }
                  >
                    <span
                      className={
                        styles.featureNumber
                      }
                    >
                      {
                        feature.number
                      }
                    </span>

                    <h3
                      className={
                        styles.featureTitle
                      }
                    >
                      {
                        feature.title
                      }
                    </h3>

                    <p
                      className={
                        styles.featureText
                      }
                    >
                      {
                        feature.text
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}

      <section
        className={
          styles.cta
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.ctaBox
            }
          >
            <div>
              <h2
                className={
                  styles.ctaTitle
                }
              >
                {liveProjectStatus ===
                "open"
                  ? "Ready to Work on a Real KRVE Project?"
                  : liveProjectStatus ===
                      "upcoming"
                    ? "KRVE Live Project Applications Open 22 August"
                    : "KRVE Live Project Applications Are Closed"}
              </h2>

              <p
                className={
                  styles.ctaText
                }
              >
                {liveProjectStatus ===
                "open"
                  ? "Applications are currently open. Explore the KRVE Live Business Project Program and submit your application before 15 September 2026."
                  : liveProjectStatus ===
                      "upcoming"
                    ? "Applications for the KRVE Live Business Project Program will automatically open on 22 August 2026 and remain open until 15 September 2026."
                    : "The application window for this KRVE Live Business Project cohort closed on 15 September 2026."}
              </p>
            </div>

            {liveProjectIsOpen ? (
              <Link
                href="/careers/live-projects"
                className={
                  styles.ctaButton
                }
              >
                View Live
                Projects

                <span>→</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className={
                  styles.disabledButton
                }
              >
                {liveProjectStatus ===
                "upcoming"
                  ? "Opens 22 Aug 2026"
                  : "Applications Closed"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
