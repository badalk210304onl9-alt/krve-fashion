import Image from "next/image";
import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import ProductCard from "@/components/product-card";

import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";

import type {
  Product,
} from "@/lib/catalog";

/* =========================================================
   PAGE CONFIG
========================================================= */

export const dynamic =
  "force-dynamic";

export const metadata = {
  title:
    "Raksha Bandhan Sale | KRVE",

  description:
    "Celebrate Raksha Bandhan with KRVE. Shop selected fashion with savings up to 60% off.",
};

/* =========================================================
   SALE EXPIRY

   Sale remains active through:
   28 August 2026

   Ends:
   29 August 2026
   12:00 AM IST

   IST = UTC + 5:30
========================================================= */

const RAKSHA_SALE_END =
  new Date(
    "2026-08-28T18:30:00.000Z",
  );

/* =========================================================
   PRODUCT CONVERSION
========================================================= */

function convertProduct(
  product: KrveProduct,
): Product {
  const primaryImage =
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg";

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
      Number(
        product.price || 0,
      ),

    compareAtPrice:
      product.compareAtPrice
        ? Number(
            product.compareAtPrice,
          )
        : undefined,

    /*
     * IMPORTANT:
     * KRVE India store.
     *
     * Force INR so ProductCard
     * displays ₹ instead of $.
     */
    currency:
      "INR",

    image:
      primaryImage,

    imageUrl:
      primaryImage,

    gallery:
      product.gallery?.length
        ? product.gallery
        : [
            primaryImage,
          ],

    category:
      product.category,

    description:
      product.description ||
      product.shortDescription ||
      "A premium KRVE creation.",

    shortDescription:
      product.shortDescription ||
      product.description ||
      "A premium KRVE creation.",

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

/* =========================================================
   LOAD SALE PRODUCTS
========================================================= */

async function getSaleProducts() {
  try {
    const products =
      await getNewArrivalProducts(
        20,
      );

    return products.map(
      convertProduct,
    );
  } catch (error) {
    console.error(
      "RAKSHA_SALE_PRODUCTS_ERROR",
      error,
    );

    return [];
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function RakshaBandhanSalePage() {
  const saleActive =
    Date.now() <
    RAKSHA_SALE_END.getTime();

  /*
   * After campaign expiry,
   * customer cannot open this page.
   */
  if (!saleActive) {
    redirect(
      "/collections",
    );
  }

  const products =
    await getSaleProducts();

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#050505",

        color:
          "#ffffff",
      }}
    >
      {/* =====================================================
          SALE HERO
      ===================================================== */}

      <section
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            "365px",

          overflow:
            "hidden",

          background:
            "#000000",

          borderBottom:
            "1px solid rgba(216,165,41,0.35)",
        }}
      >
        <Image
          src="/images/raksha-bandhan-sale.png"
          alt="KRVE Raksha Bandhan Sale - Up to 60% off"
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
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        style={{
          width:
            "min(1500px, calc(100% - 40px))",

          margin:
            "0 auto",

          padding:
            "55px 0 35px",

          textAlign:
            "center",
        }}
      >
        <p
          style={{
            margin:
              "0 0 12px",

            color:
              "#d8a529",

            fontSize:
              "10px",

            fontWeight:
              900,

            letterSpacing:
              "0.18em",
          }}
        >
          KRVE FESTIVE EDIT
        </p>

        <h1
          style={{
            margin: 0,

            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontSize:
              "clamp(38px, 5vw, 72px)",

            fontWeight:
              400,

            lineHeight:
              1,
          }}
        >
          Raksha Bandhan{" "}

          <span
            style={{
              color:
                "#d8a529",
            }}
          >
            Sale
          </span>
        </h1>

        <p
          style={{
            width:
              "min(620px, 100%)",

            margin:
              "20px auto 0",

            color:
              "#929292",

            fontSize:
              "14px",

            lineHeight:
              1.7,
          }}
        >
          Celebrate the bond
          with KRVE. Discover
          selected styles and
          limited-time savings
          of up to 60% off.
        </p>

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "center",

            flexWrap:
              "wrap",

            gap:
              "10px",

            marginTop:
              "24px",
          }}
        >
          <span
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              minHeight:
                "38px",

              padding:
                "0 17px",

              border:
                "1px solid rgba(216,165,41,0.45)",

              color:
                "#d8a529",

              fontSize:
                "10px",

              fontWeight:
                900,

              letterSpacing:
                "0.1em",
            }}
          >
            UP TO 60% OFF
          </span>

          <span
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              minHeight:
                "38px",

              padding:
                "0 17px",

              border:
                "1px solid rgba(255,255,255,0.14)",

              color:
                "#ffffff",

              fontSize:
                "10px",

              fontWeight:
                900,

              letterSpacing:
                "0.1em",
            }}
          >
            ENDS 28 AUGUST
          </span>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        style={{
          width:
            "min(1500px, calc(100% - 40px))",

          margin:
            "0 auto",

          paddingBottom:
            "90px",
        }}
      >
        {/* HEADING */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "flex-end",

            justifyContent:
              "space-between",

            flexWrap:
              "wrap",

            gap:
              "20px",

            padding:
              "0 0 18px",

            marginBottom:
              "30px",

            borderBottom:
              "1px solid rgba(216,165,41,0.32)",
          }}
        >
          <div>
            <p
              style={{
                margin:
                  "0 0 6px",

                color:
                  "#d8a529",

                fontSize:
                  "9px",

                fontWeight:
                  900,

                letterSpacing:
                  "0.16em",
              }}
            >
              LIMITED TIME
            </p>

            <h2
              style={{
                margin: 0,

                color:
                  "#ffffff",

                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  "clamp(30px, 4vw, 46px)",

                fontWeight:
                  400,
              }}
            >
              Shop the Sale
            </h2>
          </div>

          <Link
            href="/collections"
            style={{
              color:
                "#d8a529",

              fontSize:
                "10px",

              fontWeight:
                900,

              letterSpacing:
                "0.08em",

              textDecoration:
                "none",
            }}
          >
            VIEW ALL COLLECTIONS →
          </Link>
        </div>

        {/* PRODUCT GRID */}

        {products.length >
        0 ? (
          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",

              gap:
                "24px",
            }}
          >
            {products.map(
              (
                product,
              ) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div
            style={{
              padding:
                "80px 30px",

              border:
                "1px solid rgba(216,165,41,0.32)",

              textAlign:
                "center",
            }}
          >
            <p
              style={{
                color:
                  "#d8a529",

                fontSize:
                  "11px",

                fontWeight:
                  900,

                letterSpacing:
                  "0.15em",
              }}
            >
              KRVE FESTIVE EDIT
            </p>

            <h3
              style={{
                margin:
                  "14px 0 0",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "32px",

                fontWeight:
                  400,
              }}
            >
              Products are being
              curated.
            </h3>

            <Link
              href="/collections"
              style={{
                display:
                  "inline-flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                marginTop:
                  "25px",

                minHeight:
                  "44px",

                padding:
                  "0 22px",

                border:
                  "1px solid #d8a529",

                color:
                  "#d8a529",

                textDecoration:
                  "none",

                fontSize:
                  "10px",

                fontWeight:
                  900,
              }}
            >
              EXPLORE COLLECTIONS →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
