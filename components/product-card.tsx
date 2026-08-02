"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const saved = wishlist.includes(product.id);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={saved ? "wish active" : "wish"} onClick={() => toggleWishlist(product.id)} aria-label="Toggle wishlist">♡</button>
        <Link href={`/product/${product.slug}`}>
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 33vw" className="product-image" />
        </Link>
      </div>
      <div className="product-info">
        <p>{product.category}</p>
        <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <div className="price-line"><strong>{money.format(product.price)}</strong>{product.oldPrice && <s>{money.format(product.oldPrice)}</s>}</div>
        <button className="secondary-button full" onClick={() => addToCart(product)}>Add to Bag</button>
      </div>
    </article>
  );
}
