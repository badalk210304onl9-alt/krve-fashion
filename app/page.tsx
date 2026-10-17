import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";
import type { Product } from "@/lib/catalog";

import "./dussehra.css";
import "./product-carousel.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KRVE — The Fashion Studio",
  description:
    "Discover distinctive fashion, signature styles and personal styling at KRVE.",
};

async function loadNewArrivals(): Promise<KrveProduct[]> {
  try {
    const products = await getNewArrivalProducts(8);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("KRVE product loading error:", error);
    return [];
  }
}

function CategorySection() {
  const categories = [
    {
      title: "MEN",
      subtitle: "TIMELESS ESSENTIALS",
      image: "/images/hero-model.jpg",
    },
    {
      title: "WOMEN",
      subtitle: "MODERN EXPRESSION",
      image: "/images/try-on.jpg",
    },
    {
      title: "STREETWEAR",
      subtitle: "MAKE YOUR STATEMENT",
      image: "/images/hero-model.jpg",
    },
    {
      title: "ACCESSORIES",
      subtitle: "THE FINISHING TOUCH",
      image: "/images/crest.jpg",
    },
  ];

  return (
    <section className="krve-section krve-categories">
      <div className="krve-section-heading">
        <span className="krve-eyebrow">FIND YOUR SIGNATURE</span>
        <h2>
          SHOP BY <span>CATEGORY</span>
        </h2>
        <p>Distinct styles. One signature identity.</p>
      </div>

      <div className="krve-category-grid">
        {categories.map((category) => (
          <Link
            href="/collections"
            className="krve-category-card"
            key={category.title}
          >
            <Image
              src={category.image}
              alt={`${category.title} collection`}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
            />

            <span className="krve-category-overlay" />

            <div className="krve-category-text">
              <span>{category.subtitle}</span>
              <h3>{category.title}</h3>
              <b>EXPLORE COLLECTION ↗</b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EditorialSection() {
  return (
    <section className="krve-editorial">
      <div className="krve-editorial-photo">
        <Image
          src="/images/hero-model.jpg"
          alt="KRVE fashion campaign"
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>

      <div className="krve-editorial-copy">
        <span className="krve-eyebrow">THE KRVE EDIT</span>

        <h2>
          MORE THAN
          <br />
          FASHION.
          <br />
          <span>IT&apos;S KRVE.</span>
        </h2>

        <div className="krve-gold-rule" />

        <p>
          Style is more than what you wear. It is how you express
          yourself. Discover distinctive designs and a look that
          feels unmistakably yours.
        </p>

        <Link href="/collections" className="krve-button">
          EXPLORE THE COLLECTION <span>↗</span>
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const products = await loadNewArrivals();

  return (
    <main className="krve-premium-page">
      {/* Hero */}
      <section className="krve-hero">
        <div className="krve-hero-copy">
          <span className="krve-eyebrow">
            THE ART OF EVERYDAY STYLE
          </span>

          <h1>
            FASHION THAT
            <br />
            <span>UNDERSTANDS YOU.</span>
          </h1>

          <p>
            Modern styles. Distinctive details. A signature look
            that feels like you.
          </p>

          <div className="krve-hero-buttons">
            <Link href="/collections" className="krve-button">
              SHOP COLLECTIONS <span>↗</span>
            </Link>

            <Link
              href="/virtual-try-on"
              className="krve-button krve-button-outline"
            >
              VIRTUAL TRY-ON <span>✦</span>
            </Link>
          </div>

          <span className="krve-hero-caption">
            CONFIDENCE, WORN YOUR WAY.
          </span>
        </div>

        <div className="krve-hero-photo">
          <Image
            src="/images/hero-model.jpg"
            alt="KRVE contemporary fashion"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>
      </section>

      {/* Brand introduction */}
      <section className="krve-brand-intro">
        <span>DESIGNED FOR YOUR POINT OF VIEW</span>
        <p>
          Your style. Your identity. <strong>Your KRVE.</strong>
        </p>
      </section>

      {/* Categories */}
      <CategorySection />

      {/* New arrivals */}
      <section className="krve-section krve-arrivals">
        <div className="krve-arrivals-heading">
          <div>
            <span className="krve-eyebrow">JUST DISCOVERED</span>
            <h2>NEW ARRIVALS</h2>
            <p>Fresh styles. Your next favourite.</p>
          </div>

          <Link href="/collections" className="krve-text-link">
            VIEW ALL ↗
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="krve-product-grid">
            {products.slice(0, 4).map((product) => (
              <div className="krve-product-item" key={product.id}>
                <ProductCard product={product as Product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="krve-empty-state">
            <h3>The next edit is coming.</h3>
            <p>Explore our collection to discover your style.</p>
            <Link href="/collections" className="krve-button">
              EXPLORE COLLECTIONS ↗
            </Link>
          </div>
        )}
      </section>

      {/* Editorial */}
      <EditorialSection />

      {/* Virtual try-on */}
      <section className="krve-tryon">
        <div className="krve-tryon-photo">
          <Image
            src="/images/try-on.jpg"
            alt="KRVE virtual styling experience"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>

        <div className="krve-tryon-copy">
          <span className="krve-eyebrow">
            STYLE MEETS TECHNOLOGY
          </span>

          <h2>
            YOUR STYLE.
            <br />
            <span>YOUR VISION.</span>
          </h2>

          <p>
            Explore a new way to discover your look with KRVE
            Virtual Try-On.
          </p>

          <Link href="/virtual-try-on" className="krve-button">
            TRY IT YOURSELF ↗
          </Link>
        </div>
      </section>

      {/* Closing statement */}
      <section className="krve-closing">
        <span className="krve-eyebrow">THE KRVE PHILOSOPHY</span>
        <h2>
          WEAR YOUR <span>CONFIDENCE.</span>
        </h2>
        <p>Not just another look. Your own point of view.</p>
        <Link href="/collections" className="krve-text-link">
          FIND YOUR STYLE ↗
        </Link>
      </section>
    </main>
  );
}
