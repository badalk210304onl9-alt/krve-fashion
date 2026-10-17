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
    "Discover contemporary fashion, signature styles and AI-powered personal styling at KRVE Fashion Studio.",
};

function convertToProductCardProduct(
  product: KrveProduct,
): Product {
  return {
    ...product,
  } as Product;
}

async function loadNewArrivals(): Promise<KrveProduct[]> {
  try {
    const result = await getNewArrivalProducts(8);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Unable to load KRVE new arrivals:", error);
    return [];
  }
}

function HomeProductStrip({
  products,
}: {
  products: KrveProduct[];
}) {
  if (products.length === 0) {
    return null;
  }

  const stripProducts = [...products, ...products];

  return (
    <section className="krve-home-strip" aria-label="KRVE new arrivals">
      <div className="krve-home-strip-heading">
        <span>THE KRVE EDIT</span>
        <span>FRESH FITS. SIGNATURE STYLE.</span>
      </div>

      <div className="krve-home-strip-window">
        <div className="krve-home-strip-track">
          {stripProducts.map((product, index) => {
            const imageSrc =
              product.imageUrl ||
              product.image ||
              product.gallery?.[0] ||
              "/images/hero-model.jpg";

            return (
              <Link
                key={`${product.id}-${index}`}
                href={`/products/${product.slug || product.id}`}
                className="krve-home-strip-item"
              >
                <div className="krve-home-strip-image">
                  <Image
                    src={imageSrc}
                    alt={product.name || "KRVE fashion"}
                    width={110}
                    height={130}
                    sizes="110px"
                  />
                </div>

                <div className="krve-home-strip-info">
                  <span className="krve-home-strip-label">
                    NEW ARRIVAL
                  </span>

                  <span className="krve-home-strip-name">
                    {product.name}
                  </span>

                  <span className="krve-home-strip-price">
                    {product.currency || "INR"}{" "}
                    {Number(product.price || 0).toLocaleString("en-IN")}
                  </span>

                  <span className="krve-home-strip-cta">
                    SHOP NOW ↗
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShopByCategory() {
  const categories = [
    {
      number: "01",
      name: "MEN",
      description: "EVERYDAY ICONS",
      image: "/images/hero-model.jpg",
    },
    {
      number: "02",
      name: "WOMEN",
      description: "MODERN EXPRESSION",
      image: "/images/try-on.jpg",
    },
    {
      number: "03",
      name: "STREETWEAR",
      description: "MAKE YOUR STATEMENT",
      image: "/images/hero-model.jpg",
    },
    {
      number: "04",
      name: "ACCESSORIES",
      description: "THE FINISHING TOUCH",
      image: "/images/crest.jpg",
    },
  ];

  return (
    <section className="krve-category-section">
      <div className="krve-editorial-heading">
        <span className="krve-eyebrow">FIND YOUR SIGNATURE</span>
        <h2>
          SHOP BY <span>CATEGORY</span>
        </h2>
        <p>Distinct styles. One signature identity.</p>
      </div>

      <div className="krve-category-grid">
        {categories.map((category) => (
          <Link
            href="/collections"
            className="krve-category-card"
            key={category.name}
          >
            <Image
              src={category.image}
              alt={`${category.name} fashion at KRVE`}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />

            <span className="krve-category-shade" />

            <div className="krve-category-copy">
              <span>
                {category.number} / {category.description}
              </span>
              <h3>{category.name}</h3>
              <span className="krve-category-link">
                EXPLORE COLLECTION ↗
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function KrveEditorial() {
  return (
    <section className="krve-edit-section">
      <div className="krve-edit-image">
        <Image
          src="/images/hero-model.jpg"
          alt="The KRVE fashion editorial"
          fill
          sizes="(max-width: 800px) 100vw, 55vw"
          priority={false}
        />

        <div className="krve-edit-image-overlay" />

        <span className="krve-edit-image-label">
          KRVE FASHION STUDIO
        </span>
      </div>

      <div className="krve-edit-content">
        <span className="krve-eyebrow">
          A DIFFERENT POINT OF VIEW
        </span>

        <h2>
          MORE THAN
          <br />
          FASHION.
          <br />
          <span>IT&apos;S KRVE.</span>
        </h2>

        <div className="krve-edit-line" />

        <p>
          Style is more than what you wear. It is how you express
          yourself. Discover considered designs, distinctive details
          and a look that feels unmistakably yours.
        </p>

        <Link href="/collections" className="krve-edit-cta">
          EXPLORE THE COLLECTION <span>↗</span>
        </Link>

        <span className="krve-edit-index">
          THE KRVE EDIT — 001
        </span>
      </div>
    </section>
  );
}

function BrandBenefits() {
  const benefits = [
    {
      symbol: "✳",
      title: "THOUGHTFUL STYLE",
      description: "Made to express your individuality",
    },
    {
      symbol: "◇",
      title: "SIGNATURE DETAILS",
      description: "A distinct point of view",
    },
    {
      symbol: "✦",
      title: "PERSONAL STYLING",
      description: "Explore AI-powered styling",
    },
    {
      symbol: "↗",
      title: "YOUR NEXT LOOK",
      description: "Discover something new",
    },
  ];

  return (
    <section className="krve-benefits-section">
      {benefits.map((benefit) => (
        <div className="krve-benefit-item" key={benefit.title}>
          <span className="krve-benefit-symbol">
            {benefit.symbol}
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
  const newArrivalProducts = await loadNewArrivals();

  return (
    <main className="krve-dussehra-home krve-premium-home">
      {/* Minimal product strip */}
      <HomeProductStrip products={newArrivalProducts} />

      {/* Premium hero */}
      <section className="hero krve-dussehra-hero krve-premium-hero">
        <div className="hero-silk" aria-hidden="true" />
        <div className="krve-dussehra-glow" aria-hidden="true" />

        <div className="hero-copy">
          <span className="krve-premium-eyebrow">
            — THE ART OF EVERYDAY STYLE
          </span>

          <h1>
            FASHION THAT
            <br />
            <span>UNDERSTANDS YOU.</span>
          </h1>

          <p>
            Modern styles. Distinctive details. A signature look
            that feels like you.
          </p>

          <div className="krve-hero-actions">
            <Link href="/collections" className="krve-premium-primary">
              EXPLORE COLLECTIONS <span>↗</span>
            </Link>

            <Link
              href="/virtual-try-on"
              className="krve-premium-secondary"
            >
              VIRTUAL TRY-ON <span>✦</span>
            </Link>
          </div>

          <span className="krve-hero-caption">
            CONFIDENCE, WORN YOUR WAY.
          </span>
        </div>

        <div className="hero-model krve-premium-model">
          <Image
            src="/images/hero-model.jpg"
            alt="KRVE contemporary fashion campaign"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
          />
        </div>

        <div className="krve-hero-side-label" aria-hidden="true">
          <span>MEN</span>
          <span>WOMEN</span>
          <span>STREETWEAR</span>
          <span>ACCESSORIES</span>
        </div>

        <div className="krve-scroll-indicator" aria-hidden="true">
          <span>SCROLL TO DISCOVER</span>
          <span className="krve-scroll-line" />
        </div>
      </section>

      {/* Brand benefits */}
      <BrandBenefits />

      {/* Categories */}
      <ShopByCategory />

      {/* Existing product data */}
      <HomeProductStrip products={newArrivalProducts} />

      {/* Editorial brand story */}
      <KrveEditorial />

      {/* New Arrivals */}
      <section className="new-arrivals krve-premium-arrivals">
        <div className="section-heading">
          <div>
            <span className="krve-eyebrow">CURATED FOR YOU</span>
            <h2>NEW ARRIVALS</h2>
            <p>Discover the latest additions to the KRVE collection.</p>
          </div>

          <Link href="/collections" className="krve-view-all">
            VIEW ALL <span>↗</span>
          </Link>
        </div>

        {newArrivalProducts.length > 0 ? (
          <div className="product-grid">
            {newArrivalProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={convertToProductCardProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="krve-empty-arrivals">
            <span className="krve-eyebrow">THE NEXT EDIT IS COMING</span>
            <h3>Something worth wearing.</h3>
            <p>
              New pieces will appear here as soon as they are available.
            </p>
            <Link href="/collections" className="krve-premium-primary">
              EXPLORE COLLECTIONS <span>↗</span>
            </Link>
          </div>
        )}
      </section>

      {/* Virtual Try-On */}
      <section className="krve-tryon-section">
        <div className="krve-tryon-image">
          <Image
            src="/images/try-on.jpg"
            alt="Explore virtual styling at KRVE"
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>

        <div className="krve-tryon-copy">
          <span className="krve-eyebrow">STYLE MEETS TECHNOLOGY</span>
          <h2>
            YOUR STYLE.
            <br />
            YOUR <span>VISION.</span>
          </h2>
          <p>
            Explore a new way to discover your look with the KRVE
            Virtual Try-On experience.
          </p>
          <Link
            href="/virtual-try-on"
            className="krve-premium-primary"
          >
            TRY IT YOURSELF <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Closing brand statement */}
      <section className="krve-closing-section">
        <span className="krve-eyebrow">THE KRVE PHILOSOPHY</span>
        <h2>
          WEAR YOUR
          <span> CONFIDENCE.</span>
        </h2>
        <p>Not just another look. Your own point of view.</p>
        <Link href="/collections" className="krve-closing-link">
          FIND YOUR STYLE <span>↗</span>
        </Link>
      </section>
    </main>
  );
}
