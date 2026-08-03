import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-silk" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> AI-POWERED FASHION</div>
          <h1>
            FASHION THAT
            <strong>UNDERSTANDS YOU</strong>
          </h1>
          <p>Experience the future of luxury fashion with AI-powered style recommendations.</p>
          <div className="hero-buttons">
            <Link href="/collections" className="button solid">EXPLORE COLLECTIONS →</Link>
            <Link href="/virtual-try-on" className="button ghost">VIRTUAL TRY-ON ✦</Link>
          </div>
        </div>

        <div className="hero-model">
          <Image src="/images/hero-model.jpg" alt="KRVE luxury fashion model" fill priority />
        </div>

        <div className="crest">
          <Image src="/images/crest.jpg" alt="KRVE crest" fill priority />
        </div>
      </section>

      <section className="benefits">
        {[
          ["◎", "FREE WORLDWIDE SHIPPING", "On all orders above $200"],
          ["◌", "EASY RETURNS", "30-day return policy"],
          ["♜", "PREMIUM QUALITY", "Finest materials"],
          ["♙", "AI PERSONAL STYLIST", "Style that matches you"],
          ["▣", "SECURE SHOPPING", "100% protected checkout"]
        ].map(([icon, title, text]) => (
          <div key={title}>
            <span>{icon}</span>
            <p><strong>{title}</strong><small>{text}</small></p>
          </div>
        ))}
      </section>

      <section className="new-arrivals">
        <div className="section-heading">
          <h2>NEW ARRIVALS</h2>
          <Link href="/collections">VIEW ALL →</Link>
        </div>

        <div className="arrival-layout">
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          <article className="tryon-card">
            <div>
              <p className="gold-label">AI VIRTUAL TRY-ON STUDIO</p>
              <h3>See how every look feels before you wear it.</h3>
              <p>Upload your photo and preview refined KRVE outfits in real time.</p>
              <Link href="/virtual-try-on" className="button ghost">TRY NOW →</Link>
            </div>
            <div className="tryon-image">
              <Image src="/images/try-on.jpg" alt="AI virtual try-on" fill />
            </div>
          </article>
        </div>
      </section>

      <section className="bottom-strip">
        {[
          ["◈", "EXCLUSIVE COLLECTIONS", "Unique & limited designs"],
          ["◇", "LUXURY MATERIALS", "Premium & sustainable"],
          ["✤", "CRAFTED TO PERFECTION", "Attention to every detail"],
          ["♙", "TRUSTED BY THOUSANDS", "★★★★★ 4.9/5"]
        ].map(([icon, title, text]) => (
          <div key={title}><span>{icon}</span><p><strong>{title}</strong><small>{text}</small></p></div>
        ))}
      </section>
    </main>
  );
}
