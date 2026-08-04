"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/catalog";

import styles from "./collections.module.css";

type Category =
  | "ALL"
  | "MENSWEAR"
  | "WOMENSWEAR"
  | "KIDSWEAR"
  | "ACCESSORIES"
  | "FOOTWEAR";

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name";

type IconProps = {
  size?: number;
};

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const categories: {
  id: Exclude<Category, "ALL">;
  title: string;
  subtitle: string;
  number: string;
}[] = [
  {
    id: "MENSWEAR",
    title: "Menswear",
    subtitle: "Tailoring, shirts and refined essentials",
    number: "01",
  },
  {
    id: "WOMENSWEAR",
    title: "Womenswear",
    subtitle: "Modern silhouettes and timeless elegance",
    number: "02",
  },
  {
    id: "KIDSWEAR",
    title: "Kidswear",
    subtitle: "Premium style for younger wardrobes",
    number: "03",
  },
  {
    id: "ACCESSORIES",
    title: "Accessories",
    subtitle: "Bags, watches, belts and finishing pieces",
    number: "04",
  },
  {
    id: "FOOTWEAR",
    title: "Footwear",
    subtitle: "Luxury shoes and contemporary sneakers",
    number: "05",
  },
];

function HeartIcon({ size = 21 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M20.4 5.9c-1.9-2-5-1.8-6.8.2L12 7.9l-1.6-1.8c-1.8-2-4.9-2.2-6.8-.2-2 2.1-1.9 5.5.3 7.7l8.1 7.3 8.1-7.3c2.2-2.2 2.3-5.6.3-7.7Z" />
    </svg>
  );
}

function BagIcon({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M5.4 8.5h13.2l-.95 11.7H6.35L5.4 8.5Z" />
      <path d="M8.7 8.5V6.8a3.3 3.3 0 0 1 6.6 0v1.7" />
    </svg>
  );
}

function ArrowIcon({ size = 17 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function SparkleIcon({ size = 20 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" />
      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

function FilterIcon({ size = 18 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M7 12h10" />
      <path d="M10 17h4" />
    </svg>
  );
}

function normalizeCategory(
  productName?: string,
  productCategory?: string,
): Exclude<Category, "ALL"> {
  const value = `${productName || ""} ${productCategory || ""}`.toLowerCase();

  if (
    value.includes("women") ||
    value.includes("womenswear") ||
    value.includes("woman") ||
    value.includes("dress") ||
    value.includes("gown") ||
    value.includes("saree") ||
    value.includes("kurti") ||
    value.includes("skirt") ||
    value.includes("heels") ||
    value.includes("handbag")
  ) {
    return "WOMENSWEAR";
  }

  if (
    value.includes("kids") ||
    value.includes("kidswear") ||
    value.includes("child") ||
    value.includes("children") ||
    value.includes("junior") ||
    value.includes("boy") ||
    value.includes("girl")
  ) {
    return "KIDSWEAR";
  }

  if (
    value.includes("shoe") ||
    value.includes("shoes") ||
    value.includes("sneaker") ||
    value.includes("sneakers") ||
    value.includes("footwear") ||
    value.includes("loafer") ||
    value.includes("boot")
  ) {
    return "FOOTWEAR";
  }

  if (
    value.includes("bag") ||
    value.includes("duffle") ||
    value.includes("accessor") ||
    value.includes("watch") ||
    value.includes("belt") ||
    value.includes("wallet") ||
    value.includes("sunglass") ||
    value.includes("cap")
  ) {
    return "ACCESSORIES";
  }

  return "MENSWEAR";
}

function getCategoryImage(category: Exclude<Category, "ALL">) {
  const matchedProduct = products.find(
    (product) =>
      normalizeCategory(product.name, product.category) === category,
  );

  return matchedProduct?.image || products[0]?.image || "/images/placeholder.jpg";
}

export default function CollectionsPage() {
  const { wishlist, toggleWishlist } = useCart();

  const [activeCategory, setActiveCategory] =
    useState<Category>("ALL");

  const [sortOption, setSortOption] =
    useState<SortOption>("featured");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (activeCategory === "ALL") {
        return true;
      }

      return (
        normalizeCategory(product.name, product.category) === activeCategory
      );
    });

    const sorted = [...filtered];

    if (sortOption === "price-low") {
      sorted.sort((first, second) => first.price - second.price);
    }

    if (sortOption === "price-high") {
      sorted.sort((first, second) => second.price - first.price);
    }

    if (sortOption === "name") {
      sorted.sort((first, second) =>
        first.name.localeCompare(second.name),
      );
    }

    return sorted;
  }, [activeCategory, sortOption]);

  function selectCategory(category: Category) {
    setActiveCategory(category);

    window.setTimeout(() => {
      document
        .getElementById("collection-products")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroMonogram}>K</div>

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span />
            <SparkleIcon />
            KRVE PRIVATE COLLECTIONS
          </div>

          <h1>
            Designed for
            <em>every wardrobe.</em>
          </h1>

          <p>
            Explore luxury menswear, womenswear, kidswear, accessories
            and footwear—curated through the refined world of KRVE.
          </p>

          <div className={styles.heroMeta}>
            <div>
              <strong>05</strong>
              <span>MAIN CATEGORIES</span>
            </div>

            <div>
              <strong>{products.length}</strong>
              <span>CURATED PIECES</span>
            </div>

            <div>
              <strong>2026</strong>
              <span>PRIVATE EDITION</span>
            </div>
          </div>
        </div>

        <div className={styles.heroCard}>
          <SparkleIcon size={35} />

          <p>KRVE INTELLIGENCE</p>

          <h2>
            Your personal
            <em>fashion edit.</em>
          </h2>

          <span>
            Let KRVE AI understand your style and recommend pieces
            selected around your personality.
          </span>

          <Link href="/ai-stylist">
            OPEN AI STYLIST
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className={styles.categorySection}>
        <header className={styles.categoryHeading}>
          <div>
            <p>EXPLORE BY CATEGORY</p>
            <h2>Shop your world.</h2>
          </div>

          <span>
            Five distinctive collections. One KRVE experience.
          </span>
        </header>

        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryCard} ${
                activeCategory === category.id
                  ? styles.activeCategoryCard
                  : ""
              }`}
              onClick={() => selectCategory(category.id)}
            >
              <Image
                src={getCategoryImage(category.id)}
                alt={category.title}
                fill
                sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 20vw"
              />

              <span className={styles.categoryShade} />

              <span className={styles.categoryNumber}>
                {category.number}
              </span>

              <div className={styles.categoryCopy}>
                <p>KRVE COLLECTION</p>

                <h3>{category.title}</h3>

                <span>{category.subtitle}</span>

                <strong>
                  EXPLORE
                  <ArrowIcon />
                </strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section
        id="collection-products"
        className={styles.collectionArea}
      >
        <header className={styles.collectionHeader}>
          <div>
            <p>THE PRIVATE EDIT</p>

            <h2>
              {activeCategory === "ALL"
                ? "All Collections"
                : categories.find(
                    (category) => category.id === activeCategory,
                  )?.title}
            </h2>

            <span>
              Explore premium pieces crafted for the modern KRVE wardrobe.
            </span>
          </div>

          <div className={styles.resultCount}>
            <strong>{visibleProducts.length}</strong>
            <span>PIECES</span>
          </div>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <div className={styles.filterLabel}>
              <FilterIcon />
              FILTER
            </div>

            <button
              type="button"
              className={
                activeCategory === "ALL"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() => setActiveCategory("ALL")}
            >
              ALL
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={
                  activeCategory === category.id
                    ? styles.activeFilter
                    : ""
                }
                onClick={() => setActiveCategory(category.id)}
              >
                {category.title.toUpperCase()}
              </button>
            ))}
          </div>

          <label className={styles.sort}>
            <span>SORT BY</span>

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name</option>
            </select>
          </label>
        </div>

        {visibleProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {visibleProducts.map((product, index) => {
              const saved = wishlist.includes(product.id);

              const category = normalizeCategory(
                product.name,
                product.category,
              );

              return (
                <article
                  key={product.id}
                  className={styles.productCard}
                >
                  <div className={styles.cardNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <button
                    type="button"
                    className={`${styles.wishlistButton} ${
                      saved ? styles.saved : ""
                    }`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      saved
                        ? `Remove ${product.name} from wishlist`
                        : `Save ${product.name} to wishlist`
                    }
                  >
                    <HeartIcon />
                  </button>

                  <Link
                    href={`/product/${product.id}`}
                    className={styles.productImage}
                    aria-label={`Open ${product.name}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 25vw"
                    />

                    <span className={styles.imageShade} />

                    <span className={styles.categoryBadge}>
                      {category}
                    </span>
                  </Link>

                  <div className={styles.productContent}>
                    <div className={styles.productHeading}>
                      <div>
                        <p>KRVE PRIVATE COLLECTION</p>
                        <h3>{product.name}</h3>
                      </div>

                      <strong>
                        {money.format(product.price)}
                      </strong>
                    </div>

                    <div className={styles.productActions}>
                      <Link
                        href={`/product/${product.id}`}
                        className={styles.detailsButton}
                      >
                        DISCOVER
                        <ArrowIcon />
                      </Link>

                      <Link
                        href={`/product/${product.id}`}
                        className={styles.addButton}
                        aria-label={`Add ${product.name}`}
                      >
                        <BagIcon />
                        ADD
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section className={styles.emptyState}>
            <div>
              <SparkleIcon size={37} />
            </div>

            <p>COMING SOON</p>

            <h2>
              This KRVE collection is being curated.
            </h2>

            <span>
              New pieces will appear here as soon as they are added
              to the catalog.
            </span>

            <button
              type="button"
              onClick={() => setActiveCategory("ALL")}
            >
              VIEW ALL COLLECTIONS
              <ArrowIcon />
            </button>
          </section>
        )}
      </section>

      <section className={styles.aiBanner}>
        <div className={styles.aiIcon}>
          <SparkleIcon size={32} />
        </div>

        <div>
          <p>KRVE PERSONAL STYLIST</p>

          <h2>
            Find the collection
            <em>made for you.</em>
          </h2>

          <span>
            Build your style profile and receive intelligent
            recommendations across menswear, womenswear, kidswear,
            accessories and footwear.
          </span>
        </div>

        <Link href="/ai-stylist">
          GET RECOMMENDATIONS
          <ArrowIcon />
        </Link>
      </section>

      <section className={styles.serviceStrip}>
        <div>
          <strong>01</strong>

          <p>
            MENSWEAR
            <span>Refined modern tailoring</span>
          </p>
        </div>

        <div>
          <strong>02</strong>

          <p>
            WOMENSWEAR
            <span>Timeless feminine luxury</span>
          </p>
        </div>

        <div>
          <strong>03</strong>

          <p>
            KIDSWEAR
            <span>Premium younger wardrobes</span>
          </p>
        </div>

        <div>
          <strong>04</strong>

          <p>
            ACCESSORIES
            <span>The finishing KRVE detail</span>
          </p>
        </div>

        <div>
          <strong>05</strong>

          <p>
            FOOTWEAR
            <span>Style from the ground up</span>
          </p>
        </div>
      </section>
    </main>
  );
}
