"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header">
      <div className="announcement">
        <span>Private client delivery across India</span>
        <span className="announcement__center">Complimentary shipping above ₹5,000</span>
        <a href="mailto:care@krvefashionstudio.in">Client Services</a>
      </div>

      <div className="nav-shell">
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <Link className="brand" href="/" aria-label="KRVE home">
          <strong>KRVE</strong>
          <span>THE FASHION STUDIO</span>
        </Link>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link href="/collections" onClick={() => setOpen(false)}>New Collection</Link>
          <Link href="/collections?category=Tailoring" onClick={() => setOpen(false)}>Tailoring</Link>
          <Link href="/collections?category=Shirts" onClick={() => setOpen(false)}>Essentials</Link>
          <Link href="/virtual-try-on" onClick={() => setOpen(false)}>Digital Atelier</Link>
        </nav>

        <div className="nav-actions">
          <Link className="nav-account" href="/account">Account</Link>
          <Link href="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}>
            <span className="nav-icon">♡</span>
            <small>{wishlist.length}</small>
          </Link>
          <Link href="/cart" aria-label={`Shopping bag with ${cartCount} items`}>
            <span className="nav-icon">Bag</span>
            <small>{cartCount}</small>
          </Link>
        </div>
      </div>
    </header>
  );
}
