import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/product-card";
import {
  getNewArrivalProducts,
  type KrveProduct,
} from "@/lib/api";
import type { Product } from "@/lib/catalog";

import "./krve-home.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KRVE — The Fashion Studio | Move Into Style",
  description:
    "Discover luxury fashion, elevated essentials, intelligent fit and AI-powered personal styling at KRVE.",
};

function convertToProductCardProduct(product: KrveProduct): Product {
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
    gallery: product.gallery?.length ? product.gallery : [image],
    category: product.category,
    description:
      product.description ||
      product.shortDescription ||
      "A refined piece from the KRVE collection.",
    shortDescription:
      product.shortDescription ||
      product.description ||
      "Designed to move with your style.",
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

const categories = [
  {
    title: "Men's Collection",
    subtitle: "CONFIDENCE IN EVERY DETAIL",
    image: "/images/hero-model.jpg",
    href: "/collections?category=menswear",
    position: "center 25%",
  },
  {
    title: "Women's Collection",
    subtitle: "ELEGANCE REDEFINED",
    image: "/images/try-on.jpg",
    href: "/collections?category=womenswear",
    position: "center",
  },
  {
    title: "New Arrivals",
    subtitle: "THE LATEST EDIT",
    image: "/images/products/product-3.jpg",
    href: "/collections?category=new-arrivals",
    position: "center",
  },
  {
    title: "Best Sellers",
    subtitle: "MOST LOVED STYLES",
    image: "/images/products/product-1.jpg",
    href: "/collections",
    position: "center",
  },
];

const collections = [
  {
    title: "Ethnic Wear",
    image: "/images/products/product-4.jpg",
    href: "/collections?category=ethnic-wear",
  },
  {
    title: "Casual Wear",
    image: "/images/hero-model.jpg",
    href: "/collections?category=menswear",
  },
  {
    title: "Sarees",
    image: "/images/try-on.jpg",
    href: "/collections?category=womenswear",
  },
  {
    title: "Kurtis",
    image: "/images/products/product-3.jpg",
    href: "/collections?category=womenswear",
  },
  {
    title: "Hoodies",
    image: "/images/products/product-2.jpg",
    href: "/collections?category=menswear",
  },
  {
    title: "T-Shirts",
    image: "/images/products/product-1.jpg",
    href: "/collections?category=menswear",
  },
];

export default async function HomePage() {
  const newArrivalProducts = await loadNewArrivals();

  return (
    <main className="krve-home">

      {/* HERO CAMPAIGN */}
      <section className="kh-hero">
        <Image
          src="/images/hero-banner.png"
          alt="KRVE luxury fashion campaign"
          fill
          priority
          sizes="100vw"
          className="kh-hero-image"
        />

        <div className="kh-hero-overlay" />

        <div className="kh-hero-copy">
          <span className="kh-eyebrow">
            KRVE — THE FASHION STUDIO
          </span>

          <h1>
            Redefine
            <br />
            Your <em>Style.</em>
          </h1>

          <p>
            LUXURY FASHION. INTELLIGENT FIT.
            <br />
            AI-POWERED PERSONAL STYLING.
          </p>

          <div className="kh-hero-actions">
            <Link
              href="/collections?category=menswear"
              className="kh-button kh-button-gold"
            >
              SHOP MEN <span>→</span>
            </Link>

            <Link
              href="/collections?category=womenswear"
              className="kh-button kh-button-outline"
            >
              SHOP WOMEN <span>→</span>
            </Link>
          </div>

          <div className="kh-hero-tagline">
            MOVE INTO STYLE <span />
          </div>
        </div>

        <div className="kh-hero-brand">
          <span>KRVE</span>
          <small>THE FASHION STUDIO</small>
          <i />
        </div>

        <div className="kh-hero-index">
          <span>01</span>
          <i />
          <span>03</span>
          <b>←</b>
          <b>→</b>
        </div>
      </section>

      {/* CATEGORY CAMPAIGNS */}
      <section className="kh-category-section">
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.title}
            className="kh-category-card"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 700px) 50vw, 25vw"
              style={{ objectPosition: category.position }}
            />

            <div className="kh-category-overlay" />

            <div className="kh-category-copy">
              <h2>{category.title}</h2>
              <small>{category.subtitle}</small>
              <span>EXPLORE COLLECTION →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* SERVICE PROMISE */}
      <section className="kh-benefits">
        <div>
          <span>✧</span>
          <p>
            <strong>Premium Quality</strong>
            <small>Fashion That Lasts</small>
          </p>
        </div>

        <div>
          <span>♧</span>
          <p>
            <strong>Secure Payments</strong>
            <small>Safe Shopping Experience</small>
          </p>
        </div>

        <div>
          <span>↗</span>
          <p>
            <strong>Easy Returns</strong>
            <small>Customer First</small>
          </p>
        </div>

        <div>
          <span>◇</span>
          <p>
            <strong>Customer Support</strong>
            <small>Here to Help You</small>
          </p>
        </div>
      </section>

      {/* EXCLUSIVE COLLECTIONS */}
      <section className="kh-collections">
        <div className="kh-section-intro">
          <span className="kh-eyebrow">EXPLORE OUR WORLD</span>
          <h2>
            Exclusive
            <br />
            <em>Collections.</em>
          </h2>
          <p>
            Curated for every mood, every occasion
            and every version of you.
          </p>

          <Link href="/collections" className="kh-text-link">
            VIEW ALL COLLECTIONS <span>→</span>
          </Link>
        </div>

        <div className="kh-collection-grid">
          {collections.map((item, index) => (
            <Link
              href={item.href}
              className="kh-collection-card"
              key={item.title}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 700px) 33vw, 15vw"
              />

              <div className="kh-collection-overlay" />

              <span className="kh-collection-number">
                0{index + 1}
              </span>

              <strong>{item.title}</strong>
              <i>DISCOVER →</i>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="kh-new-arrivals">
        <div className="kh-products-heading">
          <div>
            <span className="kh-eyebrow">THE LATEST FROM KRVE</span>
            <h2>
              Discover the <em>New Edit.</em>
            </h2>
            <p>Fresh arrivals. Refined details. Your signature style.</p>
          </div>

          <Link href="/collections" className="kh-button kh-button-dark">
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <div className="kh-product-grid">
          {newArrivalProducts.length > 0 ? (
            newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="kh-empty-products">
              <span>✧</span>
              <h3>THE NEXT EDIT IS COMING</h3>
              <p>
                New arrivals published through KRVE will
                automatically appear here.
              </p>
              <Link href="/collections">
                EXPLORE COLLECTIONS →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* AI VIRTUAL STUDIO */}
      <section className="kh-ai-studio">
        <div className="kh-ai-image">
          <Image
            src="/images/try-on.jpg"
            alt="KRVE virtual styling experience"
            fill
            sizes="(max-width: 700px) 100vw, 48vw"
          />
          <div />
        </div>

        <div className="kh-ai-copy">
          <span className="kh-eyebrow">
            THE FUTURE OF PERSONAL STYLE
          </span>

          <h2>
            KRVE AI
            <br />
            Virtual <em>Studio.</em>
          </h2>

          <p>
            Your style. Your measurements. Your digital
            fashion experience.
          </p>

          <div className="kh-ai-features">
            <span>✧ 3D TWIN GENERATION</span>
            <span>✧ INTELLIGENT FIT</span>
            <span>✧ PERSONALIZED PICKS</span>
            <span>✧ SMART SIZE GUIDE</span>
          </div>

          <Link href="/ai-stylist" className="kh-button kh-button-gold">
            EXPERIENCE KRVE AI <span>→</span>
          </Link>
        </div>

        <div className="kh-ai-watermark">KRVE AI</div>
      </section>

      {/* FESTIVE CAMPAIGN */}
      <Link href="/collections" className="kh-festive">
        <Image
          src="/images/products/product-4.jpg"
          alt="KRVE festive collection"
          fill
          sizes="100vw"
        />

        <div className="kh-festive-overlay" />

        <div className="kh-festive-copy">
          <span>THE KRVE FESTIVE EDITION</span>

          <h2>
            Celebrate
            <br />
            in <em>Signature Style.</em>
          </h2>

          <p>
            Tradition meets contemporary fashion.
            Make every celebration unforgettable.
          </p>

          <b>EXPLORE THE FESTIVE EDIT <i>→</i></b>
        </div>

        <div className="kh-festive-side">
          FESTIVE COLLECTION
        </div>
      </Link>

      {/* BRAND STORY */}
      <section className="kh-brand-story">
        <div className="kh-story-image">
          <Image
            src="/images/hero-banner.png"
            alt="KRVE The Fashion Studio"
            fill
            sizes="(max-width: 700px) 100vw, 45vw"
          />
        </div>

        <div className="kh-story-copy">
          <span className="kh-eyebrow">OUR PHILOSOPHY</span>
          <h2>
            More Than Fashion.
            <br />
            <em>It's a Movement.</em>
          </h2>
          <p>
            KRVE — The Fashion Studio brings together
            contemporary design, individual expression
            and intelligent fashion experiences.
            We believe style is not just what you wear.
            It is how you move through the world.
          </p>

          <Link href="/about" className="kh-text-link">
            DISCOVER OUR STORY <span>→</span>
          </Link>
        </div>
      </section>

      {/* BRAND CLOSING STRIP */}
      <section className="kh-closing">
        <span>DESIGNED FOR YOU</span>
        <i />
        <strong>MOVE INTO STYLE.</strong>
        <i />
        <span>THE KRVE EXPERIENCE</span>
      </section>

    </main>
  );
}
