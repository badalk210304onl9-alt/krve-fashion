import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | KRVE – The Fashion Studio",
  description:
    "Terms and Conditions governing access to and use of KRVE – The Fashion Studio website, products, services and digital experiences.",
};

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
  },
  {
    id: "eligibility",
    number: "02",
    title: "Eligibility & Account",
  },
  {
    id: "products",
    number: "03",
    title: "Products & Availability",
  },
  {
    id: "pricing",
    number: "04",
    title: "Pricing & Taxes",
  },
  {
    id: "orders",
    number: "05",
    title: "Orders & Acceptance",
  },
  {
    id: "payments",
    number: "06",
    title: "Payments",
  },
  {
    id: "cod",
    number: "07",
    title: "Cash on Delivery",
  },
  {
    id: "offers",
    number: "08",
    title: "Coupons & Promotions",
  },
  {
    id: "shipping",
    number: "09",
    title: "Shipping & Delivery",
  },
  {
    id: "cancellation",
    number: "10",
    title: "Cancellation",
  },
  {
    id: "returns",
    number: "11",
    title: "Returns & Refunds",
  },
  {
    id: "technology",
    number: "12",
    title: "AI & Virtual Try-On",
  },
  {
    id: "intellectual-property",
    number: "13",
    title: "Intellectual Property",
  },
  {
    id: "prohibited",
    number: "14",
    title: "Prohibited Use",
  },
  {
    id: "third-party",
    number: "15",
    title: "Third-Party Services",
  },
  {
    id: "liability",
    number: "16",
    title: "Limitation of Liability",
  },
  {
    id: "privacy",
    number: "17",
    title: "Privacy",
  },
  {
    id: "law",
    number: "18",
    title: "Governing Law",
  },
  {
    id: "changes",
    number: "19",
    title: "Changes to Terms",
  },
  {
    id: "contact",
    number: "20",
    title: "Contact Us",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="legalPage">
      {/* HERO */}
      <section className="hero">
        <div className="shell">
          <Link href="/" className="backLink">
            ← BACK TO KRVE
          </Link>

          <div className="heroGrid">
            <div>
              <p className="eyebrow">LEGAL • KRVE</p>

              <h1>
                Terms &
                <br />
                <span>Conditions.</span>
              </h1>

              <p className="heroDescription">
                These Terms & Conditions govern your access to and use of
                KRVE – The Fashion Studio, including our website, shopping
                services, orders, payments, promotional offers and
                technology-led fashion experiences.
              </p>
            </div>

            <div className="heroMeta">
              <div>
                <span>EFFECTIVE DATE</span>
                <strong>16 August 2026</strong>
              </div>

              <div>
                <span>APPLICABLE TO</span>
                <strong>KRVE Customers & Website Visitors</strong>
              </div>

              <div>
                <span>JURISDICTION</span>
                <strong>India</strong>
              </div>

              <div>
                <span>DOCUMENT</span>
                <strong>Terms & Conditions</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTICE */}
      <section className="noticeSection">
        <div className="shell">
          <div className="notice">
            <div className="noticeNumber">!</div>

            <div>
              <p className="eyebrow">PLEASE READ CAREFULLY</p>

              <h2>Using KRVE means agreeing to these Terms.</h2>

              <p>
                By accessing, browsing, creating an account, placing an order,
                making a payment, using our digital features or otherwise using
                KRVE services, you acknowledge that you have read, understood
                and agreed to these Terms & Conditions together with the
                applicable policies available on our website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="contentSection">
        <div className="shell contentGrid">
          {/* LEFT INDEX */}
          <aside className="indexCard">
            <p className="eyebrow">ON THIS PAGE</p>

            <nav>
              {sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{section.number}</span>
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* RIGHT CONTENT */}
          <article className="legalContent">
            <section id="acceptance" className="legalSection">
              <p className="sectionNumber">01</p>
              <h2>Acceptance of Terms</h2>

              <p>
                Welcome to KRVE – The Fashion Studio (“KRVE”, “we”, “us” or
                “our”). These Terms & Conditions constitute the terms governing
                your use of the KRVE website and the services made available
                through it.
              </p>

              <p>
                By using the website or placing an order, you agree to comply
                with these Terms and all applicable laws and regulations. If
                you do not agree with these Terms, you should discontinue use
                of the website and its services.
              </p>

              <p>
                Certain services may also be governed by additional policies,
                notices or conditions displayed at the time you use that
                service. Those provisions should be read together with these
                Terms.
              </p>
            </section>

            <section id="eligibility" className="legalSection">
              <p className="sectionNumber">02</p>
              <h2>Eligibility & Customer Accounts</h2>

              <p>
                You must be legally capable of entering into a binding
                transaction under applicable law to independently place orders
                through KRVE. Where required, minors should use the service
                only through or with the involvement of a parent or legal
                guardian.
              </p>

              <h3>Account information</h3>

              <p>
                When creating or using an account, you are responsible for
                providing information that is accurate, current and complete.
                You should update your information whenever it changes.
              </p>

              <p>
                You are responsible for maintaining the confidentiality of
                your login credentials and for activity conducted through your
                account, except where such activity results from circumstances
                attributable to KRVE.
              </p>

              <p>
                Please contact us promptly if you believe your account has been
                accessed without authorisation.
              </p>
            </section>

            <section id="products" className="legalSection">
              <p className="sectionNumber">03</p>
              <h2>Products, Images & Availability</h2>

              <p>
                KRVE aims to provide clear and accurate information about its
                products, including descriptions, prices, available sizes,
                colours, materials, photographs and stock status.
              </p>

              <p>
                Product colours and appearance may vary slightly depending on
                lighting, photography, screen settings, display calibration
                and the device used to view the website.
              </p>

              <p>
                Measurements and sizing information are provided to assist
                customers in making a selection. Actual fit may vary depending
                on body proportions, product construction, fabric and styling
                preference.
              </p>

              <p>
                Products are subject to availability. Adding an item to your
                cart or wishlist does not reserve the product or guarantee
                availability until the order has been successfully accepted.
              </p>
            </section>

            <section id="pricing" className="legalSection">
              <p className="sectionNumber">04</p>
              <h2>Pricing, Charges & Taxes</h2>

              <p>
                Product prices displayed on KRVE are shown in Indian Rupees
                unless expressly stated otherwise.
              </p>

              <p>
                The final amount payable may include applicable taxes, delivery
                charges, discounts, promotional benefits or other charges
                displayed during the purchase process.
              </p>

              <p>
                KRVE may revise product prices from time to time. A price change
                will not ordinarily affect an order already successfully
                accepted at the earlier price, except where correction is
                required due to an obvious pricing or technical error and
                subject to applicable law.
              </p>

              <div className="infoBox">
                <strong>PRICE DISPLAY</strong>
                <p>
                  The amount displayed in the final order summary before
                  payment should be reviewed carefully before confirming an
                  order.
                </p>
              </div>
            </section>

            <section id="orders" className="legalSection">
              <p className="sectionNumber">05</p>
              <h2>Orders & Order Acceptance</h2>

              <p>
                Placing an order constitutes an offer by you to purchase the
                selected products subject to these Terms.
              </p>

              <p>
                After an order is submitted, KRVE may provide an acknowledgement
                or confirmation containing order details. An order may be
                subject to verification of payment, inventory, delivery
                information and other reasonable checks.
              </p>

              <p>
                KRVE may cancel or decline an order where reasonably necessary,
                including in cases involving unavailable inventory, incorrect
                product or pricing information, suspected fraudulent activity,
                invalid customer information, payment failure, delivery
                restrictions or technical errors.
              </p>

              <p>
                Where payment has already been collected for an order that is
                subsequently cancelled by KRVE, the applicable amount will be
                processed for refund in accordance with our refund process and
                applicable payment timelines.
              </p>
            </section>

            <section id="payments" className="legalSection">
              <p className="sectionNumber">06</p>
              <h2>Online Payments</h2>

              <p>
                KRVE may make payment methods such as UPI, cards, net banking,
                wallets or other supported methods available through authorised
                payment service providers.
              </p>

              <p>
                Payment availability may depend on the payment provider, bank,
                card issuer, device, transaction value and other technical or
                regulatory requirements.
              </p>

              <p>
                Payment processing may be performed by third-party payment
                providers. KRVE does not require customers to provide sensitive
                payment credentials directly to us where the payment is
                processed on the payment provider&apos;s secure infrastructure.
              </p>

              <p>
                A payment attempt does not by itself guarantee order
                confirmation. If an amount is debited but the order is not
                confirmed, the transaction may require reconciliation by the
                payment provider or issuing bank.
              </p>
            </section>

            <section id="cod" className="legalSection">
              <p className="sectionNumber">07</p>
              <h2>Cash on Delivery</h2>

              <p>
                Cash on Delivery (“COD”) may be offered for eligible orders,
                products and delivery locations. Its availability may be
                determined at checkout.
              </p>

              <p>
                KRVE may limit or temporarily disable COD where necessary,
                including for certain locations, order values, products or
                accounts with repeated unsuccessful deliveries, subject to
                applicable law.
              </p>

              <p>
                Customers should ensure that the required payment can be made
                at the time of delivery where COD has been selected.
              </p>
            </section>

            <section id="offers" className="legalSection">
              <p className="sectionNumber">08</p>
              <h2>Coupons, Discounts & Promotional Offers</h2>

              <p>
                KRVE may periodically offer coupon codes, promotional discounts,
                sale prices or other benefits. Each promotion may be subject to
                its own eligibility criteria, validity period, minimum purchase
                requirement or product restrictions.
              </p>

              <p>
                Unless expressly stated otherwise, promotional benefits cannot
                necessarily be combined with other offers.
              </p>

              <p>
                A coupon has no independent cash value and cannot be redeemed
                for cash. Discounts apply only in accordance with the terms
                displayed for the relevant promotion.
              </p>

              <p>
                KRVE may correct, suspend or withdraw a promotion where there
                is a genuine technical error, misuse, fraud or other legitimate
                reason, while respecting rights already accrued under
                applicable law.
              </p>
            </section>

            <section id="shipping" className="legalSection">
              <p className="sectionNumber">09</p>
              <h2>Shipping & Delivery</h2>

              <p>
                Delivery estimates displayed on KRVE are intended to help
                customers understand the expected delivery period. They are
                estimates rather than guaranteed delivery dates unless
                expressly stated otherwise.
              </p>

              <p>
                Delivery time may be affected by the destination, courier
                operations, weather, public holidays, logistical disruptions,
                incorrect addresses or other circumstances outside reasonable
                control.
              </p>

              <p>
                Customers are responsible for providing an accurate and
                complete delivery address and reachable contact information.
              </p>

              <p>
                Additional details regarding dispatch, delivery and related
                procedures may be provided in our Shipping Policy.
              </p>

              <Link href="/shipping-policy" className="policyLink">
                READ SHIPPING POLICY →
              </Link>
            </section>

            <section id="cancellation" className="legalSection">
              <p className="sectionNumber">10</p>
              <h2>Order Cancellation</h2>

              <p>
                Customers may request cancellation where the relevant order is
                still eligible for cancellation under the order status and
                applicable KRVE policy.
              </p>

              <p>
                Once an order has reached a stage where cancellation is no
                longer operationally possible, the customer may need to follow
                the applicable return process after delivery, where eligible.
              </p>

              <p>
                KRVE may cancel an order where reasonably necessary for reasons
                including stock unavailability, payment failure, incorrect
                listing information, delivery limitations or suspected misuse.
              </p>
            </section>

            <section id="returns" className="legalSection">
              <p className="sectionNumber">11</p>
              <h2>Returns, Exchanges & Refunds</h2>

              <p>
                Return, exchange and refund eligibility depends on the
                applicable KRVE Returns & Refunds Policy and the condition and
                category of the product.
              </p>

              <p>
                Returned products may be required to be unused, unwashed,
                unworn and returned with their original tags, packaging and
                accessories, except where different treatment is required by
                applicable consumer law or the product is defective,
                damaged or incorrect.
              </p>

              <p>
                Certain products may be non-returnable where clearly disclosed
                before purchase and where such restriction is legally
                permissible.
              </p>

              <p>
                Approved refunds may take additional time to appear in the
                customer&apos;s bank account or original payment method due to
                payment provider or banking processing timelines.
              </p>

              <Link href="/returns-refunds" className="policyLink">
                READ RETURNS & REFUNDS POLICY →
              </Link>
            </section>

            <section id="technology" className="legalSection">
              <p className="sectionNumber">12</p>
              <h2>AI Stylist, Virtual Try-On & Digital Experiences</h2>

              <p>
                KRVE may provide technology-led features including AI-assisted
                recommendations, virtual try-on, digital fit tools, style
                suggestions and related experiences.
              </p>

              <p>
                These tools are designed to assist customers and enhance the
                shopping experience. Recommendations, visualisations,
                measurements, size suggestions and fit predictions may be
                estimates and should not be interpreted as an absolute
                guarantee of appearance or fit.
              </p>

              <p>
                Customers should also review product measurements, size guides,
                product descriptions and their own preferences before making a
                purchase decision.
              </p>

              <div className="infoBox">
                <strong>AI EXPERIENCE NOTICE</strong>
                <p>
                  AI-generated or technology-assisted recommendations are
                  supportive shopping tools. Final product and sizing decisions
                  remain with the customer.
                </p>
              </div>
            </section>

            <section id="intellectual-property" className="legalSection">
              <p className="sectionNumber">13</p>
              <h2>Intellectual Property Rights</h2>

              <p>
                The KRVE name, brand identity, logos, website design, graphics,
                product presentation, photographs, text, original artwork,
                software elements and other proprietary content may be
                protected by intellectual property and other applicable laws.
              </p>

              <p>
                Unless permission is expressly granted, website content may not
                be copied, reproduced, republished, distributed, commercially
                exploited or used to create misleading association with KRVE.
              </p>

              <p>
                Personal, non-commercial browsing and use of the website is
                permitted subject to these Terms.
              </p>
            </section>

            <section id="prohibited" className="legalSection">
              <p className="sectionNumber">14</p>
              <h2>Prohibited Use</h2>

              <p>You must not use KRVE services to:</p>

              <ul>
                <li>engage in fraudulent or unlawful transactions;</li>
                <li>attempt unauthorised access to accounts or systems;</li>
                <li>interfere with website security or functionality;</li>
                <li>introduce malicious software or harmful code;</li>
                <li>scrape or extract data in an unauthorised manner;</li>
                <li>impersonate another individual or organisation;</li>
                <li>
                  misuse coupons, promotions, refunds or payment mechanisms;
                </li>
                <li>
                  reproduce or commercially exploit protected KRVE content
                  without authorisation; or
                </li>
                <li>
                  use the platform in a manner that violates applicable law.
                </li>
              </ul>

              <p>
                KRVE may take reasonable steps to protect its customers,
                services and systems where misuse or security threats are
                identified.
              </p>
            </section>

            <section id="third-party" className="legalSection">
              <p className="sectionNumber">15</p>
              <h2>Third-Party Services</h2>

              <p>
                KRVE may rely on third-party providers for services such as
                payments, logistics, authentication, analytics, hosting or
                communications.
              </p>

              <p>
                Those providers may operate under their own terms and privacy
                practices. KRVE is not responsible for independent third-party
                services beyond the extent required under applicable law.
              </p>

              <p>
                Links to external websites or services do not necessarily
                constitute an endorsement of all content available through
                those services.
              </p>
            </section>

            <section id="liability" className="legalSection">
              <p className="sectionNumber">16</p>
              <h2>Disclaimer & Limitation of Liability</h2>

              <p>
                KRVE aims to maintain accurate, secure and continuously
                available services, but temporary interruptions, maintenance,
                technical errors or circumstances beyond reasonable control may
                occasionally affect website availability.
              </p>

              <p>
                To the maximum extent permitted by applicable law, KRVE will
                not be responsible for indirect or consequential losses arising
                solely from use or inability to use the website where such
                liability may legally be limited.
              </p>

              <p>
                Nothing in these Terms is intended to exclude or restrict any
                liability, statutory guarantee or consumer right that cannot
                lawfully be excluded or restricted.
              </p>
            </section>

            <section id="privacy" className="legalSection">
              <p className="sectionNumber">17</p>
              <h2>Privacy & Personal Information</h2>

              <p>
                KRVE may process personal information necessary to provide
                accounts, orders, delivery, customer support, security,
                personalisation and other website functionality.
              </p>

              <p>
                Details regarding the categories of information collected and
                how information is used, stored or otherwise handled are
                described in our Privacy Policy.
              </p>

              <Link href="/privacy-policy" className="policyLink">
                READ PRIVACY POLICY →
              </Link>
            </section>

            <section id="law" className="legalSection">
              <p className="sectionNumber">18</p>
              <h2>Governing Law & Disputes</h2>

              <p>
                These Terms are governed by the applicable laws of India,
                subject to any mandatory rights or remedies available to
                consumers under applicable law.
              </p>

              <p>
                If a concern arises, customers are encouraged to contact KRVE
                first so that we can attempt to resolve the matter through
                customer support.
              </p>

              <p>
                Any jurisdiction provision applicable to a dispute remains
                subject to mandatory consumer protection and other applicable
                laws.
              </p>
            </section>

            <section id="changes" className="legalSection">
              <p className="sectionNumber">19</p>
              <h2>Changes to These Terms</h2>

              <p>
                KRVE may update these Terms from time to time to reflect
                changes in our services, business practices, technology or
                applicable legal requirements.
              </p>

              <p>
                Where appropriate, the revised effective date will be displayed
                on this page. Material changes may also be communicated through
                reasonable additional methods where required.
              </p>

              <p>
                Your use of KRVE after revised Terms become effective will be
                governed by the updated Terms, subject to applicable law and
                rights relating to transactions entered into before the change.
              </p>
            </section>

            <section id="contact" className="legalSection contactSection">
              <p className="sectionNumber">20</p>
              <h2>Contact KRVE</h2>

              <p>
                If you have questions regarding these Terms & Conditions, an
                order, payment or any KRVE service, you can contact us.
              </p>

              <div className="contactCard">
                <div>
                  <span>BRAND</span>
                  <strong>KRVE – The Fashion Studio</strong>
                </div>

                <div>
                  <span>EMAIL</span>
                  <a href="mailto:support@krvefashionstudio.in">
                    support@krvefashionstudio.in
                  </a>
                </div>

                <div>
                  <span>COUNTRY</span>
                  <strong>India</strong>
                </div>
              </div>

              <Link href="/contact" className="contactButton">
                CONTACT KRVE
                <span>→</span>
              </Link>
            </section>
          </article>
        </div>
      </section>

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .legalPage {
          min-height: 100vh;
          background: #030303;
          color: #f4f0e7;
        }

        .shell {
          width: min(1380px, calc(100% - 80px));
          margin: 0 auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 54px 0 90px;
          border-bottom: 1px solid rgba(212, 160, 25, 0.28);
          background:
            radial-gradient(
              circle at 78% 30%,
              rgba(218, 166, 28, 0.12),
              transparent 32%
            ),
            #030303;
        }

        .backLink {
          display: inline-block;
          margin-bottom: 64px;
          color: #bca05a;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 100px;
          align-items: end;
        }

        .eyebrow {
          margin: 0;
          color: #d8a31c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .hero h1 {
          margin: 22px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(62px, 7vw, 105px);
          font-weight: 400;
          line-height: 0.94;
          letter-spacing: -0.045em;
        }

        .hero h1 span {
          color: #d6a11c;
        }

        .heroDescription {
          max-width: 760px;
          margin: 32px 0 0;
          color: #a29e95;
          font-size: 16px;
          line-height: 1.85;
        }

        .heroMeta {
          border-top: 1px solid rgba(216, 163, 28, 0.4);
        }

        .heroMeta > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .heroMeta span {
          color: #77736b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .heroMeta strong {
          color: #ddd8ce;
          font-size: 12px;
          font-weight: 500;
          text-align: right;
        }

        .noticeSection {
          padding: 42px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .notice {
          display: grid;
          grid-template-columns: 75px 1fr;
          gap: 30px;
          padding: 38px;
          border: 1px solid rgba(215, 162, 25, 0.3);
          background: #080704;
        }

        .noticeNumber {
          display: grid;
          width: 54px;
          height: 54px;
          place-items: center;
          border: 1px solid #d5a11d;
          border-radius: 50%;
          color: #e1ab20;
          font-family: Georgia, serif;
          font-size: 24px;
        }

        .notice h2 {
          margin: 12px 0 10px;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 400;
        }

        .notice p:last-child {
          max-width: 1000px;
          margin: 0;
          color: #96928a;
          font-size: 14px;
          line-height: 1.8;
        }

        .contentSection {
          padding: 80px 0 120px;
        }

        .contentGrid {
          display: grid;
          grid-template-columns: 285px minmax(0, 900px);
          gap: 90px;
          align-items: start;
          justify-content: center;
        }

        .indexCard {
          position: sticky;
          top: 120px;
          padding: 28px;
          border: 1px solid rgba(212, 161, 27, 0.22);
          background: #070707;
          max-height: calc(100vh - 150px);
          overflow-y: auto;
        }

        .indexCard nav {
          margin-top: 22px;
        }

        .indexCard nav a {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 8px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
          color: #aaa69d;
          text-decoration: none;
          font-size: 11px;
          line-height: 1.4;
          transition: 0.2s ease;
        }

        .indexCard nav a:hover {
          color: #dda91d;
        }

        .indexCard nav a span {
          color: #7e682f;
          font-size: 9px;
        }

        .legalSection {
          scroll-margin-top: 130px;
          padding: 0 0 60px;
          margin-bottom: 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sectionNumber {
          margin: 0 0 14px;
          color: #d6a11b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .legalSection h2 {
          margin: 0 0 28px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 40px;
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.025em;
        }

        .legalSection h3 {
          margin: 30px 0 12px;
          color: #e1ddd4;
          font-size: 15px;
          font-weight: 700;
        }

        .legalSection > p:not(.sectionNumber) {
          margin: 0 0 19px;
          color: #aaa69e;
          font-size: 15px;
          line-height: 1.9;
        }

        .legalSection ul {
          margin: 20px 0 28px;
          padding: 0;
          list-style: none;
        }

        .legalSection li {
          position: relative;
          padding: 10px 0 10px 28px;
          color: #aaa69e;
          font-size: 14px;
          line-height: 1.7;
          border-bottom: 1px solid rgba(255, 255, 255, 0.045);
        }

        .legalSection li::before {
          content: "◆";
          position: absolute;
          left: 0;
          top: 12px;
          color: #d6a21d;
          font-size: 7px;
        }

        .infoBox {
          margin-top: 30px;
          padding: 24px 26px;
          border-left: 2px solid #d7a21c;
          background: rgba(214, 162, 28, 0.055);
        }

        .infoBox strong {
          color: #dba71f;
          font-size: 10px;
          letter-spacing: 0.16em;
        }

        .infoBox p {
          margin: 10px 0 0;
          color: #aaa69e;
          font-size: 13px;
          line-height: 1.75;
        }

        .policyLink {
          display: inline-flex;
          margin-top: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #b98d1f;
          color: #d9a41d;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .contactSection {
          border-bottom: none;
          margin-bottom: 0;
        }

        .contactCard {
          margin-top: 30px;
          border: 1px solid rgba(214, 162, 27, 0.25);
          background: #070707;
        }

        .contactCard > div {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 20px;
          padding: 21px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .contactCard > div:last-child {
          border-bottom: none;
        }

        .contactCard span {
          color: #77736b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .contactCard strong,
        .contactCard a {
          color: #dedad1;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
        }

        .contactCard a:hover {
          color: #d8a31c;
        }

        .contactButton {
          display: inline-flex;
          min-height: 54px;
          align-items: center;
          justify-content: space-between;
          gap: 70px;
          margin-top: 28px;
          padding: 0 24px;
          background: #dda81e;
          color: #050505;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        @media (max-width: 1000px) {
          .shell {
            width: min(100% - 48px, 950px);
          }

          .heroGrid {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .contentGrid {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .indexCard {
            position: static;
            max-height: none;
          }

          .indexCard nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0 25px;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 34px);
          }

          .hero {
            padding: 35px 0 60px;
          }

          .backLink {
            margin-bottom: 45px;
          }

          .hero h1 {
            font-size: 55px;
          }

          .notice {
            grid-template-columns: 1fr;
            padding: 26px;
          }

          .contentSection {
            padding-top: 50px;
          }

          .indexCard nav {
            grid-template-columns: 1fr;
          }

          .legalSection h2 {
            font-size: 32px;
          }

          .legalSection {
            padding-bottom: 45px;
            margin-bottom: 45px;
          }

          .contactCard > div {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .contactButton {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
