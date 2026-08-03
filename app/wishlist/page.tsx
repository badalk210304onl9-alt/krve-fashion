"use client";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
export default function WishlistPage() {
  const { wishlist } = useCart();
  const selected = products.filter((product) => wishlist.includes(product.id));
  return (
    <main className="page-shell">
      <h1>Wishlist</h1>
      {selected.length === 0 ? <p>No saved pieces yet.</p> : (
        <div className="product-grid" style={{ marginTop: 32 }}>
          {selected.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </main>
  );
}
