import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const selected = params.category;
  const list = selected ? products.filter((product) => product.category === selected) : products;
  const categories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <main className="page-shell">
      <div className="page-hero compact"><p className="eyebrow">KRVE Collection</p><h1>The Wardrobe Edit</h1><p>Luxury pieces selected for modern life, personal expression and precise fit.</p></div>
      <div className="filter-row"><a href="/collections" className={!selected ? "active" : ""}>All</a>{categories.map((category) => <a key={category} href={`/collections?category=${encodeURIComponent(category)}`} className={selected === category ? "active" : ""}>{category}</a>)}</div>
      <div className="product-grid collection-grid">{list.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </main>
  );
}
