import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-shell">
          <Link href="/" className="about-back">
            ← Back to KRVE
          </Link>

          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <p className="about-kicker">ABOUT KRVE</p>

              <h1>
                Fashion.
                <br />
                Intelligence.
                <br />
                <span>Identity.</span>
              </h1>

              <p className="about-lead">
                KRVE – The Fashion Studio is an emerging fashion and
                e-commerce venture building a modern shopping experience
                around design, technology, personalisation and intelligent
                fashion discovery.
              </p>

              <div className="about-actions">
                <Link href="/collections" className="about-primary-btn">
                  EXPLORE COLLECTIONS
                  <span>→</span>
                </Link>

                <Link href="/virtual-try-on" className="about-secondary-btn">
                  VIRTUAL TRY-ON
                </Link>
              </div>
            </div>

            <div className="about-hero-card">
              <div className="about-monogram">K</div>

              <p>KRVE</p>
              <span>THE FASHION STUDIO</span>

              <div className="about-card-line" />

              <strong>MOVE INTO STYLE.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-shell">
          <div className="about-section-grid">
            <div>
              <p className="about-section-kicker">OUR STORY</p>

              <h2>
                Built for a new generation
                <span> of fashion.</span>
              </h2>
            </div>

            <div className="about-story-copy">
              <p>
                KRVE was created with a simple idea: fashion shopping should
                feel more personal, more intelligent and more inspiring.
              </p>

              <p>
                Instead of building only another online clothing store, KRVE
                aims to combine contemporary fashion with technology-led
                experiences that help customers discover products, understand
                fit and make better style decisions.
              </p>

              <p>
                Our approach brings together fashion, e-commerce, artificial
                intelligence, customer experience and business operations into
                one connected brand experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-pillars">
        <div className="about-shell">
          <div className="about-heading-row">
            <div>
              <p className="about-section-kicker">WHAT DEFINES KRVE</p>

              <h2>
                Designed around
                <span> four principles.</span>
              </h2>
            </div>
          </div>

          <div className="about-pillar-grid">
            <article>
              <span>01</span>
              <h3>Contemporary Design</h3>
              <p>
                Modern silhouettes, refined styling and products designed for
                evolving fashion preferences.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Technology-Led Shopping</h3>
              <p>
                Digital experiences designed to make product discovery,
                styling and shopping more intelligent.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Personalisation</h3>
              <p>
                A long-term vision centred around individual fit, style
                preferences and personalised recommendations.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Customer Experience</h3>
              <p>
                A premium end-to-end journey from discovery and purchase to
                delivery and support.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-tech">
        <div className="about-shell">
          <div className="about-tech-grid">
            <div className="about-tech-card">
              <p>KRVE INTELLIGENCE</p>

              <div className="about-tech-number">AI</div>

              <span>
                Fashion meets intelligent
                <br />
                digital experiences.
              </span>
            </div>

            <div className="about-tech-copy">
              <p className="about-section-kicker">TECHNOLOGY & INNOVATION</p>

              <h2>
                More than
                <span> traditional e-commerce.</span>
              </h2>

              <p>
                KRVE is exploring technology-led capabilities designed to
                improve how customers interact with fashion online.
              </p>

              <div className="about-feature-list">
                <div>
                  <span>01</span>

                  <section>
                    <h3>Virtual Try-On</h3>
                    <p>
                      Helping customers visualise fashion products through
                      digital experiences.
                    </p>
                  </section>
                </div>

                <div>
                  <span>02</span>

                  <section>
                    <h3>AI Stylist</h3>
                    <p>
                      Intelligent recommendations designed around customer
                      preferences and styling needs.
                    </p>
                  </section>
                </div>

                <div>
                  <span>03</span>

                  <section>
                    <h3>Digital Fit Experience</h3>
                    <p>
                      Exploring smarter approaches to sizing, fit and product
                      suitability.
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-vision">
        <div className="about-shell">
          <div className="about-vision-grid">
            <div className="about-vision-block">
              <p className="about-section-kicker">OUR VISION</p>

              <h2>
                Build a fashion brand where
                <span> style and technology move together.</span>
              </h2>

              <p>
                Our vision is to create a connected fashion ecosystem where
                customers can discover, personalise, experience and purchase
                fashion with greater confidence.
              </p>
            </div>

            <div className="about-vision-block">
              <p className="about-section-kicker">OUR MISSION</p>

              <h2>
                Make premium fashion experiences
                <span> more intelligent and accessible.</span>
              </h2>

              <p>
                KRVE aims to continuously improve product design, digital
                experiences, customer service and technology while building a
                trusted modern fashion brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-brand">
        <div className="about-shell">
          <div className="about-brand-card">
            <div>
              <p className="about-section-kicker">THE KRVE PHILOSOPHY</p>

              <h2>
                Move into
                <span> style.</span>
              </h2>

              <p>
                Style is not only what you wear. It is how you discover,
                choose, express and experience fashion.
              </p>
            </div>

            <div className="about-brand-mark">
              <strong>KRVÉ</strong>
              <span>THE FASHION STUDIO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-careers">
        <div className="about-shell">
          <div className="about-careers-inner">
            <div>
              <p className="about-section-kicker">BUILD WITH KRVE</p>

              <h2>
                Want to work on the
                <span> future of fashion?</span>
              </h2>

              <p>
                Explore live business projects, internships and future career
                opportunities across fashion, marketing, finance, technology,
                operations and customer experience.
              </p>
            </div>

            <Link href="/careers" className="about-primary-btn">
              EXPLORE CAREERS
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          min-height: 100vh;
          background: #030303;
          color: #f5f2e9;
        }

        .about-shell {
          width: min(1400px, calc(100% - 80px));
          margin: 0 auto;
        }

        .about-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(213, 164, 31, 0.25);
          background:
            radial-gradient(circle at 82% 25%, rgba(210, 158, 24, 0.12), transparent 35%),
            linear-gradient(180deg, #050505, #020202);
        }

        .about-back {
          display: inline-block;
          margin-top: 48px;
          color: #b79b57;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 80px;
          align-items: center;
          min-height: 680px;
          padding: 50px 0 85px;
        }

        .about-kicker,
        .about-section-kicker {
          margin: 0;
          color: #dda91d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.24em;
        }

        .about-hero-copy h1 {
          margin: 24px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(62px, 7vw, 108px);
          font-weight: 400;
          line-height: 0.93;
          letter-spacing: -0.045em;
        }

        .about-hero-copy h1 span {
          color: #d8a21a;
        }

        .about-lead {
          max-width: 760px;
          margin: 34px 0 0;
          color: #aaa69d;
          font-size: 17px;
          line-height: 1.85;
        }

        .about-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 38px;
        }

        .about-primary-btn,
        .about-secondary-btn {
          display: inline-flex;
          min-height: 55px;
          align-items: center;
          justify-content: center;
          gap: 28px;
          padding: 0 26px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          transition: 0.2s ease;
        }

        .about-primary-btn {
          background: #e0aa1d;
          color: #050505;
          border: 1px solid #e0aa1d;
        }

        .about-primary-btn:hover {
          background: #f1bb2b;
        }

        .about-secondary-btn {
          color: #d9a51e;
          border: 1px solid rgba(217, 165, 30, 0.55);
        }

        .about-secondary-btn:hover {
          background: rgba(217, 165, 30, 0.08);
        }

        .about-hero-card {
          position: relative;
          display: flex;
          min-height: 430px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(217, 165, 30, 0.45);
          background:
            radial-gradient(circle at center, rgba(217, 165, 30, 0.12), transparent 58%),
            #070707;
          text-align: center;
        }

        .about-monogram {
          display: grid;
          width: 110px;
          height: 110px;
          place-items: center;
          border: 1px solid #d7a21a;
          color: #e3ad21;
          font-family: Georgia, serif;
          font-size: 54px;
        }

        .about-hero-card > p {
          margin: 28px 0 0;
          font-family: Georgia, serif;
          font-size: 34px;
        }

        .about-hero-card > span {
          margin-top: 8px;
          color: #a58c54;
          font-size: 10px;
          letter-spacing: 0.28em;
        }

        .about-card-line {
          width: 64px;
          height: 1px;
          margin: 28px 0;
          background: #c99a21;
        }

        .about-hero-card strong {
          color: #d6a11c;
          font-size: 11px;
          letter-spacing: 0.18em;
        }

        .about-story,
        .about-pillars,
        .about-tech,
        .about-vision,
        .about-brand,
        .about-careers {
          padding: 100px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .about-section-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
        }

        .about-section-grid h2,
        .about-heading-row h2,
        .about-tech-copy h2,
        .about-vision-block h2,
        .about-brand-card h2,
        .about-careers-inner h2 {
          margin: 18px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 48px;
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .about-section-grid h2 span,
        .about-heading-row h2 span,
        .about-tech-copy h2 span,
        .about-vision-block h2 span,
        .about-brand-card h2 span,
        .about-careers-inner h2 span {
          color: #d5a018;
        }

        .about-story-copy p,
        .about-tech-copy > p,
        .about-vision-block > p,
        .about-brand-card > div > p,
        .about-careers-inner > div > p {
          margin: 0 0 21px;
          color: #9c9991;
          font-size: 16px;
          line-height: 1.9;
        }

        .about-heading-row {
          margin-bottom: 52px;
        }

        .about-pillar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .about-pillar-grid article {
          min-height: 270px;
          padding: 34px 28px;
          border: 1px solid rgba(213, 162, 29, 0.22);
          background: #070707;
        }

        .about-pillar-grid article > span {
          color: #d5a21c;
          font-size: 11px;
          font-weight: 800;
        }

        .about-pillar-grid h3 {
          margin: 42px 0 0;
          font-family: Georgia, serif;
          font-size: 25px;
          font-weight: 400;
        }

        .about-pillar-grid p {
          margin: 17px 0 0;
          color: #8f8b83;
          font-size: 14px;
          line-height: 1.75;
        }

        .about-tech-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 90px;
          align-items: center;
        }

        .about-tech-card {
          display: flex;
          min-height: 500px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(214, 161, 25, 0.35);
          background:
            radial-gradient(circle at center, rgba(215, 160, 25, 0.12), transparent 55%),
            #050505;
          text-align: center;
        }

        .about-tech-card > p {
          margin: 0;
          color: #c89a26;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .about-tech-number {
          margin-top: 26px;
          color: #e0a91d;
          font-family: Georgia, serif;
          font-size: 130px;
          line-height: 1;
        }

        .about-tech-card > span {
          margin-top: 28px;
          color: #969188;
          font-size: 14px;
          line-height: 1.7;
        }

        .about-feature-list {
          margin-top: 34px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }

        .about-feature-list > div {
          display: flex;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .about-feature-list > div > span {
          color: #d2a01f;
          font-size: 10px;
          font-weight: 800;
        }

        .about-feature-list section h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
        }

        .about-feature-list section p {
          margin: 8px 0 0;
          color: #858179;
          font-size: 14px;
          line-height: 1.7;
        }

        .about-vision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .about-vision-block {
          padding: 52px;
          border: 1px solid rgba(212, 162, 28, 0.22);
          background: #070707;
        }

        .about-vision-block h2 {
          font-size: 38px;
        }

        .about-brand-card,
        .about-careers-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          padding: 60px;
          border: 1px solid rgba(215, 164, 29, 0.35);
          background:
            radial-gradient(circle at 80% 40%, rgba(214, 161, 24, 0.1), transparent 38%),
            #070707;
        }

        .about-brand-card > div:first-child,
        .about-careers-inner > div:first-child {
          max-width: 760px;
        }

        .about-brand-mark {
          min-width: 260px;
          text-align: center;
        }

        .about-brand-mark strong {
          display: block;
          color: #f2eee5;
          font-family: Georgia, serif;
          font-size: 48px;
          letter-spacing: 0.12em;
        }

        .about-brand-mark span {
          display: block;
          margin-top: 12px;
          color: #d6a21d;
          font-size: 10px;
          letter-spacing: 0.25em;
        }

        .about-careers {
          padding-bottom: 120px;
        }

        @media (max-width: 1050px) {
          .about-shell {
            width: min(100% - 48px, 1000px);
          }

          .about-hero-grid,
          .about-section-grid,
          .about-tech-grid {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .about-pillar-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .about-vision-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .about-shell {
            width: calc(100% - 34px);
          }

          .about-hero-grid {
            min-height: auto;
            padding: 40px 0 65px;
          }

          .about-hero-copy h1 {
            font-size: 54px;
          }

          .about-hero-card {
            min-height: 360px;
          }

          .about-story,
          .about-pillars,
          .about-tech,
          .about-vision,
          .about-brand,
          .about-careers {
            padding: 65px 0;
          }

          .about-pillar-grid {
            grid-template-columns: 1fr;
          }

          .about-section-grid h2,
          .about-heading-row h2,
          .about-tech-copy h2,
          .about-brand-card h2,
          .about-careers-inner h2 {
            font-size: 36px;
          }

          .about-vision-block {
            padding: 30px;
          }

          .about-brand-card,
          .about-careers-inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px;
          }

          .about-brand-mark {
            min-width: 0;
            text-align: left;
          }

          .about-actions {
            flex-direction: column;
          }

          .about-primary-btn,
          .about-secondary-btn {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
