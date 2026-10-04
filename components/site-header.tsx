"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

import { useUser } from "@clerk/nextjs";

import {
  useCart,
} from "@/components/cart-provider";

import type { KrveProduct } from "@/lib/api";

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

function getProductImage(
  product: KrveProduct,
) {
  if (
    product.image &&
    product.image.trim()
  ) {
    return product.image;
  }

  if (
    product.imageUrl &&
    product.imageUrl.trim()
  ) {
    return product.imageUrl;
  }

  if (
    Array.isArray(
      product.gallery,
    ) &&
    product.gallery.length > 0
  ) {
    return product.gallery[0];
  }

  return "";
}

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
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    liveProducts,
    setLiveProducts,
  ] = useState<KrveProduct[]>(
    [],
  );

  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState(false);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          setSearchLoading(true);
          setSearchError(false);

          try {
            const parameters =
              new URLSearchParams();

            parameters.set(
              "status",
              "published",
            );

            parameters.set(
              "limit",
              "6",
            );

            if (
              searchQuery.trim()
            ) {
              parameters.set(
                "search",
                searchQuery.trim(),
              );
            }

            const response =
              await fetch(
                `/api/products?${parameters.toString()}`,
                {
                  method:
                    "GET",

                  headers: {
                    Accept:
                      "application/json",
                  },

                  cache:
                    "no-store",

                  signal:
                    controller.signal,
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                `Product request failed with status ${response.status}.`,
              );
            }

            const result =
              (await response.json()) as {
                success?: boolean;

                data?: {
                  products?: KrveProduct[];
                };

                products?: KrveProduct[];

                message?: string;
              };

            if (
              result.success ===
              false
            ) {
              throw new Error(
                result.message ||
                  "Unable to load KRVE products.",
              );
            }

            const products =
              result.data
                ?.products ??
              result.products ??
              [];

            if (
              !Array.isArray(
                products,
              )
            ) {
              throw new Error(
                "Invalid KRVE product response.",
              );
            }

            /*
             * Only real products returned by
             * the KRVE Central API are displayed.
             *
             * There is intentionally NO demo
             * product fallback here.
             */

            setLiveProducts(
              products.filter(
                (
                  product,
                ) =>
                  product &&
                  product.id &&
                  product.name,
              ),
            );
          } catch (error) {
            if (
              error instanceof
                DOMException &&
              error.name ===
                "AbortError"
            ) {
              return;
            }

            console.error(
              "KRVE_SEARCH_PRODUCTS_ERROR",
              error,
            );

            setLiveProducts([]);
            setSearchError(true);
          } finally {
            if (
              !controller.signal.aborted
            ) {
              setSearchLoading(
                false,
              );
            }
          }
        },
        searchQuery.trim()
          ? 180
          : 0,
      );

    return () => {
      window.clearTimeout(
        timer,
      );

      controller.abort();
    };
  }, [
    searchOpen,
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

    setLiveProducts(
      [],
    );

    setSearchError(
      false,
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
      event.key !==
        "Enter" ||
      liveProducts.length ===
        0
    ) {
      return;
    }

    const firstProduct =
      liveProducts[0];

    if (
      !firstProduct
    ) {
      return;
    }

    const identifier =
      firstProduct.slug ||
      firstProduct.id;

    if (!identifier) {
      return;
    }

    window.location.href =
      `/product/${encodeURIComponent(
        identifier,
      )}`;
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

      <header className="header krve-header">
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
                    : "LIVE STORE PRODUCTS"}
                </p>

                <span>
                  {searchLoading
                    ? "Loading..."
                    : searchError
                      ? "Unable to load"
                      : `${liveProducts.length} ${
                          liveProducts.length ===
                          1
                            ? "piece"
                            : "pieces"
                        }`}
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

            {searchLoading ? (
              <div className="search-empty-state">
                <div className="search-empty-icon">
                  <SearchIcon
                    size={31}
                  />
                </div>

                <p>
                  SEARCHING KRVE
                </p>

                <h3>
                  Finding live products.
                </h3>

                <span>
                  Searching products currently
                  published in the KRVE store.
                </span>
              </div>
            ) : searchError ? (
              <div className="search-empty-state">
                <div className="search-empty-icon">
                  <CloseIcon
                    size={31}
                  />
                </div>

                <p>
                  STORE CONNECTION ERROR
                </p>

                <h3>
                  Products could not be loaded.
                </h3>

                <span>
                  Please try again in a moment.
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery(
                      (
                        current,
                      ) =>
                        current,
                      ),
                  }
                >
                  TRY AGAIN

                  <ArrowIcon />
                </button>
              </div>
            ) : liveProducts.length >
              0 ? (
              <div className="search-results">
                {liveProducts.map(
                  (
                    product,
                    index,
                  ) => {
                    const image =
                      getProductImage(
                        product,
                      );

                    const identifier =
                      product.slug ||
                      product.id;

                    return (
                      <Link
                        key={
                          product.id
                        }
                        href={`/product/${encodeURIComponent(
                          identifier,
                        )}`}
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
                          {image ? (
                            <Image
                              src={
                                image
                              }
                              alt={
                                product.name
                              }
                              fill
                              sizes="76px"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="search-result-copy">
                          <p>
                            {
                              product.category
                            }
                          </p>

                          <h3>
                            {
                              product.name
                            }
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
                    );
                  },
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
                  {searchQuery
                    ? "NO MATCHES FOUND"
                    : "NO LIVE PRODUCTS"}
                </p>

                <h3>
                  {searchQuery
                    ? "We could not find that piece."
                    : "No published products are available."}
                </h3>

                <span>
                  {searchQuery
                    ? "Try another product name, collection or category."
                    : "Publish products from the KRVE store and they will appear here automatically."}
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
