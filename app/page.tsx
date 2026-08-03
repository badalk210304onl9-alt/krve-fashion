import Link from "next/link";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

const experienceItems = [
  {
    number: "01",
    title: "Precision Fit",
    text: "Intelligent sizing calibrated around your proportions.",
  },
  {
    number: "02",
    title: "Private Styling",
    text: "A personal wardrobe direction shaped around your identity.",
  },
  {
    number: "03",
    title: "Virtual Try-On",
    text: "Preview silhouettes before you commit to the final look.",
  },
];

export default function HomePage() {
  return (
    <main className="krve-home">
      <section className="krve-hero">
        <div className="krve-hero-dark">
          <div className="krve-hero-brandline">
            <span className="krve-monogram">K</span>
            <div>
              <strong>KRVE</strong>
              <small>The Fashion Studio</small>
            </div>
          </div>

          <div className="krve-hero-copy">
            <div className="krve-pill">✦ Private Fashion House</div>
            <p className="krve-kicker">Autumn / Winter 2026</p>
            <h1>
              Fashion that feels
              <span>entirely yours.</span>
            </h1>
            <p className="krve-intro">
              Luxury tailoring, intelligent fit and personal styling—brought
              together in one refined fashion experience.
            </p>

            <div className="krve-hero-actions">
              <Link className="krve-btn krve-btn-gold" href="/collections">
                Explore the Collection <span>→</span>
              </Link>
              <Link className="krve-btn krve-btn-outline" href="/virtual-try-on">
                Enter Virtual Studio
              </Link>
            </div>
          </div>

          <div className="krve-hero-metrics">
            <div>
              <span>01</span>
              <strong>Made for your proportions</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Curated luxury wardrobe</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Private digital fitting</strong>
            </div>
          </div>
        </div>

        <div className="krve-hero-light">
          <div className="krve-studio-card">
            <div className="krve-card-topline">
              <span className="krve-status-dot" />
              Private Styling Suite
              <span className="krve-card-code">KRVE / 26</span>
            </div>

            <div className="krve-look-frame">
              <div className="krve-look-glow" />
              <div className="krve-tailored-figure">
                <span className="krve-head" />
                <span className="krve-shoulders" />
                <span className="krve-jacket" />
                <span className="krve-leg krve-leg-left" />
                <span className="krve-leg krve-leg-right" />
              </div>
              <div className="krve-scan-line" />
              <div className="krve-frame-label">Digital Fit Profile</div>
            </div>

            <div className="krve-studio-copy">
              <p>Personal Styling Session</p>
              <h2>Your silhouette, refined.</h2>
              <p>
                Discover pieces selected for your proportions, preferences and
                presence.
              </p>
            </div>

            <div className="krve-studio-actions">
              <Link href="/virtual-try-on">Begin fitting</Link>
              <Link href="/account">Client account</Link>
            </div>
          </div>

          <div className="krve-floating-note krve-note-one">
            <span>Fit Profile</span>
            <strong>Precision ready</strong>
          </div>
          <div className="krve-floating-note krve-note-two">
            <span>Private Edit</span>
            <strong>Curated for you</strong>
          </div>
        </div>
      </section>

      <section className="krve-experience-strip">
        {experienceItems.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="krve-editorial-section">
        <div className="krve-section-header">
          <div>
            <p className="krve-kicker krve-kicker-dark">The KRVE Edit</p>
            <h2>Quiet luxury. Strong presence.</h2>
          </div>
          <Link href="/collections">View all pieces →</Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="krve-private-section">
        <div className="krve-private-copy">
          <p className="krve-kicker">The House of KRVE</p>
          <h2>Designed around the person, not the mannequin.</h2>
          <p>
            Every KRVE experience begins with who you are—your body, your
            ambition and the impression you choose to leave.
          </p>
          <Link className="krve-btn krve-btn-gold" href="/virtual-try-on">
            Create My Digital Twin <span>→</span>
          </Link>
        </div>
        <div className="krve-private-art">
          <div className="krve-art-card krve-art-card-one">
            <span>Tailoring</span>
            <strong>Built with intention</strong>
          </div>
          <div className="krve-art-card krve-art-card-two">
            <span>Technology</span>
            <strong>Made invisible</strong>
          </div>
          <div className="krve-gold-orbit" />
        </div>
      </section>
    </main>
  );
}
