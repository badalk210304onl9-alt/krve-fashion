import Image from "next/image";
import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  getProductBySlug,
  type KrveProduct,
} from "@/lib/api";

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

function categoryLabel(
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
        decodeURIComponent(slug),
      );
  } catch (error) {
    console.error(
      "PRODUCT_PAGE_ERROR",
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

  const image =
    getMainImage(product);

  const gallery =
    Array.from(
      new Set(
        [
          image,
          ...(product.gallery ??
            []),
        ].filter(Boolean),
      ),
    );

  return (
    <main className="product-page">
      <div className="product-breadcrumb">
        <Link href="/">
          HOME
        </Link>

        <span>/</span>

        <Link href="/collections">
          COLLECTIONS
        </Link>

        <span>/</span>

        <span>
          {product.name}
        </span>
      </div>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-main-image">
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="
                (max-width: 900px)
                100vw,
                55vw
              "
            />
          </div>

          {gallery.length > 1 && (
            <div className="product-thumbnails">
              {gallery.map(
                (
                  galleryImage,
                  index,
                ) => (
                  <div
                    key={`${galleryImage}-${index}`}
                    className="product-thumbnail"
                  >
                    <Image
                      src={
                        galleryImage
                      }
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      sizes="140px"
                    />
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div className="product-information">
          <p className="product-category">
            {categoryLabel(
              product.category,
            )}
          </p>

          <h1>
            {product.name}
          </h1>

          <div className="product-price">
            <strong>
              {formatPrice(
                product.price,
                product.currency,
              )}
            </strong>

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
          </div>

          <p className="product-description">
            {product.description ||
              product.shortDescription ||
              "A refined piece from the KRVE private collection."}
          </p>

          <div className="product-status-row">
            <span>
              SKU
            </span>

            <strong>
              {product.sku ||
                "KRVE"}
            </strong>
          </div>

          <div className="product-status-row">
            <span>
              AVAILABILITY
            </span>

            <strong
              className={
                product.inStock
                  ? "in-stock"
                  : "out-of-stock"
              }
            >
              {product.inStock
                ? `${product.stockQuantity} IN STOCK`
                : "OUT OF STOCK"}
            </strong>
          </div>

          {product.sizes.length >
            0 && (
            <section className="product-option">
              <p>
                SELECT SIZE
              </p>

              <div>
                {product.sizes.map(
                  (size) => (
                    <button
                      type="button"
                      key={size}
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
            <section className="product-option">
              <p>
                SELECT COLOUR
              </p>

              <div>
                {product.colours.map(
                  (colour) => (
                    <button
                      type="button"
                      key={colour}
                    >
                      {colour}
                    </button>
                  ),
                )}
              </div>
            </section>
          )}

          <button
            type="button"
            className="product-add-button"
            disabled={
              !product.inStock
            }
          >
            {product.inStock
              ? "ADD TO BAG"
              : "OUT OF STOCK"}
          </button>

          <Link
            href="/virtual-try-on"
            className="product-tryon-button"
          >
            ✦ TRY WITH AI
            VIRTUAL TRY-ON
          </Link>

          <div className="product-assurance">
            <span>
              SECURE CHECKOUT
            </span>

            <span>
              EASY RETURNS
            </span>

            <span>
              PREMIUM QUALITY
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
