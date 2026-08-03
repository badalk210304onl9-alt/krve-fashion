import Image from "next/image";
import Link from "next/link";

const hotspots = [
  { href: "/", label: "Home", className: "hs-home" },
  { href: "/collections", label: "Collections", className: "hs-collections" },
  { href: "/collections?category=Men", label: "Men", className: "hs-men" },
  { href: "/collections?category=Women", label: "Women", className: "hs-women" },
  { href: "/collections?category=Accessories", label: "Accessories", className: "hs-accessories" },
  { href: "/collections?sale=true", label: "Sale", className: "hs-sale" },
  { href: "/collections", label: "Shop now", className: "hs-shop" },
  { href: "/collections", label: "Explore collection", className: "hs-explore" },
  { href: "/collections?category=Men", label: "Men collection", className: "hs-card-men" },
  { href: "/collections?category=Women", label: "Women collection", className: "hs-card-women" },
  { href: "/collections?category=Accessories", label: "Accessories collection", className: "hs-card-accessories" },
  { href: "/collections?sale=true", label: "Sale collection", className: "hs-card-sale" },
  { href: "/wishlist", label: "Wishlist", className: "hs-wishlist" },
  { href: "/cart", label: "Bag", className: "hs-bag" },
  { href: "/account", label: "Account", className: "hs-account" },
  { href: "/virtual-try-on", label: "Virtual Try-On", className: "hs-virtual" },
];

export default function HomePage() {
  return (
    <main className="exact-home">
      <section className="exact-desktop-stage" aria-label="KRVE luxury homepage">
        <div className="exact-artboard">
          <Image
            src="/krve-home-reference.png"
            alt="KRVE luxury fashion homepage"
            fill
            priority
            sizes="100vw"
            className="exact-reference-image"
          />

          {hotspots.map((item) => (
            <Link
              key={item.className}
              href={item.href}
              aria-label={item.label}
              className={`exact-hotspot ${item.className}`}
            />
          ))}
        </div>
      </section>

      <section className="exact-mobile-stage">
        <div className="mobile-brand">
          <span>♛</span>
          <strong>KRVE</strong>
          <small>THE FASHION STUDIO</small>
        </div>

        <div className="mobile-hero">
          <div className="mobile-copy">
            <p>TIMELESS STYLE. MODERN LUXURY.</p>
            <h1>
              CRAFTED TO INSPIRE.
              <em>MADE TO LAST.</em>
            </h1>
            <span>
              Elevate every moment with designs that define elegance.
            </span>
            <div>
              <Link href="/collections">SHOP NOW</Link>
              <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
            </div>
          </div>
        </div>

        <div className="mobile-collections">
          <Link href="/collections?category=Men">MEN</Link>
          <Link href="/collections?category=Women">WOMEN</Link>
          <Link href="/collections?category=Accessories">ACCESSORIES</Link>
          <Link href="/collections?sale=true">SALE</Link>
        </div>
      </section>
    </main>
  );
}
