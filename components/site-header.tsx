"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { useUser } from "@clerk/nextjs";

import {
  useCart,
} from "@/components/cart-provider";

import {
  products,
} from "@/lib/catalog";

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

      <path d="m15.7 15.7 4.3 4.3" />
    </svg>
  );
}

function CloseIcon({
  size = 21,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

function ArrowIcon({
  size = 17,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
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

function MenuIcon({
  size = 23,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  );

export default function SiteHeader() {
  const {
    cartCount,
    wishlist,
  } = useCart();

  const {
    isLoaded,
    isSignedIn,
    user,
  } = useUser();

  const [
    searchOpen,
    setSearchOpen,
  ] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const headerRef =
    useRef<HTMLElement | null>(
      null,
    );

  const filteredProducts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return products.slice(
          0,
          5,
        );
      }

      return products
        .filter(
          (
            product,
          ) => {
            const searchableText =
              [
                product.name,
                product.category,
                product.id,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
              query,
            );
          },
        )
        .slice(
          0,
          6,
        );
    }, [
      searchQuery,
    ]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          searchInputRef.current?.focus();
        },
        120,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    searchOpen,
  ]);

  useEffect(() => {
    function handleEscape(
      event: globalThis.KeyboardEvent,
    ) {
      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      setSearchOpen(
        false,
      );

      setMobileMenuOpen(
        false,
      );
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    if (
      searchOpen ||
      mobileMenuOpen
    ) {
      document.body.style.overflow =
        "hidden";

      return;
    }

    document.body.style.overflow =
      "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [
    searchOpen,
    mobileMenuOpen,
  ]);

  function openSearch() {
    setMobileMenuOpen(
      false,
    );

    setSearchOpen(
      true,
    );
  }

  function closeSearch() {
    setSearchOpen(
      false,
    );

    setSearchQuery(
      "",
    );
  }

  function handleSearchChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    setSearchQuery(
      event.target.value,
    );
  }

  function handleSearchKeyDown(
    event:
      KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key ===
        "Enter" &&
      filteredProducts.length >
        0
    ) {
      const firstProduct =
        filteredProducts[0];

      window.location.href =
        `/product/${firstProduct.id}`;
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(
      false,
    );
  }

  const accountLabel =
    isLoaded &&
    isSignedIn
      ? user?.firstName ||
        "Account"
      : "Account";

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
          Meet Your Personal AI Stylist
          — Get Recommendations
        </span>

        <span
          className="topbar-arrow"
          aria-hidden="true"
        >
          →
        </span>
      </Link>

      <header
        ref={headerRef}
        className="header krve-header"
      >
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(
              true,
            )
          }
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>

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
          className="desktop-navigation"
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
            className="
              icon-button
              search-action
            "
            onClick={
              openSearch
            }
            aria-label="Open product search"
          >
            <SearchIcon />

            <span className="action-tooltip">
              Search
            </span>
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

            <span className="action-tooltip">
              AI Stylist
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
            {isLoaded &&
            isSignedIn &&
            user?.imageUrl ? (
              <span className="header-user-image">
                <Image
                  src={
                    user.imageUrl
                  }
                  alt={
                    accountLabel
                  }
                  fill
                  sizes="38px"
                />
              </span>
            ) : (
              <AccountIcon />
            )}

            <span className="action-tooltip">
              {accountLabel}
            </span>
          </Link>

          <Link
            href="/wishlist"
            className="icon-button"
            aria-label="Wishlist"
          >
            <HeartIcon />

            {wishlist.length >
              0 && (
              <span className="count-badge">
                {wishlist.length >
                99
                  ? "99+"
                  : wishlist.length}
              </span>
            )}

            <span className="action-tooltip">
              Wishlist
            </span>
          </Link>

          <Link
            href="/cart"
            className="icon-button"
            aria-label="Shopping bag"
          >
            <BagIcon />

            <span className="count-badge">
              {cartCount > 99
                ? "99+"
                : cartCount}
            </span>

            <span className="action-tooltip">
              Shopping Bag
            </span>
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div
          className="search-overlay"
          role="presentation"
        >
          <button
            type="button"
            className="search-overlay-backdrop"
            onClick={
              closeSearch
            }
            aria-label="Close search"
          />

          <section
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search KRVE products"
          >
            <div className="search-panel-top">
              <div className="search-panel-brand">
                <span>
                  KrvE
                </span>

                <small>
                  INTELLIGENT SEARCH
                </small>
              </div>

              <button
                type="button"
                className="search-close-button"
                onClick={
                  closeSearch
                }
                aria-label="Close search"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="search-heading">
              <p>
                DISCOVER KRVE
              </p>

              <h2>
                What are you
                looking for?
              </h2>

              <span>
                Search collections,
                tailoring, accessories
                and luxury essentials.
              </span>
            </div>

            <div className="luxury-search-field">
              <SearchIcon
                size={25}
              />

              <input
                ref={
                  searchInputRef
                }
                type="search"
                value={
                  searchQuery
                }
                onChange={
                  handleSearchChange
                }
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search products, collections or styles..."
                aria-label="Search products"
                autoComplete="off"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-button"
                  onClick={() =>
                    setSearchQuery(
                      "",
                    )
                  }
                  aria-label="Clear search"
                >
                  <CloseIcon
                    size={17}
                  />
                </button>
              )}
            </div>

            <div className="search-result-heading">
              <div>
                <p>
                  {searchQuery
                    ? "SEARCH RESULTS"
                    : "FEATURED DISCOVERIES"}
                </p>

                <span>
                  {
                    filteredProducts.length
                  }{" "}
                  {filteredProducts.length ===
                  1
                    ? "piece"
                    : "pieces"}
                </span>
              </div>

              <Link
                href="/collections"
                onClick={
                  closeSearch
                }
              >
                VIEW ALL

                <ArrowIcon />
              </Link>
            </div>

            {filteredProducts.length >
            0 ? (
              <div className="search-results">
                {filteredProducts.map(
                  (
                    product,
                    index,
                  ) => (
                    <Link
                      key={
                        product.id
                      }
                      href={`/product/${product.id}`}
                      className="search-result-item"
                      onClick={
                        closeSearch
                      }
                    >
                      <div className="search-result-number">
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <div className="search-result-image">
                        <Image
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          fill
                          sizes="76px"
                        />
                      </div>

                      <div className="search-result-copy">
                        <p>
                          {product.category}
                        </p>

                        <h3>
                          {product.name}
                        </h3>

                        <strong>
                          {money.format(
                            product.price,
                          )}
                        </strong>
                      </div>

                      <span className="search-result-arrow">
                        <ArrowIcon />
                      </span>
                    </Link>
                  ),
                )}
              </div>
            ) : (
              <div className="search-empty-state">
                <div className="search-empty-icon">
                  <SearchIcon
                    size={31}
                  />
                </div>

                <p>
                  NO MATCHES FOUND
                </p>

                <h3>
                  We could not find that
                  piece.
                </h3>

                <span>
                  Try another product name,
                  collection or category.
                </span>

                <Link
                  href="/collections"
                  onClick={
                    closeSearch
                  }
                >
                  EXPLORE COLLECTIONS

                  <ArrowIcon />
                </Link>
              </div>
            )}

            <div className="search-suggestions">
              <span>
                POPULAR SEARCHES
              </span>

              <div>
                {[
                  "Blazer",
                  "Shirt",
                  "Sneakers",
                  "Accessories",
                  "Black",
                ].map(
                  (
                    suggestion,
                  ) => (
                    <button
                      type="button"
                      key={
                        suggestion
                      }
                      onClick={() =>
                        setSearchQuery(
                          suggestion,
                        )
                      }
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          className="mobile-navigation-overlay"
          role="presentation"
        >
          <button
            type="button"
            className="mobile-navigation-backdrop"
            onClick={
              closeMobileMenu
            }
            aria-label="Close navigation menu"
          />

          <aside
            className="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="KRVE navigation"
          >
            <div className="mobile-navigation-header">
              <Link
                href="/"
                className="mobile-navigation-brand"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  KrvE
                </span>

                <small>
                  THE FASHION STUDIO
                </small>
              </Link>

              <button
                type="button"
                className="mobile-navigation-close"
                onClick={
                  closeMobileMenu
                }
                aria-label="Close navigation"
              >
                <CloseIcon />
              </button>
            </div>

            <nav>
              <Link
                href="/collections"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  01
                </span>

                SHOP

                <ArrowIcon />
              </Link>

              <Link
                href="/collections"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  02
                </span>

                COLLECTIONS

                <ArrowIcon />
              </Link>

              <Link
                href="/virtual-try-on"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  03
                </span>

                VIRTUAL TRY-ON

                <ArrowIcon />
              </Link>

              <Link
                href="/ai-stylist"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  04
                </span>

                AI STYLIST

                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                onClick={
                  closeMobileMenu
                }
              >
                <span>
                  05
                </span>

                ABOUT US

                <ArrowIcon />
              </Link>
            </nav>

            <button
              type="button"
              className="mobile-search-button"
              onClick={
                openSearch
              }
            >
              <SearchIcon />

              SEARCH KRVE

              <ArrowIcon />
            </button>

            <div className="mobile-member-links">
              <Link
                href="/account"
                onClick={
                  closeMobileMenu
                }
              >
                <AccountIcon />

                MY ACCOUNT
              </Link>

              <Link
                href="/wishlist"
                onClick={
                  closeMobileMenu
                }
              >
                <HeartIcon />

                WISHLIST
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
