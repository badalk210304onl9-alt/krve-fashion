"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

function Icon({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className="krveHeaderIcon">{children}</span>;
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist } = useCart();

  return (
    <header className="krveHeader">
      <div className="krveTopBar">
        <div><span>▱</span> FREE SHIPPING ACROSS INDIA</div>
        <div><span>◇</span> CERTIFIED PREMIUM QUALITY</div>
        <div><span>♢</span> 100% SECURE PAYMENTS</div>
        <div><span>⌕</span> +91 12345 67890</div>
      </div>

      <div className="krveMainNav">
        <button
          className="krveMenuButton"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <Link href="/" className="krveLogo">
          <span>♛</span>
          <strong>KRVE</strong>
          <small>— THE FASHION STUDIO —</small>
        </Link>

        <nav className={open ? "krveNavLinks open" : "krveNavLinks"}>
          <Link className="active" href="/">HOME</Link>
          <Link href="/collections">COLLECTIONS⌄</Link>
          <Link href="/collections?category=Men">MEN⌄</Link>
          <Link href="/collections?category=Women">WOMEN⌄</Link>
          <Link href="/collections?category=Accessories">ACCESSORIES⌄</Link>
          <Link className="sale" href="/collections?sale=true">SALE</Link>
          <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
        </nav>

        <div className="krveActions">
          <button aria-label="Search">
            <Icon>⌕</Icon>
          </button>
          <Link href="/account" aria-label="Account">
            <Icon>♙</Icon>
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="krveCountLink">
            <Icon>♡</Icon>
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </Link>
          <Link href="/cart" aria-label="Cart" className="krveCountLink">
            <Icon>▱</Icon>
            <span>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
