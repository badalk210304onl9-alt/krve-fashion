import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <Image src="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=2000&q=90" alt="KRVE luxury fashion" fill priority className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">KRVE · Autumn/Winter 2026</p>
          <h1>Fashion built<br /><em>around you.</em></h1>
          <p>Luxury tailoring, intelligent fit and virtual try-on—crafted into one seamless fashion experience.</p>
          <div className="hero-actions"><Link className="primary-button" href="/collections">Explore Collection</Link><Link className="ghost-button" href="/virtual-try-on">Create My Digital Twin</Link></div>
        </div>
      </section>

      <section className="trust-strip">
        <div><strong>AI Fit</strong><span>Personalised measurements</span></div>
        <div><strong>Luxury Craft</strong><span>Premium construction</span></div>
        <div><strong>Private by Design</strong><span>Customer-first data control</span></div>
        <div><strong>India Delivery</strong><span>Tracked premium shipping</span></div>
      </section>

      <section className="section-shell">
        <div className="section-heading"><div><p className="eyebrow dark">The New Edit</p><h2>Designed for presence.</h2></div><Link href="/collections">View all pieces →</Link></div>
        <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="split-feature">
        <div className="split-media"><Image src="https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1500&q=90" alt="Tailored luxury fashion" fill className="cover" /></div>
        <div className="split-copy"><p className="eyebrow dark">The KRVE Difference</p><h2>Your body. Your style. Your fit.</h2><p>Our digital fitting journey measures, recommends and visualises your look before you buy. No guesswork. No generic sizing.</p><div className="feature-list"><span>01 · Body-aware size recommendation</span><span>02 · 3D digital twin experience</span><span>03 · AI outfit guidance</span><span>04 · Virtual try-on ready</span></div><Link className="primary-button dark-button" href="/virtual-try-on">Begin Virtual Try-On</Link></div>
      </section>

      <section className="editorial-banner">
        <p className="eyebrow">Private Appointment</p><h2>Build a wardrobe that feels unmistakably yours.</h2><p>Discover curated tailoring, refined essentials and intelligent fashion guidance.</p><Link className="ghost-button" href="/account">Create Your KRVE Account</Link>
      </section>
    </main>
  );
}
