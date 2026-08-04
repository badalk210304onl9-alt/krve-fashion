"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { products } from "@/lib/catalog";

import styles from "./wishlist.module.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      aria-hidden="true"
    >
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m7 7 1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="44"
      height="44"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </svg>
  );
}

export default function WishlistPage() {
  const {
    wishlist,
    toggleWishlist,
    hydrated,
  } = useCart();

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  return (
    <main className={styles.page}>
      <Link
        href="/"
        className={styles.backdrop}
        aria-label="Close wishlist"
      />

      <aside className={styles.drawer}>
        <header className={styles.drawerHeader}>
          <div>
            <h1>
              <span>YOUR</span> WISHLIST
            </h1>

            <p>
              {savedProducts.length}{" "}
              {savedProducts.length === 1
                ? "SAVED PIECE"
                : "SAVED PIECES"}
            </p>
          </div>

          <Link
            href="/"
            className={styles.closeButton}
            aria-label="Close wishlist"
          >
            <CloseIcon />
          </Link>
        </header>

        {!hydrated ? (
          <div className={styles.loading}>
            Preparing your private selection...
          </div>
        ) : savedProducts.length === 0 ? (
          <section className={styles.empty}>
            <div className={styles.emptyIcon}>
              <HeartIcon />
            </div>

            <p className={styles.emptyLabel}>
              YOUR PRIVATE SELECTION
            </p>

            <h2>
              Save the pieces you love.
            </h2>

            <p className={styles.emptyText}>
              Build your personal KRVE wardrobe by saving refined pieces,
              luxury essentials and signature collections.
            </p>

            <Link
              href="/collections"
              className={styles.primaryButton}
            >
              EXPLORE COLLECTIONS <span>→</span>
            </Link>

            <Link
              href="/virtual-try-on"
              className={styles.secondaryButton}
            >
              <SparkleIcon />
              VIRTUAL TRY-ON
            </Link>
          </section>
        ) : (
          <>
            <div className={styles.productList}>
              {savedProducts.map((product) => (
                <article
                  key={product.id}
                  className={styles.product}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className={styles.imageBox}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="135px"
                    />

                    <span className={styles.imageOverlay} />
                  </Link>

                  <div className={styles.productInfo}>
                    <div className={styles.productHeading}>
                      <div>
                        <Link href={`/product/${product.id}`}>
                          <h2>{product.name}</h2>
                        </Link>

                        <p>
                          KRVE PRIVATE COLLECTION
                        </p>
                      </div>

                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() =>
                          toggleWishlist(product.id)
                        }
                        aria-label={`Remove ${product.name} from wishlist`}
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <p className={styles.description}>
                      Refined craftsmanship, intelligent styling and timeless
                      KRVE design.
                    </p>

                    <div className={styles.productFooter}>
                      <strong>
                        {money.format(product.price)}
                      </strong>

                      <Link
                        href={`/product/${product.id}`}
                        className={styles.viewButton}
                      >
                        VIEW PIECE <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section className={styles.stylistCard}>
              <div className={styles.stylistIcon}>
                <SparkleIcon />
              </div>

              <div>
                <p>KRVE AI STYLIST</p>

                <h3>
                  Discover pieces selected around you.
                </h3>

                <span>
                  Receive personal recommendations based on your saved styles.
                </span>
              </div>

              <Link href="/stylist">
                EXPLORE <span>→</span>
              </Link>
            </section>

            <div className={styles.actions}>
              <Link
                href="/collections"
                className={styles.primaryButton}
              >
                CONTINUE SHOPPING <span>→</span>
              </Link>

              <Link
                href="/virtual-try-on"
                className={styles.secondaryButton}
              >
                TRY SAVED LOOKS VIRTUALLY
              </Link>
            </div>

            <div className={styles.footerNote}>
              <HeartIcon />

              <div>
                <strong>
                  YOUR WISHLIST IS SAVED
                </strong>

                <p>
                  Sign in to access your saved pieces across all devices.
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </main>
  );
}
