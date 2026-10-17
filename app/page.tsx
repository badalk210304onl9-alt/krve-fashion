import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/product-card";

import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";

import type { Product } from "@/lib/catalog";

import "./dussehra.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KRVE — The Fashion Studio",
  description:
    "Luxury fashion, intelligent fit and AI-powered personal styling.",
};

function convertToProductCardProduct(
  product: KrveProduct,
): Product {
  const image =
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg";

  return {
    id: product.slug || product.id,
    slug: product.slug || product.id,
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
    description:
      product.description ||
      product.shortDescription ||
      "A refined piece from the KRVE private collection.",
    shortDescription:
      product.shortDescription ||
      product.description ||
      "A refined piece from the KRVE private collection.",
    sizes: product.sizes || [],
    colours: product.colours || [],
    sku: product.sku,
    stockQuantity: product.stockQuantity,
    inStock: product.inStock,
    featured: product.featured,
    newArrival: product.newArrival,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

async function loadNewArrivals(): Promise<Product[]> {
  try {
    const products = await getNewArrivalProducts(8);
    return products.map(convertToProductCardProduct);
  } catch (error) {
    console.error("HOME_NEW_ARRIVALS_ERROR", error);
    return [];
  }
}

function HomeProductStrip({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <section className="home-product-strip">
      <div className="home-strip-heading">
        <div>
          <span>THE KRVE EDIT</span>
          <h2>Fresh Fits. Signature Style.</h2>
        </div>

        <Link href="/collections">VIEW ALL →</Link>
      </div>

      <div className="home-strip-viewport">
        <div className="home-strip-track">
          {[...products, ...products].map((product, index) => {
            const image =
              product.image ||
              product.imageUrl ||
              product.gallery?.[0];

            const href = `/products/${product.slug || product.id}`;

            return (
              <article
                className="home-strip-card"
                key={`${product.id}-${index}`}
              >
                <Link
                  href={href}
                  className="home-strip-photo"
                  aria-label={`View ${product.name}`}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="120px"
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  ) : (
                    <span>KRVE</span>
                  )}
                </Link>

                <div className="home-strip-info">
                  <span className="home-strip-tag">
                    NEW ARRIVAL
                  </span>

                  <Link href={href} className="home-strip-name">
                    {product.name}
                  </Link>

                  <div className="home-strip-price">
                    {product.currency || "₹"}
                    {Number(product.price).toLocaleString("en-IN")}

                    {product.compareAtPrice &&
                      Number(product.compareAtPrice) >
                        Number(product.price) && (
                        <del>
                          {product.currency || "₹"}
                          {Number(product.compareAtPrice).toLocaleString(
                            "en-IN",
                          )}
                        </del>
                      )}
                  </div>

                  <Link href={href} className="home-strip-shop">
                    SHOP NOW →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .home-product-strip {
          box-sizing: border-box;
          width: 100%;
          padding: 12px 3.4% 16px;
          color: #f7f1e6;
          background: #0b0906;
          border-bottom: 1px solid #49371d;
        }

        .home-strip-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .home-strip-heading span {
          color: #d9b45e;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .home-strip-heading h2 {
          margin: 3px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(17px, 1.8vw, 23px);
          font-weight: 400;
        }

        .home-strip-heading > a {
          flex-shrink: 0;
          color: #e8c46f;
          font-size: 11px;
          text-decoration: none;
        }

        .home-strip-viewport {
          width: 100%;
          overflow: hidden;
          border: 1px solid #49371d;
          border-radius: 4px;
          background: #100d08;
        }

        .home-strip-track {
          display: flex;
          width: max-content;
          animation: home-strip-slide 36s linear infinite;
        }

        .home-strip-viewport:hover .home-strip-track {
          animation-play-state: paused;
        }

        .home-strip-card {
          display: flex;
          flex: 0 0 285px;
          width: 285px;
          height: 124px;
          min-width: 0;
          box-sizing: border-box;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-right: 1px solid #352818;
          overflow: hidden;
        }

        .home-strip-photo {
          position: relative;
          display: block;
          flex: 0 0 100px;
          width: 100px;
          height: 106px;
          overflow: hidden;
          box-sizing: border-box;
          background: #19150f;
          border: 1px solid #302517;
        }

        .home-strip-photo > span {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          color: #d9b45e;
          font-family: Georgia, serif;
        }

        .home-strip-info {
          display: flex;
          flex: 1;
          min-width: 0;
          flex-direction: column;
          align-items: flex-start;
          gap: 5px;
        }

        .home-strip-tag {
          color: #d9b45e;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .home-strip-name {
          display: -webkit-box;
          width: 100%;
          overflow: hidden;
          color: #f7f1e6;
          font-size: 12px;
          line-height: 1.35;
          text-decoration: none;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .home-strip-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 5px;
          color: #e8c46f;
          font-size: 12px;
          font-weight: 600;
        }

        .home-strip-price del {
          color: #9d9588;
          font-size: 10px;
          font-weight: 400;
        }

        .home-strip-shop {
          color: #f7f1e6;
          font-size: 9px;
          letter-spacing: 0.5px;
          text-decoration: none;
        }

        .home-strip-shop:hover {
          color: #e8c46f;
        }

        @keyframes home-strip-slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 600px) {
          .home-product-strip {
            padding: 11px 12px 14px;
          }

          .home-strip-card {
            flex-basis: 250px;
            width: 250px;
            height: 116px;
            gap: 9px;
          }

          .home-strip-photo {
            flex-basis: 88px;
            width: 88px;
            height: 98px;
          }

          .home-strip-track {
            animation-duration: 30s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-strip-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default async function HomePage() {
  const newArrivalProducts = await loadNewArrivals();

  return (
    <main className="krve-dussehra-home">
      <HomeProductStrip products={newArrivalProducts} />

      <section className="hero krve-dussehra-hero">
        <div className="hero-silk" />

        <div
          className="krve-dussehra-glow"
          aria-hidden="true"
        />

        <div className="hero-copy">
          <div className="eyebrow">
            <span />
            AI-POWERED FASHION
          </div>

          <h1>
            FASHION THAT
            <strong>UNDERSTANDS YOU</strong>
          </h1>

          <p>
            Experience the future of luxury fashion with
            AI-powered style recommendations.
          </p>

          <div className="hero-buttons">
            <Link href="/collections" className="button solid">
              EXPLORE COLLECTIONS →
            </Link>

            <Link href="/virtual-try-on" className="button ghost">
              VIRTUAL TRY-ON ✦
            </Link>
          </div>
        </div>

        <div className="hero-model">
          <Image
            src="/images/hero-model.jpg"
            alt="KRVE luxury fashion model"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 70vw"
          />
        </div>

        <div className="crest">
          <Image
            src="/images/crest.jpg"
            alt="KRVE crest"
            fill
            sizes="220px"
          />
        </div>

        <aside className="krve-dussehra-greeting">
          <span className="krve-greeting-ornament">✦</span>

          <p className="krve-greeting-eyebrow">
            THE FESTIVE EDITION
          </p>

          <h2>
            Happy
            <strong>Dussehra</strong>
          </h2>

          <span className="krve-greeting-divider">
            ✧ ━━━━━━━━━ ✧
          </span>

          <p className="krve-greeting-message">
            May the victory of good over evil inspire you always.
          </p>

          <span className="krve-greeting-ornament">✦</span>
        </aside>
      </section>

      <section className="benefits">
        {[
          ["◎", "FREE WORLDWIDE SHIPPING", "On all orders above $200"],
          ["◌", "EASY RETURNS", "30-day return policy"],
          ["♜", "PREMIUM QUALITY", "Finest materials"],
          ["♙", "AI PERSONAL STYLIST", "Style that matches you"],
          ["▣", "SECURE SHOPPING", "100% protected checkout"],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <span>{icon}</span>
            <p>
              <strong>{title}</strong>
              <small>{text}</small>
            </p>
          </div>
        ))}
      </section>

      <section className="new-arrivals krve-festive-section">
        <div className="section-heading">
          <div>
            <h2>NEW ARRIVALS</h2>
            <small>LIVE FROM KEOS CENTER</small>
          </div>

          <Link href="/collections">VIEW ALL →</Link>
        </div>

        <div className="arrival-layout">
          <div className="product-grid">
            {newArrivalProducts.length > 0 ? (
              newArrivalProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="homepage-products-empty">
                <span>✦</span>
                <div>
                  <strong>NEW COLLECTION COMING SOON</strong>
                  <p>
                    Publish a product from KEOS Center with New
                    Arrival enabled and it will automatically appear here.
                  </p>
                  <Link href="/collections" className="button ghost">
                    EXPLORE COLLECTIONS →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <article className="tryon-card">
            <div>
              <p className="gold-label">AI VIRTUAL TRY-ON STUDIO</p>

              <h3>
                See how every look feels before you wear it.
              </h3>

              <p>
                Upload your photo and preview refined KRVE outfits
                in real time.
              </p>

              <Link href="/virtual-try-on" className="button ghost">
                TRY NOW →
              </Link>
            </div>

            <div className="tryon-image">
              <Image
                src="/images/try-on.jpg"
                alt="AI virtual try-on"
                fill
                sizes="(max-width: 900px) 100vw, 380px"
              />
            </div>
          </article>
        </div>
      </section>

      <section className="bottom-strip krve-festive-section">
        {[
          ["◈", "EXCLUSIVE COLLECTIONS", "Unique & limited designs"],
          ["◇", "LUXURY MATERIALS", "Premium & sustainable"],
          ["✤", "CRAFTED TO PERFECTION", "Attention to every detail"],
          ["♙", "TRUSTED BY THOUSANDS", "★★★★★ 4.9/5"],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <span>{icon}</span>
            <p>
              <strong>{title}</strong>
              <small>{text}</small>
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
