"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.7-5 3.1-7.5 7.5-7.5s6.8 2.5 7.5 7.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="site-header">
      <div className="service-bar">
        <div><span>▱</span> FREE SHIPPING ACROSS INDIA</div>
        <div><span>◇</span> CERTIFIED PREMIUM QUALITY</div>
        <div><span>♢</span> 100% SECURE PAYMENTS</div>
        <div><span>⌕</span> +91 12345 67890</div>
      </div>

      <div className="main-navigation">
        <button
          className="mobile-menu"
          aria-label="Open navigation"
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>

        <Link className="luxury-brand" href="/">
          <span className="brand-crown">♛</span>
          <strong>KRVE</strong>
          <small>— THE FASHION STUDIO —</small>
        </Link>

        <nav className={open ? "desktop-nav open" : "desktop-nav"}>
          <Link className="active" href="/">HOME</Link>
          <Link href="/collections">COLLECTIONS⌄</Link>
          <Link href="/collections?category=Men">MEN⌄</Link>
          <Link href="/collections?category=Women">WOMEN⌄</Link>
          <Link href="/collections?category=Accessories">ACCESSORIES⌄</Link>
          <Link className="sale-link" href="/collections?sale=true">SALE</Link>
          <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
        </nav>

        <div className="header-actions">
          <button type="button" aria-label="Search"><SearchIcon /></button>
          <Link href="/account" aria-label="Account"><UserIcon /></Link>
          <Link className="action-with-count" href="/wishlist" aria-label="Wishlist">
            <HeartIcon />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link className="action-with-count" href="/cart" aria-label="Shopping bag">
            <BagIcon />
            <span>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
