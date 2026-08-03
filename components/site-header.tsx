"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const { cartCount, wishlist } = useCart();

  return (
    <>
      <div className="topbar">
        <span>✦ Meet Your Personal AI Stylist — Get Recommendations</span>
        <span aria-hidden>›</span>
      </div>

      <header className="header">
        <Link href="/" className="brand">
          <span>KrvE</span>
          <small>THE FASHION STUDIO</small>
        </Link>

        <nav>
          <Link href="/collections">SHOP</Link>
          <Link href="/collections">COLLECTIONS</Link>
          <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
          <Link href="/ai-stylist">AI STYLIST</Link>
          <Link href="/about">ABOUT US</Link>
        </nav>

        <div className="actions">
          <button aria-label="Search">⌕</button>
          <Link href="/ai-stylist" className="ai-badge">⚡<b>AI</b></Link>
          <Link href="/account">♙</Link>
          <Link href="/wishlist">♡<span>{wishlist.length}</span></Link>
          <Link href="/cart">▢<span>{cartCount}</span></Link>
        </div>
      </header>
    </>
  );
}
