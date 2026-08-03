"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header">
      <div className="top-strip">
        <div>▱ <span>FREE SHIPPING ACROSS INDIA</span></div>
        <div>◇ <span>CERTIFIED PREMIUM QUALITY</span></div>
        <div>♢ <span>100% SECURE PAYMENTS</span></div>
        <div>⌕ <span>+91 12345 67890</span></div>
      </div>

      <div className="nav-shell">
        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>

        <Link className="logo" href="/">
          <span>♛</span>
          <strong>KRVE</strong>
          <small>— THE FASHION STUDIO —</small>
        </Link>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link className="active" href="/">HOME</Link>
          <Link href="/collections">COLLECTIONS⌄</Link>
          <Link href="/collections?category=Men">MEN⌄</Link>
          <Link href="/collections?category=Women">WOMEN⌄</Link>
          <Link href="/collections?category=Accessories">ACCESSORIES⌄</Link>
          <Link className="sale" href="/collections?sale=true">SALE</Link>
          <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
        </nav>

        <div className="nav-actions">
          <button aria-label="Search">⌕</button>
          <Link href="/account" aria-label="Account">♙</Link>
          <Link href="/wishlist" className="counter-link" aria-label="Wishlist">♡{wishlist.length > 0 && <span>{wishlist.length}</span>}</Link>
          <Link href="/cart" className="counter-link" aria-label="Bag">▱<span>{cartCount}</span></Link>
        </div>
      </div>
    </header>
  );
}
