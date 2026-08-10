import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import ProductShowcase from "@/components/product/product-showcase";
import SimilarProducts from "@/components/product/similar-products";

import {
  getProductBySlug,
  getProductsByCategory,
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

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const {
    slug,
  } =
    await params;

  let product:
    KrveProduct | null =
    null;

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

  let similarProducts:
    KrveProduct[] =
    [];

  try {
    const products =
      await getProductsByCategory(
        product.category,
        12,
      );

    similarProducts =
      products
        .filter(
          (item) =>
            item.id !==
              product.id &&
            item.status ===
              "published",
        )
        .slice(
          0,
          8,
        );
  } catch (error) {
    console.error(
      "KRVE_SIMILAR_PRODUCTS_ERROR",
      error,
    );
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <section
        className={
          styles.breadcrumbBar
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

            <Link
              href={`/collections?category=${product.category}`}
            >
              {getCategoryLabel(
                product.category,
              )}
            </Link>

            <span>
              /
            </span>

            <strong>
              {
                product.name
              }
            </strong>
          </nav>
        </div>
      </section>

      <section
        className={
          styles.productArea
        }
      >
        <div
          className={
            styles.container
          }
        >
          <ProductShowcase
            product={
              product
            }
          />
        </div>
      </section>

      {similarProducts.length >
      0 ? (
        <section
          className={
            styles.similarArea
          }
        >
          <div
            className={
              styles.container
            }
          >
            <SimilarProducts
              products={
                similarProducts
              }
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
