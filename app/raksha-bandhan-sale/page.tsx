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

export const dynamic =
  "force-dynamic";

export const metadata = {
  title:
    "Raksha Bandhan Sale | KRVE",

  description:
    "Celebrate Raksha Bandhan with KRVE. Shop selected fashion with savings up to 60% off.",
};

/*
 * Sale expires:
 * 29 August 2026
 * 12:00 AM IST
 */
const RAKSHA_SALE_END =
  new Date(
    "2026-08-28T18:30:00.000Z",
  );

function convertProduct(
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

async function getSaleProducts() {
  try {
    /*
     * Currently using live KEOS products.
     *
     * Later we can add a dedicated
     * Raksha Sale toggle inside KEOS.
     */
    const products =
      await getNewArrivalProducts(
        12,
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

export default async function RakshaBandhanSalePage() {
  const saleActive =
    new Date().getTime() <
    RAKSHA_SALE_END.getTime();

  /*
   * Sale over?
   *
   * Customer automatically
   * returns to collections.
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
            "430px",

          overflow:
            "hidden",

          borderBottom:
            "1px solid rgba(220,170,35,0.45)",
        }}
      >
        <Image
          src="/images/raksha-bandhan-sale.png"
          alt="KRVE Raksha Bandhan Sale"
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
          SALE INTRO
      ===================================================== */}

      <section
        style={{
          width:
            "min(1400px, calc(100% - 40px))",

          margin:
            "0 auto",

          padding:
            "60px 0 40px",

          textAlign:
            "center",
        }}
      >
        <p
          style={{
            margin:
              "0 0 14px",

            color:
              "#d8a529",

            fontSize:
              "11px",

            fontWeight:
              800,

            letterSpacing:
              "0.18em",
          }}
        >
          KRVE FESTIVE EDIT
        </p>

        <h1
          style={{
            margin:
              "0",

            fontFamily:
              "Georgia, serif",

            fontSize:
              "clamp(42px, 6vw, 82px)",

            fontWeight:
              400,

            lineHeight:
              0.98,
          }}
        >
          Raksha Bandhan
          <br />

          <span
            style={{
              color:
                "#d8a529",
            }}
          >
            Sale Collection
          </span>
        </h1>

        <p
          style={{
            maxWidth:
              "650px",

            margin:
              "24px auto 0",

            color:
              "#979797",

            fontSize:
              "14px",

            lineHeight:
              1.8,
          }}
        >
          Celebrate the bond
          with elevated KRVE
          fashion. Discover
          selected festive
          styles and limited-time
          savings of up to 60%.
        </p>

        <div
          style={{
            marginTop:
              "28px",
          }}
        >
          <span
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              minHeight:
                "42px",

              border:
                "1px solid rgba(216,165,41,0.55)",

              padding:
                "0 18px",

              color:
                "#e0ad2c",

              fontSize:
                "10px",

              fontWeight:
                900,

              letterSpacing:
                "0.12em",
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
            "min(1400px, calc(100% - 40px))",

          margin:
            "0 auto",

          paddingBottom:
            "90px",
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "end",

            gap:
              "20px",

            marginBottom:
              "30px",

            borderBottom:
              "1px solid rgba(220,170,35,0.30)",

            paddingBottom:
              "18px",
          }}
        >
          <div>
            <p
              style={{
                margin:
                  "0 0 7px",

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

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "clamp(30px, 4vw, 48px)",

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
                "#d9a725",

              fontSize:
                "10px",

              fontWeight:
                900,

              textDecoration:
                "none",

              letterSpacing:
                "0.1em",
            }}
          >
            VIEW ALL COLLECTIONS →
          </Link>
        </div>

        {products.length >
        0 ? (
          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",

              gap:
                "20px",
            }}
          >
            {products.map(
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
            )}
          </div>
        ) : (
          <div
            style={{
              border:
                "1px solid rgba(220,170,35,0.35)",

              padding:
                "70px 30px",

              textAlign:
                "center",
            }}
          >
            <h3
              style={{
                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "30px",

                fontWeight:
                  400,
              }}
            >
              The festive edit
              is being curated.
            </h3>

            <Link
              href="/collections"
              style={{
                display:
                  "inline-flex",

                marginTop:
                  "20px",

                border:
                  "1px solid #d8a529",

                padding:
                  "15px 25px",

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
              SHOP COLLECTIONS →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
