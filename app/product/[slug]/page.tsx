import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductDetailsSections from "@/components/product/product-details-sections";
import ProductPurchasePanel from "@/components/product/product-purchase-panel";
import SimilarProducts from "@/components/product/similar-products";

import {
  getProductBySlug,
  getProductsByCategory,
  type KrveProduct,
} from "@/lib/api";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProductImage(product: KrveProduct) {
  return (
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

function getGalleryImages(product: KrveProduct) {
  const images = [
    getProductImage(product),
    ...(Array.isArray(product.gallery) ? product.gallery : []),
  ];

  return Array.from(
    new Set(
      images.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      ),
    ),
  );
}

function getCategoryLabel(category: KrveProduct["category"]) {
  switch (category) {
    case "womenswear":
      return "Womenswear";

    case "kidswear":
      return "Kidswear";

    case "accessories":
      return "Accessories";

    case "footwear":
      return "Footwear";

    default:
      return "Menswear";
  }
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  let product: KrveProduct | null = null;

  try {
    product = await getProductBySlug(
      decodeURIComponent(slug),
    );
  } catch (error) {
    console.error(
      "KRVE_PRODUCT_PAGE_ERROR",
      error,
    );
  }

  if (
    !product ||
    product.status !== "published"
  ) {
    notFound();
  }

  let similarProducts: KrveProduct[] = [];

  try {
    const categoryProducts =
      await getProductsByCategory(
        product.category,
        12,
      );

    similarProducts = categoryProducts
      .filter(
        (item) =>
          item.id !== product.id &&
          item.status === "published",
      )
      .slice(0, 8);
  } catch (error) {
    console.error(
      "KRVE_SIMILAR_PRODUCTS_ERROR",
      error,
    );
  }

  const galleryImages =
    getGalleryImages(product);

  const mainImage =
    galleryImages[0] ||
    "/images/products/product-1.jpg";

  const secondaryImages =
    galleryImages.slice(1);

  return (
    <main className={styles.page}>
      <section className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <nav
            className={styles.breadcrumb}
            aria-label="Breadcrumb"
          >
            <Link href="/">
              Home
            </Link>

            <span>/</span>

            <Link href="/collections">
              Collections
            </Link>

            <span>/</span>

            <Link
              href={`/collections?category=${product.category}`}
            >
              {getCategoryLabel(
                product.category,
              )}
            </Link>

            <span>/</span>

            <strong>
              {product.name}
            </strong>
          </nav>
        </div>
      </section>

      <section className={styles.productArea}>
        <div
          className={`${styles.container} ${styles.productGrid}`}
        >
          <div className={styles.leftColumn}>
            <section
              className={styles.gallerySection}
            >
              <div
                className={styles.mainImageCard}
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 58vw"
                  className={styles.mainImage}
                />

                <div
                  className={styles.imageLabels}
                >
                  <span>
                    {getCategoryLabel(
                      product.category,
                    )}
                  </span>

                  {product.newArrival && (
                    <strong>
                      New Arrival
                    </strong>
                  )}
                </div>

                <button
                  type="button"
                  className={
                    styles.imageWishlist
                  }
                  aria-label="Add product to wishlist"
                >
                  ♡
                </button>
              </div>

              {secondaryImages.length > 0 && (
                <div
                  className={
                    styles.secondaryImageGrid
                  }
                >
                  {secondaryImages.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className={
                          styles.secondaryImageCard
                        }
                      >
                        <Image
                          src={image}
                          alt={`${product.name} view ${index + 2}`}
                          fill
                          sizes="(max-width: 700px) 100vw, 28vw"
                          className={
                            styles.secondaryImage
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            <ProductPurchasePanel
              product={product}
            />
          </div>

          <aside className={styles.rightColumn}>
            <section
              className={styles.productIdentity}
            >
              <p className={styles.eyebrow}>
                KRVE Signature Collection
              </p>

              <h1>
                {product.name}
              </h1>

              <div className={styles.ratingLine}>
                <strong>
                  4.7 ★
                </strong>

                <span>
                  Premium customer rating
                </span>
              </div>
            </section>

            <section
              className={styles.descriptionSection}
            >
              <h2>
                Product Story
              </h2>

              <p>
                {product.description ||
                  product.shortDescription ||
                  "A premium KRVE creation designed for modern luxury, comfort and confident everyday styling."}
              </p>
            </section>

            <section
              className={styles.quickMeta}
            >
              <div>
                <span>
                  SKU
                </span>

                <strong>
                  {product.sku || "KRVE"}
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {getCategoryLabel(
                    product.category,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Availability
                </span>

                <strong
                  className={
                    product.inStock
                      ? styles.available
                      : styles.unavailable
                  }
                >
                  {product.inStock
                    ? `${product.stockQuantity} units in stock`
                    : "Out of stock"}
                </strong>
              </div>
            </section>

            <ProductDetailsSections
              product={product}
            />
          </aside>
        </div>
      </section>

      <section className={styles.similarArea}>
        <div className={styles.container}>
          <SimilarProducts
            products={similarProducts}
          />
        </div>
      </section>
    </main>
  );
}
