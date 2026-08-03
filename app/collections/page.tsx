import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

export default function CollectionsPage() {
  return (
    <main className="page-shell">
      <h1>Collections</h1>
      <p>Explore KRVE tailoring, footwear and accessories.</p>
      <div className="product-grid" style={{ marginTop: 32 }}>
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </main>
  );
}
