"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useCart,
} from "@/components/cart-provider";

import styles from "./cart.module.css";

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      maximumFractionDigits:
        0,
    },
  );

const AVAILABLE_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
    >
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
    >
      <path d="M4 7h16" />

      <path
        d="
          M9 7
          V4
          h6
          v3
        "
      />

      <path
        d="
          m7 7
          1 13
          h8
          l1-13
        "
      />

      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d="
          M7 4
          h10
          v16
          l-5-3
          -5 3
          V4Z
        "
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="34"
      height="34"
      aria-hidden="true"
    >
      <path
        d="
          M12 2
          20 5
          v6
          c0 5-3.4 8.6-8 11
          -4.6-2.4-8-6-8-11
          V5
          l8-3Z
        "
      />

      <path
        d="
          m9 12
          2 2
          4-5
        "
      />
    </svg>
  );
}

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    hydrated,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateSize,
    toggleWishlist,
  } = useCart();

  if (!hydrated) {
    return (
      <main className={styles.page}>
        <div
          className={
            styles.backdrop
          }
        />

        <section
          className={
            styles.cartDrawer
          }
        >
          <div
            className={
              styles.loading
            }
          >
            Loading your bag...
          </div>
        </section>
      </main>
    );
  }

  const shipping =
    0;

  const discount =
    cartSubtotal >=
    5000
      ? 2500
      : 0;

  const taxableAmount =
    Math.max(
      0,
      cartSubtotal -
        discount,
    );

  const estimatedTax =
    Math.round(
      taxableAmount *
        0.075,
    );

  const total =
    taxableAmount +
    estimatedTax +
    shipping;

  return (
    <main className={styles.page}>
      <div
        className={
          styles.backdrop
        }
      />

      <section
        className={
          styles.cartDrawer
        }
      >
        <header
          className={
            styles.cartHeader
          }
        >
          <div>
            <h1>
              <span>YOUR</span>{" "}
              BAG
            </h1>

            <p>
              {cartCount}{" "}
              {cartCount ===
              1
                ? "ITEM"
                : "ITEMS"}
            </p>
          </div>

          <Link
            href="/"
            className={
              styles.closeButton
            }
            aria-label="Close shopping bag"
          >
            <CloseIcon />
          </Link>
        </header>

        {cart.length ===
        0 ? (
          <div
            className={
              styles.emptyCart
            }
          >
            <div
              className={
                styles.emptyBagIcon
              }
            >
              <span>K</span>
            </div>

            <p
              className={
                styles.emptyEyebrow
              }
            >
              YOUR BAG IS EMPTY
            </p>

            <h2>
              Curate your next
              signature look.
            </h2>

            <p
              className={
                styles.emptyDescription
              }
            >
              Explore KRVE
              tailoring, luxury
              essentials and
              intelligent
              styling.
            </p>

            <Link
              href="/collections"
              className={
                styles.primaryButton
              }
            >
              EXPLORE COLLECTIONS

              <span>→</span>
            </Link>

            <Link
              href="/virtual-try-on"
              className={
                styles.secondaryButton
              }
            >
              VIRTUAL TRY-ON
            </Link>
          </div>
        ) : (
          <>
            <div
              className={
                styles.items
              }
            >
              {cart.map(
                (
                  item,
                ) => {
                  const itemTotal =
                    item.price *
                    item.quantity;

                  return (
                    <article
                      key={
                        item.id
                      }
                      className={
                        styles.cartItem
                      }
                    >
                      <Link
                        href={`/product/${item.id}`}
                        className={
                          styles.itemImage
                        }
                      >
                        <Image
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          fill
                          sizes="140px"
                        />

                        <span
                          className={
                            styles.imageShade
                          }
                        />
                      </Link>

                      <div
                        className={
                          styles.itemContent
                        }
                      >
                        <div
                          className={
                            styles.itemTop
                          }
                        >
                          <div>
                            <Link
                              href={`/product/${item.id}`}
                            >
                              <h2>
                                {
                                  item.name
                                }
                              </h2>
                            </Link>

                            <p>
                              KRVE PRIVATE
                              COLLECTION
                            </p>
                          </div>

                          <button
                            type="button"
                            className={
                              styles.deleteButton
                            }
                            onClick={() =>
                              removeFromCart(
                                item.id,
                              )
                            }
                            aria-label={`Remove ${item.name}`}
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        <div
                          className={
                            styles.controls
                          }
                        >
                          <label>
                            <span>
                              SIZE
                            </span>

                            <select
                              value={
                                item.size
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSize(
                                  item.id,
                                  event
                                    .target
                                    .value,
                                )
                              }
                            >
                              {AVAILABLE_SIZES.map(
                                (
                                  size,
                                ) => (
                                  <option
                                    key={
                                      size
                                    }
                                    value={
                                      size
                                    }
                                  >
                                    {
                                      size
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </label>

                          <div
                            className={
                              styles.quantityBlock
                            }
                          >
                            <span>
                              QUANTITY
                            </span>

                            <div
                              className={
                                styles.quantity
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id,
                                  )
                                }
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>

                              <strong>
                                {
                                  item.quantity
                                }
                              </strong>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item.id,
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className={
                            styles.itemBottom
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.saveButton
                            }
                            onClick={() => {
                              toggleWishlist(
                                item.id,
                              );

                              removeFromCart(
                                item.id,
                              );
                            }}
                          >
                            <BookmarkIcon />

                            <span>
                              SAVE FOR LATER
                            </span>
                          </button>

                          <strong>
                            {money.format(
                              itemTotal,
                            )}
                          </strong>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>

            <div
              className={
                styles.summary
              }
            >
              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  {money.format(
                    cartSubtotal,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Shipping

                  <small>
                    Free shipping
                    on all orders
                  </small>
                </span>

                <strong
                  className={
                    styles.goldText
                  }
                >
                  Complimentary
                </strong>
              </div>

              <div>
                <span>
                  Discount

                  <small>
                    WELCOME10
                  </small>
                </span>

                <strong>
                  −
                  {money.format(
                    discount,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Estimated Tax
                </span>

                <strong>
                  {money.format(
                    estimatedTax,
                  )}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.total
              }
            >
              <span>
                TOTAL
              </span>

              <strong>
                {money.format(
                  total,
                )}
              </strong>
            </div>

            <div
              className={
                styles.actions
              }
            >
              <Link
                href="/checkout"
                className={
                  styles.primaryButton
                }
              >
                PROCEED TO CHECKOUT

                <span>→</span>
              </Link>

              <Link
                href="/collections"
                className={
                  styles.secondaryButton
                }
              >
                CONTINUE SHOPPING
              </Link>
            </div>

            <div
              className={
                styles.security
              }
            >
              <ShieldIcon />

              <div>
                <strong>
                  100% SECURE AND
                  ENCRYPTED CHECKOUT
                </strong>

                <p>
                  Your information is
                  protected with
                  bank-level
                  security.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
