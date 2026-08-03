import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { products } from "@/lib/catalog";

const trustItems = [
  ["◎", "FREE WORLDWIDE SHIPPING", "On all orders above ₹15,000"],
  ["↻", "EASY RETURNS", "30-day return policy"],
  ["◇", "PREMIUM QUALITY", "Finest materials"],
  ["♙", "AI PERSONAL STYLIST", "Style that matches you"],
  ["▣", "SECURE SHOPPING", "100% protected checkout"],
];

const housePoints = [
  ["◈", "EXCLUSIVE COLLECTIONS", "Unique & limited designs"],
  ["⬡", "LUXURY MATERIALS", "Premium & sustainable"],
  ["✣", "CRAFTED TO PERFECTION", "Attention to every detail"],
  ["♙", "TRUSTED BY THOUSANDS", "★★★★★  4.9/5"],
];

export default function HomePage() {
  return (
    <main className="krve-home">
      <section className="ai-banner">
        <span>✦</span>
        <Link href="/virtual-try-on">Meet Your Personal AI Stylist — Get Recommendations</Link>
        <span>›</span>
      </section>

      <section className="hero-luxury">
        <div className="hero-luxury__image">
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=2200&q=95"
            alt="KRVE luxury menswear"
            fill
            priority
            sizes="100vw"
            className="hero-cover"
          />
          <div className="hero-luxury__shade" />
        </div>

        <div className="hero-luxury__copy">
          <p className="hero-kicker"><span /> AI-POWERED FASHION</p>
          <h1>
            FASHION THAT
            <strong>UNDERSTANDS YOU</strong>
          </h1>
          <p className="hero-description">
            Experience the future of luxury fashion with AI-powered style recommendations,
            precise fit intelligence and immersive virtual try-on.
          </p>
          <div className="hero-cta-row">
            <Link href="/collections" className="gold-cta">EXPLORE COLLECTIONS <span>→</span></Link>
            <Link href="/virtual-try-on" className="outline-cta">VIRTUAL TRY-ON <span>✧</span></Link>
          </div>
        </div>

        <div className="hero-crest" aria-hidden="true">
          <span>♛</span>
          <strong>K</strong>
          <small>KRVE</small>
        </div>
      </section>

      <section className="trust-strip">
        {trustItems.map(([icon, title, text]) => (
          <article key={title}>
            <span className="trust-icon">{icon}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="arrival-section">
        <div className="arrival-heading">
          <div>
            <p className="gold-label">NEW ARRIVALS</p>
            <span className="gold-diamond">◇</span>
          </div>
          <Link href="/collections">VIEW ALL <span>→</span></Link>
        </div>

        <div className="arrival-layout">
          <div className="arrival-products">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <aside className="tryon-card">
            <div className="tryon-card__copy">
              <p>AI VIRTUAL TRY-ON STUDIO</p>
              <h2>See your next look before you wear it.</h2>
              <span>Upload your photo and preview KRVE pieces in real-time with intelligent fit guidance.</span>
              <Link href="/virtual-try-on">TRY NOW <b>→</b></Link>
            </div>
            <div className="tryon-card__visual">
              <div className="tryon-main-photo">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=90"
                  alt="Virtual try-on model"
                  fill
                  sizes="260px"
                  className="cover"
                />
              </div>
              <div className="tryon-mini tryon-mini--one">
                <Image
                  src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=500&q=90"
                  alt="Suit preview"
                  fill
                  sizes="110px"
                  className="cover"
                />
              </div>
              <div className="tryon-mini tryon-mini--two">
                <Image
                  src="https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=500&q=90"
                  alt="Blazer preview"
                  fill
                  sizes="110px"
                  className="cover"
                />
              </div>
              <div className="tryon-focus">◎</div>
            </div>
          </aside>
        </div>
      </section>

      <section className="house-strip">
        {housePoints.map(([icon, title, text]) => (
          <article key={title}>
            <span>{icon}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
