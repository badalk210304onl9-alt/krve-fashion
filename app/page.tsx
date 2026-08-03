import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

const virtues = [
  ["01", "Private Fit", "Body-aware recommendations shaped around you."],
  ["02", "Modern Craft", "Quiet luxury, precise cuts and considered materials."],
  ["03", "Digital Atelier", "Visualise every look before it enters your wardrobe."],
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="couture-hero">
        <div className="couture-hero__media">
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=2200&q=92"
            alt="KRVE tailored menswear"
            fill
            priority
            sizes="100vw"
            className="couture-hero__image"
          />
          <div className="couture-hero__veil" />
        </div>

        <div className="couture-hero__content">
          <div className="hero-index">KRVE / 01 — PRIVATE COLLECTION</div>
          <p className="eyebrow">The House of Intelligent Tailoring</p>
          <h1>
            Designed to be
            <span>remembered.</span>
          </h1>
          <p className="hero-copy">
            An elevated fashion experience where precision tailoring, personal identity
            and intelligent fit become one.
          </p>
          <div className="hero-actions">
            <Link className="luxury-button luxury-button--light" href="/collections">
              Enter the Collection
            </Link>
            <Link className="text-link text-link--light" href="/virtual-try-on">
              Discover Virtual Try-On <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-signature">
          <span>KRVE</span>
          <small>THE FASHION STUDIO</small>
        </div>

        <div className="hero-scroll">SCROLL TO DISCOVER</div>
      </section>

      <section className="house-statement">
        <div className="house-statement__number">EST. 2026</div>
        <div className="house-statement__copy">
          <p className="eyebrow eyebrow--dark">A New Language of Luxury</p>
          <h2>
            The finest wardrobe is not chosen for you.
            <em>It is built around you.</em>
          </h2>
        </div>
        <p className="house-statement__aside">
          KRVE brings together refined silhouettes, intelligent measurements and a
          private digital atelier to create a wardrobe with presence.
        </p>
      </section>

      <section className="collection-feature">
        <div className="collection-feature__media">
          <Image
            src="https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1800&q=90"
            alt="KRVE evening tailoring"
            fill
            sizes="(max-width: 900px) 100vw, 62vw"
            className="cover"
          />
          <div className="image-caption">THE NOIR EDIT — 2026</div>
        </div>
        <div className="collection-feature__content">
          <p className="eyebrow">Noir, Reimagined</p>
          <h2>Tailoring with quiet authority.</h2>
          <p>
            Sculpted shoulders. Fluid structure. A restrained palette. Every piece is
            designed to feel timeless without ever feeling familiar.
          </p>
          <Link className="luxury-button luxury-button--outline" href="/collections?category=Tailoring">
            Explore Tailoring
          </Link>
        </div>
      </section>

      <section className="new-edit section-shell">
        <div className="section-heading section-heading--editorial">
          <div>
            <p className="eyebrow eyebrow--dark">The New Edit</p>
            <h2>Objects of distinction.</h2>
          </div>
          <Link className="text-link" href="/collections">
            View the full collection <span>↗</span>
          </Link>
        </div>
        <div className="product-grid product-grid--luxury">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="digital-atelier">
        <div className="digital-atelier__content">
          <p className="eyebrow">KRVE Digital Atelier</p>
          <h2>Try the future on.</h2>
          <p>
            Create your digital twin, discover your most precise fit and experience
            every garment before it reaches your wardrobe.
          </p>
          <div className="atelier-steps">
            <span><b>01</b> Scan your silhouette</span>
            <span><b>02</b> Build your digital twin</span>
            <span><b>03</b> Curate your private wardrobe</span>
          </div>
          <Link className="luxury-button luxury-button--light" href="/virtual-try-on">
            Begin the Experience
          </Link>
        </div>
        <div className="digital-atelier__visual">
          <div className="atelier-frame">
            <div className="atelier-orbit atelier-orbit--one" />
            <div className="atelier-orbit atelier-orbit--two" />
            <div className="atelier-silhouette">
              <span>K</span>
            </div>
            <div className="atelier-marker atelier-marker--top">SHOULDER / 46.2</div>
            <div className="atelier-marker atelier-marker--mid">CHEST / 39.1</div>
            <div className="atelier-marker atelier-marker--bottom">FIT PROFILE / SIGNATURE</div>
          </div>
        </div>
      </section>

      <section className="house-virtues">
        {virtues.map(([index, title, copy]) => (
          <article key={index}>
            <span>{index}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="private-appointment">
        <div className="private-appointment__image">
          <Image
            src="https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=2000&q=90"
            alt="KRVE private styling appointment"
            fill
            sizes="100vw"
            className="cover"
          />
          <div className="private-appointment__overlay" />
        </div>
        <div className="private-appointment__content">
          <p className="eyebrow">Private Client Service</p>
          <h2>Your wardrobe, considered in private.</h2>
          <p>
            Create a KRVE account to save your fit, curate your wishlist and receive
            personalised recommendations from the house.
          </p>
          <Link className="luxury-button luxury-button--light" href="/account">
            Request Access
          </Link>
        </div>
      </section>
    </main>
  );
}
