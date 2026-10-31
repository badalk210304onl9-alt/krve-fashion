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
    <main className="krve-dussehra-home krve-diwali-home">

      {/* DIWALI LUXURY HERO BANNER */}
      <section
        className="krve-diwali-hero"
        aria-label="KRVE Diwali Fashion Collection"
      >
        <Link
          href="/collections"
          className="krve-diwali-hero-link"
          aria-label="Explore the KRVE Diwali collection"
        >
          <Image
            src="/images/diwali-hero.png"
            alt="KRVE Diwali luxury fashion campaign featuring festive fashion, traditional Indian attire and a special gift box"
            width={1648}
            height={928}
            priority
            sizes="100vw"
            className="krve-diwali-hero-image"
          />
        </Link>
      </section>

      {/* DIWALI BENEFITS STRIP */}
      <section
        className="benefits krve-diwali-benefits"
        aria-label="KRVE shopping benefits"
      >
        {[
          [
            "♧",
            "SPECIAL GIFT BOX",
            "For Every Customer",
          ],
          [
            "◇",
            "PREMIUM FASHION",
            "Curated Collections",
          ],
          [
            "✧",
            "EXCLUSIVE FESTIVE OFFERS",
            "Limited Time Only",
          ],
          [
            "♢",
            "SECURE SHOPPING",
            "Protected Checkout",
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

      {/* NEW ARRIVALS */}
      <section className="new-arrivals krve-festive-section">

        <div className="section-heading">
          <div>
            <h2>NEW ARRIVALS</h2>
            <small>FRESH STYLES. TIMELESS ELEGANCE.</small>
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

          {/* AI VIRTUAL TRY-ON */}
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
                alt="KRVE AI virtual try-on studio"
                fill
                sizes="(max-width: 900px) 100vw, 380px"
              />
            </div>
          </article>

        </div>
      </section>

      {/* BRAND EXPERIENCE STRIP */}
      <section className="bottom-strip krve-festive-section">
        {[
          [
            "◈",
            "EXCLUSIVE COLLECTIONS",
            "Unique & Limited Designs",
          ],
          [
            "◇",
            "LUXURY MATERIALS",
            "Premium Quality",
          ],
          [
            "✤",
            "CRAFTED TO PERFECTION",
            "Attention to Every Detail",
          ],
          [
            "♙",
            "MORE THAN FASHION",
            "IT'S KRVE.",
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
