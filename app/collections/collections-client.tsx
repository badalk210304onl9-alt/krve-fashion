"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { KrveProduct, ProductCategory } from "@/lib/api";
import styles from "./collections.module.css";

type CategoryFilter = "all" | ProductCategory;
type SortOption = "featured" | "newest" | "price-low" | "price-high" | "name";

type Props = {
  initialProducts: KrveProduct[];
  apiConnected: boolean;
};

const categories: {
  id: ProductCategory;
  title: string;
  heading: string;
  description: string;
}[] = [
  {
    id: "menswear",
    title: "Menswear",
    heading: "Dress Sharp. Live Bold.",
    description: "From everyday essentials to statement pieces.",
  },
  {
    id: "womenswear",
    title: "Womenswear",
    heading: "Elegance in Every Detail.",
    description: "Contemporary silhouettes and timeless style.",
  },
  {
    id: "kidswear",
    title: "Kidswear",
    heading: "Little Looks. Big Style.",
    description: "Comfort-first fashion for little wardrobes.",
  },
];

const subcategories: Record<string, { id: string; title: string; keywords: string[] }[]> = {
  menswear: [
    { id: "tshirts", title: "T-Shirts", keywords: ["t-shirt", "tshirt", "tee", "polo"] },
    { id: "shirts", title: "Shirts", keywords: ["shirt", "shirts", "overshirt"] },
    { id: "ethnic", title: "Ethnic Wear", keywords: ["kurta", "sherwani", "ethnic"] },
    { id: "trousers", title: "Trousers", keywords: ["trouser", "pant", "chino"] },
    { id: "jeans", title: "Jeans", keywords: ["jean", "denim"] },
    { id: "jackets", title: "Jackets", keywords: ["jacket", "coat", "blazer"] },
    { id: "sweatshirts", title: "Sweatshirts", keywords: ["sweatshirt", "hoodie"] },
    { id: "co-ords", title: "Co-ords", keywords: ["co-ord", "coord", "co ord"] },
  ],
  womenswear: [
    { id: "tops", title: "Tops", keywords: ["top", "blouse"] },
    { id: "shirts", title: "Shirts", keywords: ["shirt"] },
    { id: "dresses", title: "Dresses", keywords: ["dress", "gown"] },
    { id: "ethnic", title: "Ethnic Wear", keywords: ["kurti", "kurta", "ethnic"] },
    { id: "trousers", title: "Trousers", keywords: ["trouser", "pant"] },
    { id: "jeans", title: "Jeans", keywords: ["jean", "denim"] },
    { id: "jackets", title: "Jackets", keywords: ["jacket", "coat", "blazer"] },
    { id: "co-ords", title: "Co-ords", keywords: ["co-ord", "coord", "set"] },
  ],
  kidswear: [
    { id: "tshirts", title: "T-Shirts", keywords: ["t-shirt", "tshirt", "tee"] },
    { id: "shirts", title: "Shirts", keywords: ["shirt"] },
    { id: "sets", title: "Sets", keywords: ["set", "combo"] },
    { id: "dresses", title: "Dresses", keywords: ["dress", "frock"] },
    { id: "bottoms", title: "Bottoms", keywords: ["trouser", "pant", "shorts"] },
    { id: "ethnic", title: "Ethnic Wear", keywords: ["kurta", "ethnic"] },
  ],
};

function getImage(product: KrveProduct): string | null {
  const images = [
    product.image,
    product.imageUrl,
    ...(Array.isArray(product.gallery) ? product.gallery : []),
  ];

  return images.find(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  ) ?? null;
}

function getCategoryImage(
  category: ProductCategory,
  products: KrveProduct[]
): string | null {
  const product = products.find(
    (item) => item.category === category && getImage(item)
  );
  return product ? getImage(product) : null;
}

function getSubcategory(product: KrveProduct, category: string): string {
  const saved = (product as KrveProduct & { subcategory?: string | null }).subcategory;

  if (saved) {
    const normalized = saved.trim().toLowerCase().replace(/[ _]+/g, "-");
    const exact = (subcategories[category] ?? []).find(
      (item) => item.id === normalized || item.title.toLowerCase() === saved.trim().toLowerCase()
    );
    if (exact) return exact.id;
  }

  const searchable = [
    product.name,
    product.shortDescription,
    product.description,
    product.sku,
  ].filter(Boolean).join(" ").toLowerCase();

  const matches = (subcategories[category] ?? [])
    .flatMap((item) =>
      item.keywords
        .filter((keyword) => searchable.includes(keyword))
        .map((keyword) => ({ id: item.id, length: keyword.length }))
    )
    .sort((a, b) => b.length - a.length);

  return matches[0]?.id ?? "other";
}

function formatPrice(price: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Heart({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M20.8 8.8c0 4.2-8.8 10-8.8 10S3.2 13 3.2 8.8a4.4 4.4 0 0 1 8.8-.2 4.4 4.4 0 0 1 8.8.2Z" />
    </svg>
  );
}

function ProductPhoto({ product }: { product: KrveProduct }) {
  const src = getImage(product);

  if (!src) {
    return <div className={styles.productPhotoFallback}>KRVE</div>;
  }

  return (
    <Image
      src={src}
      alt={product.name}
      fill
      sizes="(max-width: 650px) 50vw, 25vw"
    />
  );
}

export default function CollectionsClient({
  initialProducts,
  apiConnected,
}: Props) {
  const { wishlist, toggleWishlist } = useCart();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category");
  const startingCategory: CategoryFilter =
    urlCategory === "menswear" ||
    urlCategory === "womenswear" ||
    urlCategory === "kidswear"
      ? urlCategory
      : "menswear";

  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>(startingCategory);
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("featured");

  const activeInfo = categories.find((item) => item.id === activeCategory) ?? categories[0];

  const activeSubcategories =
    activeCategory === "all" ? [] : subcategories[activeCategory] ?? [];

  const visibleProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);

      if (activeSubcategory !== "all") {
        result = result.filter(
          (product) => getSubcategory(product, activeCategory) === activeSubcategory
        );
      }
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((product) =>
        [
          product.name,
          product.category,
          product.description,
          product.shortDescription,
          product.sku,
        ].filter(Boolean).join(" ").toLowerCase().includes(query)
      );
    }

    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else {
      result.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.newArrival !== b.newArrival) return a.newArrival ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [initialProducts, activeCategory, activeSubcategory, searchQuery, sortOption]);

  function chooseCategory(category: CategoryFilter) {
    setActiveCategory(category);
    setActiveSubcategory("all");
  }

  return (
    <main className={styles.page}>
       <section className={styles.hero}>
        <div className={styles.heroImage}>
          {getCategoryImage("menswear", initialProducts) && (
            <Image
              src={getCategoryImage("menswear", initialProducts)!}
              alt="KRVE menswear collection"
              fill
              priority
              sizes="100vw"
            />
          )}
        </div>

        <div className={styles.heroSecondImage}>
          {getCategoryImage("womenswear", initialProducts) && (
            <Image
              src={getCategoryImage("womenswear", initialProducts)!}
              alt="KRVE womenswear collection"
              fill
              sizes="40vw"
            />
          )}
        </div>

        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <p>EXPLORE KRVE</p>
          <h1>Our <em>Collections</em></h1>
          <div className={styles.heroRule} />
          <span>FASHION FOR EVERY YOU</span>
          <a href="#krve-category-tabs">
            EXPLORE THE EDIT <Arrow />
          </a>
        </div>
        <div className={styles.heroCurve} />
      </section>

      <section className={styles.collectionSection} id="krve-category-tabs">
        <div className={styles.categoryTabs}>
          <span />
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => chooseCategory(category.id)}
              className={activeCategory === category.id ? styles.activeTab : ""}
            >
              {category.title}
            </button>
          ))}
          <span />
        </div>

        <header className={styles.sectionHeading}>
          <div>
            <p>{activeCategory === "all" ? "THE KRVE EDIT" : activeInfo.title.toUpperCase()}</p>
            <h2>{activeCategory === "all" ? "Explore Every Style." : activeInfo.heading}</h2>
            <span>{activeCategory === "all" ? "Discover the latest KRVE collections." : activeInfo.description}</span>
          </div>

          <div className={styles.sliderArrows}>
            <button
              type="button"
              aria-label="Previous category"
              onClick={() => {
                const index = categories.findIndex((item) => item.id === activeCategory);
                chooseCategory(categories[(index + categories.length - 1) % categories.length].id);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next category"
              onClick={() => {
                const index = categories.findIndex((item) => item.id === activeCategory);
                chooseCategory(categories[(index + 1) % categories.length].id);
              }}
            >
              ›
            </button>
          </div>
        </header>

        {activeSubcategories.length > 0 && (
          <div className={styles.subcategorySlider}>
            {activeSubcategories.map((item) => {
              const count = initialProducts.filter(
                (product) =>
                  product.category === activeCategory &&
                  getSubcategory(product, activeCategory) === item.id
              ).length;

              const imageProduct = initialProducts.find(
                (product) =>
                  product.category === activeCategory &&
                  getSubcategory(product, activeCategory) === item.id &&
                  getImage(product)
              );

              return (
                <button
                  type="button"
                  key={item.id}
                  className={`${styles.subcategoryItem} ${activeSubcategory === item.id ? styles.activeSubcategory : ""}`}
                  onClick={() => setActiveSubcategory(
                    activeSubcategory === item.id ? "all" : item.id
                  )}
                >
                  <span className={styles.subcategoryImage}>
                    {imageProduct && <ProductPhoto product={imageProduct} />}
                  </span>
                  <span className={styles.subcategoryName}>{item.title}</span>
                  <small>{count} {count === 1 ? "piece" : "pieces"}</small>
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.productToolbar}>
          <span>{visibleProducts.length} PIECES</span>
          <label>
            <span>SEARCH</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search collection"
            />
          </label>
          <label>
            <span>SORT</span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name</option>
            </select>
          </label>
        </div>

        {!apiConnected && (
          <p className={styles.apiNotice}>
            Products could not be loaded. Please check the KEOS connection.
          </p>
        )}

        {visibleProducts.length > 0 ? (
          <div className={styles.productGrid}>
            {visibleProducts.map((product) => {
              const saved = wishlist.includes(product.id);

              return (
                <article className={styles.productCard} key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.productImage}
                    aria-label={`View ${product.name}`}
                  >
                    <ProductPhoto product={product} />
                    {!product.inStock && (
                      <span className={styles.stockBadge}>OUT OF STOCK</span>
                    )}
                  </Link>

                  <button
                    type="button"
                    className={`${styles.wishlistButton} ${saved ? styles.saved : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart active={saved} />
                  </button>

                  <div className={styles.productInfo}>
                    <div>
                      <p>KRVE COLLECTION</p>
                      <Link href={`/product/${product.slug}`}>
                        <h3>{product.name}</h3>
                      </Link>
                    </div>
                    <strong>
                      {formatPrice(product.price, product.currency)}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>THE KRVE EDIT</p>
            <h2>No products found.</h2>
            <span>Try another category or search term.</span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setActiveSubcategory("all");
                setSearchQuery("");
              }}
            >
              VIEW ALL COLLECTIONS <Arrow />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
