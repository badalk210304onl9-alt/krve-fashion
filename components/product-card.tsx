"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

type ProductCardProps = {
  product: Product;
};

function HeartIcon({
  filled,
}: {
  filled: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
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
        fill={
          filled
            ? "currentColor"
            : "none"
        }
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path
        d="
          M5.5 8.5
          h13
          l-.9 11
          H6.4
          l-.9-11Z
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="
          M8.8 8.5
          V6.7
          a3.2 3.2 0 0 1 6.4 0
          v1.8
        "
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   KRVE INDIA PRICE FORMAT
========================================================= */

function formatIndianPrice(
  price: number,
) {
  const safePrice =
    Number.isFinite(
      Number(price),
    )
      ? Number(price)
      : 0;

  return safePrice.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    wishlist,
  } = useCart();

  const wished =
    wishlist.includes(
      product.id,
    );

  const productHref =
    `/product/${
      product.slug ||
      product.id
    }`;

  return (
    <article className="product-card">
      {/* PRODUCT IMAGE */}

      <div className="product-media">
        <Link
          href={productHref}
          className="product-image"
          aria-label={`Open ${product.name}`}
        >
          <Image
            src={
              product.image ||
              product.imageUrl ||
              "/images/products/product-1.jpg"
            }
            alt={product.name}
            fill
            sizes="
              (max-width: 560px) 100vw,
              (max-width: 900px) 50vw,
              22vw
            "
          />

          <span
            className="product-image-mask"
            aria-hidden="true"
          />
        </Link>

        {/* WISHLIST */}

        <button
          type="button"
          className="wishlist-button"
          onClick={() =>
            toggleWishlist(
              product.id,
            )
          }
          aria-label={
            wished
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <HeartIcon
            filled={wished}
          />
        </button>

        {/* CATEGORY */}

        <span className="product-category">
          {product.category}
        </span>
      </div>

      {/* PRODUCT DETAILS */}

      <div className="product-copy">
        <div className="product-details">
          <Link
            href={productHref}
          >
            <h3>
              {product.name}
            </h3>
          </Link>

          {/* =============================================
              IMPORTANT:
              Direct Indian Rupee symbol.
              No USD.
              No product.currency.
              No Intl currency conversion.
          ============================================== */}

          <p>
            ₹
            {formatIndianPrice(
              product.price,
            )}
          </p>
        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          className="add-product-button"
          onClick={() =>
            addToCart(product)
          }
          aria-label={`Add ${product.name} to bag`}
        >
          <BagIcon />

          <span>
            ADD
          </span>
        </button>
      </div>
    </article>
  );
}
