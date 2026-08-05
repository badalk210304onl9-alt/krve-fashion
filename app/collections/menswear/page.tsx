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
    "Explore premium KRVE menswear including oversized T-shirts, shirts, trousers, formal wear, jackets, hoodies and footwear.",
};

type MenswearPageProps = {
  searchParams: Promise<{
    type?: string;
    sort?: string;
  }>;
};

type MenswearSubcategory = {
  title: string;
  slug: string;
  image: string;
  keywords: string[];
};

const menswearCategories: MenswearSubcategory[] = [
  {
    title: "All Menswear",
    slug: "all",
    image: "/images/hero-model.jpg",
    keywords: [],
  },
  {
    title: "T-Shirts",
    slug: "tshirts",
    image: "/images/products/product-1.jpg",
    keywords: [
      "t-shirt",
      "tshirt",
      "tee",
      "oversized",
    ],
  },
  {
    title: "Jeans & Trousers",
    slug: "jeans-trousers",
    image: "/images/products/product-2.jpg",
    keywords: [
      "jeans",
      "trouser",
      "pants",
      "denim",
      "cargo",
    ],
  },
  {
    title: "Shirts",
    slug: "shirts",
    image: "/images/products/product-2.jpg",
    keywords: [
      "shirt",
      "overshirt",
    ],
  },
  {
    title: "Kurta & Sets",
    slug: "kurta-sets",
    image: "/images/hero-model.jpg",
    keywords: [
      "kurta",
      "ethnic",
      "set",
      "traditional",
    ],
  },
  {
    title: "Formal Wear",
    slug: "formal-wear",
    image: "/images/products/product-1.jpg",
    keywords: [
      "formal",
      "blazer",
      "suit",
      "office",
      "tailoring",
    ],
  },
  {
    title: "Jackets",
    slug: "jackets",
    image: "/images/products/product-1.jpg",
    keywords: [
      "jacket",
      "bomber",
      "coat",
      "outerwear",
    ],
  },
  {
    title: "Hoodies",
    slug: "hoodies",
    image: "/images/products/product-2.jpg",
    keywords: [
      "hoodie",
      "sweatshirt",
      "pullover",
    ],
  },
  {
    title: "Footwear",
    slug: "footwear",
    image: "/images/products/product-4.jpg",
    keywords: [
      "shoe",
      "shoes",
      "sneaker",
      "footwear",
      "loafer",
    ],
  },
];

function formatPrice(
  price: number,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
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

function getDiscountPercentage(
  product: KrveProduct,
) {
  if (
    product.compareAtPrice === null ||
    product.compareAtPrice <= product.price
  ) {
    return null;
  }

  return Math.round(
    ((product.compareAtPrice -
      product.price) /
      product.compareAtPrice) *
      100,
  );
}

function getSelectedCategory(
  type: string,
) {
  return (
    menswearCategories.find(
      (category) =>
        category.slug === type,
    ) ?? menswearCategories[0]
  );
}

function productMatchesCategory(
  product: KrveProduct,
  category: MenswearSubcategory,
) {
  if (
    category.slug === "all" ||
    category.keywords.length === 0
  ) {
    return true;
  }

  const searchableText = [
    product.name,
    product.shortDescription,
    product.description,
    product.sku,
    product.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return category.keywords.some(
    (keyword) =>
      searchableText.includes(
        keyword.toLowerCase(),
      ),
  );
}

function sortProducts(
  products: KrveProduct[],
  sort: string,
) {
  const copiedProducts = [
    ...products,
  ];

  switch (sort) {
    case "price-low":
      return copiedProducts.sort(
        (first, second) =>
          first.price -
          second.price,
      );

    case "price-high":
      return copiedProducts.sort(
        (first, second) =>
          second.price -
          first.price,
      );

    case "name":
      return copiedProducts.sort(
        (first, second) =>
          first.name.localeCompare(
            second.name,
          ),
      );

    case "newest":
      return copiedProducts.sort(
        (first, second) =>
          new Date(
            second.createdAt,
          ).getTime() -
          new Date(
            first.createdAt,
          ).getTime(),
      );

    default:
      return copiedProducts.sort(
        (first, second) => {
          if (
            first.featured !==
            second.featured
          ) {
            return first.featured
              ? -1
              : 1;
          }

          if (
            first.newArrival !==
            second.newArrival
          ) {
            return first.newArrival
              ? -1
              : 1;
          }

          return 0;
        },
      );
  }
}

export default async function MenswearPage({
  searchParams,
}: MenswearPageProps) {
  const resolvedSearchParams =
    await searchParams;

  const selectedType =
    resolvedSearchParams.type ||
    "all";

  const selectedSort =
    resolvedSearchParams.sort ||
    "featured";

  const selectedCategory =
    getSelectedCategory(
      selectedType,
    );

  let products: KrveProduct[] =
    [];

  try {
    products =
      await getProductsByCategory(
        "menswear",
        100,
      );
  } catch (error) {
    console.error(
      "KRVE_MENSWEAR_PRODUCTS_ERROR",
      error,
    );
  }

  const publishedProducts =
    products.filter(
      (product) =>
        product.status ===
        "published",
    );

  const filteredProducts =
    publishedProducts.filter(
      (product) =>
        productMatchesCategory(
          product,
          selectedCategory,
        ),
    );

  const visibleProducts =
    sortProducts(
      filteredProducts,
      selectedSort,
    );

  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
      >
        <Image
          src="/images/hero-model.jpg"
          alt="KRVE premium menswear"
          fill
          priority
          sizes="100vw"
          className={
            styles.heroImage
          }
        />

        <div
          className={
            styles.heroOverlay
          }
        />

        <div
          className={
            styles.heroGlow
          }
        />

        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.heroContent
            }
          >
            <p
              className={
                styles.eyebrow
              }
            >
              KRVE MEN · 2026
            </p>

            <h1>
              Menswear
            </h1>

            <p
              className={
                styles.heroDescription
              }
            >
              Premium streetwear,
              modern tailoring and
              timeless essentials
              crafted for confident
              everyday style.
            </p>

            <div
              className={
                styles.heroActions
              }
            >
              <Link
                href="#menswear-products"
                className={
                  styles.primaryButton
                }
              >
                SHOP MENSWEAR
                <span>→</span>
              </Link>

              <Link
                href="/virtual-try-on"
                className={
                  styles.secondaryButton
                }
              >
                ✦ TRY WITH KRVE AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className={
          styles.categorySection
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.categoryHeading
            }
          >
            <div>
              <p>
                SHOP BY STYLE
              </p>

              <h2>
                Explore Menswear
              </h2>
            </div>

            <span>
              Select a category
            </span>
          </div>

          <div
            className={
              styles.categoryScroller
            }
          >
            {menswearCategories.map(
              (category) => {
                const active =
                  selectedCategory.slug ===
                  category.slug;

                return (
                  <Link
                    key={
                      category.slug
                    }
                    href={`/collections/menswear?type=${category.slug}&sort=${selectedSort}#menswear-products`}
                    className={`${styles.categoryItem} ${
                      active
                        ? styles.activeCategory
                        : ""
                    }`}
                  >
                    <div
                      className={
                        styles.categoryImage
                      }
                    >
                      <Image
                        src={
                          category.image
                        }
                        alt={
                          category.title
                        }
                        fill
                        sizes="120px"
                      />

                      <span
                        className={
                          styles.categoryImageOverlay
                        }
                      />
                    </div>

                    <strong>
                      {category.title}
                    </strong>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section
        id="menswear-products"
        className={
          styles.productsSection
        }
      >
        <div
          className={
            styles.container
          }
        >
          <div
            className={
              styles.productsHeader
            }
          >
            <div>
              <p
                className={
                  styles.sectionLabel
                }
              >
                THE KRVE MEN EDIT
              </p>

              <h2>
                {
                  selectedCategory.title
                }
              </h2>

              <span
                className={
                  styles.resultCount
                }
              >
                {
                  visibleProducts.length
                }{" "}
                products available
              </span>
            </div>

            <div
              className={
                styles.sortArea
              }
            >
              <span>
                SORT BY
              </span>

              <div
                className={
                  styles.sortLinks
                }
              >
                <Link
                  href={`/collections/menswear?type=${selectedCategory.slug}&sort=featured#menswear-products`}
                  className={
                    selectedSort ===
                    "featured"
                      ? styles.activeSort
                      : ""
                  }
                >
                  Featured
                </Link>

                <Link
                  href={`/collections/menswear?type=${selectedCategory.slug}&sort=newest#menswear-products`}
                  className={
                    selectedSort ===
                    "newest"
                      ? styles.activeSort
                      : ""
                  }
                >
                  Newest
                </Link>

                <Link
                  href={`/collections/menswear?type=${selectedCategory.slug}&sort=price-low#menswear-products`}
                  className={
                    selectedSort ===
                    "price-low"
                      ? styles.activeSort
                      : ""
                  }
                >
                  Price Low
                </Link>

                <Link
                  href={`/collections/menswear?type=${selectedCategory.slug}&sort=price-high#menswear-products`}
                  className={
                    selectedSort ===
                    "price-high"
                      ? styles.activeSort
                      : ""
                  }
                >
                  Price High
                </Link>
              </div>
            </div>
          </div>

          {visibleProducts.length ===
          0 ? (
            <div
              className={
                styles.emptyState
              }
            >
              <div
                className={
                  styles.emptyIcon
                }
              >
                K
              </div>

              <p>
                KRVE MEN
              </p>

              <h3>
                New{" "}
                {
                  selectedCategory.title
                }{" "}
                arriving soon.
              </h3>

              <span>
                Publish matching
                menswear products
                from KEOS Center and
                they will
                automatically appear
                here.
              </span>

              <Link
                href="/collections/menswear?type=all"
              >
                VIEW ALL MENSWEAR
                →
              </Link>
            </div>
          ) : (
            <div
              className={
                styles.productGrid
              }
            >
              {visibleProducts.map(
                (
                  product,
                  index,
                ) => {
                  const discount =
                    getDiscountPercentage(
                      product,
                    );

                  return (
                    <article
                      key={
                        product.id
                      }
                      className={
                        styles.productCard
                      }
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        className={
                          styles.productImageLink
                        }
                      >
                        <div
                          className={
                            styles.productImage
                          }
                        >
                          <Image
                            src={getProductImage(
                              product,
                            )}
                            alt={
                              product.name
                            }
                            fill
                            priority={
                              index < 4
                            }
                            sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw"
                          />

                          <div
                            className={
                              styles.productImageShade
                            }
                          />

                          <div
                            className={
                              styles.productBadges
                            }
                          >
                            {product.newArrival && (
                              <span>
                                NEW
                              </span>
                            )}

                            {product.featured && (
                              <strong>
                                FEATURED
                              </strong>
                            )}
                          </div>

                          <button
                            type="button"
                            className={
                              styles.wishlistButton
                            }
                            aria-label={`Add ${product.name} to wishlist`}
                          >
                            ♡
                          </button>

                          <div
                            className={
                              styles.quickView
                            }
                          >
                            VIEW PRODUCT
                            <span>→</span>
                          </div>
                        </div>
                      </Link>

                      <div
                        className={
                          styles.productInfo
                        }
                      >
                        <div
                          className={
                            styles.productTopLine
                          }
                        >
                          <p>
                            MENSWEAR
                          </p>

                          <span>
                            4.7 ★
                          </span>
                        </div>

                        <Link
                          href={`/product/${product.slug}`}
                        >
                          <h3>
                            {
                              product.name
                            }
                          </h3>
                        </Link>

                        <p
                          className={
                            styles.productDescription
                          }
                        >
                          {product.shortDescription ||
                            "Premium KRVE menswear crafted for elevated everyday style."}
                        </p>

                        <div
                          className={
                            styles.priceRow
                          }
                        >
                          {discount !==
                            null && (
                            <span
                              className={
                                styles.discount
                              }
                            >
                              {
                                discount
                              }
                              % OFF
                            </span>
                          )}

                          {product.compareAtPrice !==
                            null &&
                            product.compareAtPrice >
                              product.price && (
                              <del>
                                {formatPrice(
                                  product.compareAtPrice,
                                  product.currency,
                                )}
                              </del>
                            )}

                          <strong>
                            {formatPrice(
                              product.price,
                              product.currency,
                            )}
                          </strong>
                        </div>

                        <div
                          className={
                            styles.stockRow
                          }
                        >
                          <span
                            className={
                              product.inStock
                                ? styles.stockDot
                                : styles.outStockDot
                            }
                          />

                          <p>
                            {product.inStock
                              ? `${product.stockQuantity} in stock`
                              : "Out of stock"}
                          </p>
                        </div>

                        {product.sizes.length >
                          0 && (
                          <div
                            className={
                              styles.sizePreview
                            }
                          >
                            {product.sizes
                              .slice(
                                0,
                                5,
                              )
                              .map(
                                (
                                  size,
                                ) => (
                                  <span
                                    key={
                                      size
                                    }
                                  >
                                    {
                                      size
                                    }
                                  </span>
                                ),
                              )}
                          </div>
                        )}

                        <div
                          className={
                            styles.cardActions
                          }
                        >
                          <Link
                            href={`/product/${product.slug}`}
                            className={
                              styles.discoverButton
                            }
                          >
                            DISCOVER
                            <span>→</span>
                          </Link>

                          <Link
                            href={`/virtual-try-on?product=${encodeURIComponent(
                              product.slug,
                            )}`}
                            className={
                              styles.tryOnButton
                            }
                          >
                            ✦ TRY ON
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>

      <section
        className={
          styles.assuranceStrip
        }
      >
        <div
          className={`${styles.container} ${styles.assuranceGrid}`}
        >
          <div>
            <span>◇</span>

            <p>
              <strong>
                PREMIUM QUALITY
              </strong>

              <small>
                Carefully selected
                fabrics
              </small>
            </p>
          </div>

          <div>
            <span>↺</span>

            <p>
              <strong>
                EASY RETURNS
              </strong>

              <small>
                Simple return
                support
              </small>
            </p>
          </div>

          <div>
            <span>✦</span>

            <p>
              <strong>
                KRVE AI STYLING
              </strong>

              <small>
                Personalised fashion
                experience
              </small>
            </p>
          </div>

          <div>
            <span>♙</span>

            <p>
              <strong>
                SECURE SHOPPING
              </strong>

              <small>
                Protected checkout
              </small>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
