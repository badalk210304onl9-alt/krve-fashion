import Link from "next/link";

const menSizes = [
  { size: "XS", chest: "34–36", waist: "28–30", shoulder: "16–17", length: "26–27" },
  { size: "S", chest: "36–38", waist: "30–32", shoulder: "17–18", length: "27–28" },
  { size: "M", chest: "38–40", waist: "32–34", shoulder: "18–19", length: "28–29" },
  { size: "L", chest: "40–42", waist: "34–36", shoulder: "19–20", length: "29–30" },
  { size: "XL", chest: "42–44", waist: "36–38", shoulder: "20–21", length: "30–31" },
  { size: "XXL", chest: "44–46", waist: "38–40", shoulder: "21–22", length: "31–32" },
];

const womenSizes = [
  { size: "XS", bust: "30–32", waist: "24–26", hip: "34–36", length: "24–25" },
  { size: "S", bust: "32–34", waist: "26–28", hip: "36–38", length: "25–26" },
  { size: "M", bust: "34–36", waist: "28–30", hip: "38–40", length: "26–27" },
  { size: "L", bust: "36–38", waist: "30–32", hip: "40–42", length: "27–28" },
  { size: "XL", bust: "38–40", waist: "32–34", hip: "42–44", length: "28–29" },
  { size: "XXL", bust: "40–42", waist: "34–36", hip: "44–46", length: "29–30" },
];

const kidsSizes = [
  { size: "2–3Y", height: "92–98", chest: "20–21", waist: "19–20" },
  { size: "4–5Y", height: "104–110", chest: "22–23", waist: "20–21" },
  { size: "6–7Y", height: "116–122", chest: "24–25", waist: "21–22" },
  { size: "8–9Y", height: "128–134", chest: "26–27", waist: "22–23" },
  { size: "10–11Y", height: "140–146", chest: "28–29", waist: "23–24" },
  { size: "12–13Y", height: "152–158", chest: "30–31", waist: "24–25" },
];

export default function SizeGuidePage() {
  return (
    <main className="sizePage">
      <section className="sizeHero">
        <div className="sizeContainer">
          <Link href="/" className="sizeBack">
            ← BACK TO KRVÉ
          </Link>

          <p className="sizeEyebrow">FIT & SIZING</p>

          <h1>
            Find Your
            <br />
            <span>Perfect Fit.</span>
          </h1>

          <p className="sizeLead">
            Use the KRVÉ size guide to choose the best fit for your body and
            preferred silhouette. Measurements are provided as a general guide
            and may vary slightly by product style and construction.
          </p>
        </div>
      </section>

      <section className="sizeContent">
        <div className="sizeContainer">
          <div className="sizeIntroGrid">
            <div>
              <p className="sizeSmall">HOW TO MEASURE</p>
              <h2>Measure once. Choose with confidence.</h2>
            </div>

            <div className="sizeIntroText">
              <p>
                Use a flexible measuring tape and keep it comfortably close to
                the body without pulling too tightly.
              </p>

              <p>
                For oversized styles, you may choose your usual size for a
                relaxed fit or size down for a more structured silhouette.
              </p>
            </div>
          </div>

          <div className="measureGrid">
            <article>
              <span>01</span>
              <h3>Chest / Bust</h3>
              <p>
                Measure around the fullest part of your chest or bust while
                keeping the tape level.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Waist</h3>
              <p>
                Measure around your natural waistline without holding your
                breath or pulling the tape tightly.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Hip</h3>
              <p>
                Measure around the fullest part of your hips while standing
                naturally.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Shoulder</h3>
              <p>
                Measure from one shoulder edge to the other across the upper
                back.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="tableSection">
        <div className="sizeContainer">
          <div className="tableHeader">
            <div>
              <p className="sizeSmall">MEN</p>
              <h2>Menswear Size Guide</h2>
            </div>

            <span>Measurements in inches</span>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Shoulder</th>
                  <th>Length</th>
                </tr>
              </thead>

              <tbody>
                {menSizes.map((item) => (
                  <tr key={item.size}>
                    <td>{item.size}</td>
                    <td>{item.chest}</td>
                    <td>{item.waist}</td>
                    <td>{item.shoulder}</td>
                    <td>{item.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="tableSection">
        <div className="sizeContainer">
          <div className="tableHeader">
            <div>
              <p className="sizeSmall">WOMEN</p>
              <h2>Womenswear Size Guide</h2>
            </div>

            <span>Measurements in inches</span>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hip</th>
                  <th>Length</th>
                </tr>
              </thead>

              <tbody>
                {womenSizes.map((item) => (
                  <tr key={item.size}>
                    <td>{item.size}</td>
                    <td>{item.bust}</td>
                    <td>{item.waist}</td>
                    <td>{item.hip}</td>
                    <td>{item.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="tableSection">
        <div className="sizeContainer">
          <div className="tableHeader">
            <div>
              <p className="sizeSmall">KIDS</p>
              <h2>Kidswear Size Guide</h2>
            </div>

            <span>Height in cm • Other measurements in inches</span>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Age / Size</th>
                  <th>Height</th>
                  <th>Chest</th>
                  <th>Waist</th>
                </tr>
              </thead>

              <tbody>
                {kidsSizes.map((item) => (
                  <tr key={item.size}>
                    <td>{item.size}</td>
                    <td>{item.height}</td>
                    <td>{item.chest}</td>
                    <td>{item.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="fitSection">
        <div className="sizeContainer">
          <div className="fitGrid">
            <div>
              <p className="sizeSmall">FIT NOTES</p>

              <h2>
                KRVÉ Oversized
                <span> Fit.</span>
              </h2>

              <p>
                Many KRVÉ T-shirts are designed with a relaxed silhouette,
                dropped shoulders and additional room through the body.
              </p>
            </div>

            <div className="fitNotes">
              <article>
                <strong>TRUE OVERSIZED LOOK</strong>
                <p>Choose your regular size.</p>
              </article>

              <article>
                <strong>SLIGHTLY RELAXED LOOK</strong>
                <p>Choose one size smaller.</p>
              </article>

              <article>
                <strong>BETWEEN TWO SIZES?</strong>
                <p>
                  Choose based on your preferred silhouette rather than only
                  body measurement.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="sizeHelp">
        <div className="sizeContainer">
          <div className="sizeHelpCard">
            <div>
              <p className="sizeSmall">NEED HELP?</p>

              <h2>Still unsure about your size?</h2>

              <p>
                Contact KRVÉ Customer Care and share the product name along with
                your usual size for assistance.
              </p>
            </div>

            <Link href="/contact">
              CONTACT US
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .sizePage {
          min-height: 100vh;
          background: #040404;
          color: #f2eee6;
        }

        .sizeContainer {
          width: min(1360px, calc(100% - 80px));
          margin: 0 auto;
        }

        .sizeHero {
          padding: 65px 0 90px;
          border-bottom: 1px solid rgba(216, 163, 27, 0.28);
          background:
            radial-gradient(
              circle at 82% 35%,
              rgba(218, 166, 28, 0.09),
              transparent 30%
            ),
            #050505;
        }

        .sizeBack {
          color: #969087;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .sizeEyebrow,
        .sizeSmall {
          margin: 65px 0 18px;
          color: #dda91e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .sizeHero h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(56px, 7vw, 92px);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.045em;
        }

        .sizeHero h1 span {
          color: #dda91e;
        }

        .sizeLead {
          max-width: 760px;
          margin: 30px 0 0;
          color: #a09b92;
          font-size: 15px;
          line-height: 1.85;
        }

        .sizeContent {
          padding: 90px 0;
          border-bottom: 1px solid #232323;
        }

        .sizeIntroGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 90px;
        }

        .sizeIntroGrid .sizeSmall {
          margin-top: 0;
        }

        .sizeIntroGrid h2,
        .tableHeader h2,
        .fitGrid h2,
        .sizeHelpCard h2 {
          margin: 12px 0 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          line-height: 1.15;
        }

        .sizeIntroText p {
          color: #979289;
          font-size: 14px;
          line-height: 1.85;
          margin: 0 0 17px;
        }

        .measureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 55px;
          border-top: 1px solid #282828;
          border-left: 1px solid #282828;
        }

        .measureGrid article {
          min-height: 215px;
          padding: 28px;
          border-right: 1px solid #282828;
          border-bottom: 1px solid #282828;
        }

        .measureGrid span {
          color: #dda91e;
          font-size: 10px;
        }

        .measureGrid h3 {
          margin: 30px 0 12px;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 400;
        }

        .measureGrid p {
          color: #88847c;
          font-size: 13px;
          line-height: 1.7;
        }

        .tableSection {
          padding: 85px 0;
          border-bottom: 1px solid #222;
        }

        .tableHeader {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 35px;
        }

        .tableHeader .sizeSmall {
          margin: 0 0 10px;
        }

        .tableHeader span {
          color: #77736c;
          font-size: 11px;
        }

        .tableWrap {
          overflow-x: auto;
          border: 1px solid rgba(218, 166, 27, 0.22);
        }

        table {
          width: 100%;
          min-width: 700px;
          border-collapse: collapse;
        }

        thead {
          background: rgba(218, 166, 27, 0.06);
        }

        th {
          padding: 20px 22px;
          color: #dca81e;
          text-align: left;
          font-size: 10px;
          letter-spacing: 0.15em;
          border-bottom: 1px solid rgba(218, 166, 27, 0.22);
        }

        td {
          padding: 19px 22px;
          color: #a7a198;
          font-size: 13px;
          border-bottom: 1px solid #202020;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        td:first-child {
          color: #f0ebe2;
          font-family: Georgia, serif;
          font-size: 18px;
        }

        tbody tr:hover {
          background: rgba(218, 166, 27, 0.025);
        }

        .fitSection {
          padding: 90px 0;
          border-bottom: 1px solid #222;
          background: #070707;
        }

        .fitGrid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
        }

        .fitGrid .sizeSmall {
          margin-top: 0;
        }

        .fitGrid h2 span {
          color: #dda91e;
        }

        .fitGrid > div:first-child > p:last-child {
          max-width: 500px;
          margin-top: 25px;
          color: #969188;
          line-height: 1.85;
          font-size: 14px;
        }

        .fitNotes {
          border-top: 1px solid #292929;
        }

        .fitNotes article {
          padding: 24px 0;
          border-bottom: 1px solid #292929;
        }

        .fitNotes strong {
          color: #d9a51d;
          font-size: 10px;
          letter-spacing: 0.16em;
        }

        .fitNotes p {
          margin: 8px 0 0;
          color: #918c84;
          font-size: 13px;
          line-height: 1.7;
        }

        .sizeHelp {
          padding: 90px 0 110px;
        }

        .sizeHelpCard {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
          padding: 50px;
          border: 1px solid rgba(218, 166, 27, 0.32);
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(218, 166, 27, 0.08),
              transparent 35%
            ),
            #070707;
        }

        .sizeHelpCard .sizeSmall {
          margin: 0;
        }

        .sizeHelpCard > div > p:last-child {
          max-width: 700px;
          color: #918c84;
          font-size: 13px;
          line-height: 1.75;
        }

        .sizeHelpCard > a {
          display: inline-flex;
          min-width: 210px;
          min-height: 55px;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 0 22px;
          background: #dda91e;
          color: #050505;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        @media (max-width: 950px) {
          .sizeContainer {
            width: min(100% - 42px, 950px);
          }

          .sizeIntroGrid,
          .fitGrid {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .measureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sizeHelpCard {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .sizeContainer {
            width: calc(100% - 30px);
          }

          .sizeHero {
            padding: 40px 0 60px;
          }

          .sizeEyebrow {
            margin-top: 45px;
          }

          .sizeHero h1 {
            font-size: 50px;
          }

          .sizeContent,
          .tableSection,
          .fitSection,
          .sizeHelp {
            padding: 60px 0;
          }

          .measureGrid {
            grid-template-columns: 1fr;
          }

          .tableHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .sizeIntroGrid h2,
          .tableHeader h2,
          .fitGrid h2,
          .sizeHelpCard h2 {
            font-size: 32px;
          }

          .sizeHelpCard {
            padding: 28px;
          }

          .sizeHelpCard > a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
