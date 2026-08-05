import Image from "next/image";
import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  getProductBySlug,
  type KrveProduct,
} from "@/lib/api";

import styles from "./page.module.css";

export const dynamic =
  "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

function getCategoryLabel(
  category:
    KrveProduct["category"],
) {
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

function getMainImage(
  product: KrveProduct,
) {
  return (
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

function getGalleryImages(
  product: KrveProduct,
) {
  const mainImage =
    getMainImage(product);

  return Array.from(
    new Set(
      [
        mainImage,
        ...(product.gallery || []),
      ].filter(
        (
          image,
        ): image is string =>
          typeof image ===
            "string" &&
          image.trim().length >
            0,
      ),
    ),
  );
}

function getDiscountPercentage(
  price: number,
  compareAtPrice:
    | number
    | null,
) {
  if (
    !compareAtPrice ||
    compareAtPrice <= price
  ) {
    return null;
  }

  return Math.round(
    ((compareAtPrice -
      price) /
      compareAtPrice) *
      100,
  );
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const {
    slug,
  } = await params;

  let product:
    | KrveProduct
    | null = null;

  try {
    product =
      await getProductBySlug(
        decodeURIComponent(
          slug,
        ),
      );
  } catch (error) {
    console.error(
      "KRVE_PRODUCT_PAGE_ERROR",
      error,
    );
  }

  if (
    !product ||
    product.status !==
      "published"
  ) {
    notFound();
  }

  const mainImage =
    getMainImage(product);

  const gallery =
    getGalleryImages(
      product,
    );

  const discountPercentage =
    getDiscountPercentage(
      product.price,
      product.compareAtPrice,
    );

  const description =
    product.description ||
    product.shortDescription ||
    "A refined KRVE creation designed with contemporary styling, premium craftsmanship and timeless character.";

  return (
    <main className={styles.page}>
      <section
        className={
          styles.breadcrumbSection
        }
      >
        <div
          className={
            styles.container
          }
        >
          <nav
            className={
              styles.breadcrumb
            }
            aria-label="Breadcrumb"
          >
            <Link href="/">
              Home
            </Link>

            <span>
              /
            </span>

            <Link href="/collections">
              Collections
            </Link>

            <span>
              /
            </span>

            <span>
              {product.name}
            </span>
          </nav>
        </div>
      </section>

      <section
        className={
          styles.productSection
        }
      >
        <div
          className={`${styles.container} ${styles.productLayout}`}
        >
          <div
            className={
              styles.galleryColumn
            }
          >
            <div
              className={
                styles.mainImageCard
              }
            >
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 56vw"
                className={
                  styles.mainImage
                }
              />

              <div
                className={
                  styles.imageTopBar
                }
              >
                <span
                  className={
                    styles.categoryBadge
                  }
                >
                  {getCategoryLabel(
                    product.category,
                  )}
                </span>

                {product.newArrival && (
                  <span
                    className={
                      styles.newBadge
                    }
                  >
                    New Arrival
                  </span>
                )}
              </div>

              <button
                type="button"
                className={
                  styles.wishlistButton
                }
                aria-label="Add product to wishlist"
              >
                ♡
              </button>
            </div>

            {gallery.length >
              1 && (
              <div
                className={
                  styles.thumbnailGrid
                }
              >
                {gallery.map(
                  (
                    galleryImage,
                    index,
                  ) => (
                    <div
                      key={`${galleryImage}-${index}`}
                      className={
                        styles.thumbnailCard
                      }
                    >
                      <Image
                        src={
                          galleryImage
                        }
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        sizes="160px"
                        className={
                          styles.thumbnailImage
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <aside
            className={
              styles.informationColumn
            }
          >
            <div
              className={
                styles.productHeader
              }
            >
              <p
                className={
                  styles.collectionLabel
                }
              >
                KRVE Private Collection
              </p>

              <h1
                className={
                  styles.productTitle
                }
              >
                {product.name}
              </h1>

              <div
                className={
                  styles.ratingRow
                }
              >
                <span
                  className={
                    styles.stars
                  }
                >
                  ★★★★★
                </span>

                <span>
                  Premium KRVE
                  product
                </span>
              </div>
            </div>

            <div
              className={
                styles.priceSection
              }
            >
              <strong
                className={
                  styles.currentPrice
                }
              >
                {formatPrice(
                  product.price,
                  product.currency,
                )}
              </strong>

              {product.compareAtPrice !==
                null &&
                product.compareAtPrice >
                  product.price && (
                  <>
                    <del
                      className={
                        styles.comparePrice
                      }
                    >
                      {formatPrice(
                        product.compareAtPrice,
                        product.currency,
                      )}
                    </del>

                    {discountPercentage !==
                      null && (
                      <span
                        className={
                          styles.discountBadge
                        }
                      >
                        {
                          discountPercentage
                        }
                        % OFF
                      </span>
                    )}
                  </>
                )}
            </div>

            <p
              className={
                styles.taxNote
              }
            >
              Inclusive of all
              taxes
            </p>

            <p
              className={
                styles.description
              }
            >
              {description}
            </p>

            <div
              className={
                styles.metaPanel
              }
            >
              <div
                className={
                  styles.metaRow
                }
              >
                <span>
                  SKU
                </span>

                <strong>
                  {product.sku ||
                    "KRVE"}
                </strong>
              </div>

              <div
                className={
                  styles.metaRow
                }
              >
                <span>
                  Category
                </span>

                <strong>
                  {getCategoryLabel(
                    product.category,
                  )}
                </strong>
              </div>

              <div
                className={
                  styles.metaRow
                }
              >
                <span>
                  Availability
                </span>

                <strong
                  className={
                    product.inStock
                      ? styles.inStock
                      : styles.outOfStock
                  }
                >
                  {product.inStock
                    ? `${product.stockQuantity} units in stock`
                    : "Out of stock"}
                </strong>
              </div>
            </div>

            {product.sizes.length >
              0 && (
              <section
                className={
                  styles.optionSection
                }
              >
                <div
                  className={
                    styles.optionHeading
                  }
                >
                  <p>
                    Select size
                  </p>

                  <button
                    type="button"
                  >
                    Size guide
                  </button>
                </div>

                <div
                  className={
                    styles.optionButtons
                  }
                >
                  {product.sizes.map(
                    (size) => (
                      <button
                        type="button"
                        key={size}
                        className={
                          styles.optionButton
                        }
                      >
                        {size}
                      </button>
                    ),
                  )}
                </div>
              </section>
            )}

            {product.colours.length >
              0 && (
              <section
                className={
                  styles.optionSection
                }
              >
                <div
                  className={
                    styles.optionHeading
                  }
                >
                  <p>
                    Select colour
                  </p>
                </div>

                <div
                  className={
                    styles.optionButtons
                  }
                >
                  {product.colours.map(
                    (colour) => (
                      <button
                        type="button"
                        key={colour}
                        className={
                          styles.colourButton
                        }
                      >
                        <span
                          className={
                            styles.colourDot
                          }
                        />

                        {colour}
                      </button>
                    ),
                  )}
                </div>
              </section>
            )}

            <div
              className={
                styles.actionArea
              }
            >
              <button
                type="button"
                disabled={
                  !product.inStock
                }
                className={
                  styles.addToBagButton
                }
              >
                <span>
                  ♧
                </span>

                {product.inStock
                  ? "Add to bag"
                  : "Out of stock"}
              </button>

              <button
                type="button"
                className={
                  styles.buyNowButton
                }
                disabled={
                  !product.inStock
                }
              >
                Buy now
              </button>

              <Link
                href={`/virtual-try-on?product=${encodeURIComponent(
                  product.slug,
                )}`}
                className={
                  styles.tryOnButton
                }
              >
                <span>
                  ✦
                </span>

                Try with AI
                Virtual Try-On
              </Link>
            </div>

            <div
              className={
                styles.deliveryCard
              }
            >
              <div
                className={
                  styles.deliveryItem
                }
              >
                <span>
                  ◇
                </span>

                <div>
                  <strong>
                    Premium
                    quality
                  </strong>

                  <p>
                    Carefully
                    selected
                    materials
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.deliveryItem
                }
              >
                <span>
                  ↺
                </span>

                <div>
                  <strong>
                    Easy returns
                  </strong>

                  <p>
                    30-day return
                    policy
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.deliveryItem
                }
              >
                <span>
                  ♙
                </span>

                <div>
                  <strong>
                    Secure
                    checkout
                  </strong>

                  <p>
                    Protected
                    payment
                  </p>
                </div>
              </div>
            </div>

            <div
              className={
                styles.accordionArea
              }
            >
              <details open>
                <summary>
                  Product details
                </summary>

                <p>
                  {description}
                </p>
              </details>

              <details>
                <summary>
                  Shipping and
                  returns
                </summary>

                <p>
                  Orders are
                  securely packed.
                  Eligible products
                  can be returned
                  according to the
                  KRVE return
                  policy.
                </p>
              </details>

              <details>
                <summary>
                  Care
                  instructions
                </summary>

                <p>
                  Follow the care
                  instructions
                  provided with the
                  product to
                  preserve its fit,
                  finish and
                  appearance.
                </p>
              </details>
            </div>
          </aside>
        </div>
      </section>

      <section
        className={
          styles.bottomStrip
        }
      >
        <div
          className={`${styles.container} ${styles.bottomStripGrid}`}
        >
          <div>
            <span>
              ✦
            </span>

            <p>
              <strong>
                KRVE
                Craftsmanship
              </strong>

              <small>
                Refined design
                and premium
                finish
              </small>
            </p>
          </div>

          <div>
            <span>
              ◇
            </span>

            <p>
              <strong>
                Secure Shopping
              </strong>

              <small>
                Protected
                checkout
              </small>
            </p>
          </div>

          <div>
            <span>
              ↺
            </span>

            <p>
              <strong>
                Easy Returns
              </strong>

              <small>
                Simple return
                support
              </small>
            </p>
          </div>

          <div>
            <span>
              ♙
            </span>

            <p>
              <strong>
                AI Styling
              </strong>

              <small>
                Personalised
                fashion
                experience
              </small>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
