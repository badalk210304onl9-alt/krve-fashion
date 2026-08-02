"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header">
      <div className="announcement">Complimentary shipping on orders above ₹5,000</div>
      <div className="nav-shell">
        <button className="menu-button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>☰</button>
        <Link className="brand" href="/">KRVE<span>THE FASHION STUDIO</span></Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link href="/collections">Collections</Link>
          <Link href="/collections?category=Tailoring">Tailoring</Link>
          <Link href="/virtual-try-on">Virtual Try-On</Link>
          <Link href="/account">Account</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/wishlist" aria-label="Wishlist">♡ <span>{wishlist.length}</span></Link>
          <Link href="/cart" aria-label="Cart">Bag <span>{cartCount}</span></Link>
        </div>
      </div>
    </header>
  );
}
