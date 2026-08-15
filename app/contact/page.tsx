"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="krveContact-page">
      {/* HERO */}
      <section className="krveContact-hero">
        <div className="krveContact-glow" />

        <div className="krveContact-container">
          <Link href="/" className="krveContact-back">
            ← BACK TO KRVÉ
          </Link>

          <div className="krveContact-heroContent">
            <div className="krveContact-eyebrow">
              <span />
              CUSTOMER CARE
            </div>

            <h1 className="krveContact-title">
              We&apos;re Here
              <br />
              <em>For You.</em>
            </h1>

            <p className="krveContact-heroText">
              Questions about your order, delivery, return, payment or KRVÉ
              experience? Our customer care team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="krveContact-options">
        <div className="krveContact-container">
          <div className="krveContact-optionGrid">
            <article className="krveContact-optionCard">
              <span className="krveContact-cardNumber">01</span>

              <div className="krveContact-cardIcon">✉</div>

              <p className="krveContact-smallLabel">EMAIL SUPPORT</p>

              <h2>Customer Support</h2>

              <p className="krveContact-cardText">
                Get assistance with products, payments, orders, returns,
                refunds and general customer enquiries.
              </p>

              <a href="mailto:support@krvefashionstudio.in">
                EMAIL KRVÉ
                <span>→</span>
              </a>
            </article>

            <article className="krveContact-optionCard">
              <span className="krveContact-cardNumber">02</span>

              <div className="krveContact-cardIcon">◇</div>

              <p className="krveContact-smallLabel">ORDER SUPPORT</p>

              <h2>Track Your Order</h2>

              <p className="krveContact-cardText">
                Already placed an order? Check your latest available order and
                delivery information.
              </p>

              <Link href="/track-order">
                TRACK ORDER
                <span>→</span>
              </Link>
            </article>

            <article className="krveContact-optionCard">
              <span className="krveContact-cardNumber">03</span>

              <div className="krveContact-cardIcon">↺</div>

              <p className="krveContact-smallLabel">AFTER-SALES SUPPORT</p>

              <h2>Returns & Refunds</h2>

              <p className="krveContact-cardText">
                Review return, exchange and refund information before
                submitting your support request.
              </p>

              <Link href="/returns-refunds">
                VIEW POLICY
                <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="krveContact-formSection">
        <div className="krveContact-container krveContact-formGrid">
          <div className="krveContact-formIntro">
            <div className="krveContact-eyebrow">
              <span />
              SEND A MESSAGE
            </div>

            <h2>
              How Can We
              <br />
              <em>Help?</em>
            </h2>

            <p>
              Tell us what you need help with. If your query relates to an
              existing order, include the Order ID so our team can identify
              your request more easily.
            </p>

            <div className="krveContact-infoPanel">
              <span>SUPPORT EMAIL</span>

              <a href="mailto:support@krvefashionstudio.in">
                support@krvefashionstudio.in
              </a>

              <p>
                Customer support response times may vary depending on the
                nature and volume of enquiries.
              </p>
            </div>
          </div>

          <div className="krveContact-formCard">
            {submitted ? (
              <div className="krveContact-success">
                <div className="krveContact-successIcon">✓</div>

                <p className="krveContact-smallLabel">MESSAGE RECEIVED</p>

                <h3>Thank You.</h3>

                <p>
                  Your message has been entered successfully on this form.
                  You can also contact us directly at{" "}
                  <a href="mailto:support@krvefashionstudio.in">
                    support@krvefashionstudio.in
                  </a>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="krveContact-row">
                  <div className="krveContact-field">
                    <label htmlFor="name">FULL NAME *</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="krveContact-field">
                    <label htmlFor="email">EMAIL ADDRESS *</label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="krveContact-row">
                  <div className="krveContact-field">
                    <label htmlFor="phone">MOBILE NUMBER</label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91"
                    />
                  </div>

                  <div className="krveContact-field">
                    <label htmlFor="orderId">ORDER ID</label>

                    <input
                      id="orderId"
                      name="orderId"
                      type="text"
                      placeholder="If applicable"
                    />
                  </div>
                </div>

                <div className="krveContact-field">
                  <label htmlFor="subject">SUBJECT *</label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>

                    <option value="order">
                      Order Related Query
                    </option>

                    <option value="shipping">
                      Shipping & Delivery
                    </option>

                    <option value="return">
                      Return / Exchange
                    </option>

                    <option value="refund">
                      Refund
                    </option>

                    <option value="payment">
                      Payment Issue
                    </option>

                    <option value="product">
                      Product Information
                    </option>

                    <option value="account">
                      Account Support
                    </option>

                    <option value="ai">
                      AI Stylist / Virtual Try-On
                    </option>

                    <option value="career">
                      Careers / Live Projects
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="krveContact-field">
                  <label htmlFor="message">MESSAGE *</label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <label className="krveContact-consent">
                  <input type="checkbox" required />

                  <span>
                    I confirm that the information provided is accurate and I
                    agree to the{" "}
                    <Link href="/privacy-policy">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  className="krveContact-submit"
                >
                  <span>SEND MESSAGE</span>
                  <strong>→</strong>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* QUICK HELP */}
      <section className="krveContact-help">
        <div className="krveContact-container">
          <div className="krveContact-helpHeading">
            <div>
              <p className="krveContact-smallLabel">
                CUSTOMER CARE
              </p>

              <h2>Quick Help</h2>
            </div>

            <p>
              Find useful information about common KRVÉ customer service
              topics.
            </p>
          </div>

          <div className="krveContact-helpGrid">
            <Link href="/track-order">
              <span>01</span>
              <strong>Track Order</strong>
              <b>→</b>
            </Link>

            <Link href="/returns-refunds">
              <span>02</span>
              <strong>Returns & Refunds</strong>
              <b>→</b>
            </Link>

            <Link href="/shipping-policy">
              <span>03</span>
              <strong>Shipping Policy</strong>
              <b>→</b>
            </Link>

            <Link href="/privacy-policy">
              <span>04</span>
              <strong>Privacy Policy</strong>
              <b>→</b>
            </Link>

            <Link href="/terms">
              <span>05</span>
              <strong>Terms & Conditions</strong>
              <b>→</b>
            </Link>

            <Link href="/about">
              <span>06</span>
              <strong>About KRVÉ</strong>
              <b>→</b>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .krveContact-page {
          min-height: 100vh;
          background: #040404;
          color: #f4f0e8;
        }

        .krveContact-container {
          width: min(1360px, calc(100% - 80px));
          margin: 0 auto;
        }

        /* HERO */

        .krveContact-hero {
          position: relative;
          min-height: 480px;
          overflow: hidden;
          border-bottom: 1px solid rgba(218, 166, 29, 0.28);
          background:
            radial-gradient(
              circle at 85% 40%,
              rgba(219, 168, 27, 0.1),
              transparent 32%
            ),
            #050505;
        }

        .krveContact-glow {
          position: absolute;
          right: -180px;
          top: -200px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: rgba(215, 160, 22, 0.07);
          filter: blur(90px);
        }

        .krveContact-hero .krveContact-container {
          position: relative;
          padding-top: 65px;
          padding-bottom: 72px;
        }

        .krveContact-back {
          color: #99938a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .krveContact-back:hover {
          color: #dda81c;
        }

        .krveContact-heroContent {
          margin-top: 65px;
        }

        .krveContact-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          color: #dda91e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .krveContact-eyebrow span {
          display: block;
          width: 38px;
          height: 1px;
          background: #dda91e;
        }

        .krveContact-title {
          max-width: 720px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 5.8vw, 78px);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.045em;
        }

        .krveContact-title em {
          color: #dda91e;
          font-weight: 400;
        }

        .krveContact-heroText {
          max-width: 650px;
          margin: 27px 0 0;
          color: #a09b92;
          font-size: 15px;
          line-height: 1.8;
        }

        /* OPTIONS */

        .krveContact-options {
          border-bottom: 1px solid #222;
        }

        .krveContact-optionGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .krveContact-optionCard {
          position: relative;
          min-height: 325px;
          padding: 40px;
          border-right: 1px solid #242424;
        }

        .krveContact-optionCard:first-child {
          border-left: 1px solid #242424;
        }

        .krveContact-cardNumber {
          position: absolute;
          right: 27px;
          top: 25px;
          color: #555149;
          font-size: 11px;
        }

        .krveContact-cardIcon {
          margin-bottom: 30px;
          color: #dda91e;
          font-size: 25px;
        }

        .krveContact-smallLabel {
          margin: 0;
          color: #dda91e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .krveContact-optionCard h2 {
          margin: 12px 0 14px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
          font-weight: 400;
        }

        .krveContact-cardText {
          min-height: 75px;
          margin: 0 0 24px;
          color: #8f8a82;
          font-size: 13px;
          line-height: 1.75;
        }

        .krveContact-optionCard > a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 18px;
          border-top: 1px solid #282828;
          color: #e8e3d9;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .krveContact-optionCard > a span {
          color: #dda91e;
        }

        /* FORM */

        .krveContact-formSection {
          padding: 95px 0;
          background: #070707;
        }

        .krveContact-formGrid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 90px;
          align-items: start;
        }

        .krveContact-formIntro .krveContact-eyebrow {
          margin-top: 10px;
        }

        .krveContact-formIntro h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 4.5vw, 62px);
          font-weight: 400;
          line-height: 1;
        }

        .krveContact-formIntro h2 em {
          color: #dda91e;
          font-weight: 400;
        }

        .krveContact-formIntro > p {
          max-width: 470px;
          margin: 28px 0 0;
          color: #99948b;
          font-size: 14px;
          line-height: 1.85;
        }

        .krveContact-infoPanel {
          margin-top: 40px;
          padding: 24px 0;
          border-top: 1px solid #292929;
          border-bottom: 1px solid #292929;
        }

        .krveContact-infoPanel > span {
          display: block;
          margin-bottom: 10px;
          color: #68645d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .krveContact-infoPanel > a {
          color: #dda91e;
          font-size: 14px;
          text-decoration: none;
        }

        .krveContact-infoPanel > p {
          margin: 14px 0 0;
          color: #77736c;
          font-size: 12px;
          line-height: 1.7;
        }

        .krveContact-formCard {
          padding: 38px;
          border: 1px solid rgba(218, 166, 27, 0.25);
          background: #050505;
        }

        .krveContact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .krveContact-field {
          margin-bottom: 21px;
        }

        .krveContact-field label {
          display: block;
          margin-bottom: 9px;
          color: #aaa59c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .krveContact-field input,
        .krveContact-field select,
        .krveContact-field textarea {
          width: 100%;
          border: 1px solid #302e2a;
          border-radius: 0;
          outline: none;
          background: #090909;
          color: #eee8dc;
          padding: 15px 16px;
          font-family: inherit;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .krveContact-field input:focus,
        .krveContact-field select:focus,
        .krveContact-field textarea:focus {
          border-color: #c9971d;
          background: #0d0c09;
        }

        .krveContact-field input::placeholder,
        .krveContact-field textarea::placeholder {
          color: #595650;
        }

        .krveContact-field textarea {
          min-height: 135px;
          resize: vertical;
        }

        .krveContact-consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 2px 0 25px;
          color: #827e76;
          font-size: 11px;
          line-height: 1.65;
        }

        .krveContact-consent input {
          width: 15px;
          height: 15px;
          margin-top: 2px;
          accent-color: #dda91e;
        }

        .krveContact-consent a {
          color: #dda91e;
        }

        .krveContact-submit {
          display: flex;
          width: 100%;
          min-height: 53px;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border: 1px solid #dda91e;
          background: #dda91e;
          color: #050505;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .krveContact-submit:hover {
          background: #efbc31;
        }

        .krveContact-submit strong {
          font-size: 17px;
        }

        /* SUCCESS */

        .krveContact-success {
          display: flex;
          min-height: 430px;
          flex-direction: column;
          justify-content: center;
        }

        .krveContact-successIcon {
          display: grid;
          width: 50px;
          height: 50px;
          margin-bottom: 25px;
          place-items: center;
          border: 1px solid #dda91e;
          color: #dda91e;
          font-size: 20px;
        }

        .krveContact-success h3 {
          margin: 12px 0;
          font-family: Georgia, serif;
          font-size: 40px;
          font-weight: 400;
        }

        .krveContact-success > p:not(.krveContact-smallLabel) {
          max-width: 570px;
          color: #918c83;
          font-size: 13px;
          line-height: 1.8;
        }

        .krveContact-success a {
          color: #dda91e;
        }

        .krveContact-success button {
          width: fit-content;
          margin-top: 22px;
          padding: 16px 22px;
          border: 1px solid #dda91e;
          background: #dda91e;
          color: #050505;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        /* QUICK HELP */

        .krveContact-help {
          padding: 80px 0 100px;
        }

        .krveContact-helpHeading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 35px;
        }

        .krveContact-helpHeading h2 {
          margin: 10px 0 0;
          font-family: Georgia, serif;
          font-size: 40px;
          font-weight: 400;
        }

        .krveContact-helpHeading > p {
          max-width: 410px;
          margin: 0;
          color: #817d75;
          font-size: 13px;
          line-height: 1.7;
        }

        .krveContact-helpGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #282828;
          border-left: 1px solid #282828;
        }

        .krveContact-helpGrid > a {
          display: grid;
          min-height: 105px;
          grid-template-columns: 40px 1fr auto;
          align-items: center;
          padding: 24px;
          border-right: 1px solid #282828;
          border-bottom: 1px solid #282828;
          color: #eee8df;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .krveContact-helpGrid > a:hover {
          background: rgba(218, 166, 27, 0.05);
        }

        .krveContact-helpGrid span {
          color: #6c6861;
          font-size: 10px;
        }

        .krveContact-helpGrid strong {
          font-family: Georgia, serif;
          font-size: 17px;
          font-weight: 400;
        }

        .krveContact-helpGrid b {
          color: #dda91e;
          font-size: 16px;
        }

        @media (max-width: 1000px) {
          .krveContact-container {
            width: min(100% - 42px, 1000px);
          }

          .krveContact-optionGrid {
            grid-template-columns: 1fr;
          }

          .krveContact-optionCard {
            min-height: auto;
            border-left: 1px solid #242424;
            border-bottom: 1px solid #242424;
          }

          .krveContact-cardText {
            min-height: auto;
          }

          .krveContact-formGrid {
            grid-template-columns: 1fr;
            gap: 55px;
          }
        }

        @media (max-width: 700px) {
          .krveContact-container {
            width: calc(100% - 32px);
          }

          .krveContact-hero {
            min-height: auto;
          }

          .krveContact-hero .krveContact-container {
            padding-top: 35px;
            padding-bottom: 55px;
          }

          .krveContact-heroContent {
            margin-top: 45px;
          }

          .krveContact-title {
            font-size: 46px;
          }

          .krveContact-optionCard {
            padding: 30px 24px;
          }

          .krveContact-formSection {
            padding: 65px 0;
          }

          .krveContact-formIntro h2 {
            font-size: 40px;
          }

          .krveContact-formCard {
            padding: 24px 18px;
          }

          .krveContact-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .krveContact-helpHeading {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
          }

          .krveContact-helpGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
