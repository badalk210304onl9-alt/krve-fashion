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
   KRVE — PREMIUM HEADER V2
   Independent styling. Existing website layout preserved.
========================================================= */

type IconProps = { size?: number };

function Icon({
  name,
  size = 21,
}: IconProps & {
  name: "search" | "close" | "arrow" | "account" | "heart" | "bag" | "menu" | "sparkle";
}) {
  const paths = {
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m15.7 15.7 4.3 4.3" />
      </>
    ),
    close: (
      <>
        <path d="M5 5 19 19" />
        <path d="M19 5 5 19" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    account: (
      <>
        <circle cx="12" cy="7.5" r="3.2" />
        <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
      </>
    ),
    heart: (
      <path d="M20.4 5.9c-1.9-2-5-1.8-6.8.2L12 7.9l-1.6-1.8c-1.8-2-4.9-2.2-6.8-.2-2 2.1-1.9 5.5.3 7.7L12 20.9l8.1-7.3c2.2-2.2 2.3-5.6.3-7.7Z" />
    ),
    bag: (
      <>
        <path d="M5.4 8.5h13.2l-.95 11.7H6.35L5.4 8.5Z" />
        <path d="M8.7 8.5V6.8a3.3 3.3 0 0 1 6.6 0v1.7" />
      </>
    ),
    menu: (
      <>
        <path d="M3.5 7h17" />
        <path d="M3.5 12h17" />
        <path d="M3.5 17h17" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 2.5c1.1 5.1 2.4 6.4 7.5 7.5-5.1 1.1-6.4 2.4-7.5 7.5-1.1-5.1-2.4-6.4-7.5-7.5 5.1-1.1 6.4-2.4 7.5-7.5Z" />
        <path d="M19 16.5c.4 1.8.9 2.3 2.5 2.7-1.6.3-2.1.9-2.5 2.5-.4-1.6-.9-2.2-2.5-2.5 1.6-.4 2.1-.9 2.5-2.7Z" />
      </>
    ),
  };

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
      {paths[name]}
    </svg>
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

const navigation = [
  { label: "SHOP", href: "/collections" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "VIRTUAL TRY-ON", href: "/virtual-try-on" },
  { label: "AI STYLIST", href: "/ai-stylist" },
  { label: "ABOUT US", href: "/about" },
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

  /* LIVE PRODUCT SEARCH */

  useEffect(() => {
    if (!searchOpen) return;

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(false);

      try {
        const params = new URLSearchParams({
          status: "published",
          limit: "6",
        });

        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const response = await fetch(
          `/api/products?${params.toString()}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`Product request failed: ${response.status}`);
        }

        const result = (await response.json()) as {
          success?: boolean;
          data?: { products?: KrveProduct[] };
          products?: KrveProduct[];
          message?: string;
        };

        if (result.success === false) {
          throw new Error(result.message || "Unable to load products.");
        }

        const products =
          result.data?.products ?? result.products ?? [];

        if (!Array.isArray(products)) {
          throw new Error("Invalid product response.");
        }

        setLiveProducts(
          products.filter(
            (product) => Boolean(product?.id && product?.name),
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

  /* FOCUS SEARCH */

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  /* ESCAPE + BODY SCROLL */

  useEffect(() => {
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      searchOpen || mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, mobileMenuOpen]);

  /* ACTIONS */

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

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || liveProducts.length === 0) return;

    const product = liveProducts[0];
    if (!product) return;

    const identifier = product.slug || product.id;

    window.location.href = `/product/${encodeURIComponent(identifier)}`;
  }

  const accountLabel =
    isLoaded && isSignedIn
      ? user?.firstName || "Account"
      : "Account";

  return (
    <>
      <FestivalTheme />

      {/* EXISTING AI STYLIST ANNOUNCEMENT */}

      <Link href="/ai-stylist" className="krve-v2-topbar">
        <span className="krve-v2-topbar-star">✦</span>
        <span>MEET YOUR PERSONAL AI STYLIST — GET RECOMMENDATIONS</span>
        <span className="krve-v2-topbar-arrow">→</span>
      </Link>

      {/* MAIN HEADER */}

      <header className="krve-v2-header">
        <div className="krve-v2-inner">

          {/* MOBILE MENU */}

          <button
            type="button"
            className="krve-v2-mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Icon name="menu" size={23} />
          </button>

          {/* LOGO */}

          <Link href="/" className="krve-v2-logo" aria-label="KRVE homepage">
            <span className="krve-v2-logo-main">KrvE</span>
            <span className="krve-v2-logo-caption">THE FASHION STUDIO</span>
          </Link>

          {/* NAVIGATION */}

          <nav className="krve-v2-navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="krve-v2-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ACTION ICONS */}

          <div className="krve-v2-actions">
            <button
              type="button"
              className="krve-v2-action"
              onClick={openSearch}
              aria-label="Search"
            >
              <Icon name="search" />
            </button>

            <Link
              href="/ai-stylist"
              className="krve-v2-action krve-v2-ai-action"
              aria-label="AI Stylist"
            >
              <Icon name="sparkle" />
            </Link>

            <Link
              href="/account"
              className="krve-v2-action"
              aria-label="My account"
            >
              {isLoaded && isSignedIn && user?.imageUrl ? (
                <span className="krve-v2-user-image">
                  <Image
                    src={user.imageUrl}
                    alt={accountLabel}
                    fill
                    sizes="34px"
                  />
                </span>
              ) : (
                <Icon name="account" />
              )}
            </Link>

            <Link
              href="/wishlist"
              className="krve-v2-action krve-v2-count-parent"
              aria-label="Wishlist"
            >
              <Icon name="heart" />
              {wishlist.length > 0 && (
                <span className="krve-v2-count">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="krve-v2-action krve-v2-count-parent"
              aria-label="Shopping bag"
            >
              <Icon name="bag" />
              <span className="krve-v2-count">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* SEARCH */}

      {searchOpen && (
        <div className="krve-v2-search-overlay">
          <button
            type="button"
            className="krve-v2-search-backdrop"
            onClick={closeSearch}
            aria-label="Close search"
          />

          <section
            className="krve-v2-search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search KRVE products"
          >
            <div className="krve-v2-search-top">
              <div className="krve-v2-search-brand">
                <span>KrvE</span>
                <small>INTELLIGENT SEARCH</small>
              </div>

              <button
                type="button"
                onClick={closeSearch}
                aria-label="Close search"
                className="krve-v2-close"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="krve-v2-search-intro">
              <p>DISCOVER KRVE</p>
              <h2>What are you looking for?</h2>
              <span>
                Explore collections, tailoring, accessories and luxury essentials.
              </span>
            </div>

            <div className="krve-v2-search-field">
              <Icon name="search" size={23} />

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
                  <Icon name="close" size={17} />
                </button>
              )}
            </div>

            <div className="krve-v2-result-heading">
              <div>
                <p>{searchQuery ? "SEARCH RESULTS" : "LIVE STORE PRODUCTS"}</p>
                <span>
                  {searchLoading
                    ? "Loading..."
                    : searchError
                      ? "Unable to load"
                      : `${liveProducts.length} pieces`}
                </span>
              </div>

              <Link href="/collections" onClick={closeSearch}>
                VIEW ALL <Icon name="arrow" size={15} />
              </Link>
            </div>

            {searchLoading ? (
              <div className="krve-v2-empty">
                <Icon name="search" size={30} />
                <p>SEARCHING KRVE</p>
                <h3>Finding live products.</h3>
                <span>Searching published products in the KRVE store.</span>
              </div>
            ) : searchError ? (
              <div className="krve-v2-empty">
                <Icon name="close" size={30} />
                <p>STORE CONNECTION ERROR</p>
                <h3>Products could not be loaded.</h3>
                <span>Please try again in a moment.</span>
              </div>
            ) : liveProducts.length > 0 ? (
              <div className="krve-v2-results">
                {liveProducts.map((product, index) => {
                  const image = getProductImage(product);
                  const identifier = product.slug || product.id;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${encodeURIComponent(identifier)}`}
                      className="krve-v2-result"
                      onClick={closeSearch}
                    >
                      <span className="krve-v2-result-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="krve-v2-result-image">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="70px"
                          />
                        ) : null}
                      </div>

                      <div className="krve-v2-result-copy">
                        <p>{product.category}</p>
                        <h3>{product.name}</h3>
                        <strong>{money.format(product.price)}</strong>
                      </div>

                      <Icon name="arrow" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="krve-v2-empty">
                <Icon name="search" size={30} />
                <p>{searchQuery ? "NO MATCHES FOUND" : "NO LIVE PRODUCTS"}</p>
                <h3>
                  {searchQuery
                    ? "We could not find that piece."
                    : "No published products are available."}
                </h3>
                <span>
                  {searchQuery
                    ? "Try another product name, collection or category."
                    : "No published products are currently available in the store."}
                </span>
                <Link href="/collections" onClick={closeSearch}>
                  EXPLORE COLLECTIONS <Icon name="arrow" size={15} />
                </Link>
              </div>
            )}

            <div className="krve-v2-suggestions">
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

      {/* MOBILE DRAWER */}

      {mobileMenuOpen && (
        <div className="krve-v2-mobile-overlay">
          <button
            type="button"
            className="krve-v2-mobile-backdrop"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          <aside
            className="krve-v2-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="KRVE navigation"
          >
            <div className="krve-v2-mobile-head">
              <Link href="/" className="krve-v2-logo" onClick={closeMobileMenu}>
                <span className="krve-v2-logo-main">KrvE</span>
                <span className="krve-v2-logo-caption">THE FASHION STUDIO</span>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <Icon name="close" />
              </button>
            </div>

            <p className="krve-v2-mobile-eyebrow">
              EXPLORE THE WORLD OF KRVE
            </p>

            <nav className="krve-v2-mobile-links">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                  <Icon name="arrow" size={17} />
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="krve-v2-mobile-search"
              onClick={openSearch}
            >
              <Icon name="search" />
              SEARCH KRVE
              <Icon name="arrow" />
            </button>

            <div className="krve-v2-mobile-account">
              <Link href="/account" onClick={closeMobileMenu}>
                <Icon name="account" /> MY ACCOUNT
              </Link>

              <Link href="/wishlist" onClick={closeMobileMenu}>
                <Icon name="heart" /> WISHLIST ({wishlist.length})
              </Link>

              <Link href="/cart" onClick={closeMobileMenu}>
                <Icon name="bag" /> BAG ({cartCount})
              </Link>
            </div>

            <div className="krve-v2-mobile-footer">
              THE FASHION STUDIO
            </div>
          </aside>
        </div>
      )}

      {/* ALL HEADER CSS IS SCOPED TO KRVE V2 */}

      <style jsx global>{`
        .krve-v2-topbar,
        .krve-v2-topbar * {
          box-sizing: border-box;
        }

        .krve-v2-topbar {
          width: 100%;
          min-height: 38px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #080808;
          color: #e9c77d;
          border-top: 1px solid rgba(201,151,38,.28);
          border-bottom: 1px solid rgba(201,151,38,.25);
          text-decoration: none;
          font: 9px Arial, sans-serif;
          font-weight: 600;
          letter-spacing: 1.3px;
          position: relative;
          z-index: 90;
        }

        .krve-v2-topbar:hover {
          color: #fff;
        }

        .krve-v2-topbar-star {
          font-size: 14px;
        }

        .krve-v2-topbar-arrow {
          font-size: 15px;
        }

        .krve-v2-header,
        .krve-v2-header * {
          box-sizing: border-box;
        }

        .krve-v2-header {
          width: 100%;
          min-height: 88px;
          position: relative;
          z-index: 80;
          display: block;
          background: #f5f2eb;
          color: #171613;
          border-bottom: 1px solid rgba(25,22,17,.13);
        }

        .krve-v2-inner {
          width: 100%;
          max-width: 1900px;
          min-height: 88px;
          margin: 0 auto;
          padding: 0 4.5%;
          display: grid;
          grid-template-columns: 180px minmax(0, 1fr) 205px;
          align-items: center;
          column-gap: 28px;
        }

        .krve-v2-logo {
          width: 150px;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          justify-self: start;
          color: #171613;
          text-decoration: none;
          line-height: 1;
          position: relative;
          z-index: 2;
        }

        .krve-v2-logo-main {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 45px;
          font-weight: 500;
          line-height: .91;
          letter-spacing: -3.3px;
        }

        .krve-v2-logo-caption {
          margin-top: 8px;
          font-family: Arial, sans-serif;
          font-size: 7px;
          letter-spacing: 2.2px;
          white-space: nowrap;
        }

        .krve-v2-navigation {
          min-width: 0;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          gap: clamp(17px, 2.1vw, 34px);
        }

        .krve-v2-nav-link {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 13px 0;
          color: #292720;
          font-family: Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.05px;
          text-decoration: none;
          white-space: nowrap;
          transition: color .2s ease;
        }

        .krve-v2-nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 5px;
          width: 0;
          height: 1px;
          background: #a77c32;
          transition: width .25s ease;
        }

        .krve-v2-nav-link:hover {
          color: #a77c32;
        }

        .krve-v2-nav-link:hover::after {
          width: 100%;
        }

        .krve-v2-actions {
          width: 205px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          gap: 17px;
          justify-self: end;
        }

        .krve-v2-action {
          width: 27px;
          height: 36px;
          flex: 0 0 27px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: 0;
          background: transparent;
          color: #24221c;
          text-decoration: none;
          cursor: pointer;
          transition: color .2s ease;
        }

        .krve-v2-action:hover {
          color: #a77c32;
        }

        .krve-v2-count-parent {
          position: relative;
        }

        .krve-v2-count {
          position: absolute;
          top: -1px;
          right: -7px;
          min-width: 15px;
          height: 15px;
          padding: 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 30px;
          background: #171613;
          color: #fff;
          font: 8px Arial, sans-serif;
        }

        .krve-v2-user-image {
          position: relative;
          display: block;
          width: 30px;
          height: 30px;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid #c99726;
        }

        .krve-v2-user-image img {
          object-fit: cover;
        }

        .krve-v2-mobile-menu {
          display: none;
        }

        /* SEARCH OVERLAY */

        .krve-v2-search-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 5vh 18px;
        }

        .krve-v2-search-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(0,0,0,.68);
          cursor: pointer;
        }

        .krve-v2-search-panel {
          position: relative;
          z-index: 1;
          width: min(760px,100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px 38px;
          background: #f5f2eb;
          color: #191814;
          box-shadow: 0 25px 90px rgba(0,0,0,.3);
        }

        .krve-v2-search-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0,0,0,.12);
        }

        .krve-v2-search-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .krve-v2-search-brand span {
          font: 31px Georgia,serif;
          letter-spacing: -2px;
        }

        .krve-v2-search-brand small {
          font: 7px Arial,sans-serif;
          letter-spacing: 2px;
        }

        .krve-v2-close,
        .krve-v2-mobile-head button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .krve-v2-search-intro {
          padding: 30px 0 23px;
        }

        .krve-v2-search-intro p,
        .krve-v2-result-heading p,
        .krve-v2-empty p {
          color: #a77c32;
          font: 9px Arial,sans-serif;
          letter-spacing: 2px;
        }

        .krve-v2-search-intro h2 {
          margin: 10px 0;
          font: 38px Georgia,serif;
          font-weight: 400;
        }

        .krve-v2-search-intro span {
          color: #777268;
          font: 12px Arial,sans-serif;
        }

        .krve-v2-search-field {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px;
          border: 1px solid rgba(0,0,0,.25);
          background: #fffdf8;
        }

        .krve-v2-search-field input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #171613;
          font: 13px Arial,sans-serif;
        }

        .krve-v2-search-field button {
          display: flex;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .krve-v2-result-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 25px 0 12px;
        }

        .krve-v2-result-heading p {
          margin: 0 0 5px;
        }

        .krve-v2-result-heading span {
          color: #777268;
          font: 10px Arial,sans-serif;
        }

        .krve-v2-result-heading a,
        .krve-v2-empty a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #8c682c;
          font: 9px Arial,sans-serif;
          letter-spacing: 1px;
          text-decoration: none;
        }

        .krve-v2-results {
          border-top: 1px solid rgba(0,0,0,.12);
        }

        .krve-v2-result {
          display: grid;
          grid-template-columns: 25px 65px minmax(0,1fr) 22px;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,0,0,.1);
          color: #171613;
          text-decoration: none;
        }

        .krve-v2-result-number {
          color: #a79e8e;
          font: 10px Georgia,serif;
        }

        .krve-v2-result-image {
          position: relative;
          width: 65px;
          height: 72px;
          overflow: hidden;
          background: #e8e3d9;
        }

        .krve-v2-result-image img {
          object-fit: cover;
        }

        .krve-v2-result-copy p {
          margin: 0 0 5px;
          color: #9a763a;
          font: 8px Arial,sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .krve-v2-result-copy h3 {
          margin: 0 0 6px;
          font: 16px Georgia,serif;
          font-weight: 400;
        }

        .krve-v2-result-copy strong {
          font: 11px Arial,sans-serif;
        }

        .krve-v2-empty {
          min-height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 25px;
          text-align: center;
          color: #8b6c37;
        }

        .krve-v2-empty h3 {
          margin: 0;
          color: #25231d;
          font: 22px Georgia,serif;
          font-weight: 400;
        }

        .krve-v2-empty span {
          color: #777268;
          font: 11px Arial,sans-serif;
        }

        .krve-v2-suggestions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 15px;
          padding-top: 22px;
          border-top: 1px solid rgba(0,0,0,.12);
        }

        .krve-v2-suggestions > span {
          color: #777268;
          font: 8px Arial,sans-serif;
          letter-spacing: 1px;
        }

        .krve-v2-suggestions > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .krve-v2-suggestions button {
          padding: 7px 11px;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 30px;
          background: transparent;
          color: #38352d;
          font: 10px Arial,sans-serif;
          cursor: pointer;
        }

        .krve-v2-suggestions button:hover {
          border-color: #a77c32;
          color: #a77c32;
        }

        /* MOBILE NAVIGATION */

        .krve-v2-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
        }

        .krve-v2-mobile-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(0,0,0,.65);
        }

        .krve-v2-mobile-drawer {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: min(420px,88vw);
          overflow-y: auto;
          padding: 24px 25px;
          background: #f5f2eb;
          color: #171613;
          box-shadow: 15px 0 50px rgba(0,0,0,.2);
          animation: krveV2Drawer .25s ease both;
        }

        @keyframes krveV2Drawer {
          from {
            transform: translateX(-25px);
            opacity: .6;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .krve-v2-mobile-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0,0,0,.14);
        }

        .krve-v2-mobile-head .krve-v2-logo {
          align-items: flex-start;
        }

        .krve-v2-mobile-eyebrow {
          margin: 30px 0 13px;
          color: #a77c32;
          font: 9px Arial,sans-serif;
          letter-spacing: 1.5px;
        }

        .krve-v2-mobile-links {
          display: flex;
          flex-direction: column;
        }

        .krve-v2-mobile-links a {
          display: grid;
          grid-template-columns: 28px 1fr 20px;
          align-items: center;
          gap: 10px;
          padding: 17px 0;
          border-bottom: 1px solid rgba(0,0,0,.11);
          color: #25231d;
          font: 11px Arial,sans-serif;
          font-weight: 600;
          letter-spacing: 1px;
          text-decoration: none;
        }

        .krve-v2-mobile-links a span {
          color: #a77c32;
          font: 11px Georgia,serif;
        }

        .krve-v2-mobile-links a svg {
          justify-self: end;
          color: #a77c32;
        }

        .krve-v2-mobile-search {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 27px;
          padding: 15px;
          border: 1px solid #292720;
          background: #171613;
          color: #f5f2eb;
          font: 10px Arial,sans-serif;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .krve-v2-mobile-search svg:last-child {
          margin-left: auto;
        }

        .krve-v2-mobile-account {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 26px;
        }

        .krve-v2-mobile-account a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #343128;
          font: 9px Arial,sans-serif;
          text-decoration: none;
        }

        .krve-v2-mobile-footer {
          margin-top: 45px;
          padding-top: 17px;
          border-top: 1px solid rgba(0,0,0,.12);
          color: #a77c32;
          font: 8px Arial,sans-serif;
          letter-spacing: 2px;
        }

        /* TABLET */

        @media (max-width: 1250px) and (min-width: 901px) {
          .krve-v2-inner {
            padding-left: 2.5%;
            padding-right: 2.5%;
            grid-template-columns: 145px minmax(0,1fr) 175px;
            column-gap: 15px;
          }

          .krve-v2-logo {
            width: 135px;
            min-width: 135px;
          }

          .krve-v2-logo-main {
            font-size: 40px;
          }

          .krve-v2-navigation {
            gap: clamp(10px,1.3vw,17px);
          }

          .krve-v2-nav-link {
            font-size: 8px;
            letter-spacing: .6px;
          }

          .krve-v2-actions {
            width: 175px;
            gap: 12px;
          }
        }

        /* MOBILE */

        @media (max-width: 900px) {
          .krve-v2-inner {
            min-height: 73px;
            padding: 0 16px;
            grid-template-columns: 42px minmax(0,1fr) auto;
            column-gap: 8px;
          }

          .krve-v2-mobile-menu {
            display: inline-flex;
            width: 36px;
            height: 36px;
            align-items: center;
            justify-content: flex-start;
            padding: 5px;
            border: 0;
            background: transparent;
            color: #171613;
            cursor: pointer;
          }

          .krve-v2-inner > .krve-v2-logo {
            width: 130px;
            min-width: 130px;
            justify-self: center;
          }

          .krve-v2-logo-main {
            font-size: 36px;
          }

          .krve-v2-logo-caption {
            font-size: 6px;
          }

          .krve-v2-navigation {
            display: none;
          }

          .krve-v2-actions {
            width: auto;
            gap: 10px;
          }

          .krve-v2-actions a[href="/account"],
          .krve-v2-actions a[href="/wishlist"],
          .krve-v2-ai-action {
            display: none;
          }

          .krve-v2-action {
            width: 25px;
            flex-basis: 25px;
          }
        }

        @media (max-width: 430px) {
          .krve-v2-inner {
            padding: 0 10px;
            grid-template-columns: 34px minmax(0,1fr) auto;
          }

          .krve-v2-actions {
            gap: 7px;
          }

          .krve-v2-action {
            width: 23px;
            flex-basis: 23px;
          }

          .krve-v2-logo-main {
            font-size: 33px;
          }

          .krve-v2-search-panel {
            padding: 22px 16px;
          }

          .krve-v2-search-intro h2 {
            font-size: 27px;
          }

          .krve-v2-result {
            grid-template-columns: 18px 56px minmax(0,1fr) 18px;
            gap: 9px;
          }

          .krve-v2-result-image {
            width: 56px;
            height: 65px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .krve-v2-mobile-drawer {
            animation: none;
          }

          .krve-v2-nav-link,
          .krve-v2-action {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
