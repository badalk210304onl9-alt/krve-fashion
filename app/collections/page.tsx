"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/catalog";

import styles from "./collections.module.css";

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

const filters = [
  "ALL",
  "TAILORING",
  "SHIRTS",
  "ACCESSORIES",
  "FOOTWEAR",
];

function HeartIcon({ size = 20 }: IconProps) {
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

function BagIcon({ size = 17 }: IconProps) {
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

function normalizeCategory(category?: string) {
  const value = (category || "").toLowerCase();

  if (
    value.includes("blazer") ||
    value.includes("tailor") ||
    value.includes("suit")
  ) {
    return "TAILORING";
  }

  if (value.includes("shirt")) {
    return "SHIRTS";
  }

  if (
    value.includes("shoe") ||
    value.includes("sneaker") ||
    value.includes("footwear")
  ) {
    return "FOOTWEAR";
  }

  if (
    value.includes("bag") ||
    value.includes("duffle") ||
    value.includes("accessor")
  ) {
    return "ACCESSORIES";
  }

  return category?.toUpperCase() || "KRVE COLLECTION";
}

export default function CollectionsPage() {
  const { wishlist, toggleWishlist } = useCart();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortOption, setSortOption] =
    useState<SortOption>("featured");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (activeFilter === "ALL") {
        return true;
      }

      return normalizeCategory(product.category) === activeFilter;
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
  }, [activeFilter, sortOption]);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroMonogram}>K</div>

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span />
            <SparkleIcon />
            KRVE PRIVATE COLLECTION
          </div>

          <h1>
            Discover the
            <em>KRVE collection.</em>
          </h1>

          <p>
            Timeless tailoring, intelligent essentials and refined
            accessories—crafted for modern luxury.
          </p>

          <div className={styles.heroMeta}>
            <div>
              <strong>{products.length}</strong>
              <span>CURATED PIECES</span>
            </div>

            <div>
              <strong>2026</strong>
              <span>PRIVATE EDITION</span>
            </div>

            <div>
              <strong>KRVE</strong>
              <span>DESIGN HOUSE</span>
            </div>
          </div>
        </div>

        <div className={styles.heroCard}>
          <SparkleIcon size={34} />

          <p>INTELLIGENT FASHION</p>

          <h2>
            Fashion selected
            <em>around you.</em>
          </h2>

          <span>
            Use KRVE AI Stylist to discover pieces aligned with your
            personal aesthetic.
          </span>

          <Link href="/ai-stylist">
            OPEN AI STYLIST
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className={styles.collectionArea}>
        <header className={styles.collectionHeader}>
          <div>
            <p>THE PRIVATE EDIT</p>
            <h2>Collections</h2>
            <span>
              Explore KRVE tailoring, footwear and accessories.
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

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={
                  activeFilter === filter
                    ? styles.activeFilter
                    : ""
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
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
              const category = normalizeCategory(product.category);

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

                    <div className={styles.quickView}>
                      VIEW PIECE
                      <ArrowIcon />
                    </div>
                  </Link>

                  <div className={styles.productContent}>
                    <div className={styles.productHeading}>
                      <div>
                        <p>KRVE PRIVATE COLLECTION</p>
                        <h3>{product.name}</h3>
                      </div>

                      <strong>{money.format(product.price)}</strong>
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
                        aria-label={`Select ${product.name}`}
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
              <SparkleIcon size={36} />
            </div>

            <p>NO PIECES FOUND</p>

            <h2>This collection is being curated.</h2>

            <span>
              Select another category to continue discovering KRVE.
            </span>

            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
            >
              VIEW ALL PIECES
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
          <p>KRVE INTELLIGENCE</p>

          <h2>
            Find your signature
            <em>with KRVE AI.</em>
          </h2>

          <span>
            Create your personal style profile and receive luxury
            recommendations selected around you.
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
            PREMIUM QUALITY
            <span>Finest selected materials</span>
          </p>
        </div>

        <div>
          <strong>02</strong>
          <p>
            VIRTUAL TRY-ON
            <span>Preview before purchase</span>
          </p>
        </div>

        <div>
          <strong>03</strong>
          <p>
            EASY RETURNS
            <span>Refined shopping experience</span>
          </p>
        </div>

        <div>
          <strong>04</strong>
          <p>
            SECURE SHOPPING
            <span>Protected checkout</span>
          </p>
        </div>
      </section>
    </main>
  );
}
