
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
          <span className="krve-greeting-ornament">
            ✦
          </span>

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
            May the victory of good over evil inspire
            you always.
          </p>

          <span className="krve-greeting-ornament">
            ✦
          </span>
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
    </main>
  );
}
