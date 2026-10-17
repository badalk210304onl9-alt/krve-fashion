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
    "Luxury fashion, intelligent fit and AI-powered personal styling.",
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

/**
 * Keep the API product fields mapped explicitly for ProductCard.
 */
function convertToProductCardProduct(
  product: KrveProduct,
): Product {
  const image =
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency,
    image,
    imageUrl: image,
    gallery: product.gallery?.length
      ? product.gallery
      : [image],
    category: product.category,
    description: product.description,
    sizes: product.sizes,
    colours: product.colours,
    sku: product.sku,
    stockQuantity: product.stockQuantity,
    inStock: product.inStock,
    featured: product.featured,
    newArrival: product.newArrival,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  } as Product;
}

/* Original scrolling product strip */
function HomeProductStrip({
  products,
}: {
  products: KrveProduct[];
}) {
  if (!products.length) return null;

  const items = [...products.slice(0, 8), ...products.slice(0, 8)];

  return (
    <section className="bottom-strip" aria-label="The KRVE edit">
      <div className="strip-heading">
        <span>THE KRVE EDIT</span>
        <p>Fresh Fits. Signature Style.</p>
      </div>

      <div className="product-marquee">
        <div className="product-marquee-track">
          {items.map((product, index) => {
            const image =
              product.image ||
              product.imageUrl ||
              product.gallery?.[0] ||
              "/images/products/product-1.jpg";

            return (
              <Link
                className="strip-product"
                href={`/products/${product.slug || product.id}`}
                key={`${product.id}-${index}`}
              >
                <div className="strip-product-image">
                  <Image
                    src={image}
                    alt={product.name}
                    width={160}
                    height={190}
                    unoptimized
                  />
                </div>

                <div className="strip-product-info">
                  <span>{product.name}</span>
                  <strong>
                    {product.currency || "INR"}{" "}
                    {Number(product.price || 0).toLocaleString("en-IN")}
                  </strong>
                  <small>SHOP NOW →</small>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    {
      title: "SIGNATURE STYLE",
      description: "Distinctive looks for your everyday identity.",
    },
    {
      title: "THOUGHTFUL DETAILS",
      description: "Style built around the details that matter.",
    },
    {
      title: "YOUR STYLE, YOUR WAY",
      description: "Discover pieces that feel like you.",
    },
    {
      title: "VIRTUAL TRY-ON",
      description: "Explore your look with our digital styling experience.",
    },
    {
      title: "THE KRVE EXPERIENCE",
      description: "A more personal way to discover fashion.",
    },
  ];

  return (
    <section className="benefits">
      {benefits.map((benefit, index) => (
        <div className="benefit-item" key={benefit.title}>
          <span className="benefit-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default async function HomePage() {
  const products = await loadNewArrivals();
  const arrivals = products.slice(0, 4);

  return (
    <main className="krve-dussehra-home">
      {/* Original product strip */}
      <HomeProductStrip products={products} />

      {/* Original hero — Dussehra greeting intentionally removed */}
      <section className="hero krve-dussehra-hero">
        <div className="hero-silk" aria-hidden="true" />
        <div className="krve-dussehra-glow" aria-hidden="true" />

        <div className="hero-copy">
          <span className="hero-eyebrow">AI-POWERED FASHION</span>

          <h1>
            FASHION THAT
            <br />
            UNDERSTANDS YOU
          </h1>

          <p>
            Discover distinctive fashion, intelligent fit and
            a personal styling experience designed around you.
          </p>

          <div className="hero-actions">
            <Link href="/collections" className="button button-primary">
              EXPLORE COLLECTION
            </Link>

            <Link
              href="/virtual-try-on"
              className="button button-outline"
            >
              VIRTUAL TRY-ON
            </Link>
          </div>
        </div>

        <div className="hero-model">
          <Image
            src="/images/hero-model.jpg"
            alt="KRVE fashion collection"
            fill
            priority
            sizes="(max-width: 880px) 100vw, 55vw"
          />
        </div>

        <div className="crest">
          <Image
            src="/images/crest.jpg"
            alt="KRVE signature emblem"
            width={100}
            height={100}
          />
        </div>
      </section>

      {/* Original benefits section */}
      <BenefitsSection />

      {/* Original new arrivals */}
      <section className="new-arrivals page-shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE LATEST FROM KRVE</span>
            <h2>NEW ARRIVALS</h2>
            <p>Discover your next signature look.</p>
          </div>

          <Link href="/collections" className="text-link">
            VIEW ALL →
          </Link>
        </div>

        {arrivals.length > 0 ? (
          <div className="arrival-layout">
            <div className="product-grid">
              {arrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={convertToProductCardProduct(product)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-products">
            <h3>New styles are on the way.</h3>
            <p>Explore the KRVE collection in the meantime.</p>
            <Link href="/collections" className="button button-primary">
              EXPLORE COLLECTION
            </Link>
          </div>
        )}
      </section>

      {/* Original Virtual Try-On promotion */}
      <section className="tryon-card page-shell">
        <div className="tryon-image">
          <Image
            src="/images/try-on.jpg"
            alt="KRVE virtual try-on experience"
            fill
            sizes="(max-width: 880px) 100vw, 50vw"
          />
        </div>

        <div className="tryon-copy">
          <span className="section-kicker">STYLE MEETS TECHNOLOGY</span>
          <h2>
            YOUR STYLE.
            <br />
            YOUR VISION.
          </h2>
          <p>
            Discover a new way to explore your look with KRVE
            Virtual Try-On.
          </p>
          <Link href="/virtual-try-on" className="button button-primary">
            TRY VIRTUAL TRY-ON →
          </Link>
        </div>
      </section>

      {/* Original bottom highlights */}
      <section className="bottom-strip bottom-highlights">
        <div className="bottom-highlight">
          <span>01</span>
          <p>THE KRVE EDIT</p>
        </div>
        <div className="bottom-highlight">
          <span>02</span>
          <p>FRESH FITS</p>
        </div>
        <div className="bottom-highlight">
          <span>03</span>
          <p>SIGNATURE STYLE</p>
        </div>
        <div className="bottom-highlight">
          <span>04</span>
          <p>YOUR STYLE, YOUR WAY</p>
        </div>
      </section>
    </main>
  );
}
