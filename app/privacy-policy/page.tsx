import Link from "next/link";
import styles from "./privacy-policy.module.css";

const sections = [
  {
    id: "information",
    number: "01",
    title: "Information We Collect",
    content: [
      "We may collect information that you provide directly when using KRVE services, including your name, email address, mobile number, delivery address, billing details and account information.",
      "When you place an order, we may process information relating to selected products, sizes, colours, quantities, delivery preferences, coupon usage, order history and payment status.",
      "We may also collect technical information such as device type, browser type, session activity and interaction data necessary to operate, secure and improve the website.",
    ],
  },
  {
    id: "use",
    number: "02",
    title: "How We Use Your Information",
    content: [
      "We use customer information to process orders, provide delivery updates, manage accounts, respond to support requests, prevent fraud, improve website performance and provide relevant shopping experiences.",
      "Information may also be used for service notifications, customer communication, analytics, internal business operations and promotional communication where permitted.",
    ],
  },
  {
    id: "payments",
    number: "03",
    title: "Payments",
    content: [
      "Online payments may be processed through authorised third-party payment service providers. KRVE does not intend to directly store complete card credentials, UPI PINs or other sensitive authentication information used to complete a payment.",
      "Payment service providers may process information according to their own terms, privacy policies and regulatory obligations.",
    ],
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Digital Technologies",
    content: [
      "KRVE may use cookies, local storage, session storage and similar technologies to maintain shopping carts, remember preferences, support account functionality, measure performance and improve the customer experience.",
      "Some website functionality may be affected when required browser storage technologies are disabled.",
    ],
  },
  {
    id: "sharing",
    number: "05",
    title: "Sharing of Information",
    content: [
      "Information may be shared with service providers where reasonably necessary for payment processing, fulfilment, shipping, website hosting, authentication, analytics, customer support or security.",
      "Information may also be disclosed when required by applicable law or when reasonably necessary to protect KRVE, its customers or others from fraud, misuse or security threats.",
    ],
  },
  {
    id: "security",
    number: "06",
    title: "Data Security",
    content: [
      "KRVE aims to use reasonable technical and organisational safeguards to protect customer information against unauthorised access, loss, alteration or misuse.",
      "No internet-based service can guarantee absolute security, and customers should also take appropriate steps to protect their devices and account credentials.",
    ],
  },
  {
    id: "retention",
    number: "07",
    title: "Data Retention",
    content: [
      "Information may be retained for as long as reasonably required to provide services, maintain business and transaction records, resolve disputes, prevent fraud and comply with applicable legal, accounting or regulatory obligations.",
    ],
  },
  {
    id: "rights",
    number: "08",
    title: "Your Choices & Rights",
    content: [
      "Subject to applicable law, customers may contact KRVE regarding access to, correction of or deletion of certain personal information held about them.",
      "Customers may also choose to stop receiving promotional communications using available unsubscribe options or by contacting customer support.",
    ],
  },
  {
    id: "children",
    number: "09",
    title: "Children's Privacy",
    content: [
      "KRVE services are not intended to knowingly collect personal information from children in circumstances where parental or guardian consent is legally required.",
    ],
  },
  {
    id: "updates",
    number: "10",
    title: "Changes to This Policy",
    content: [
      "This Privacy Policy may be updated periodically to reflect changes in KRVE services, technologies, business practices or applicable requirements. The latest update date will be displayed on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            <span>←</span>
            BACK TO KRVE
          </Link>

          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              LEGAL & PRIVACY
            </div>

            <h1 className={styles.title}>
              Privacy
              <span> Policy.</span>
            </h1>

            <p className={styles.intro}>
              How KRVE – The Fashion Studio collects, uses and protects
              information while delivering a secure and personalised
              shopping experience.
            </p>

            <div className={styles.heroMeta}>
              <div>
                <span>LAST UPDATED</span>
                <strong>15 August 2026</strong>
              </div>

              <div>
                <span>POLICY TYPE</span>
                <strong>Customer Privacy</strong>
              </div>

              <div>
                <span>BRAND</span>
                <strong>KRVE</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className={styles.contentArea}>
        <div className={`${styles.container} ${styles.contentGrid}`}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarTop}>
              <span>POLICY INDEX</span>
              <strong>10 Sections</strong>
            </div>

            <nav className={styles.navigation}>
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  <span>{section.number}</span>
                  <p>{section.title}</p>
                </a>
              ))}

              <a href="#contact">
                <span>11</span>
                <p>Contact Us</p>
              </a>
            </nav>
          </aside>

          {/* POLICY */}
          <div className={styles.policyContent}>
            <div className={styles.notice}>
              <div className={styles.noticeIcon}>K</div>

              <div>
                <span>OUR PRIVACY COMMITMENT</span>

                <p>
                  We believe customer information should be handled
                  responsibly, securely and only for legitimate business
                  purposes connected with the KRVE experience.
                </p>
              </div>
            </div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={styles.policySection}
              >
                <div className={styles.sectionHeader}>
                  <span>{section.number}</span>

                  <div>
                    <p>PRIVACY POLICY</p>
                    <h2>{section.title}</h2>
                  </div>
                </div>

                <div className={styles.sectionText}>
                  {section.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* CONTACT */}
            <section id="contact" className={styles.contactCard}>
              <div>
                <p className={styles.contactLabel}>PRIVACY SUPPORT</p>

                <h2>
                  Have a question about
                  <span> your information?</span>
                </h2>

                <p className={styles.contactText}>
                  For privacy-related questions, requests or concerns,
                  contact the KRVE support team.
                </p>
              </div>

              <a
                href="mailto:support@krvefashionstudio.in"
                className={styles.contactButton}
              >
                CONTACT KRVE
                <span>→</span>
              </a>
            </section>
          </div>
        </div>
      </section>

      {/* LEGAL NAVIGATION */}
      <section className={styles.legalLinks}>
        <div className={styles.container}>
          <div className={styles.legalLinksInner}>
            <div>
              <span>KRVE LEGAL</span>
              <p>Explore related policies and customer information.</p>
            </div>

            <div className={styles.links}>
              <Link href="/terms-and-conditions">
                TERMS & CONDITIONS
              </Link>

              <Link href="/returns-refunds">
                RETURNS & REFUNDS
              </Link>

              <Link href="/shipping-policy">
                SHIPPING POLICY
              </Link>

              <Link href="/contact">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
