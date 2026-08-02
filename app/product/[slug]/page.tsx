"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { productBySlug } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = productBySlug(params.slug);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  if (!product) notFound();

  return (
    <main className="product-page">
      <div className="product-gallery"><Image src={product.image} alt={product.name} fill priority className="cover" /></div>
      <div className="product-detail">
        <Link className="back-link" href="/collections">← Back to collection</Link>
        <p className="eyebrow dark">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="detail-price">{money.format(product.price)} {product.oldPrice && <s>{money.format(product.oldPrice)}</s>}</div>
        <p className="detail-description">{product.description}</p>
        <div className="option-block"><span>Available colours</span><div className="chips">{product.colors.map((color) => <button key={color}>{color}</button>)}</div></div>
        <div className="option-block"><span>Select size</span><div className="chips">{product.sizes.map((size) => <button key={size}>{size}</button>)}</div></div>
        <div className="detail-actions"><button className="primary-button dark-button" onClick={() => addToCart(product)}>Add to Bag</button><button className="secondary-button" onClick={() => toggleWishlist(product.id)}>{wishlist.includes(product.id) ? "Saved" : "Save to Wishlist"}</button></div>
        <div className="service-notes"><span>Complimentary shipping above ₹5,000</span><span>Easy 7-day size exchange</span><span>Virtual Try-On compatible</span></div>
      </div>
    </main>
  );
}
