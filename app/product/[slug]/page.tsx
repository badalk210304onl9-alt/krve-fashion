import Image from "next/image";
import { notFound } from "next/navigation";
import { productBySlug } from "@/lib/catalog";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  return (
    <main className="page-shell" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
      <div style={{position:"relative",minHeight:520,border:"1px solid #5b4415"}}>
        <Image src={product.image} alt={product.name} fill style={{objectFit:"cover"}} />
      </div>
      <div>
        <p style={{color:"#d8a62f"}}>{product.category}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p style={{fontSize:26,color:"#d8a62f"}}>${product.price.toFixed(2)}</p>
      </div>
    </main>
  );
}
