"use client";

import Image from "next/image";
import Link from "next/link";
import FestivalTheme from "./festival-theme";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { useUser } from "@clerk/nextjs";
import { useCart } from "@/components/cart-provider";
import type { KrveProduct } from "@/lib/api";

/* =========================================================
   KRVE — SITE HEADER
   Premium ivory navigation / black announcement bar
   All header styling is included in this file.
========================================================= */

type IconProps = {
  size?: number;
};

function IconBase({
  children,
  size = 21,
}: IconProps & {
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function SearchIcon({ size = 21 }: IconProps) {
  return (
    <IconBase size={size}>
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.1 4.1" />
    </IconBase>
  );
}

function CloseIcon({ size = 21 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </IconBase>
  );
}

function ArrowIcon({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

function AccountIcon({ size = 21 }: IconProps) {
  return (
    <IconBase size={size}>
      <circle cx="12" cy="7.5" r="3.3" />
      <path d="M5.3 20c.5-4 2.8-6.1 6.7-6.1s6.2 2.1 6.7 6.1" />
    </IconBase>
  );
}

function HeartIcon({ size = 21 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M20.4 5.9c-1.9-2-5-1.8-6.8.2L12 7.9l-1.6-1.8c-1.8-2-4.9-2.2-6.8-.2-2 2.1-1.9 5.5.3 7.7L12 20.9l8.1-7.3c2.2-2.2 2.3-5.6.3-7.7Z" />
    </IconBase>
  );
}

function BagIcon({ size = 21 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M5.4 8.5h13.2l-.95 11.7H6.35L5.4 8.5Z" />
      <path d="M8.7 8.5V6.8a3.3 3.3 0 0 1 6.6 0v1.7" />
    </IconBase>
  );
}

function MenuIcon({ size = 22 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M3.5 7h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 17h17" />
    </IconBase>
  );
}

function SparkleIcon({ size = 19 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M12 2.5c1.1 5.1 2.4 6.4 7.5 7.5-5.1 1.1-6.4 2.4-7.5 7.5-1.1-5.1-2.4-6.4-7.5-7.5 5.1-1.1 6.4-2.4 7.5-7.5Z" />
      <path d="M19 16.5c.4 1.8.9 2.3 2.5 2.7-1.6.3-2.1.9-2.5 2.5-.4-1.6-.9-2.2-2.5-2.5 1.6-.4 2.1-.9 2.5-2.7Z" />
    </IconBase>
  );
}

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getProductImage(product: KrveProduct) {
  if (product.image?.trim()) return product.image;
  if (product.imageUrl?.trim()) return product.imageUrl;

  if (Array.isArray(product.gallery) && product.gallery.length > 0) {
    return product.gallery[0];
  }

  return "";
}

const navigationLinks = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/collections?category=menswear" },
  { label: "WOMEN", href: "/collections?category=womenswear" },
  { label: "NEW ARRIVALS", href: "/collections" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "VIRTUAL TRY-ON", href: "/virtual-try-on" },
  { label: "ABOUT", href: "/about" },
];

export default function SiteHeader() {
  const { cartCount, wishlist } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveProducts, setLiveProducts] = useState<KrveProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------------------------------------------------
     LIVE PRODUCT SEARCH
  --------------------------------------------------------- */

  useEffect(() => {
    if (!searchOpen) return;

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(false);

      try {
        const parameters = new URLSearchParams();

        parameters.set("status", "published");
        parameters.set("limit", "6");

        if (searchQuery.trim()) {
          parameters.set("search", searchQuery.trim());
        }

        const response = await fetch(
          `/api/products?${parameters.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Product request failed.");
        }

        const result = (await response.json()) as {
          success?: boolean;
          data?: {
            products?: KrveProduct[];
          };
          products?: KrveProduct[];
          message?: string;
        };

        if (result.success === false) {
          throw new Error(
            result.message || "Unable to load KRVE products.",
          );
        }

        const products =
          result.data?.products ?? result.products ?? [];

        if (!Array.isArray(products)) {
          throw new Error("Invalid product response.");
        }

        setLiveProducts(
          products.filter(
            (product) =>
              Boolean(product?.id && product?.name),
          ),
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("KRVE_SEARCH_PRODUCTS_ERROR", error);
        setLiveProducts([]);
        setSearchError(true);
      } finally {
        if (!controller.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, searchQuery.trim() ? 200 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchOpen, searchQuery]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  /* ---------------------------------------------------------
     ESCAPE KEY + BODY SCROLL
  --------------------------------------------------------- */

  useEffect(() => {
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (searchOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, mobileMenuOpen]);

  /* ---------------------------------------------------------
     ACTIONS
  --------------------------------------------------------- */

  function openSearch() {
    setMobileMenuOpen(false);
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setLiveProducts([]);
    setSearchError(false);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleSearchChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setSearchQuery(event.target.value);
  }

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== "Enter" || liveProducts.length === 0) {
      return;
    }

    const firstProduct = liveProducts[0];
    if (!firstProduct) return;

    const identifier = firstProduct.slug || firstProduct.id;
    if (!identifier) return;

    window.location.href = `/product/${encodeURIComponent(identifier)}`;
  }

  const accountLabel =
    isLoaded && isSignedIn
      ? user?.firstName || "Account"
      : "Account";

  return (
    <>
      <FestivalTheme />

      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div className="krve-announcement">
        <div className="krve-announcement-left">
          <span className="announcement-dot" />
          <span>THE ART OF PERSONAL STYLE</span>
        </div>

        <Link href="/ai-stylist" className="krve-announcement-center">
          <SparkleIcon size={15} />
          <span>DISCOVER YOUR PERSONAL AI STYLIST</span>
          <ArrowIcon size={14} />
        </Link>

        <div className="krve-announcement-right">
          <span>CRAFTED FOR YOU</span>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header className="krve-header">
        <div className="krve-header-inner">

          <button
            type="button"
            className="krve-mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon size={24} />
          </button>

          {/* BRAND */}

          <Link
            href="/"
            className="krve-brand"
            aria-label="KRVE homepage"
          >
            <span className="krve-brand-name">KrvE</span>
            <span className="krve-brand-subtitle">
              THE FASHION STUDIO
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            className="krve-desktop-navigation"
            aria-label="Primary navigation"
          >
            {navigationLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="krve-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* HEADER ACTIONS */}

          <div className="krve-header-actions">

            <button
              type="button"
              className="krve-header-icon"
              onClick={openSearch}
              aria-label="Search products"
            >
              <SearchIcon />
            </button>

            <Link
              href="/account"
              className="krve-header-icon krve-account-icon"
              aria-label="My account"
            >
              {isLoaded && isSignedIn && user?.imageUrl ? (
                <span className="krve-user-image">
                  <Image
                    src={user.imageUrl}
                    alt={accountLabel}
                    fill
                    sizes="36px"
                  />
                </span>
              ) : (
                <AccountIcon />
              )}
            </Link>

            <Link
              href="/wishlist"
              className="krve-header-icon krve-count-parent"
              aria-label="Wishlist"
            >
              <HeartIcon />
              {wishlist.length > 0 && (
                <span className="krve-count-badge">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="krve-header-icon krve-count-parent"
              aria-label="Shopping bag"
            >
              <BagIcon />
              <span className="krve-count-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>

          </div>
        </div>
      </header>

      {/* =====================================================
          SEARCH OVERLAY
      ===================================================== */}

      {searchOpen && (
        <div className="krve-search-overlay">
          <button
            type="button"
            className="krve-search-backdrop"
            onClick={closeSearch}
            aria-label="Close search"
          />

          <section
            className="krve-search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search KRVE products"
          >
            <div className="krve-search-top">
              <div className="krve-search-logo">
                <span>KrvE</span>
                <small>INTELLIGENT SEARCH</small>
              </div>

              <button
                type="button"
                className="krve-search-close"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="krve-search-intro">
              <p>DISCOVER KRVE</p>
              <h2>What are you looking for?</h2>
              <span>
                Explore collections, tailoring, accessories and
                luxury essentials.
              </span>
            </div>

            <div className="krve-search-input-wrap">
              <SearchIcon size={23} />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products, collections or styles..."
                aria-label="Search products"
                autoComplete="off"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <CloseIcon size={17} />
                </button>
              )}
            </div>

            <div className="krve-search-results-heading">
              <div>
                <p>
                  {searchQuery ? "SEARCH RESULTS" : "LIVE STORE PRODUCTS"}
                </p>
                <span>
                  {searchLoading
                    ? "Loading..."
                    : searchError
                      ? "Unable to load"
                      : `${liveProducts.length} ${
                          liveProducts.length === 1 ? "piece" : "pieces"
                        }`}
                </span>
              </div>

              <Link href="/collections" onClick={closeSearch}>
                VIEW ALL <ArrowIcon size={15} />
              </Link>
            </div>

            {searchLoading ? (
              <div className="krve-search-empty">
                <SearchIcon size={30} />
                <p>SEARCHING KRVE</p>
                <h3>Finding live products.</h3>
                <span>
                  Searching products currently published in the store.
                </span>
              </div>
            ) : searchError ? (
              <div className="krve-search-empty">
                <CloseIcon size={30} />
                <p>STORE CONNECTION ERROR</p>
                <h3>Products could not be loaded.</h3>
                <span>Please try again in a moment.</span>
              </div>
            ) : liveProducts.length > 0 ? (
              <div className="krve-search-results">
                {liveProducts.map((product, index) => {
                  const image = getProductImage(product);
                  const identifier = product.slug || product.id;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${encodeURIComponent(identifier)}`}
                      className="krve-search-result"
                      onClick={closeSearch}
                    >
                      <span className="krve-result-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="krve-result-image">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="76px"
                          />
                        ) : (
                          <span />
                        )}
                      </div>

                      <div className="krve-result-copy">
                        <p>{product.category}</p>
                        <h3>{product.name}</h3>
                        <strong>{money.format(product.price)}</strong>
                      </div>

                      <ArrowIcon />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="krve-search-empty">
                <SearchIcon size={30} />
                <p>
                  {searchQuery ? "NO MATCHES FOUND" : "NO LIVE PRODUCTS"}
                </p>
                <h3>
                  {searchQuery
                    ? "We could not find that piece."
                    : "No published products are available."}
                </h3>
                <span>
                  {searchQuery
                    ? "Try another product name, collection or category."
                    : "No published products are currently available in the KRVE store."}
                </span>
                <Link href="/collections" onClick={closeSearch}>
                  EXPLORE COLLECTIONS <ArrowIcon size={15} />
                </Link>
              </div>
            )}

            <div className="krve-popular-searches">
              <span>POPULAR SEARCHES</span>
              <div>
                {["Blazer", "Shirt", "Sneakers", "Accessories", "Black"].map(
                  (item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setSearchQuery(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      {mobileMenuOpen && (
        <div className="krve-mobile-overlay">
          <button
            type="button"
            className="krve-mobile-backdrop"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          <aside
            className="krve-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="KRVE navigation"
          >
            <div className="krve-mobile-drawer-top">
              <Link
                href="/"
                className="krve-brand"
                onClick={closeMobileMenu}
              >
                <span className="krve-brand-name">KrvE</span>
                <span className="krve-brand-subtitle">
                  THE FASHION STUDIO
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation"
              >
                <CloseIcon />
              </button>
            </div>

            <p className="krve-mobile-eyebrow">
              EXPLORE THE WORLD OF KRVE
            </p>

            <nav className="krve-mobile-links">
              {navigationLinks.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                  <ArrowIcon size={17} />
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="krve-mobile-search"
              onClick={openSearch}
            >
              <SearchIcon />
              SEARCH KRVE
              <ArrowIcon />
            </button>

            <div className="krve-mobile-account-links">
              <Link href="/account" onClick={closeMobileMenu}>
                <AccountIcon />
                MY ACCOUNT
              </Link>

              <Link href="/wishlist" onClick={closeMobileMenu}>
                <HeartIcon />
                WISHLIST ({wishlist.length})
              </Link>

              <Link href="/cart" onClick={closeMobileMenu}>
                <BagIcon />
                BAG ({cartCount})
              </Link>
            </div>

            <div className="krve-mobile-footer">
              THE FASHION STUDIO
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================
          HEADER STYLES
      ===================================================== */}

      <style jsx global>{`
        .krve-announcement {
          min-height: 34px;
          width: 100%;
          padding: 0 5.2%;
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          align-items: center;
          background: #080808;
          color: #f4f0e8;
          font-family: Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 1.35px;
          position: relative;
          z-index: 80;
        }

        .krve-announcement-left,
        .krve-announcement-center,
        .krve-announcement-right {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .krve-announcement-center {
          justify-content: center;
          color: #e8c982;
          text-decoration: none;
          transition: color .25s ease;
        }

        .krve-announcement-center:hover {
          color: #fff;
        }

        .krve-announcement-right {
          justify-content: flex-end;
          color: #aaa49a;
        }

        .announcement-dot {
          height: 5px;
          width: 5px;
          border-radius: 50%;
          background: #c59b49;
          box-shadow: 0 0 8px rgba(197, 155, 73, .65);
        }

        .krve-header {
          width: 100%;
          background: #f5f2eb;
          color: #171613;
          position: relative;
          z-index: 70;
          border-bottom: 1px solid rgba(30, 27, 20, .12);
        }

        .krve-header-inner {
          min-height: 91px;
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 5.2%;
          display: grid;
          grid-template-columns: 190px minmax(0, 1fr) 190px;
          align-items: center;
          gap: 25px;
        }

        .krve-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #171613;
          width: fit-content;
          line-height: 1;
          flex-shrink: 0;
        }

        .krve-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 43px;
          font-weight: 500;
          letter-spacing: -3.2px;
          line-height: .95;
        }

        .krve-brand-subtitle {
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: 2.65px;
          margin-top: 7px;
          white-space: nowrap;
        }

        .krve-desktop-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(13px, 2.05vw, 34px);
          min-width: 0;
        }

        .krve-nav-link {
          position: relative;
          color: #292720;
          text-decoration: none;
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.05px;
          white-space: nowrap;
          padding: 12px 0;
          transition: color .25s ease;
        }

        .krve-nav-link::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 0;
          height: 1px;
          background: #a77c32;
          transition: width .25s ease;
        }

        .krve-nav-link:hover {
          color: #a77c32;
        }

        .krve-nav-link:hover::after {
          width: 100%;
        }

        .krve-header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 19px;
        }

        .krve-header-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 27px;
          height: 34px;
          padding: 0;
          color: #24221c;
          background: transparent;
          border: 0;
          text-decoration: none;
          cursor: pointer;
          transition: color .2s ease;
        }

        .krve-header-icon:hover {
          color: #a77c32;
        }

        .krve-count-parent {
          position: relative;
        }

        .krve-count-badge {
          position: absolute;
          top: -1px;
          right: -8px;
          min-width: 15px;
          height: 15px;
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          background: #171613;
          color: #fff;
          font-family: Arial, sans-serif;
          font-size: 8px;
          line-height: 1;
        }

        .krve-user-image {
          position: relative;
          width: 29px;
          height: 29px;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid rgba(167, 124, 50, .45);
        }

        .krve-user-image img {
          object-fit: cover;
        }

        .krve-mobile-menu-button {
          display: none;
          border: 0;
          background: transparent;
          color: #171613;
          padding: 7px;
          cursor: pointer;
        }

        /* SEARCH */

        .krve-search-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 5vh 18px;
        }

        .krve-search-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, .66);
          border: 0;
          cursor: pointer;
        }

        .krve-search-panel {
          position: relative;
          z-index: 1;
          width: min(760px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px 38px 30px;
          background: #f5f2eb;
          color: #191814;
          box-shadow: 0 25px 90px rgba(0, 0, 0, .25);
        }

        .krve-search-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(0, 0, 0, .12);
        }

        .krve-search-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .krve-search-logo span {
          font-family: Georgia, serif;
          font-size: 31px;
          letter-spacing: -2px;
        }

        .krve-search-logo small {
          font: 7px Arial, sans-serif;
          letter-spacing: 2px;
        }

        .krve-search-close,
        .krve-mobile-drawer-top button {
          border: 0;
          background: transparent;
          color: inherit;
          padding: 7px;
          cursor: pointer;
        }

        .krve-search-intro {
          padding: 35px 0 24px;
        }

        .krve-search-intro p,
        .krve-search-results-heading p,
        .krve-search-empty p {
          color: #a77c32;
          font: 9px Arial, sans-serif;
          letter-spacing: 2px;
        }

        .krve-search-intro h2 {
          margin: 10px 0;
          font: 38px Georgia, serif;
          font-weight: 400;
        }

        .krve-search-intro > span {
          color: #777268;
          font: 12px Arial, sans-serif;
        }

        .krve-search-input-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 16px;
          border: 1px solid rgba(0, 0, 0, .28);
          background: #fffdf8;
        }

        .krve-search-input-wrap input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #171613;
          font: 13px Arial, sans-serif;
        }

        .krve-search-input-wrap button {
          display: flex;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #292720;
        }

        .krve-search-results-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 25px 0 12px;
        }

        .krve-search-results-heading p {
          margin: 0 0 5px;
        }

        .krve-search-results-heading span {
          color: #777268;
          font: 10px Arial, sans-serif;
        }

        .krve-search-results-heading > a,
        .krve-search-empty > a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #8c682c;
          font: 9px Arial, sans-serif;
          letter-spacing: 1px;
          text-decoration: none;
        }

        .krve-search-results {
          border-top: 1px solid rgba(0, 0, 0, .12);
        }

        .krve-search-result {
          display: grid;
          grid-template-columns: 25px 65px minmax(0, 1fr) 22px;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, .1);
          color: #171613;
          text-decoration: none;
        }

        .krve-result-number {
          color: #a79e8e;
          font: 10px Georgia, serif;
        }

        .krve-result-image {
          position: relative;
          width: 65px;
          height: 72px;
          background: #e8e3d9;
          overflow: hidden;
        }

        .krve-result-image img {
          object-fit: cover;
        }

        .krve-result-copy p {
          margin: 0 0 5px;
          color: #9a763a;
          font: 8px Arial, sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .krve-result-copy h3 {
          margin: 0 0 6px;
          font: 16px Georgia, serif;
          font-weight: 400;
        }

        .krve-result-copy strong {
          font: 11px Arial, sans-serif;
        }

        .krve-search-result > svg {
          color: #9a763a;
        }

        .krve-search-empty {
          min-height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 9px;
          padding: 25px;
          color: #8b6c37;
        }

        .krve-search-empty p {
          margin: 7px 0 0;
        }

        .krve-search-empty h3 {
          margin: 0;
          color: #25231d;
          font: 22px Georgia, serif;
          font-weight: 400;
        }

        .krve-search-empty span {
          color: #777268;
          font: 11px Arial, sans-serif;
        }

        .krve-search-empty > a {
          margin-top: 9px;
        }

        .krve-popular-searches {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 15px;
          padding-top: 22px;
          border-top: 1px solid rgba(0, 0, 0, .12);
        }

        .krve-popular-searches > span {
          color: #777268;
          font: 8px Arial, sans-serif;
          letter-spacing: 1px;
        }

        .krve-popular-searches > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .krve-popular-searches button {
          padding: 7px 11px;
          border: 1px solid rgba(0, 0, 0, .15);
          border-radius: 30px;
          background: transparent;
          color: #38352d;
          font: 10px Arial, sans-serif;
          cursor: pointer;
        }

        .krve-popular-searches button:hover {
          border-color: #a77c32;
          color: #a77c32;
        }

        /* MOBILE DRAWER */

        .krve-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
        }

        .krve-mobile-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(0, 0, 0, .62);
        }

        .krve-mobile-drawer {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(420px, 88vw);
          overflow-y: auto;
          padding: 24px 25px;
          background: #f5f2eb;
          color: #171613;
          box-shadow: 15px 0 50px rgba(0, 0, 0, .2);
          animation: krveDrawerIn .28s ease both;
        }

        @keyframes krveDrawerIn {
          from {
            transform: translateX(-25px);
            opacity: .7;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .krve-mobile-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, .14);
        }

        .krve-mobile-drawer-top .krve-brand {
          align-items: flex-start;
        }

        .krve-mobile-eyebrow {
          margin: 31px 0 13px;
          color: #a77c32;
          font: 9px Arial, sans-serif;
          letter-spacing: 1.5px;
        }

        .krve-mobile-links {
          display: flex;
          flex-direction: column;
        }

        .krve-mobile-links a {
          display: grid;
          grid-template-columns: 28px 1fr 20px;
          align-items: center;
          gap: 10px;
          padding: 17px 0;
          border-bottom: 1px solid rgba(0, 0, 0, .11);
          color: #25231d;
          font: 11px Arial, sans-serif;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-decoration: none;
        }

        .krve-mobile-links a > span {
          color: #a77c32;
          font: 11px Georgia, serif;
        }

        .krve-mobile-links a > svg {
          justify-self: end;
          color: #a77c32;
        }

        .krve-mobile-search {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 27px;
          padding: 15px;
          border: 1px solid #292720;
          background: #171613;
          color: #f5f2eb;
          font: 10px Arial, sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .krve-mobile-search svg:last-child {
          margin-left: auto;
        }

        .krve-mobile-account-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 26px;
        }

        .krve-mobile-account-links a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #343128;
          font: 9px Arial, sans-serif;
          letter-spacing: .7px;
          text-decoration: none;
        }

        .krve-mobile-footer {
          margin-top: 45px;
          padding-top: 17px;
          border-top: 1px solid rgba(0, 0, 0, .12);
          color: #a77c32;
          font: 8px Arial, sans-serif;
          letter-spacing: 2px;
        }

        /* TABLET */

        @media (max-width: 1250px) {
          .krve-header-inner {
            grid-template-columns: 145px minmax(0, 1fr) 160px;
            padding-left: 3%;
            padding-right: 3%;
            gap: 12px;
          }

          .krve-desktop-navigation {
            gap: clamp(10px, 1.35vw, 19px);
          }

          .krve-nav-link {
            font-size: 8px;
            letter-spacing: .7px;
          }

          .krve-header-actions {
            gap: 13px;
          }
        }

        /* MOBILE */

        @media (max-width: 900px) {
          .krve-announcement {
            min-height: 31px;
            display: flex;
            justify-content: center;
            padding: 0 10px;
          }

          .krve-announcement-left,
          .krve-announcement-right {
            display: none;
          }

          .krve-announcement-center {
            font-size: 8px;
            letter-spacing: 1px;
          }

          .krve-header-inner {
            min-height: 73px;
            display: grid;
            grid-template-columns: 42px 1fr auto;
            padding: 0 17px;
            gap: 8px;
          }

          .krve-mobile-menu-button {
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
          }

          .krve-header-inner > .krve-brand {
            justify-self: center;
          }

          .krve-brand-name {
            font-size: 37px;
          }

          .krve-brand-subtitle {
            font-size: 6px;
            letter-spacing: 2px;
            margin-top: 5px;
          }

          .krve-desktop-navigation {
            display: none;
          }

          .krve-header-actions {
            gap: 12px;
          }

          .krve-header-actions .krve-account-icon,
          .krve-header-actions a[href="/wishlist"] {
            display: none;
          }

          .krve-header-icon {
            width: 25px;
          }

          .krve-search-panel {
            padding: 22px 20px;
          }

          .krve-search-intro h2 {
            font-size: 31px;
          }
        }

        @media (max-width: 430px) {
          .krve-header-inner {
            padding: 0 12px;
            grid-template-columns: 34px 1fr auto;
          }

          .krve-header-actions {
            gap: 8px;
          }

          .krve-header-actions .krve-header-icon {
            width: 23px;
          }

          .krve-brand-name {
            font-size: 34px;
          }

          .krve-search-result {
            grid-template-columns: 18px 56px minmax(0, 1fr) 18px;
            gap: 9px;
          }

          .krve-result-image {
            width: 56px;
            height: 65px;
          }

          .krve-result-copy h3 {
            font-size: 14px;
          }

          .krve-search-intro h2 {
            font-size: 27px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-mobile-drawer {
            animation: none;
          }

          .krve-nav-link,
          .krve-header-icon,
          .krve-announcement-center {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
