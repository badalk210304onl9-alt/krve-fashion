"use client";

import Image from "next/image";
import Link from "next/link";

import type {
  Product,
} from "@/lib/catalog";

import {
  useCart,
} from "@/components/cart-provider";

type ProductCardProps = {
  product: Product;
};

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

  return (
    <article className="product-card">
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
        {wished ? "♥" : "♡"}
      </button>

      <Link
        href={`/product/${product.id}`}
        className="product-image"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="
            (max-width: 600px) 100vw,
            (max-width: 900px) 50vw,
            25vw
          "
        />
      </Link>

      <div className="product-copy">
        <div>
          <h3>
            {product.name}
          </h3>

          <p>
            $
            {product.price.toFixed(
              2,
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            addToCart(
              product,
            )
          }
        >
          ADD
        </button>
      </div>
    </article>
  );
}
