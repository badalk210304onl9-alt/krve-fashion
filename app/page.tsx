import Link from "next/link";

const trustItems = [
  ["◇", "PREMIUM QUALITY", "Finest Materials"],
  ["✺", "100% ORIGINAL", "Authentic Products"],
  ["▱", "FREE SHIPPING", "Across India"],
  ["↺", "EASY RETURNS", "15 Days Return"],
  ["♢", "SECURE PAYMENTS", "100% Safe & Secure"],
];

const collections = [
  { title: "MEN", subtitle: "COLLECTION", href: "/collections?category=Men", image: "/images/men.jpg" },
  { title: "WOMEN", subtitle: "COLLECTION", href: "/collections?category=Women", image: "/images/women.jpg" },
  { title: "ACCESSORIES", subtitle: "COLLECTION", href: "/collections?category=Accessories", image: "/images/accessories.jpg" },
  { title: "SALE", subtitle: "UP TO 50% OFF", href: "/collections?sale=true", image: "/images/sale.jpg" },
];

export default function HomePage() {
  return (
    <main className="krve-home">
      <section className="reference-hero">
        <div className="hero-copy">
          <div className="eyebrow"><i /> TIMELESS STYLE. MODERN LUXURY. <i /></div>
          <h1>
            <span>CRAFTED TO INSPIRE.</span>
            <em>MADE TO LAST.</em>
          </h1>
          <div className="ornament"><i /><b>◇</b><i /></div>
          <p>
            Elevate every moment with designs that define elegance,
            crafted for those who value quality and individuality.
          </p>
          <div className="hero-buttons">
            <Link className="primary" href="/collections">SHOP NOW <span>→</span></Link>
            <Link className="secondary" href="/collections">EXPLORE COLLECTION</Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true" />

        <div className="brand-plaque" aria-label="KRVE brand">
          <div className="crown">♛</div>
          <strong>KRVE</strong>
          <small>— THE FASHION STUDIO —</small>
          <span>MOVE INTO STYLE</span>
          <i />
        </div>
      </section>

      <section className="trust-bar">
        {trustItems.map(([icon, title, text]) => (
          <div className="trust-item" key={title}>
            <span className="trust-icon">{icon}</span>
            <div><strong>{title}</strong><small>{text}</small></div>
          </div>
        ))}
      </section>

      <section className="collection-section">
        <div className="section-title"><i /><h2>SHOP BY COLLECTION</h2><i /></div>
        <div className="section-ornament">◇</div>
        <div className="collection-grid">
          {collections.map((item) => (
            <Link
              className="collection-card"
              key={item.title}
              href={item.href}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="shade" />
              <span className="corner tl" />
              <span className="corner tr" />
              <div className="card-copy">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <span>EXPLORE →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
