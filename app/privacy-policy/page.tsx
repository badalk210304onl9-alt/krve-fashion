import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-[#3a2b00] bg-[radial-gradient(circle_at_top_right,rgba(212,166,40,0.08),transparent_35%)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d9aa25] transition hover:text-[#f2c94c]"
          >
            ← Back to KRVE
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d9aa25]">
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400 md:text-lg">
              This Privacy Policy explains how KRVE – The Fashion Studio
              collects, uses, stores and protects information when customers
              use our website, shopping services, accounts and related digital
              experiences.
            </p>

            <p className="mt-4 text-sm text-neutral-500">
              Last updated: 15 August 2026
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#3a2b00] bg-[#080808] p-6 lg:sticky lg:top-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d9aa25]">
              On this page
            </p>

            <nav className="mt-6 space-y-3 text-sm text-neutral-400">
              <a className="block hover:text-white" href="#information">
                Information We Collect
              </a>
              <a className="block hover:text-white" href="#use">
                How We Use Information
              </a>
              <a className="block hover:text-white" href="#payments">
                Payments
              </a>
              <a className="block hover:text-white" href="#cookies">
                Cookies & Analytics
              </a>
              <a className="block hover:text-white" href="#sharing">
                Data Sharing
              </a>
              <a className="block hover:text-white" href="#security">
                Data Security
              </a>
              <a className="block hover:text-white" href="#retention">
                Data Retention
              </a>
              <a className="block hover:text-white" href="#rights">
                Your Rights
              </a>
              <a className="block hover:text-white" href="#children">
                Children&apos;s Privacy
              </a>
              <a className="block hover:text-white" href="#changes">
                Policy Updates
              </a>
              <a className="block hover:text-white" href="#contact">
                Contact Us
              </a>
            </nav>
          </aside>

          <article className="space-y-12">
            <section id="information">
              <h2 className="text-2xl font-semibold text-white">
                1. Information We Collect
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  We may collect information that you provide directly when
                  using KRVE services, including your name, email address,
                  mobile number, delivery address, billing details and account
                  information.
                </p>

                <p>
                  When you place an order, we may process information relating
                  to selected products, sizes, colours, quantities, delivery
                  preferences, coupon usage, order history and payment status.
                </p>

                <p>
                  We may also collect technical information such as device
                  type, browser type, IP-related information, pages visited,
                  session activity and interaction data necessary to operate,
                  secure and improve the website.
                </p>
              </div>
            </section>

            <section id="use">
              <h2 className="text-2xl font-semibold text-white">
                2. How We Use Your Information
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  We use customer information to process orders, provide
                  delivery updates, manage accounts, respond to support
                  requests, prevent fraud, improve website performance and
                  provide relevant shopping experiences.
                </p>

                <p>
                  Information may also be used for service notifications,
                  customer communication, analytics, business operations and,
                  where permitted, promotional communication.
                </p>
              </div>
            </section>

            <section id="payments">
              <h2 className="text-2xl font-semibold text-white">
                3. Payment Information
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  Online payments may be processed through authorised third-
                  party payment service providers. KRVE does not intend to
                  directly store complete card credentials, UPI PINs or other
                  sensitive authentication information used to complete a
                  payment.
                </p>

                <p>
                  Payment service providers may process information according
                  to their own terms, privacy policies and regulatory
                  obligations.
                </p>
              </div>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-semibold text-white">
                4. Cookies and Analytics
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  KRVE may use cookies, local storage, session storage and
                  similar technologies to remember preferences, maintain cart
                  sessions, support login functionality, measure performance
                  and improve the customer experience.
                </p>

                <p>
                  Browser settings may allow you to restrict cookies, although
                  some website functions may not operate correctly if required
                  storage technologies are disabled.
                </p>
              </div>
            </section>

            <section id="sharing">
              <h2 className="text-2xl font-semibold text-white">
                5. When We Share Information
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  Information may be shared with service providers when
                  reasonably necessary for payment processing, order
                  fulfilment, shipping, website hosting, authentication,
                  analytics, customer support or security.
                </p>

                <p>
                  We may also disclose information when required by applicable
                  law, court order, governmental request or to protect KRVE,
                  customers or others from fraud, security threats or misuse.
                </p>
              </div>
            </section>

            <section id="security">
              <h2 className="text-2xl font-semibold text-white">
                6. Data Security
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  We aim to use reasonable technical and organisational
                  safeguards to protect customer information against
                  unauthorised access, loss, alteration or misuse.
                </p>

                <p>
                  No internet-based service can guarantee absolute security,
                  and customers should protect their account credentials and
                  devices appropriately.
                </p>
              </div>
            </section>

            <section id="retention">
              <h2 className="text-2xl font-semibold text-white">
                7. Data Retention
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-neutral-400">
                Information may be retained for as long as reasonably required
                to provide services, maintain business and transaction records,
                resolve disputes, prevent fraud and comply with legal,
                accounting or regulatory obligations.
              </p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-semibold text-white">
                8. Your Choices and Rights
              </h2>

              <div className="mt-5 space-y-4 text-[15px] leading-7 text-neutral-400">
                <p>
                  Subject to applicable law, you may contact KRVE to request
                  access to, correction of or deletion of certain personal
                  information held about you.
                </p>

                <p>
                  You may also choose to stop receiving promotional
                  communication by using the available unsubscribe option or
                  contacting customer support.
                </p>
              </div>
            </section>

            <section id="children">
              <h2 className="text-2xl font-semibold text-white">
                9. Children&apos;s Privacy
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-neutral-400">
                KRVE services are not intended to knowingly collect personal
                information from children in circumstances where parental or
                guardian consent is legally required.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-2xl font-semibold text-white">
                10. Changes to This Privacy Policy
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-neutral-400">
                This Privacy Policy may be updated periodically to reflect
                changes in KRVE services, technology, business practices or
                legal requirements. The updated date will be displayed on this
                page.
              </p>
            </section>

            <section
              id="contact"
              className="rounded-2xl border border-[#4a3500] bg-[linear-gradient(135deg,#0d0d0d,#171100)] p-7 md:p-9"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d9aa25]">
                Privacy Support
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                Questions about your privacy?
              </h2>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-neutral-400">
                For privacy-related questions or requests, contact KRVE using
                the customer support details provided on our website.
              </p>

              <a
                href="mailto:support@krvefashionstudio.in"
                className="mt-6 inline-flex border border-[#d9aa25] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#d9aa25] transition hover:bg-[#d9aa25] hover:text-black"
              >
                support@krvefashionstudio.in
              </a>
            </section>
          </article>
        </div>
      </section>

      <section className="border-t border-[#2c2100]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between md:px-10">
          <p>© 2026 KRVE – The Fashion Studio.</p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/terms-and-conditions"
              className="transition hover:text-[#d9aa25]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/returns-refunds"
              className="transition hover:text-[#d9aa25]"
            >
              Returns & Refunds
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[#d9aa25]"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
