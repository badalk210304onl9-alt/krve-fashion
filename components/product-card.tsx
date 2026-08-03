"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.id);

  return (
    <article className="product-card">
      <button
        className="wishlist-button"
        onClick={() => toggleWishlist(product.id)}
        aria-label="Toggle wishlist"
      >
        {wished ? "♥" : "♡"}
      </button>
      <Link href={`/product/${product.id}`} className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="25vw" />
      </Link>
      <div className="product-copy">
        <div>
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
        </div>
        <button onClick={() => addToCart(product)}>ADD</button>
      </div>
    </article>
  );
}
