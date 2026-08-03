import Link from "next/link";

const collections = [
  {
    title: "MEN",
    subtitle: "COLLECTION",
    href: "/collections?category=Men",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=92",
  },
  {
    title: "WOMEN",
    subtitle: "COLLECTION",
    href: "/collections?category=Women",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=92",
  },
  {
    title: "ACCESSORIES",
    subtitle: "COLLECTION",
    href: "/collections?category=Accessories",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=92",
  },
  {
    title: "SALE",
    subtitle: "UP TO 50% OFF",
    href: "/collections?sale=true",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=92",
  },
];

const trustItems = [
  ["◇", "PREMIUM QUALITY", "Finest Materials"],
  ["✺", "100% ORIGINAL", "Authentic Products"],
  ["▱", "FREE SHIPPING", "Across India"],
  ["↺", "EASY RETURNS", "15 Days Return"],
  ["♢", "SECURE PAYMENTS", "100% Safe & Secure"],
];

export default function HomePage() {
  return (
    <main>
      <section className="krveHero">
        <div className="krveHeroCopy">
          <div className="krveEyebrow">
            <span />
            <b>TIMELESS STYLE. MODERN LUXURY.</b>
            <span />
          </div>

          <h1>
            <span>CRAFTED TO INSPIRE.</span>
            <em>MADE TO LAST.</em>
          </h1>

          <div className="krveOrnament">
            <span />
            <b>◇</b>
            <span />
          </div>

          <p>
            Elevate every moment with designs that define elegance, crafted
            for those who value quality and individuality.
          </p>

          <div className="krveHeroButtons">
            <Link className="krvePrimaryButton" href="/collections">
              SHOP NOW <span>→</span>
            </Link>
            <Link className="krveOutlineButton" href="/collections">
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>

        <div className="krveHeroModel" />

        <div className="krveHeroBrandPanel">
          <div className="krvePanelCrown">♛</div>
          <strong>KRVE</strong>
          <small>— THE FASHION STUDIO —</small>
          <span>MOVE INTO STYLE</span>
          <i />
        </div>
      </section>

      <section className="krveTrustBar">
        {trustItems.map(([icon, title, text]) => (
          <div className="krveTrustItem" key={title}>
            <div className="krveTrustIcon">{icon}</div>
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="krveCollections">
        <div className="krveSectionTitle">
          <span />
          <h2>SHOP BY COLLECTION</h2>
          <span />
        </div>
        <div className="krveSectionMark">◇</div>

        <div className="krveCollectionGrid">
          {collections.map((item) => (
            <Link
              href={item.href}
              className="krveCollectionCard"
              key={item.title}
              style={{ backgroundImage: `url("${item.image}")` }}
            >
              <div className="krveCardShade" />
              <div className="krveCardCorner left" />
              <div className="krveCardCorner right" />
              <div className="krveCollectionText">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <span>EXPLORE &nbsp;→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
