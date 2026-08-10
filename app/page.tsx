import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/product-card";

import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";

import type {
  Product,
} from "@/lib/catalog";

export const dynamic =
  "force-dynamic";

export const metadata = {
  title:
    "KRVE — The Fashion Studio",

  description:
    "Luxury fashion, intelligent fit and AI-powered personal styling.",
};

function convertToProductCardProduct(
  product: KrveProduct,
): Product {
  return {
    id:
      product.slug ||
      product.id,

    slug:
      product.slug ||
      product.id,

    name:
      product.name,

    price:
      product.price,

    compareAtPrice:
      product.compareAtPrice,

    currency:
      product.currency,

    image:
      product.image ||
      product.imageUrl ||
      product.gallery?.[0] ||
      "/images/products/product-1.jpg",

    imageUrl:
      product.image ||
      product.imageUrl ||
      product.gallery?.[0] ||
      "/images/products/product-1.jpg",

    gallery:
      product.gallery?.length
        ? product.gallery
        : [
            product.image ||
              product.imageUrl ||
              "/images/products/product-1.jpg",
          ],

    category:
      product.category,

    description:
      product.description ||
      product.shortDescription ||
      "A refined piece from the KRVE private collection.",

    shortDescription:
      product.shortDescription ||
      product.description ||
      "A refined piece from the KRVE private collection.",

    sizes:
      product.sizes || [],

    colours:
      product.colours || [],

    sku:
      product.sku,

    stockQuantity:
      product.stockQuantity,

    inStock:
      product.inStock,

    featured:
      product.featured,

    newArrival:
      product.newArrival,

    status:
      product.status,

    createdAt:
      product.createdAt,

    updatedAt:
      product.updatedAt,
  };
}

async function loadNewArrivals() {
  try {
    const liveProducts =
      await getNewArrivalProducts(
        4,
      );

    return liveProducts.map(
      convertToProductCardProduct,
    );
  } catch (error) {
    console.error(
      "HOME_NEW_ARRIVALS_ERROR",
      error,
    );

    return [];
  }
}

export default async function HomePage() {
  const newArrivalProducts =
    await loadNewArrivals();

  return (
    <main>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span />

            AI-POWERED FASHION
          </div>

          <h1>
            FASHION THAT

            <strong>
              UNDERSTANDS YOU
            </strong>
          </h1>

          <p>
            Experience the future
            of luxury fashion with
            AI-powered style
            recommendations.
          </p>

          <div className="hero-buttons">
            <Link
              href="/collections"
              className="button solid"
            >
              EXPLORE COLLECTIONS
              →
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
      </section>

      {/* =====================================================
          RAKSHA BANDHAN SALE BANNER
      ===================================================== */}

      <section
        style={{
          background: "#050505",
          padding:
            "28px 0 32px",
          borderTop:
            "1px solid rgba(218, 165, 32, 0.35)",
          borderBottom:
            "1px solid rgba(218, 165, 32, 0.35)",
        }}
      >
        <div
          style={{
            width:
              "min(1500px, calc(100% - 32px))",

            margin:
              "0 auto",
          }}
        >
          <Link
            href="/collections"
            aria-label="Shop Raksha Bandhan Sale - Up to 60% off"
            style={{
              position:
                "relative",

              display:
                "block",

              width:
                "100%",

              aspectRatio:
                "16 / 9",

              overflow:
                "hidden",

              border:
                "1px solid rgba(220, 168, 30, 0.65)",

              background:
                "#000",

              boxShadow:
                "0 24px 70px rgba(0,0,0,0.45)",
            }}
          >
            <Image
              src="/images/raksha-bandhan-sale.png"
              alt="KRVE Raksha Bandhan Sale is live - Up to 60% off"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit:
                  "cover",

                objectPosition:
                  "center",
              }}
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          BENEFITS
      ===================================================== */}

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
        ].map(
          ([
            icon,
            title,
            text,
          ]) => (
            <div key={title}>
              <span>
                {icon}
              </span>

              <p>
                <strong>
                  {title}
                </strong>

                <small>
                  {text}
                </small>
              </p>
            </div>
          ),
        )}
      </section>

      {/* =====================================================
          NEW ARRIVALS
      ===================================================== */}

      <section className="new-arrivals">
        <div className="section-heading">
          <div>
            <h2>
              NEW ARRIVALS
            </h2>

            <small>
              LIVE FROM KEOS
              CENTER
            </small>
          </div>

          <Link href="/collections">
            VIEW ALL →
          </Link>
        </div>

        <div className="arrival-layout">
          <div className="product-grid">
            {newArrivalProducts.length >
            0 ? (
              newArrivalProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                ),
              )
            ) : (
              <div className="homepage-products-empty">
                <span>
                  ✦
                </span>

                <div>
                  <strong>
                    NEW COLLECTION
                    COMING SOON
                  </strong>

                  <p>
                    Publish a product
                    from KEOS Center
                    with New Arrival
                    enabled and it will
                    automatically appear
                    here.
                  </p>

                  <Link
                    href="/collections"
                    className="button ghost"
                  >
                    EXPLORE
                    COLLECTIONS →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <article className="tryon-card">
            <div>
              <p className="gold-label">
                AI VIRTUAL TRY-ON
                STUDIO
              </p>

              <h3>
                See how every look
                feels before you
                wear it.
              </h3>

              <p>
                Upload your photo
                and preview refined
                KRVE outfits in
                real time.
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
                sizes="
                  (max-width: 900px)
                  100vw,
                  380px
                "
              />
            </div>
          </article>
        </div>
      </section>

      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}

      <section className="bottom-strip">
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
        ].map(
          ([
            icon,
            title,
            text,
          ]) => (
            <div key={title}>
              <span>
                {icon}
              </span>

              <p>
                <strong>
                  {title}
                </strong>

                <small>
                  {text}
                </small>
              </p>
            </div>
          ),
        )}
      </section>
    </main>
  );
}
