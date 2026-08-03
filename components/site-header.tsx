"use client";

import Link from "next/link";

import {
  useCart,
} from "@/components/cart-provider";

type IconProps = {
  size?: number;
};

function SearchIcon({
  size = 22,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle
        cx="10.8"
        cy="10.8"
        r="6.4"
      />

      <path
        d="m15.7 15.7 4.3 4.3"
      />
    </svg>
  );
}

function SparkleIcon({
  size = 23,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          M11.5 2.7
          c.9 4.5 2.5 6.1 7 7
          -4.5.9-6.1 2.5-7 7
          -.9-4.5-2.5-6.1-7-7
          4.5-.9 6.1-2.5 7-7Z
        "
      />

      <path
        d="
          M18.8 15.5
          c.35 1.7.95 2.3 2.65 2.65
          -1.7.35-2.3.95-2.65 2.65
          -.35-1.7-.95-2.3-2.65-2.65
          1.7-.35 2.3-.95 2.65-2.65Z
        "
      />
    </svg>
  );
}

function AccountIcon({
  size = 23,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="7.6"
        r="3.25"
      />

      <path
        d="
          M5.7 20
          c.5-4 2.75-6.1 6.3-6.1
          s5.8 2.1 6.3 6.1
        "
      />
    </svg>
  );
}

function HeartIcon({
  size = 23,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          M20.4 5.9
          c-1.9-2-5-1.8-6.8.2
          L12 7.9
          10.4 6.1
          c-1.8-2-4.9-2.2-6.8-.2
          -2 2.1-1.9 5.5.3 7.7
          L12 20.9
          l8.1-7.3
          c2.2-2.2 2.3-5.6.3-7.7Z
        "
      />
    </svg>
  );
}

function BagIcon({
  size = 23,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="
          M5.4 8.5
          h13.2
          l-.95 11.7
          H6.35
          L5.4 8.5Z
        "
      />

      <path
        d="
          M8.7 8.5
          V6.8
          a3.3 3.3 0 0 1 6.6 0
          v1.7
        "
      />
    </svg>
  );
}

export default function SiteHeader() {
  const {
    cartCount,
    wishlist,
  } = useCart();

  return (
    <>
      <Link
        href="/ai-stylist"
        className="topbar"
      >
        <span
          className="topbar-star"
          aria-hidden="true"
        >
          ✦
        </span>

        <span>
          Meet Your Personal AI
          Stylist — Get
          Recommendations
        </span>

        <span
          className="topbar-arrow"
          aria-hidden="true"
        >
          →
        </span>
      </Link>

      <header className="header">
        <Link
          href="/"
          className="brand"
          aria-label="KRVE homepage"
        >
          <span>KrvE</span>

          <small>
            THE FASHION STUDIO
          </small>
        </Link>

        <nav
          aria-label="Primary navigation"
        >
          <Link href="/collections">
            SHOP
          </Link>

          <Link href="/collections">
            COLLECTIONS
          </Link>

          <Link href="/virtual-try-on">
            VIRTUAL TRY-ON
          </Link>

          <Link href="/ai-stylist">
            AI STYLIST
          </Link>

          <Link href="/about">
            ABOUT US
          </Link>
        </nav>

        <div className="actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          <Link
            href="/ai-stylist"
            className="
              icon-button
              ai-action
            "
            aria-label="Open AI stylist"
          >
            <SparkleIcon />

            <span className="ai-label">
              AI
            </span>
          </Link>

          <Link
            href="/account"
            className="
              icon-button
              account-action
            "
            aria-label="My account"
          >
            <AccountIcon />
          </Link>

          <Link
            href="/wishlist"
            className="icon-button"
            aria-label="Wishlist"
          >
            <HeartIcon />

            {wishlist.length > 0 && (
              <span className="count-badge">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="icon-button"
            aria-label="Shopping bag"
          >
            <BagIcon />

            <span className="count-badge">
              {cartCount}
            </span>
          </Link>
        </div>
      </header>
    </>
  );
}
