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
  title: "KRVE — The Fashion Studio",
  description:
    "Luxury fashion, intelligent fit and AI-powered personal styling. Discover the latest Menswear, Womenswear and Kidswear collections at KRVE.",
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

const categories = [
  {
    title: "MENSWEAR",
    subtitle: "SHOP NOW",
    href: "/collections?category=menswear",
    image: "/images/hero-model.jpg",
    position: "center 24%",
  },
  {
    title: "WOMENSWEAR",
    subtitle: "SHOP NOW",
    href: "/collections?category=womenswear",
    image: "/images/try-on.jpg",
    position: "70% center",
  },
  {
    title: "KIDSWEAR",
    subtitle: "SHOP NOW",
    href: "/collections?category=kidswear",
    image: "/images/products/product-3.jpg",
    position: "center",
  },
];

export default async function HomePage() {
  const newArrivalProducts = await loadNewArrivals();

  return (
    <main className="krve-home">
      <section className="krve-home-hero">
       <div className="krve-home-hero-image">
         <Image
           src="/images/hero-banner.png"
           alt="KRVE luxury fashion campaign featuring
                 menswear and womenswear"
                  fill
           priority
    sizes="100vw"
    style={{
      objectFit: "cover",
      objectPosition: "center center",
    }}
  />
</div>
        <div className="krve-home-hero-shade" />

        <div className="krve-home-hero-copy">
          <p className="krve-home-kicker">MORE THAN FASHION. IT’S KRVE.</p>
          <h1>
            FASHION
            <span>THAT UNDERSTANDS YOU.</span>
          </h1>
          <p className="krve-home-hero-description">
            Luxury fashion, intelligent fit
            <br />
            and AI-powered personal styling.
          </p>
          <Link href="/collections" className="krve-home-outline-button">
            EXPLORE THE EDIT <span>→</span>
          </Link>
        </div>

        <div className="krve-home-slide-count" aria-label="Campaign 1 of 3">
          <span>01</span><i /><span>03</span><b>←</b><b>→</b>
        </div>
        <div className="krve-home-hero-caption">THE KRVE SIGNATURE COLLECTION</div>
      </section>

      <section className="krve-home-categories" aria-label="Shop by category">
        {categories.map((category) => (
          <Link
            href={category.href}
            className="krve-home-category-card"
            key={category.title}
          >
            <Image
              src={category.image}
              alt={`${category.title.toLowerCase()} collection`}
              fill
              sizes="(max-width: 700px) 100vw, 33vw"
              style={{ objectPosition: category.position }}
            />
            <span className="krve-home-category-shade" />
            <span className="krve-home-category-copy">
              <strong>{category.title}</strong>
              <small>{category.subtitle} <b>→</b></small>
            </span>
          </Link>
        ))}
      </section>

      <section className="krve-home-benefits">
        <div><span className="krve-benefit-icon">◇</span><p><strong>Premium Quality</strong><small>Guaranteed</small></p></div>
        <div><span className="krve-benefit-icon">♧</span><p><strong>Trendy Collections</strong><small>For Every You</small></p></div>
        <div><span className="krve-benefit-icon">♧</span><p><strong>Free Shipping</strong><small>Above ₹999</small></p></div>
        <div><span className="krve-benefit-icon">⬡</span><p><strong>Secure Payments</strong><small>Powered by Razorpay</small></p></div>
      </section>

      <section className="krve-home-new-edit">
        <div className="krve-home-edit-intro">
          <p className="krve-home-kicker">✦ THE NEW EDIT</p>
          <h2>Curated Styles.<br />Timeless Appeal.</h2>
          <p>Discover the latest from KRVE — designed for every moment.</p>
          <Link href="/collections" className="krve-home-gold-button">
            SHOP THE COLLECTION <span>→</span>
          </Link>
        </div>

        <div className="krve-home-product-grid">
          {newArrivalProducts.length > 0 ? (
            newArrivalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="krve-home-empty-products">
              <span>✦</span>
              <strong>THE NEXT EDIT IS COMING</strong>
              <p>New arrivals published through KEOS will appear here automatically.</p>
              <Link href="/collections">EXPLORE COLLECTIONS →</Link>
            </div>
          )}
        </div>
      </section>

      <section className="krve-home-ai-stylist">
        <div className="krve-home-ai-line-art" aria-hidden="true">♙</div>
        <div className="krve-home-ai-copy">
          <p className="krve-home-kicker">STYLE, REIMAGINED</p>
          <h2>AI-POWERED<br />PERSONAL STYLING</h2>
          <p>Discover your perfect look with the power of AI.</p>
          <Link href="/ai-stylist" className="krve-home-outline-button">
            TRY VIRTUAL STYLIST <span>→</span>
          </Link>
        </div>
        <div className="krve-home-ai-image">
          <Image
            src="/images/try-on.jpg"
            alt="KRVE AI-powered virtual styling experience"
            fill
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </div>
      </section>

      <Link href="/collections" className="krve-home-festive">
        <div className="krve-home-festive-image">
          <Image
            src="/images/products/product-4.jpg"
            alt="KRVE festive fashion collection"
            fill
            sizes="100vw"
          />
        </div>
        <span className="krve-home-festive-shade" />
        <span className="krve-home-festive-copy">
          <small>THE FESTIVE EDITION</small>
          <strong>Celebrate in<br />Signature Style.</strong>
          <em>Discover the festive collection and dress for every celebration.</em>
          <b>EXPLORE FESTIVE STYLES <span>→</span></b>
        </span>
      </Link>
    </main>
  );
}
