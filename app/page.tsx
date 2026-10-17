import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/product-card";
import FestivalTheme from "@/components/festival-theme";

import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";

import type { Product } from "@/lib/catalog";

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

async function loadNewArrivals() {
  try {
    const products = await getNewArrivalProducts(4);
    return products.map(convertToProductCardProduct);
  } catch (error) {
    console.error("HOME_NEW_ARRIVALS_ERROR", error);
    return [];
  }
}

export default async function HomePage() {
  const newArrivalProducts = await loadNewArrivals();

  return (
    <main className="krve-dussehra-home">
      {/* Festival effects remain separate from the page layout. */}
      <FestivalTheme />

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
            <Link
              href="/collections"
              className="button solid"
            >
              EXPLORE COLLECTIONS →
            </Link>

            <Link
              href="/virtual-try-on"
              className="button ghost"
            >
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
            sizes="70vw"
          />
        </div>

        <div className="crest">
          <Image
            src="/images/crest.jpg"
            alt="KRVE crest"
            fill
            priority
            sizes="220px"
          />
        </div>

        {/* Dussehra greeting on the homepage hero */}
        <aside className="krve-dussehra-greeting">
          <span className="krve-greeting-ornament">✦</span>
          <p>THE FESTIVE EDITION</p>
          <h2>
            Happy
            <strong>Dussehra</strong>
          </h2>
          <span className="krve-greeting-divider">
            ✧ ━━━━━━━━━ ✧
          </span>
          <p className="krve-greeting-message">
            May the victory of good over evil
            inspire you always.
          </p>
          <span className="krve-greeting-ornament">✦</span>
        </aside>
      </section>

      <section className="benefits">
        {[
          [
            "◎",
            "FREE WORLDWIDE SHIPPING",
            "On all orders above $200",
          ],
          [
            "◌",
            "EASY RETURNS",
            "30-day return policy",
          ],
          [
            "♜",
            "PREMIUM QUALITY",
            "Finest materials",
          ],
          [
            "♙",
            "AI PERSONAL STYLIST",
            "Style that matches you",
          ],
          [
            "▣",
            "SECURE SHOPPING",
            "100% protected checkout",
          ],
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

          <Link href="/collections">
            VIEW ALL →
          </Link>
        </div>

        <div className="arrival-layout">
          <div className="product-grid">
            {newArrivalProducts.length > 0 ? (
              newArrivalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))
            ) : (
              <div className="homepage-products-empty">
                <span>✦</span>
                <div>
                  <strong>
                    NEW COLLECTION COMING SOON
                  </strong>

                  <p>
                    Publish a product from KEOS Center
                    with New Arrival enabled and it will
                    automatically appear here.
                  </p>

                  <Link
                    href="/collections"
                    className="button ghost"
                  >
                    EXPLORE COLLECTIONS →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <article className="tryon-card">
            <div>
              <p className="gold-label">
                AI VIRTUAL TRY-ON STUDIO
              </p>

              <h3>
                See how every look feels before you wear it.
              </h3>

              <p>
                Upload your photo and preview refined
                KRVE outfits in real time.
              </p>

              <Link
                href="/virtual-try-on"
                className="button ghost"
              >
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
          [
            "◈",
            "EXCLUSIVE COLLECTIONS",
            "Unique & limited designs",
          ],
          [
            "◇",
            "LUXURY MATERIALS",
            "Premium & sustainable",
          ],
          [
            "✤",
            "CRAFTED TO PERFECTION",
            "Attention to every detail",
          ],
          [
            "♙",
            "TRUSTED BY THOUSANDS",
            "★★★★★ 4.9/5",
          ],
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

      <style jsx global>{`
        .krve-dussehra-home {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(
              ellipse at 50% 22%,
              rgba(139, 68, 15, 0.12),
              transparent 55%
            ),
            #050403;
          color: #fff8e9;
        }

        .krve-dussehra-hero {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .krve-dussehra-glow {
          position: absolute;
          z-index: 0;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at 82% 32%,
              rgba(255, 158, 38, 0.2),
              transparent 34%
            ),
            radial-gradient(
              ellipse at 15% 85%,
              rgba(188, 78, 14, 0.15),
              transparent 40%
            );
        }

        .krve-dussehra-hero .hero-copy,
        .krve-dussehra-hero .hero-model,
        .krve-dussehra-hero .crest {
          z-index: 1;
        }

        .krve-dussehra-greeting {
          position: absolute;
          z-index: 3;
          top: 50%;
          right: 2.5%;
          width: min(19%, 270px);
          transform: translateY(-50%);
          padding: 24px 14px;
          text-align: center;
          color: #f8d67d;
          background:
            radial-gradient(
              ellipse at center,
              rgba(111, 51, 11, 0.4),
              rgba(8, 5, 3, 0.86) 75%
            );
          border: 1px solid rgba(229, 180, 72, 0.55);
          box-shadow:
            0 0 25px rgba(222, 139, 29, 0.16),
            inset 0 0 20px rgba(244, 189, 70, 0.06);
        }

        .krve-dussehra-greeting p {
          margin: 8px 0;
          font-size: 10px;
          letter-spacing: 0.13em;
        }

        .krve-dussehra-greeting h2 {
          margin: 10px 0;
          font-family: Georgia, serif;
          font-size: clamp(21px, 2.2vw, 37px);
          font-weight: 400;
          line-height: 1.1;
          text-shadow: 0 0 16px rgba(255, 181, 49, 0.3);
        }

        .krve-dussehra-greeting h2 strong {
          display: block;
          color: #ffca55;
          font-weight: 400;
        }

        .krve-greeting-ornament {
          display: block;
          font-size: 20px;
          text-shadow: 0 0 15px #e8a72d;
        }

        .krve-greeting-divider {
          display: block;
          overflow: hidden;
          font-size: 10px;
          color: #d99d36;
        }

        .krve-dussehra-greeting .krve-greeting-message {
          font-family: Georgia, serif;
          font-size: 13px;
          line-height: 1.6;
          letter-spacing: 0;
        }

        .krve-festive-section {
          position: relative;
        }

        html.krve-festival-dussehra
          .krve-dussehra-home
          .section-heading h2 {
          text-shadow: 0 0 18px rgba(226, 165, 48, 0.2);
        }

        html.krve-festival-dussehra
          .krve-dussehra-home
          .product-grid > * {
          outline: 1px solid rgba(218, 164, 60, 0.12);
          outline-offset: -1px;
        }

        @media (max-width: 1100px) {
          .krve-dussehra-greeting {
            right: 2%;
            width: 20%;
            padding: 14px 8px;
          }

          .krve-dussehra-greeting p {
            font-size: 9px;
          }

          .krve-dussehra-greeting .krve-greeting-message {
            font-size: 11px;
          }
        }

        @media (max-width: 760px) {
          .krve-dussehra-greeting {
            position: relative;
            top: auto;
            right: auto;
            width: calc(100% - 32px);
            margin: 16px;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-dussehra-home *,
          .krve-dussehra-home *::before,
          .krve-dussehra-home *::after {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
