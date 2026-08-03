"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";

export default function SiteHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="inner-site-header">
      <Link href="/" className="inner-brand">
        <span>♛</span>
        <strong>KRVE</strong>
        <small>THE FASHION STUDIO</small>
      </Link>

      <nav>
        <Link href="/collections">Collections</Link>
        <Link href="/virtual-try-on">Virtual Try-On</Link>
        <Link href="/account">Account</Link>
        <Link href="/wishlist">Wishlist</Link>
        <Link href="/cart">Bag ({cartCount})</Link>
      </nav>
    </header>
  );
}
