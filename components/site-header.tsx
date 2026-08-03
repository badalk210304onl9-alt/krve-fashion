"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header exact-header">
      <div className="exact-nav">
        <Link className="exact-brand" href="/" aria-label="KRVE home">
          <strong>K<small>rv</small>E</strong>
          <span>THE FASHION STUDIO</span>
        </Link>

        <button className="menu-button exact-menu" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          <span />
          <span />
        </button>

        <nav className={open ? "exact-links open" : "exact-links"}>
          <Link href="/collections" onClick={() => setOpen(false)}>SHOP</Link>
          <Link href="/collections" onClick={() => setOpen(false)}>COLLECTIONS</Link>
          <Link href="/virtual-try-on" onClick={() => setOpen(false)}>VIRTUAL TRY-ON</Link>
          <Link href="/virtual-try-on" onClick={() => setOpen(false)}>AI STYLIST</Link>
          <Link href="/account" onClick={() => setOpen(false)}>ABOUT US</Link>
        </nav>

        <div className="exact-actions">
          <span aria-hidden="true">⌕</span>
          <Link href="/virtual-try-on" className="ai-action" aria-label="AI stylist">✧<b>AI</b></Link>
          <Link href="/account" aria-label="Account">♙</Link>
          <Link href="/wishlist" aria-label="Wishlist">♡<small>{wishlist.length}</small></Link>
          <Link href="/cart" aria-label="Bag">▱<small>{cartCount}</small></Link>
        </div>
      </div>
    </header>
  );
}
