import Link from "next/link";

import styles from "./careers.module.css";

export default function CareersPage() {
  const opportunities = [
    {
      id: "live-projects",
      icon: "◇",
      title: "Live Business Projects",
      badge: "Open",
      badgeClass: styles.badgeOpen,
      description:
        "Work on real KRVE business challenges across marketing, sales, finance, HR, operations, product research, technology and customer experience.",
      primary: true,
      duration: "4–6 Weeks",
      outcome: "Verified Certificate",
    },
    {
      id: "internships",
      icon: "▣",
      title: "Internships",
      badge: "Coming Soon",
      badgeClass: styles.badgeSoon,
      description:
        "Structured internship opportunities for students and early-career professionals who want practical exposure to fashion and e-commerce operations.",
      primary: false,
    },
    {
      id: "careers",
      icon: "◎",
      title: "Full-Time Careers",
      badge: "Future",
      badgeClass: styles.badgeFuture,
      description:
        "Future opportunities to join KRVE's core team across business, fashion, technology, customer experience and enterprise operations.",
      primary: false,
    },
  ];

  const features = [
    {
      number: "01",
      title: "Real Business Projects",
      text: "Work on practical KRVE challenges instead of classroom-only assignments.",
    },
    {
      number: "02",
      title: "Structured Evaluation",
      text: "Performance is assessed through tasks, initiative, teamwork and business impact.",
    },
    {
      number: "03",
      title: "Cross-Functional Exposure",
      text: "Understand how marketing, finance, operations, sales and technology connect.",
    },
    {
      number: "04",
      title: "Growth Opportunities",
      text: "Strong performers may be considered for internships or future KRVE opportunities.",
    },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span>✦</span>
            Careers at KRVE
          </div>

          <h1 className={styles.heroTitle}>
            Build, Learn & Grow
            <span className={styles.gold}>
              With KRVE
            </span>
          </h1>

          <p className={styles.heroText}>
            Explore live business projects, internships and future career
            opportunities across fashion, e-commerce, technology, marketing,
            finance and business operations.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>
              Opportunities
            </p>

            <h2 className={styles.sectionTitle}>
              Choose Your Path at KRVE
            </h2>

            <p className={styles.sectionText}>
              Start with an opportunity that matches your current experience,
              skills and career goals.
            </p>
          </div>

          <div className={styles.cards}>
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className={`${styles.card} ${
                  opportunity.primary
                    ? styles.primaryCard
                    : ""
                }`}
              >
                <div className={styles.iconBox}>
                  <span>{opportunity.icon}</span>
                </div>

                <div className={styles.badgeRow}>
                  <h3 className={styles.cardTitle}>
                    {opportunity.title}
                  </h3>

                  <span className={opportunity.badgeClass}>
                    {opportunity.badge}
                  </span>
                </div>

                <p className={styles.cardText}>
                  {opportunity.description}
                </p>

                {opportunity.primary ? (
                  <div className={styles.metrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>
                        Duration
                      </span>

                      <span className={styles.metricValue}>
                        {opportunity.duration}
                      </span>
                    </div>

                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>
                        Outcome
                      </span>

                      <span className={styles.metricValue}>
                        {opportunity.outcome}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className={styles.cardBottom}>
                  {opportunity.primary ? (
                    <Link
                      href="/careers/live-projects"
                      className={styles.primaryButton}
                    >
                      Explore Live Projects
                      <span>→</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className={styles.disabledButton}
                    >
                      Applications Not Open
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div>
              <p className={styles.sectionTag}>
                Why KRVE
              </p>

              <h2 className={styles.sectionTitle}>
                Experience a Real Business Environment
              </h2>

              <p className={styles.sectionText}>
                KRVE opportunities are designed to give candidates structured,
                practical exposure to how an early-stage fashion and e-commerce
                venture operates.
              </p>
            </div>

            <div className={styles.featureGrid}>
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className={styles.feature}
                >
                  <span className={styles.featureNumber}>
                    {feature.number}
                  </span>

                  <h3 className={styles.featureTitle}>
                    {feature.title}
                  </h3>

                  <p className={styles.featureText}>
                    {feature.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <div>
              <h2 className={styles.ctaTitle}>
                Ready to Work on a Real KRVE Project?
              </h2>

              <p className={styles.ctaText}>
                Explore the KRVE Live Business Project Program and choose a
                functional area where you can contribute, learn and build
                practical experience.
              </p>
            </div>

            <Link
              href="/careers/live-projects"
              className={styles.ctaButton}
            >
              View Live Projects
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
