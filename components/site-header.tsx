"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header krve-site-header">
      <div className="announcement krve-announcement">
        Private client services · Complimentary shipping above ₹5,000
      </div>
      <div className="nav-shell krve-nav-shell">
        <button
          className="menu-button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>

        <Link className="brand krve-header-brand" href="/">
          KRVE
          <span>The Fashion Studio</span>
        </Link>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link href="/collections">Collections</Link>
          <Link href="/collections?category=Tailoring">Tailoring</Link>
          <Link href="/virtual-try-on">Virtual Studio</Link>
          <Link href="/account">Client Account</Link>
        </nav>

        <div className="nav-actions krve-nav-actions">
          <Link href="/wishlist" aria-label="Wishlist">
            Wishlist <span>{wishlist.length}</span>
          </Link>
          <Link href="/cart" aria-label="Shopping bag">
            Bag <span>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
