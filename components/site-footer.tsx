import Link from "next/link";

import styles from "./site-footer.module.css";

const shopLinks = [
  {
    label: "Men",
    href: "/men",
  },
  {
    label: "Women",
    href: "/women",
  },
  {
    label: "Kids",
    href: "/kids",
  },
  {
    label: "Accessories",
    href: "/accessories",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
];

const customerCareLinks = [
  {
    label: "Contact Us",
    href: "/contact",
  },
  {
    label: "Track Order",
    href: "/track-order",
  },
  {
    label: "Returns & Refunds",
    href: "/returns-refunds",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    label: "Size Guide",
    href: "/size-guide",
  },
];

const companyLinks = [
  {
    label: "About KRVE",
    href: "/about",
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
];

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.logo}
            >
              <div className={styles.logoText}>
                KRVÉ
              </div>

              <div className={styles.logoSub}>
                The Fashion Studio
              </div>
            </Link>

            <p className={styles.description}>
              Contemporary fashion, elevated essentials and
              technology-led shopping experiences designed
              for a new generation.
            </p>

            <div className={styles.contact}>
              <a
                href="mailto:support@krvefashionstudio.in"
                className={styles.contactLink}
              >
                support@krvefashionstudio.in
              </a>

              <span className={styles.contactText}>
                India
              </span>
            </div>

            <div className={styles.social}>
              <a
                href="#"
                className={styles.socialLink}
              >
                Instagram
              </a>

              <a
                href="#"
                className={styles.socialLink}
              >
                Facebook
              </a>

              <a
                href="#"
                className={styles.socialLink}
              >
                LinkedIn
              </a>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={shopLinks}
          />

          <FooterColumn
            title="Customer Care"
            links={customerCareLinks}
          />

          <FooterColumn
            title="Company"
            links={companyLinks}
            highlightCareers
          />
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} KRVE – The Fashion Studio.
            All rights reserved.
          </p>

          <div className={styles.bottomLinks}>
            <span className={styles.bottomText}>
              Secure Shopping
            </span>

            <span className={styles.bottomText}>
              Made for India
            </span>

            <span
              className={`${styles.bottomText} ${styles.gold}`}
            >
              Move into style.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  highlightCareers = false,
}: {
  title: string;

  links: {
    label: string;
    href: string;
  }[];

  highlightCareers?: boolean;
}) {
  return (
    <div className={styles.column}>
      <h3 className={styles.heading}>
        {title}
      </h3>

      <ul className={styles.links}>
        {links.map(
          (
            link,
          ) => {
            const isCareer =
              highlightCareers &&
              link.label ===
                "Careers";

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.link} ${
                    isCareer
                      ? styles.careerLink
                      : ""
                  }`}
                >
                  {link.label}

                  {isCareer ? (
                    <span className={styles.careerBadge}>
                      Open
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          },
        )}
      </ul>
    </div>
  );
}
