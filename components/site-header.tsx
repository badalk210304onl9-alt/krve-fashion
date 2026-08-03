"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

type IconProps = {
  size?: number;
};

function SearchIcon({ size = 23 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function SparkleIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2.8c.9 4.7 2.5 6.3 7.2 7.2-4.7.9-6.3 2.5-7.2 7.2-.9-4.7-2.5-6.3-7.2-7.2 4.7-.9 6.3-2.5 7.2-7.2Z" />
      <path d="M19.1 15.3c.35 1.85.98 2.48 2.83 2.83-1.85.35-2.48.98-2.83 2.83-.35-1.85-.98-2.48-2.83-2.83 1.85-.35 2.48-.98 2.83-2.83Z" />
    </svg>
  );
}

function AccountIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="8" r="3.35" />
      <path d="M5.8 20c.45-4 2.7-6.2 6.2-6.2s5.75 2.2 6.2 6.2" />
    </svg>
  );
}

function HeartIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M20.6 5.8c-1.9-2-5-1.8-6.8.2L12 7.9 10.2 6C8.4 4 5.3 3.8 3.4 5.8c-2.1 2.2-1.9 5.6.2 7.7L12 21l8.4-7.5c2.1-2.1 2.3-5.5.2-7.7Z" />
    </svg>
  );
}

function BagIcon({ size = 24 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5.2 8.5h13.6l-1 12H6.2l-1-12Z" />
      <path d="M8.6 8.5V6.8a3.4 3.4 0 0 1 6.8 0v1.7" />
    </svg>
  );
}

export default function SiteHeader() {
  const { cartCount, wishlist } = useCart();

  return (
    <>
      <Link href="/ai-stylist" className="topbar">
        <span className="topbar-star">✦</span>
        <span>Meet Your Personal AI Stylist — Get Recommendations</span>
        <span className="topbar-arrow" aria-hidden="true">→</span>
      </Link>

      <header className="header">
        <Link href="/" className="brand" aria-label="KRVE homepage">
          <span>KrvE</span>
          <small>THE FASHION STUDIO</small>
        </Link>

        <nav aria-label="Primary navigation">
          <Link href="/collections">SHOP</Link>
          <Link href="/collections">COLLECTIONS</Link>
          <Link href="/virtual-try-on">VIRTUAL TRY-ON</Link>
          <Link href="/ai-stylist">AI STYLIST</Link>
          <Link href="/about">ABOUT US</Link>
        </nav>

        <div className="actions">
          <button className="icon-button" type="button" aria-label="Search">
            <SearchIcon />
          </button>

          <Link href="/ai-stylist" className="icon-button ai-action" aria-label="AI Stylist">
            <SparkleIcon />
            <span className="ai-label">AI</span>
          </Link>

          <Link href="/account" className="icon-button account-action" aria-label="My account">
            <AccountIcon />
          </Link>

          <Link href="/wishlist" className="icon-button" aria-label="Wishlist">
            <HeartIcon />
            {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
          </Link>

          <Link href="/cart" className="icon-button" aria-label="Shopping bag">
            <BagIcon />
            <span className="count-badge">{cartCount}</span>
          </Link>
        </div>
      </header>
    </>
  );
}
