"use client";

import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <main className="page-shell"><div className="page-hero compact"><p className="eyebrow">Saved Pieces</p><h1>Your Wishlist</h1><p>Pieces you are considering, kept together in one private edit.</p></div>{saved.length === 0 ? <div className="empty-state"><h2>No saved pieces yet.</h2><p>Tap the heart on any product to add it here.</p></div> : <div className="product-grid collection-grid">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</main>;
}
