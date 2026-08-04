"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  useCart,
} from "@/components/cart-provider";

import type {
  KrveProduct,
  ProductCategory,
} from "@/lib/api";

import styles from "./collections.module.css";

type CategoryFilter =
  | "all"
  | ProductCategory;

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "name";

type CollectionsClientProps = {
  initialProducts: KrveProduct[];
  apiConnected: boolean;
};

type IconProps = {
  size?: number;
};

const categoryOptions: {
  id: ProductCategory;
  title: string;
  subtitle: string;
  number: string;
}[] = [
  {
    id: "menswear",
    title: "Menswear",
    subtitle:
      "Tailoring, shirts and refined essentials",
    number: "01",
  },
  {
    id: "womenswear",
    title: "Womenswear",
    subtitle:
      "Modern silhouettes and timeless elegance",
    number: "02",
  },
  {
    id: "kidswear",
    title: "Kidswear",
    subtitle:
      "Premium style for younger wardrobes",
    number: "03",
  },
  {
    id: "accessories",
    title: "Accessories",
    subtitle:
      "Bags, watches, belts and finishing pieces",
    number: "04",
  },
  {
    id: "footwear",
    title: "Footwear",
    subtitle:
      "Luxury shoes and contemporary sneakers",
    number: "05",
  },
];

function HeartIcon({
  size = 21,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          M20.4 5.9
          c-1.9-2-5-1.8-6.8.2
          L12 7.9
          10.4 6.1
          c-1.8-2-4.9-2.2-6.8-.2
          -2 2.1-1.9 5.5.3 7.7
          L12 20.9
          l8.1-7.3
          c2.2-2.2 2.3-5.6.3-7.7Z
        "
      />
    </svg>
  );
}

function BagIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          M5.4 8.5
          h13.2
          l-.95 11.7
          H6.35
          L5.4 8.5Z
        "
      />

      <path
        d="
          M8.7 8.5
          V6.8
          a3.3 3.3 0 0 1 6.6 0
          v1.7
        "
      />
    </svg>
  );
}

function ArrowIcon({
  size = 17,
}: IconProps) {
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

function SparkleIcon({
  size = 20,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          m12 2
          1.7 5.3
          L19 9
          l-5.3 1.7
          L12 16
          l-1.7-5.3
          L5 9
          l5.3-1.7
          L12 2Z
        "
      />

      <path
        d="
          m19 15
          .8 2.2
          L22 18
          l-2.2.8
          L19 21
          l-.8-2.2
          L16 18
          l2.2-.8
          L19 15Z
        "
      />
    </svg>
  );
}

function FilterIcon({
  size = 18,
}: IconProps) {
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

function SearchIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6.3"
      />

      <path d="m15.4 15.4 4.6 4.6" />
    </svg>
  );
}

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
  category: ProductCategory,
) {
  const matched =
    categoryOptions.find(
      (item) =>
        item.id === category,
    );

  return (
    matched?.title ??
    "KRVE Collection"
  );
}

function getProductImage(
  product: KrveProduct,
) {
  return (
    product.image ||
    product.imageUrl ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

function getCategoryImage(
  category: ProductCategory,
  products: KrveProduct[],
) {
  const categoryProduct =
    products.find(
      (product) =>
        product.category === category,
    );

  return categoryProduct
    ? getProductImage(
        categoryProduct,
      )
    : "/images/products/product-1.jpg";
}

function getCategoryCount(
  category: ProductCategory,
  products: KrveProduct[],
) {
  return products.filter(
    (product) =>
      product.category === category,
  ).length;
}

export default function CollectionsClient({
  initialProducts,
  apiConnected,
}: CollectionsClientProps) {
  const {
    wishlist,
    toggleWishlist,
  } = useCart();

  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState<CategoryFilter>(
      "all",
    );

  const [
    sortOption,
    setSortOption,
  ] =
    useState<SortOption>(
      "featured",
    );

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const visibleProducts =
    useMemo(() => {
      let result =
        [...initialProducts];

      if (
        activeCategory !== "all"
      ) {
        result =
          result.filter(
            (product) =>
              product.category ===
              activeCategory,
          );
      }

      const cleanSearch =
        searchQuery
          .trim()
          .toLowerCase();

      if (cleanSearch) {
        result =
          result.filter(
            (product) => {
              const content = [
                product.name,
                product.category,
                product.description,
                product.shortDescription,
                product.sku,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return content.includes(
                cleanSearch,
              );
            },
          );
      }

      if (
        sortOption ===
        "price-low"
      ) {
        result.sort(
          (first, second) =>
            first.price -
            second.price,
        );
      }

      if (
        sortOption ===
        "price-high"
      ) {
        result.sort(
          (first, second) =>
            second.price -
            first.price,
        );
      }

      if (
        sortOption === "name"
      ) {
        result.sort(
          (first, second) =>
            first.name.localeCompare(
              second.name,
            ),
        );
      }

      if (
        sortOption === "newest"
      ) {
        result.sort(
          (first, second) =>
            new Date(
              second.createdAt ||
                0,
            ).getTime() -
            new Date(
              first.createdAt ||
                0,
            ).getTime(),
        );
      }

      if (
        sortOption ===
        "featured"
      ) {
        result.sort(
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

      return result;
    }, [
      activeCategory,
      initialProducts,
      searchQuery,
      sortOption,
    ]);

  function selectCategory(
    category: CategoryFilter,
  ) {
    setActiveCategory(
      category,
    );

    window.setTimeout(
      () => {
        document
          .getElementById(
            "collection-products",
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      },
      50,
    );
  }

  return (
    <main
      className={styles.page}
    >
      <section
        className={styles.hero}
      >
        <div
          className={
            styles.heroPattern
          }
        />

        <div
          className={
            styles.heroMonogram
          }
        >
          K
        </div>

        <div
          className={
            styles.heroContent
          }
        >
          <div
            className={
              styles.eyebrow
            }
          >
            <span />

            <SparkleIcon />

            KRVE PRIVATE
            COLLECTIONS
          </div>

          <h1>
            Designed for
            <em>
              every wardrobe.
            </em>
          </h1>

          <p>
            Explore luxury
            menswear,
            womenswear,
            kidswear,
            accessories and
            footwear—curated
            through the refined
            world of KRVE.
          </p>

          <div
            className={
              styles.heroMeta
            }
          >
            <div>
              <strong>
                05
              </strong>

              <span>
                MAIN CATEGORIES
              </span>
            </div>

            <div>
              <strong>
                {
                  initialProducts.length
                }
              </strong>

              <span>
                LIVE PRODUCTS
              </span>
            </div>

            <div>
              <strong>
                {apiConnected
                  ? "LIVE"
                  : "OFF"}
              </strong>

              <span>
                KEOS CONNECTION
              </span>
            </div>
          </div>
        </div>

        <div
          className={
            styles.heroCard
          }
        >
          <SparkleIcon
            size={35}
          />

          <p>
            KRVE INTELLIGENCE
          </p>

          <h2>
            Your personal
            <em>
              fashion edit.
            </em>
          </h2>

          <span>
            Let KRVE AI
            understand your
            style and recommend
            pieces selected
            around your
            personality.
          </span>

          <Link
            href="/ai-stylist"
          >
            OPEN AI STYLIST
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section
        className={
          styles.categorySection
        }
      >
        <header
          className={
            styles.categoryHeading
          }
        >
          <div>
            <p>
              EXPLORE BY
              CATEGORY
            </p>

            <h2>
              Shop your world.
            </h2>
          </div>

          <span>
            Five distinctive
            collections. One
            KRVE experience.
          </span>
        </header>

        <div
          className={
            styles.categoryGrid
          }
        >
          {categoryOptions.map(
            (category) => {
              const count =
                getCategoryCount(
                  category.id,
                  initialProducts,
                );

              return (
                <button
                  key={
                    category.id
                  }
                  type="button"
                  className={`${
                    styles.categoryCard
                  } ${
                    activeCategory ===
                    category.id
                      ? styles.activeCategoryCard
                      : ""
                  }`}
                  onClick={() =>
                    selectCategory(
                      category.id,
                    )
                  }
                >
                  <Image
                    src={getCategoryImage(
                      category.id,
                      initialProducts,
                    )}
                    alt={
                      category.title
                    }
                    fill
                    sizes="
                      (max-width: 650px)
                      100vw,
                      (max-width: 1100px)
                      50vw,
                      20vw
                    "
                  />

                  <span
                    className={
                      styles.categoryShade
                    }
                  />

                  <span
                    className={
                      styles.categoryNumber
                    }
                  >
                    {
                      category.number
                    }
                  </span>

                  <div
                    className={
                      styles.categoryCopy
                    }
                  >
                    <p>
                      {count} LIVE
                      PIECES
                    </p>

                    <h3>
                      {
                        category.title
                      }
                    </h3>

                    <span>
                      {
                        category.subtitle
                      }
                    </span>

                    <strong>
                      EXPLORE
                      <ArrowIcon />
                    </strong>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </section>

      <section
        id="collection-products"
        className={
          styles.collectionArea
        }
      >
        <header
          className={
            styles.collectionHeader
          }
        >
          <div>
            <p>
              THE PRIVATE EDIT
            </p>

            <h2>
              {activeCategory ===
              "all"
                ? "All Collections"
                : getCategoryLabel(
                    activeCategory,
                  )}
            </h2>

            <span>
              Explore premium
              pieces controlled
              directly through
              the KRVE Enterprise
              Operating System.
            </span>
          </div>

          <div
            className={
              styles.resultCount
            }
          >
            <strong>
              {
                visibleProducts.length
              }
            </strong>

            <span>
              PIECES
            </span>
          </div>
        </header>

        <div
          className={
            styles.toolbar
          }
        >
          <div
            className={
              styles.filters
            }
          >
            <div
              className={
                styles.filterLabel
              }
            >
              <FilterIcon />
              FILTER
            </div>

            <button
              type="button"
              className={
                activeCategory ===
                "all"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() =>
                setActiveCategory(
                  "all",
                )
              }
            >
              ALL
            </button>

            {categoryOptions.map(
              (category) => (
                <button
                  key={
                    category.id
                  }
                  type="button"
                  className={
                    activeCategory ===
                    category.id
                      ? styles.activeFilter
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.id,
                    )
                  }
                >
                  {category.title.toUpperCase()}
                </button>
              ),
            )}
          </div>

          <div
            className={
              styles.searchSortArea
            }
          >
            <label
              className={
                styles.productSearch
              }
            >
              <SearchIcon />

              <input
                type="search"
                value={
                  searchQuery
                }
                onChange={(
                  event,
                ) =>
                  setSearchQuery(
                    event.target
                      .value,
                  )
                }
                placeholder="Search products"
                aria-label="Search products"
              />
            </label>

            <label
              className={
                styles.sort
              }
            >
              <span>
                SORT BY
              </span>

              <select
                value={
                  sortOption
                }
                onChange={(
                  event,
                ) =>
                  setSortOption(
                    event.target
                      .value as SortOption,
                  )
                }
              >
                <option
                  value="featured"
                >
                  Featured
                </option>

                <option
                  value="newest"
                >
                  Newest
                </option>

                <option
                  value="price-low"
                >
                  Price: Low to
                  High
                </option>

                <option
                  value="price-high"
                >
                  Price: High to
                  Low
                </option>

                <option
                  value="name"
                >
                  Product Name
                </option>
              </select>
            </label>
          </div>
        </div>

        {!apiConnected && (
          <div
            className={
              styles.connectionNotice
            }
          >
            <SparkleIcon />

            <div>
              <strong>
                Central API
                unavailable
              </strong>

              <span>
                Products will
                appear here when
                the KEOS API
                connection is
                available.
              </span>
            </div>
          </div>
        )}

        {visibleProducts.length >
        0 ? (
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
                const saved =
                  wishlist.includes(
                    product.id,
                  );

                const image =
                  getProductImage(
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
                    <div
                      className={
                        styles.cardNumber
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </div>

                    <button
                      type="button"
                      className={`${
                        styles.wishlistButton
                      } ${
                        saved
                          ? styles.saved
                          : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(
                          product.id,
                        )
                      }
                      aria-label={
                        saved
                          ? `Remove ${product.name} from wishlist`
                          : `Save ${product.name} to wishlist`
                      }
                    >
                      <HeartIcon />
                    </button>

                    <Link
                      href={`/product/${product.slug}`}
                      className={
                        styles.productImage
                      }
                      aria-label={`Open ${product.name}`}
                    >
                      <Image
                        src={
                          image
                        }
                        alt={
                          product.name
                        }
                        fill
                        sizes="
                          (max-width: 650px)
                          100vw,
                          (max-width: 1000px)
                          50vw,
                          25vw
                        "
                      />

                      <span
                        className={
                          styles.imageShade
                        }
                      />

                      <span
                        className={
                          styles.categoryBadge
                        }
                      >
                        {getCategoryLabel(
                          product.category,
                        ).toUpperCase()}
                      </span>

                      {!product.inStock && (
                        <span
                          className={
                            styles.stockBadge
                          }
                        >
                          OUT OF STOCK
                        </span>
                      )}
                    </Link>

                    <div
                      className={
                        styles.productContent
                      }
                    >
                      <div
                        className={
                          styles.productHeading
                        }
                      >
                        <div>
                          <p>
                            KRVE PRIVATE
                            COLLECTION
                          </p>

                          <h3>
                            {
                              product.name
                            }
                          </h3>
                        </div>

                        <div
                          className={
                            styles.priceArea
                          }
                        >
                          <strong>
                            {formatPrice(
                              product.price,
                              product.currency,
                            )}
                          </strong>

                          {product.compareAtPrice &&
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
                      </div>

                      <div
                        className={
                          styles.productMeta
                        }
                      >
                        <span>
                          {product.stockQuantity >
                          0
                            ? `${product.stockQuantity} in stock`
                            : "Currently unavailable"}
                        </span>

                        {product.newArrival && (
                          <span>
                            NEW ARRIVAL
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          styles.productActions
                        }
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          className={
                            styles.detailsButton
                          }
                        >
                          DISCOVER
                          <ArrowIcon />
                        </Link>

                        <Link
                          href={`/product/${product.slug}`}
                          className={
                            styles.addButton
                          }
                          aria-label={`Open ${product.name}`}
                        >
                          <BagIcon />
                          {product.inStock
                            ? "ADD"
                            : "VIEW"}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <section
            className={
              styles.emptyState
            }
          >
            <div>
              <SparkleIcon
                size={37}
              />
            </div>

            <p>
              NO PRODUCTS FOUND
            </p>

            <h2>
              This KRVE
              collection is
              being curated.
            </h2>

            <span>
              Add or publish
              products from KEOS
              Center and they
              will automatically
              appear here.
            </span>

            <button
              type="button"
              onClick={() => {
                setActiveCategory(
                  "all",
                );

                setSearchQuery(
                  "",
                );
              }}
            >
              VIEW ALL
              COLLECTIONS
              <ArrowIcon />
            </button>
          </section>
        )}
      </section>

      <section
        className={
          styles.aiBanner
        }
      >
        <div
          className={
            styles.aiIcon
          }
        >
          <SparkleIcon
            size={32}
          />
        </div>

        <div>
          <p>
            KRVE PERSONAL
            STYLIST
          </p>

          <h2>
            Find the collection
            <em>
              made for you.
            </em>
          </h2>

          <span>
            Receive intelligent
            recommendations
            across menswear,
            womenswear,
            kidswear,
            accessories and
            footwear.
          </span>
        </div>

        <Link
          href="/ai-stylist"
        >
          GET
          RECOMMENDATIONS
          <ArrowIcon />
        </Link>
      </section>

      <section
        className={
          styles.serviceStrip
        }
      >
        {categoryOptions.map(
          (category) => (
            <div
              key={
                category.id
              }
            >
              <strong>
                {
                  category.number
                }
              </strong>

              <p>
                {category.title.toUpperCase()}

                <span>
                  {
                    category.subtitle
                  }
                </span>
              </p>
            </div>
          ),
        )}
      </section>
    </main>
  );
}
