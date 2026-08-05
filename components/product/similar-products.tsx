import Image from "next/image";
import Link from "next/link";

import type {
  KrveProduct,
} from "@/lib/api";

type SimilarProductsProps = {
  products: KrveProduct[];
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

function discountPercentage(
  product: KrveProduct,
) {
  if (
    !product.compareAtPrice ||
    product.compareAtPrice <=
      product.price
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

function productImage(
  product: KrveProduct,
) {
  return (
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    "/images/products/product-1.jpg"
  );
}

export default function SimilarProducts({
  products,
}: SimilarProductsProps) {
  if (
    products.length === 0
  ) {
    return null;
  }

  return (
    <section className="krve-similar-section">
      <div className="krve-similar-heading">
        <div>
          <p>
            DISCOVER MORE
          </p>

          <h2>
            Similar Products
          </h2>
        </div>

        <Link href="/collections">
          View All →
        </Link>
      </div>

      <div className="krve-similar-scroll">
        {products.map(
          (product) => {
            const discount =
              discountPercentage(
                product,
              );

            return (
              <Link
                href={`/product/${product.slug}`}
                key={
                  product.id
                }
                className="krve-similar-card"
              >
                <div className="krve-similar-image">
                  <Image
                    src={productImage(
                      product,
                    )}
                    alt={
                      product.name
                    }
                    fill
                    sizes="280px"
                  />

                  {product.newArrival && (
                    <span>
                      NEW
                    </span>
                  )}

                  <div>
                    4.7 ★
                  </div>
                </div>

                <div className="krve-similar-info">
                  <h3>
                    {product.name}
                  </h3>

                  {discount !==
                    null && (
                    <strong className="krve-similar-discount">
                      {discount}% OFF
                    </strong>
                  )}

                  <div className="krve-similar-price">
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

                  <p>
                    Premium KRVE
                    collection
                  </p>
                </div>
              </Link>
            );
          },
        )}
      </div>
    </section>
  );
}
