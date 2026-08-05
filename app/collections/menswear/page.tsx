import Image from "next/image";
import Link from "next/link";

import {
  getProductsByCategory,
  type KrveProduct,
} from "@/lib/api";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menswear | KRVE The Fashion Studio",
  description:
    "Explore KRVE menswear including T-shirts, shirts, trousers, kurtas, formal wear and premium essentials.",
};

const menswearCategories = [
  {
    title: "T-Shirts",
    slug: "tshirts",
    image:
      "/images/categories/menswear-tshirts.jpg",
  },
  {
    title: "Jeans & Trousers",
    slug: "jeans-trousers",
    image:
      "/images/categories/menswear-trousers.jpg",
  },
  {
    title: "Shirts",
    slug: "shirts",
    image:
      "/images/categories/menswear-shirts.jpg",
  },
  {
    title: "Kurta & Sets",
    slug: "kurta-sets",
    image:
      "/images/categories/menswear-kurta.jpg",
  },
  {
    title: "Formal Wear",
    slug: "formal-wear",
    image:
      "/images/categories/menswear-formal.jpg",
  },
  {
    title: "Jackets",
    slug: "jackets",
    image:
      "/images/categories/menswear-jackets.jpg",
  },
  {
    title: "Hoodies",
    slug: "hoodies",
    image:
      "/images/categories/menswear-hoodies.jpg",
  },
  {
    title: "Footwear",
    slug: "footwear",
    image:
      "/images/categories/menswear-footwear.jpg",
  },
];

function formatPrice(
  price: number,
  currency = "INR",
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function getProductImage(
  product: KrveProduct,
) {
  return (
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

export default async function MenswearPage() {
  let products: KrveProduct[] = [];

  try {
    products =
      await getProductsByCategory(
        "menswear",
        100,
      );
  } catch (error) {
    console.error(
      "MENSWEAR_PRODUCTS_ERROR",
      error,
    );
  }

  const publishedProducts =
    products.filter(
      (product) =>
        product.status ===
        "published",
    );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.container}>
          <p className={styles.eyebrow}>
            KRVE MEN
          </p>

          <h1>
            Menswear
          </h1>

          <p className={styles.heroText}>
            Premium everyday style,
            statement silhouettes and
            refined essentials for the
            modern KRVE wardrobe.
          </p>
        </div>
      </section>

      <section className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categoryScroller}>
            {menswearCategories.map(
              (category) => (
                <Link
                  key={category.slug}
                  href={`/collections/menswear/${category.slug}`}
                  className={styles.categoryItem}
                >
                  <div className={styles.categoryImage}>
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="130px"
                    />
                  </div>

                  <span>
                    {category.title}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p>
                THE KRVE EDIT
              </p>

              <h2>
                All Menswear
              </h2>
            </div>

            <span>
              {publishedProducts.length} Products
            </span>
          </div>

          {publishedProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>
                New menswear arriving soon.
              </h3>

              <p>
                Publish menswear products from
                KEOS Center and they will
                automatically appear here.
              </p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {publishedProducts.map(
                (product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className={styles.productCard}
                  >
                    <div className={styles.productImage}>
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 700px) 50vw, 25vw"
                      />

                      {product.newArrival && (
                        <span className={styles.newBadge}>
                          NEW
                        </span>
                      )}

                      <button
                        type="button"
                        className={styles.wishlistButton}
                        aria-label={`Add ${product.name} to wishlist`}
                      >
                        ♡
                      </button>
                    </div>

                    <div className={styles.productInfo}>
                      <p className={styles.productCategory}>
                        MENSWEAR
                      </p>

                      <h3>
                        {product.name}
                      </h3>

                      <div className={styles.priceRow}>
                        <strong>
                          {formatPrice(
                            product.price,
                            product.currency,
                          )}
                        </strong>

                        {product.compareAtPrice !== null &&
                          product.compareAtPrice >
                            product.price && (
                            <del>
                              {formatPrice(
                                product.compareAtPrice,
                                product.currency,
                              )}
                            </del>
                          )}
                      </div>

                      <p className={styles.stock}>
                        {product.inStock
                          ? `${product.stockQuantity} in stock`
                          : "Out of stock"}
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
