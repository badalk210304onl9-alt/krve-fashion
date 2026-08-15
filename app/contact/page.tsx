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
    <main className="contactPage">
      {/* HERO */}
      <section className="hero">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />

        <div className="container heroInner">
          <Link href="/" className="back">
            ← BACK TO KRVÉ
          </Link>

          <div className="eyebrow">
            <span />
            CUSTOMER CARE
          </div>

          <h1>
            We&apos;re Here
            <br />
            <em>For You.</em>
          </h1>

          <p className="heroText">
            Questions about your order, delivery, return, payment or KRVÉ
            experience? Our customer care team is here to help.
          </p>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="contactOptions">
        <div className="container">
          <div className="optionGrid">
            <article className="option">
              <div className="optionNumber">01</div>
              <div className="icon">✉</div>

              <span className="label">EMAIL US</span>

              <h2>Customer Support</h2>

              <p>
                For orders, products, returns, refunds, payments and general
                customer support.
              </p>

              <a href="mailto:support@krvefashionstudio.in">
                support@krvefashionstudio.in
                <span>→</span>
              </a>
            </article>

            <article className="option">
              <div className="optionNumber">02</div>
              <div className="icon">◇</div>

              <span className="label">ORDER SUPPORT</span>

              <h2>Track Your Order</h2>

              <p>
                Already placed an order? Use our order tracking experience to
                check the latest available status.
              </p>

              <Link href="/track-order">
                TRACK ORDER
                <span>→</span>
              </Link>
            </article>

            <article className="option">
              <div className="optionNumber">03</div>
              <div className="icon">↺</div>

              <span className="label">RETURNS</span>

              <h2>Returns & Refunds</h2>

              <p>
                Need help with a return, exchange or refund? Review our policy
                before submitting your request.
              </p>

              <Link href="/returns-refunds">
                VIEW POLICY
                <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="formSection">
        <div className="container formGrid">
          <div className="formIntro">
            <div className="eyebrow">
              <span />
              SEND A MESSAGE
            </div>

            <h2>
              How Can We
              <br />
              <em>Help?</em>
            </h2>

            <p>
              Complete the form with your query and order information, where
              applicable. Please provide accurate details so your request can
              be handled efficiently.
            </p>

            <div className="responseBox">
              <span>RESPONSE</span>
              <strong>Customer Care</strong>
              <p>
                Response times may vary depending on the nature and volume of
                support requests.
              </p>
            </div>
          </div>

          <div className="formCard">
            {submitted ? (
              <div className="success">
                <div className="successIcon">✓</div>

                <span>MESSAGE RECEIVED</span>

                <h3>Thank You.</h3>

                <p>
                  Your enquiry has been recorded on this page. For immediate
                  email support, please contact us at{" "}
                  <a href="mailto:support@krvefashionstudio.in">
                    support@krvefashionstudio.in
                  </a>
                  .
                </p>

                <button type="button" onClick={() => setSubmitted(false)}>
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="field">
                    <label htmlFor="name">FULL NAME *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="field">
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

                <div className="row">
                  <div className="field">
                    <label htmlFor="phone">PHONE NUMBER</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="order">ORDER ID</label>
                    <input
                      id="order"
                      name="order"
                      type="text"
                      placeholder="If applicable"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="subject">HOW CAN WE HELP? *</label>

                  <select id="subject" name="subject" required defaultValue="">
                    <option value="" disabled>
                      Select a subject
                    </option>

                    <option value="order">Order Related Query</option>
                    <option value="delivery">Shipping & Delivery</option>
                    <option value="return">Return / Exchange</option>
                    <option value="refund">Refund</option>
                    <option value="payment">Payment Issue</option>
                    <option value="product">Product Information</option>
                    <option value="account">Account Support</option>
                    <option value="ai">AI Stylist / Virtual Try-On</option>
                    <option value="career">Careers / Live Projects</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="message">MESSAGE *</label>

                  <textarea
                    id="message"
                    name="message"
                    rows={7}
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <label className="checkbox">
                  <input type="checkbox" required />

                  <span>
                    I confirm that the information provided is accurate and I
                    agree to the{" "}
                    <Link href="/privacy-policy">Privacy Policy</Link>.
                  </span>
                </label>

                <button className="submit" type="submit">
                  <span>SEND MESSAGE</span>
                  <strong>→</strong>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* HELP */}
      <section className="help">
        <div className="container">
          <div className="helpHeader">
            <div>
              <span className="small">BEFORE YOU CONTACT US</span>
              <h2>Quick Help</h2>
            </div>

            <p>
              You may find the information you need in one of our customer care
              pages.
            </p>
          </div>

          <div className="helpGrid">
            <Link href="/track-order" className="helpItem">
              <span>01</span>
              <strong>Track Order</strong>
              <b>→</b>
            </Link>

            <Link href="/returns-refunds" className="helpItem">
              <span>02</span>
              <strong>Returns & Refunds</strong>
              <b>→</b>
            </Link>

            <Link href="/shipping-policy" className="helpItem">
              <span>03</span>
              <strong>Shipping Policy</strong>
              <b>→</b>
            </Link>

            <Link href="/privacy-policy" className="helpItem">
              <span>04</span>
              <strong>Privacy Policy</strong>
              <b>→</b>
            </Link>

            <Link href="/terms" className="helpItem">
              <span>05</span>
              <strong>Terms & Conditions</strong>
              <b>→</b>
            </Link>

            <Link href="/about" className="helpItem">
              <span>06</span>
              <strong>About KRVÉ</strong>
              <b>→</b>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container footerTop">
          <div className="brand">
            <strong>KRVÉ</strong>
            <span>THE FASHION STUDIO</span>

            <p>
              Contemporary fashion, elevated essentials and technology-led
              shopping experiences designed for a new generation.
            </p>

            <a href="mailto:support@krvefashionstudio.in">
              support@krvefashionstudio.in
            </a>

            <p className="india">India</p>
          </div>

          <div className="footerColumn">
            <h3>SHOP</h3>
            <Link href="/collections">Collections</Link>
            <Link href="/collections?category=men">Men</Link>
            <Link href="/collections?category=women">Women</Link>
            <Link href="/collections?category=kids">Kids</Link>
            <Link href="/collections?category=accessories">Accessories</Link>
          </div>

          <div className="footerColumn">
            <h3>CUSTOMER CARE</h3>
            <Link href="/contact">Contact Us</Link>
            <Link href="/track-order">Track Order</Link>
            <Link href="/returns-refunds">Returns & Refunds</Link>
            <Link href="/shipping-policy">Shipping Policy</Link>
          </div>

          <div className="footerColumn">
            <h3>COMPANY</h3>
            <Link href="/about">About KRVÉ</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>

        <div className="container bottom">
          <span>© 2026 KRVÉ – The Fashion Studio. All rights reserved.</span>

          <div>
            <span>SECURE SHOPPING</span>
            <span>MADE FOR INDIA</span>
            <strong>MOVE INTO STYLE.</strong>
          </div>
        </div>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .contactPage {
          min-height: 100vh;
          background: #050505;
          color: #f5f0e7;
        }

        .container {
          width: min(1400px, calc(100% - 80px));
          margin: 0 auto;
        }

        .hero {
          min-height: 610px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(218, 166, 24, 0.3);
          background:
            radial-gradient(
              circle at 82% 40%,
              rgba(217, 164, 25, 0.09),
              transparent 25%
            ),
            linear-gradient(135deg, #050505, #090806);
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          width: 500px;
          height: 500px;
          right: -100px;
          top: -100px;
          background: rgba(218, 166, 24, 0.07);
        }

        .glowTwo {
          width: 350px;
          height: 350px;
          left: -150px;
          bottom: -150px;
          background: rgba(218, 166, 24, 0.04);
        }

        .heroInner {
          position: relative;
          padding: 65px 0 90px;
        }

        .back {
          color: #918b80;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .back:hover {
          color: #e1ad22;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #dda91e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.23em;
          margin-top: 80px;
          margin-bottom: 25px;
        }

        .eyebrow span {
          width: 42px;
          height: 1px;
          background: #dda91e;
        }

        .hero h1 {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(68px, 8vw, 125px);
          font-weight: 400;
          line-height: 0.87;
          letter-spacing: -0.055em;
          margin: 0;
        }

        .hero h1 em,
        .formIntro h2 em {
          color: #dda91e;
          font-weight: 400;
        }

        .heroText {
          max-width: 680px;
          color: #a39e95;
          line-height: 1.9;
          font-size: 17px;
          margin-top: 42px;
        }

        .contactOptions {
          border-bottom: 1px solid #202020;
        }

        .optionGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .option {
          position: relative;
          min-height: 390px;
          padding: 50px;
          border-right: 1px solid #242424;
        }

        .option:first-child {
          border-left: 1px solid #242424;
        }

        .optionNumber {
          position: absolute;
          right: 30px;
          top: 28px;
          color: #4e4b45;
          font-family: Georgia, serif;
          font-size: 14px;
        }

        .icon {
          color: #dda91e;
          font-size: 32px;
          margin-bottom: 45px;
        }

        .label,
        .small {
          color: #dda91e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .option h2 {
          font-family: Georgia, serif;
          font-weight: 400;
          font-size: 30px;
          margin: 13px 0 17px;
        }

        .option p {
          min-height: 90px;
          color: #8d8981;
          line-height: 1.75;
          font-size: 14px;
        }

        .option a {
          border-top: 1px solid #272727;
          padding-top: 22px;
          display: flex;
          justify-content: space-between;
          color: #e3ded4;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .option a span {
          color: #dda91e;
        }

        .formSection {
          padding: 120px 0;
          background:
            radial-gradient(
              circle at 10% 40%,
              rgba(219, 169, 30, 0.04),
              transparent 28%
            ),
            #080808;
        }

        .formGrid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 110px;
        }

        .formIntro .eyebrow {
          margin-top: 0;
        }

        .formIntro h2 {
          font-family: Georgia, serif;
          font-size: clamp(50px, 5vw, 76px);
          font-weight: 400;
          line-height: 0.98;
          margin: 0;
        }

        .formIntro > p {
          color: #959087;
          line-height: 1.9;
          max-width: 500px;
          margin-top: 35px;
        }

        .responseBox {
          margin-top: 50px;
          padding: 25px 0;
          border-top: 1px solid #2b2925;
          border-bottom: 1px solid #2b2925;
        }

        .responseBox span {
          display: block;
          color: #6f6b64;
          font-size: 9px;
          letter-spacing: 0.2em;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .responseBox strong {
          font-family: Georgia, serif;
          font-size: 21px;
          font-weight: 400;
        }

        .responseBox p {
          color: #77736c;
          font-size: 12px;
          line-height: 1.7;
          margin-bottom: 0;
        }

        .formCard {
          padding: 50px;
          border: 1px solid rgba(217, 164, 25, 0.25);
          background: #050505;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .field {
          margin-bottom: 25px;
        }

        .field label {
          display: block;
          color: #b4afa6;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.18em;
          margin-bottom: 12px;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #302e2a;
          outline: none;
          background: #0a0a0a;
          color: #f0eadf;
          padding: 17px 18px;
          font: inherit;
          border-radius: 0;
          transition: 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #c79617;
          background: #0d0c09;
        }

        input::placeholder,
        textarea::placeholder {
          color: #56534e;
        }

        select {
          cursor: pointer;
        }

        textarea {
          resize: vertical;
          min-height: 160px;
        }

        .checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #817d75;
          font-size: 12px;
          line-height: 1.7;
          margin: 5px 0 30px;
        }

        .checkbox input {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          accent-color: #dca91f;
        }

        .checkbox a {
          color: #dca91f;
        }

        .submit,
        .success button {
          width: 100%;
          border: 1px solid #e1ad22;
          background: #dca91f;
          color: #080808;
          padding: 19px 22px;
          font-weight: 900;
          letter-spacing: 0.13em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .submit:hover,
        .success button:hover {
          background: #edbb31;
        }

        .submit strong {
          font-size: 20px;
        }

        .success {
          min-height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .successIcon {
          width: 60px;
          height: 60px;
          border: 1px solid #dda91e;
          display: grid;
          place-items: center;
          color: #dda91e;
          font-size: 25px;
          margin-bottom: 30px;
        }

        .success > span {
          color: #dda91e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .success h3 {
          font-family: Georgia, serif;
          font-size: 55px;
          font-weight: 400;
          margin: 13px 0 15px;
        }

        .success p {
          color: #918c83;
          line-height: 1.8;
          margin-bottom: 35px;
        }

        .success a {
          color: #dda91e;
        }

        .success button {
          max-width: 300px;
          justify-content: center;
        }

        .help {
          padding: 100px 0;
          border-top: 1px solid #202020;
        }

        .helpHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 50px;
          margin-bottom: 50px;
        }

        .helpHeader h2 {
          font-family: Georgia, serif;
          font-size: 48px;
          font-weight: 400;
          margin: 12px 0 0;
        }

        .helpHeader > p {
          color: #858078;
          max-width: 420px;
          line-height: 1.7;
        }

        .helpGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid #292929;
          border-left: 1px solid #292929;
        }

        .helpItem {
          min-height: 130px;
          padding: 28px;
          border-right: 1px solid #292929;
          border-bottom: 1px solid #292929;
          text-decoration: none;
          color: #f0eae0;
          display: grid;
          grid-template-columns: 45px 1fr auto;
          align-items: center;
          transition: 0.2s ease;
        }

        .helpItem:hover {
          background: rgba(219, 169, 30, 0.045);
        }

        .helpItem span {
          color: #706c65;
          font-size: 11px;
        }

        .helpItem strong {
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 400;
        }

        .helpItem b {
          color: #dda91e;
          font-size: 19px;
        }

        footer {
          background: #020202;
          border-top: 1px solid rgba(218, 166, 24, 0.28);
          padding: 80px 0 30px;
        }

        .footerTop {
          display: grid;
          grid-template-columns: 1.7fr repeat(3, 1fr);
          gap: 70px;
        }

        .brand strong {
          display: block;
          font-family: Georgia, serif;
          font-size: 45px;
          letter-spacing: 0.1em;
        }

        .brand > span {
          display: block;
          color: #dda91e;
          font-size: 10px;
          letter-spacing: 0.25em;
          font-weight: 800;
          margin: 8px 0 35px;
        }

        .brand p {
          color: #8c887f;
          max-width: 390px;
          line-height: 1.9;
        }

        .brand a {
          color: #aaa59c;
          text-decoration: none;
        }

        .brand .india {
          margin-top: 15px;
        }

        .footerColumn {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .footerColumn h3 {
          font-size: 13px;
          letter-spacing: 0.16em;
          margin: 0 0 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid #29261e;
        }

        .footerColumn a {
          color: #8e8a82;
          text-decoration: none;
          font-size: 14px;
        }

        .footerColumn a:hover {
          color: #dda91e;
        }

        .bottom {
          border-top: 1px solid #1d1d1d;
          margin-top: 70px;
          padding-top: 28px;
          display: flex;
          justify-content: space-between;
          gap: 30px;
          color: #5e5b55;
          font-size: 11px;
        }

        .bottom div {
          display: flex;
          gap: 30px;
        }

        .bottom strong {
          color: #dda91e;
          font-weight: 500;
        }

        @media (max-width: 1000px) {
          .container {
            width: min(100% - 40px, 1400px);
          }

          .optionGrid {
            grid-template-columns: 1fr;
          }

          .option {
            min-height: auto;
            border-left: 1px solid #242424;
            border-bottom: 1px solid #242424;
          }

          .option p {
            min-height: auto;
          }

          .formGrid {
            grid-template-columns: 1fr;
            gap: 65px;
          }

          .helpGrid {
            grid-template-columns: 1fr 1fr;
          }

          .footerTop {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 650px) {
          .container {
            width: calc(100% - 30px);
          }

          .hero {
            min-height: auto;
          }

          .heroInner {
            padding: 40px 0 65px;
          }

          .eyebrow {
            margin-top: 60px;
          }

          .hero h1 {
            font-size: 58px;
          }

          .option {
            padding: 35px 25px;
          }

          .formSection {
            padding: 75px 0;
          }

          .formCard {
            padding: 25px 20px;
          }

          .row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .helpHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .helpGrid {
            grid-template-columns: 1fr;
          }

          .footerTop {
            grid-template-columns: 1fr;
          }

          .bottom {
            flex-direction: column;
          }

          .bottom div {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
