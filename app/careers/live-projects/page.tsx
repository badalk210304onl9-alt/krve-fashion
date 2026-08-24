import type { Metadata } from "next";
import Link from "next/link";

import styles from "./live-projects.module.css";

export const metadata: Metadata = {
  title: "KRVE Live Business Project Program | Careers at KRVE",
  description:
    "Apply for the KRVE Live Business Project Program and gain practical experience in marketing, sales, finance, HR, operations, e-commerce, technology and product through real business projects.",
  keywords: [
    "KRVE Live Project",
    "KRVE Live Business Project",
    "KRVE The Fashion Studio Live Project",
    "KRVE Careers",
    "Live Business Project",
    "MBA Live Project",
    "Student Live Project",
    "Business Live Project India",
    "Marketing Live Project",
    "Sales Live Project",
    "Finance Live Project",
    "HR Live Project",
    "E-Commerce Live Project",
    "Technology Live Project",
    "Fashion Live Project",
    "Internship Project India",
    "KRVE Internship",
  ],
  authors: [
    {
      name: "KRVE — The Fashion Studio",
    },
  ],
  creator: "KRVE — The Fashion Studio",
  publisher: "KRVE — The Fashion Studio",

  alternates: {
    canonical:
      "https://krve-fashion.vercel.app/careers/live-projects",
  },

  openGraph: {
    title: "KRVE Live Business Project Program",
    description:
      "Work on real business challenges at KRVE across marketing, sales, finance, HR, operations, e-commerce, technology and product.",
    url: "https://krve-fashion.vercel.app/careers/live-projects",
    siteName: "KRVE — The Fashion Studio",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "KRVE Live Business Project Program",
    description:
      "Gain practical business experience through real projects at KRVE — The Fashion Studio.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const departments = [
  {
    number: "01",
    title: "Marketing & Brand",
    description:
      "Work on brand strategy, digital marketing, social media, campaigns, customer acquisition and market research.",
    skills:
      "Marketing • Branding • Research • Content",
  },
  {
    number: "02",
    title: "Sales & Business Development",
    description:
      "Work on customer acquisition, sales strategy, partnerships, lead generation and revenue-focused business activities.",
    skills:
      "Sales • Business Development • CRM • Growth",
  },
  {
    number: "03",
    title: "Finance & Business Analysis",
    description:
      "Support financial planning, pricing analysis, unit economics, business reporting and performance analysis.",
    skills:
      "Finance • Excel • Analysis • Reporting",
  },
  {
    number: "04",
    title: "Human Resources",
    description:
      "Work on recruitment, talent management, performance systems, documentation and people operations.",
    skills:
      "HR • Recruitment • People Operations",
  },
  {
    number: "05",
    title: "Operations & E-Commerce",
    description:
      "Work on order operations, inventory processes, vendor coordination, customer experience and e-commerce workflows.",
    skills:
      "Operations • E-Commerce • Process Management",
  },
  {
    number: "06",
    title: "Technology & Product",
    description:
      "Contribute to KRVE's website, enterprise systems, product workflows, AI-enabled features and digital experiences.",
    skills:
      "Technology • Product • UI/UX • AI",
  },
];

const process = [
  {
    number: "01",
    title: "Apply",
    text:
      "Submit your application and select your preferred functional area.",
  },
  {
    number: "02",
    title: "Screening",
    text:
      "Applications are reviewed based on profile, interest and relevant skills.",
  },
  {
    number: "03",
    title: "Selection",
    text:
      "Selected applicants receive project allocation and onboarding details.",
  },
  {
    number: "04",
    title: "Live Project",
    text:
      "Complete weekly tasks and real business deliverables over the project period.",
  },
  {
    number: "05",
    title: "Evaluation",
    text:
      "Performance is evaluated on execution, initiative, quality and business impact.",
  },
  {
    number: "06",
    title: "Certificate",
    text:
      "Successful participants receive a verifiable KRVE project completion certificate.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  name: "KRVE Live Business Project Program",
  description:
    "A structured live business project program by KRVE — The Fashion Studio providing practical experience across marketing, sales, finance, human resources, operations, e-commerce, technology and product.",
  url: "https://krve-fashion.vercel.app/careers/live-projects",
  provider: {
    "@type": "Organization",
    name: "KRVE — The Fashion Studio",
    url: "https://krve-fashion.vercel.app",
  },
  timeToComplete: "P4W",
  occupationalCategory: [
    "Marketing",
    "Sales",
    "Finance",
    "Human Resources",
    "Operations",
    "E-Commerce",
    "Technology",
    "Product",
  ],
  educationalProgramMode: "Project Based",
};

export default function LiveProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <Link
              href="/careers"
              className={styles.backLink}
            >
              ← Back to Careers
            </Link>

            <div className={styles.heroGrid}>
              <div>
                <div className={styles.eyebrow}>
                  <span className={styles.liveDot} />

                  Applications Open
                </div>

                <h1 className={styles.heroTitle}>
                  KRVE Live Business
                  <span className={styles.gold}>
                    Project Program
                  </span>
                </h1>

                <p className={styles.heroText}>
                  Work on real business challenges inside KRVE and gain
                  practical experience across fashion, e-commerce,
                  marketing, sales, finance, HR, operations and
                  technology.
                </p>

                <div className={styles.heroActions}>
                  <a
                    href="#projects"
                    className={styles.primaryButton}
                  >
                    Explore Projects
                    <span>→</span>
                  </a>

                  <a
                    href="/KRVE_Live_Business_Project_Program_Detailed.pdf"
                    download="KRVE_Live_Business_Project_Program_Detailed.pdf"
                    className={styles.secondaryButton}
                  >
                    Program Details
                    <span>↓</span>
                  </a>
                </div>
              </div>

              <div className={styles.programCard}>
                <p className={styles.programLabel}>
                  Program Overview
                </p>

                <div className={styles.programRows}>
                  <ProgramRow
                    label="Program Type"
                    value="Live Business Project"
                  />

                  <ProgramRow
                    label="Duration"
                    value="4–6 Weeks"
                  />

                  <ProgramRow
                    label="Mode"
                    value="Project Based"
                  />

                  <ProgramRow
                    label="Functions"
                    value="6 Business Areas"
                  />

                  <ProgramRow
                    label="Certificate"
                    value="Verified"
                  />

                  <ProgramRow
                    label="Status"
                    value="Applications Open"
                    highlight
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="program"
          className={styles.introSection}
        >
          <div className={styles.container}>
            <div className={styles.introGrid}>
              <div>
                <p className={styles.sectionTag}>
                  About The Program
                </p>

                <h2 className={styles.sectionTitle}>
                  Learn by Working on
                  <span className={styles.goldInline}>
                    {" "}
                    Real Business
                  </span>
                </h2>
              </div>

              <div>
                <p className={styles.largeText}>
                  The KRVE Live Business Project Program gives students
                  an opportunity to contribute to an early-stage fashion
                  and e-commerce venture through structured,
                  outcome-driven projects.
                </p>

                <p className={styles.bodyText}>
                  Participants work on defined business objectives,
                  receive weekly assignments and are evaluated on the
                  quality of their work, initiative, consistency,
                  collaboration and practical business contribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="projects"
          className={styles.projectsSection}
        >
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionTag}>
                Project Functions
              </p>

              <h2 className={styles.sectionTitle}>
                Choose Your Project Area
              </h2>

              <p className={styles.sectionDescription}>
                Select the business function that best matches your
                interests, skills and career goals.
              </p>
            </div>

            <div className={styles.projectGrid}>
              {departments.map((department) => (
                <article
                  key={department.number}
                  className={styles.projectCard}
                >
                  <div className={styles.projectTop}>
                    <span className={styles.projectNumber}>
                      {department.number}
                    </span>

                    <span className={styles.openBadge}>
                      Open
                    </span>
                  </div>

                  <h3 className={styles.projectTitle}>
                    {department.title}
                  </h3>

                  <p className={styles.projectDescription}>
                    {department.description}
                  </p>

                  <div className={styles.skills}>
                    {department.skills}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <div className={styles.benefitsGrid}>
              <div>
                <p className={styles.sectionTag}>
                  Program Experience
                </p>

                <h2 className={styles.sectionTitle}>
                  More Than Just
                  <span className={styles.goldInline}>
                    {" "}
                    a Certificate
                  </span>
                </h2>

                <p className={styles.sectionDescription}>
                  The program is designed around practical exposure,
                  measurable work and professional development.
                </p>
              </div>

              <div className={styles.benefitCards}>
                <Benefit
                  number="01"
                  title="Real Business Exposure"
                  text="Work on actual KRVE business requirements and practical challenges."
                />

                <Benefit
                  number="02"
                  title="Weekly Deliverables"
                  text="Complete structured assignments with measurable project outcomes."
                />

                <Benefit
                  number="03"
                  title="Performance Evaluation"
                  text="Receive evaluation based on execution, quality, initiative and contribution."
                />

                <Benefit
                  number="04"
                  title="Verified Certificate"
                  text="Successful completion can lead to a KRVE certificate with a unique Certificate ID."
                />

                <Benefit
                  number="05"
                  title="Professional Portfolio"
                  text="Build practical project experience that can strengthen your professional profile."
                />

                <Benefit
                  number="06"
                  title="Future Opportunities"
                  text="Strong performers may be considered for internships or future KRVE team opportunities."
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionTag}>
                Selection Process
              </p>

              <h2 className={styles.sectionTitle}>
                From Application to Completion
              </h2>
            </div>

            <div className={styles.processGrid}>
              {process.map((item) => (
                <article
                  key={item.number}
                  className={styles.processCard}
                >
                  <span className={styles.processNumber}>
                    {item.number}
                  </span>

                  <h3 className={styles.processTitle}>
                    {item.title}
                  </h3>

                  <p className={styles.processText}>
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaBox}>
              <div>
                <div className={styles.eyebrow}>
                  <span className={styles.liveDot} />

                  Applications Open
                </div>

                <h2 className={styles.ctaTitle}>
                  Ready to Start Your
                  <span className={styles.goldInline}>
                    {" "}
                    KRVE Live Project?
                  </span>
                </h2>

                <p className={styles.ctaText}>
                  Select your preferred business function and submit
                  your application for the KRVE Live Business Project
                  Program.
                </p>
              </div>

              <Link
                href="/careers/live-projects/apply"
                className={styles.applyButton}
              >
                Apply Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ProgramRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={styles.programRow}>
      <span className={styles.programRowLabel}>
        {label}
      </span>

      <span
        className={
          highlight
            ? styles.programHighlight
            : styles.programRowValue
        }
      >
        {value}
      </span>
    </div>
  );
}

function Benefit({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className={styles.benefitCard}>
      <span className={styles.benefitNumber}>
        {number}
      </span>

      <h3 className={styles.benefitTitle}>
        {title}
      </h3>

      <p className={styles.benefitText}>
        {text}
      </p>
    </article>
  );
}
