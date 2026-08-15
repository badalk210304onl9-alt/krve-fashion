import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | KRVÉ – The Fashion Studio",
  description:
    "Terms and Conditions governing the use of KRVÉ – The Fashion Studio website, products, orders, payments, delivery, returns and digital services.",
};

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing, browsing, registering on, purchasing from, or otherwise
          using KRVÉ – The Fashion Studio and its website, you agree to these
          Terms & Conditions.
        </p>
        <p>
          If you do not agree with these terms, you should not use the website
          or place an order through our platform.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "About KRVÉ",
    content: (
      <>
        <p>
          KRVÉ – The Fashion Studio is a fashion and e-commerce venture offering
          apparel, accessories, fashion-related products and technology-enabled
          shopping experiences.
        </p>
        <p>
          References to “KRVÉ”, “we”, “our” or “us” in these Terms & Conditions
          refer to KRVÉ – The Fashion Studio.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Eligibility & Customer Accounts",
    content: (
      <>
        <p>
          Customers are responsible for providing accurate and complete
          information while creating an account, placing an order or contacting
          KRVÉ.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for activities carried out through your
          account.
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "Products & Product Information",
    content: (
      <>
        <p>
          We make reasonable efforts to display product descriptions, sizes,
          colours, photographs, pricing and other information as accurately as
          possible.
        </p>
        <p>
          Actual product colours may vary slightly depending on lighting,
          photography, screen settings, manufacturing batches and other
          factors.
        </p>
        <p>
          Product availability is subject to stock and may change without prior
          notice.
        </p>
      </>
    ),
  },
  {
    number: "05",
    title: "Pricing",
    content: (
      <>
        <p>
          Product prices displayed on the website are shown in Indian Rupees
          (INR) unless otherwise stated.
        </p>
        <p>
          KRVÉ reserves the right to revise prices, offers and discounts at any
          time. A price change will not normally affect an order that has
          already been successfully confirmed, except where correction is
          necessary because of an obvious technical or pricing error.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Coupons, Discounts & Promotional Offers",
    content: (
      <>
        <p>
          Promotional codes, coupons and special offers may be subject to
          eligibility requirements, minimum order values, product restrictions,
          validity periods and other campaign-specific conditions.
        </p>
        <p>
          Unless specifically stated otherwise, promotional benefits cannot be
          exchanged for cash.
        </p>
        <p>
          KRVÉ may reject or cancel the use of a coupon where misuse, fraud,
          manipulation or a technical error is reasonably suspected.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Orders",
    content: (
      <>
        <p>
          Submission of an order does not automatically guarantee acceptance.
          An order is considered confirmed after it has been successfully
          accepted by KRVÉ.
        </p>
        <p>
          We may cancel or refuse an order where a product becomes unavailable,
          incorrect information has been provided, payment cannot be verified,
          fraud is suspected or an obvious technical or pricing error has
          occurred.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Payments",
    content: (
      <>
        <p>
          Available payment methods may include UPI, cards, net banking,
          wallets, supported online payment methods and Cash on Delivery where
          available.
        </p>
        <p>
          Online payments may be processed through authorised third-party
          payment service providers. Their own terms, security requirements and
          policies may also apply to the payment transaction.
        </p>
        <p>
          KRVÉ does not intentionally store complete card numbers, CVV details
          or UPI PINs on its website.
        </p>
      </>
    ),
  },
  {
    number: "09",
    title: "Cash on Delivery",
    content: (
      <>
        <p>
          Cash on Delivery may be available for eligible orders, products and
          delivery locations.
        </p>
        <p>
          KRVÉ may restrict or disable Cash on Delivery for particular orders,
          customers or locations where necessary for operational, fraud
          prevention or serviceability reasons.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Shipping & Delivery",
    content: (
      <>
        <p>
          Delivery estimates displayed on the website are approximate and may
          vary depending on destination, courier operations, product
          availability, weather, public holidays or circumstances beyond our
          reasonable control.
        </p>
        <p>
          Customers must provide a complete and accurate delivery address and
          contact information.
        </p>
        <p>
          Additional information regarding delivery is available in our
          Shipping Policy.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Returns, Exchanges & Refunds",
    content: (
      <>
        <p>
          Returns, exchanges and refunds are governed by the applicable KRVÉ
          Returns & Refunds Policy.
        </p>
        <p>
          Products may need to satisfy eligibility requirements regarding
          condition, tags, packaging, return period and product category before
          a return or refund can be approved.
        </p>
      </>
    ),
  },
  {
    number: "12",
    title: "Order Cancellation",
    content: (
      <>
        <p>
          Customers may request cancellation before an order reaches a stage at
          which cancellation is no longer operationally possible.
        </p>
        <p>
          KRVÉ may also cancel an order due to stock unavailability, payment
          failure, suspected fraudulent activity, incorrect pricing or other
          legitimate operational reasons.
        </p>
      </>
    ),
  },
  {
    number: "13",
    title: "Virtual Try-On & AI Features",
    content: (
      <>
        <p>
          KRVÉ may provide technology-enabled features including AI stylist
          recommendations, virtual try-on, digital fitting tools, size
          suggestions and related experiences.
        </p>
        <p>
          These features are intended to assist customers and may generate
          estimates or recommendations. They do not guarantee an exact physical
          fit, appearance, measurement or purchasing outcome.
        </p>
        <p>
          Customers should also review available product measurements and size
          information before purchasing.
        </p>
      </>
    ),
  },
  {
    number: "14",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The KRVÉ name, branding, logos, website design, graphics, product
          presentation, photographs, written content and other original
          materials displayed on the platform may be protected by applicable
          intellectual property laws.
        </p>
        <p>
          Such material must not be copied, reproduced, distributed, modified
          or commercially exploited without appropriate permission, except
          where permitted by law.
        </p>
      </>
    ),
  },
  {
    number: "15",
    title: "Acceptable Use",
    content: (
      <>
        <p>You must not use the KRVÉ website to:</p>
        <ul>
          <li>conduct fraudulent or unlawful activities;</li>
          <li>attempt unauthorised access to accounts or systems;</li>
          <li>interfere with website security or operation;</li>
          <li>introduce malicious software or harmful code;</li>
          <li>scrape or misuse data in violation of applicable law;</li>
          <li>impersonate another person or provide deliberately false information.</li>
        </ul>
      </>
    ),
  },
  {
    number: "16",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Certain features of the KRVÉ website may depend on third-party
          services such as payment processors, logistics providers, analytics
          platforms, authentication providers and technology infrastructure.
        </p>
        <p>
          The availability and operation of those independent services may be
          governed by their respective terms and policies.
        </p>
      </>
    ),
  },
  {
    number: "17",
    title: "Privacy",
    content: (
      <>
        <p>
          Personal information collected through the KRVÉ platform is handled
          in accordance with our Privacy Policy and applicable requirements.
        </p>
        <p>
          Please review our Privacy Policy for further information regarding
          collection, use and protection of personal information.
        </p>
      </>
    ),
  },
  {
    number: "18",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, KRVÉ will not be
          responsible for indirect or consequential losses arising solely from
          circumstances outside its reasonable control.
        </p>
        <p>
          Nothing in these Terms & Conditions is intended to exclude or limit
          rights or liabilities that cannot legally be excluded or limited.
        </p>
      </>
    ),
  },
  {
    number: "19",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          KRVÉ may update these Terms & Conditions when necessary to reflect
          changes in our services, policies, technology, business operations or
          applicable requirements.
        </p>
        <p>
          The latest version published on this page will apply from its stated
          effective or updated date.
        </p>
      </>
    ),
  },
  {
    number: "20",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms & Conditions are governed by the applicable laws of
          India. Any dispute will be handled subject to applicable law and the
          jurisdiction of competent courts.
        </p>
      </>
    ),
  },
  {
    number: "21",
    title: "Contact Us",
    content: (
      <>
        <p>
          Questions regarding these Terms & Conditions can be sent to:
        </p>

        <div className="contactBox">
          <strong>KRVÉ – The Fashion Studio</strong>
          <span>India</span>
          <a href="mailto:support@krvefashionstudio.in">
            support@krvefashionstudio.in
          </a>
        </div>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="termsPage">
      <section className="hero">
        <div className="heroGlow" />

        <div className="container heroInner">
          <Link href="/" className="backLink">
            ← BACK TO KRVÉ
          </Link>

          <div className="eyebrow">
            <span />
            LEGAL
          </div>

          <h1>
            Terms <em>&</em>
            <br />
            Conditions
          </h1>

          <p className="intro">
            These Terms & Conditions govern your access to and use of KRVÉ –
            The Fashion Studio, including our website, shopping services,
            orders, payments and technology-enabled fashion experiences.
          </p>

          <div className="meta">
            <span>LAST UPDATED</span>
            <strong>16 AUGUST 2026</strong>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container contentGrid">
          <aside className="side">
            <div className="sideSticky">
              <span className="sideLabel">LEGAL DOCUMENT</span>
              <h2>Terms of Service</h2>
              <p>
                Please read these terms carefully before using KRVÉ services or
                completing a purchase.
              </p>

              <div className="sideLinks">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/shipping-policy">Shipping Policy</Link>
                <Link href="/returns-refunds">Returns & Refunds</Link>
              </div>
            </div>
          </aside>

          <article className="article">
            {sections.map((section) => (
              <section className="legalSection" key={section.number}>
                <div className="number">{section.number}</div>

                <div className="sectionBody">
                  <h2>{section.title}</h2>
                  <div className="sectionText">{section.content}</div>
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <section className="legalFooter">
        <div className="container footerInner">
          <div>
            <span className="footerBrand">KRVÉ</span>
            <p>THE FASHION STUDIO</p>
          </div>

          <div className="footerLinks">
            <Link href="/">Home</Link>
            <Link href="/about">About KRVÉ</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>

          <p className="copyright">
            © 2026 KRVÉ – The Fashion Studio. All rights reserved.
          </p>
        </div>
      </section>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .termsPage {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(212, 160, 23, 0.07),
              transparent 28%
            ),
            #050505;
          color: #f4efe5;
        }

        .container {
          width: min(1380px, calc(100% - 80px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(212, 160, 23, 0.28);
        }

        .heroGlow {
          position: absolute;
          width: 650px;
          height: 650px;
          border-radius: 50%;
          right: -250px;
          top: -300px;
          background: rgba(215, 162, 25, 0.08);
          filter: blur(80px);
          pointer-events: none;
        }

        .heroInner {
          position: relative;
          padding: 70px 0 90px;
        }

        .backLink {
          display: inline-block;
          color: #aaa397;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-decoration: none;
          margin-bottom: 58px;
          transition: 0.2s ease;
        }

        .backLink:hover {
          color: #e1ae27;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 13px;
          color: #e0aa1c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.22em;
          margin-bottom: 25px;
        }

        .eyebrow span {
          display: block;
          width: 42px;
          height: 1px;
          background: #e0aa1c;
        }

        h1 {
          margin: 0;
          max-width: 900px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(58px, 7.5vw, 112px);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.045em;
        }

        h1 em {
          color: #e2ad24;
          font-weight: 400;
        }

        .intro {
          max-width: 780px;
          margin: 45px 0 0;
          color: #aaa69f;
          font-size: 18px;
          line-height: 1.85;
        }

        .meta {
          margin-top: 48px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .meta span {
          color: #77736d;
          font-size: 10px;
          letter-spacing: 0.18em;
          font-weight: 800;
        }

        .meta strong {
          color: #e0aa1c;
          font-size: 11px;
          letter-spacing: 0.13em;
        }

        .content {
          padding: 90px 0 120px;
        }

        .contentGrid {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 100px;
        }

        .sideSticky {
          position: sticky;
          top: 120px;
          border-top: 1px solid #d9a71d;
          padding-top: 27px;
        }

        .sideLabel {
          color: #dba91e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .side h2 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 32px;
          font-weight: 400;
          margin: 14px 0 17px;
        }

        .side p {
          color: #89857d;
          font-size: 14px;
          line-height: 1.8;
        }

        .sideLinks {
          display: flex;
          flex-direction: column;
          margin-top: 32px;
          border-top: 1px solid #252525;
        }

        .sideLinks a {
          padding: 15px 0;
          color: #aaa59b;
          text-decoration: none;
          border-bottom: 1px solid #252525;
          font-size: 13px;
        }

        .sideLinks a:hover {
          color: #e2ad24;
        }

        .article {
          border-top: 1px solid #272727;
        }

        .legalSection {
          display: grid;
          grid-template-columns: 65px minmax(0, 1fr);
          gap: 25px;
          padding: 46px 0;
          border-bottom: 1px solid #272727;
        }

        .number {
          color: #dba91e;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          padding-top: 8px;
        }

        .sectionBody h2 {
          margin: 0 0 20px;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: clamp(26px, 3vw, 38px);
          color: #f1eadf;
        }

        .sectionText {
          max-width: 850px;
          color: #a6a198;
          font-size: 15px;
          line-height: 1.9;
        }

        .sectionText p {
          margin: 0 0 16px;
        }

        .sectionText p:last-child {
          margin-bottom: 0;
        }

        .sectionText ul {
          margin: 15px 0 0;
          padding-left: 21px;
        }

        .sectionText li {
          margin: 9px 0;
        }

        .contactBox {
          margin-top: 25px;
          padding: 26px 30px;
          border: 1px solid rgba(219, 169, 30, 0.3);
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(219, 169, 30, 0.025);
        }

        .contactBox strong {
          color: #f2ecdf;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 20px;
          font-weight: 400;
        }

        .contactBox span {
          color: #77736c;
        }

        .contactBox a {
          color: #dfa91d;
          text-decoration: none;
        }

        .legalFooter {
          border-top: 1px solid rgba(212, 160, 23, 0.3);
          padding: 60px 0 40px;
          background: #030303;
        }

        .footerInner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
        }

        .footerBrand {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 38px;
          letter-spacing: 0.08em;
        }

        .footerInner > div > p {
          color: #d9a71d;
          font-size: 10px;
          letter-spacing: 0.25em;
          font-weight: 800;
          margin-top: 8px;
        }

        .footerLinks {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .footerLinks a {
          color: #99948b;
          font-size: 13px;
          text-decoration: none;
        }

        .footerLinks a:hover {
          color: #dba91e;
        }

        .copyright {
          grid-column: 1 / -1;
          border-top: 1px solid #1e1e1e;
          margin: 10px 0 0;
          padding-top: 30px;
          color: #68655f;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .container {
            width: min(100% - 36px, 1380px);
          }

          .heroInner {
            padding: 45px 0 65px;
          }

          .backLink {
            margin-bottom: 45px;
          }

          .content {
            padding: 60px 0 80px;
          }

          .contentGrid {
            grid-template-columns: 1fr;
            gap: 55px;
          }

          .sideSticky {
            position: static;
          }

          .legalSection {
            grid-template-columns: 45px minmax(0, 1fr);
          }

          .footerInner {
            grid-template-columns: 1fr;
          }

          .footerLinks {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .container {
            width: calc(100% - 30px);
          }

          h1 {
            font-size: 54px;
          }

          .intro {
            font-size: 15px;
          }

          .legalSection {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 36px 0;
          }

          .number {
            padding: 0;
          }

          .sectionText {
            font-size: 14px;
          }

          .meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}
