"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import styles from "./cart.module.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const AVAILABLE_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "40",
  "41",
  "42",
  "43",
];

type CouponResult = {
  code: string;
  label: string;
  discount: number;
};

function getCouponResult(
  rawCode: string,
  subtotal: number,
): CouponResult | null {
  const code = rawCode.trim().toUpperCase();

  if (code === "WELCOME10") {
    return {
      code,
      label: "10% welcome discount",
      discount: Math.round(subtotal * 0.1),
    };
  }

  if (code === "KRVE15") {
    return {
      code,
      label: "15% KRVE member discount",
      discount: Math.round(subtotal * 0.15),
    };
  }

  if (code === "FIRST500") {
    return {
      code,
      label: "₹500 first-order discount",
      discount: Math.min(500, subtotal),
    };
  }

  return null;
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
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
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="m7 7 1 13h8l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      aria-hidden="true"
    >
      <path d="M7 4h10v16l-5-3-5 3V4Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="31"
      height="31"
      aria-hidden="true"
    >
      <path d="M12 2 20 5v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function CouponIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
    >
      <path d="M4 7.5V5h16v2.5a2.5 2.5 0 0 0 0 5V15H4v-2.5a2.5 2.5 0 0 0 0-5Z" />
      <path d="M12 6.5v1.5" />
      <path d="M12 10.5V12" />
      <path d="M12 14.5V16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
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

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState<CouponResult | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    const refreshedCoupon = getCouponResult(
      appliedCoupon.code,
      cartSubtotal,
    );

    return refreshedCoupon?.discount ?? 0;
  }, [appliedCoupon, cartSubtotal]);

  const shipping = 0;

  const taxableAmount = Math.max(
    0,
    cartSubtotal - couponDiscount,
  );

  const estimatedTax = Math.round(taxableAmount * 0.075);

  const total =
    taxableAmount +
    estimatedTax +
    shipping;

  function applyCoupon() {
    if (!couponInput.trim()) {
      setCouponStatus("error");
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    if (cartSubtotal <= 0) {
      setCouponStatus("error");
      setCouponMessage(
        "Add an item to your bag before applying a coupon.",
      );
      return;
    }

    const result = getCouponResult(
      couponInput,
      cartSubtotal,
    );

    if (!result) {
      setAppliedCoupon(null);
      setCouponStatus("error");
      setCouponMessage(
        "This coupon code is invalid or has expired.",
      );
      return;
    }

    setAppliedCoupon(result);
    setCouponInput(result.code);
    setCouponStatus("success");
    setCouponMessage(
      `${result.code} applied successfully.`,
    );
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponMessage("Coupon removed.");
    setCouponStatus("idle");
  }

  return (
    <main className={styles.page}>
      <Link
        href="/"
        className={styles.backdrop}
        aria-label="Close shopping bag"
      />

      <aside className={styles.drawer}>
        <header className={styles.drawerHeader}>
          <div>
            <h1>
              <span>YOUR</span> BAG
            </h1>

            <p>
              {cartCount}{" "}
              {cartCount === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>

          <Link
            href="/"
            className={styles.closeButton}
            aria-label="Close bag"
          >
            <CloseIcon />
          </Link>
        </header>

        {!hydrated ? (
          <div className={styles.loading}>
            Preparing your bag...
          </div>
        ) : cart.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyMonogram}>
              K
            </div>

            <p className={styles.emptyLabel}>
              YOUR BAG IS EMPTY
            </p>

            <h2>
              Curate your next signature look.
            </h2>

            <p className={styles.emptyText}>
              Explore refined tailoring, luxury essentials
              and intelligent styling from KRVE.
            </p>

            <Link
              href="/collections"
              className={styles.primaryButton}
            >
              EXPLORE COLLECTIONS <span>→</span>
            </Link>

            <Link
              href="/virtual-try-on"
              className={styles.secondaryButton}
            >
              VIRTUAL TRY-ON
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.itemList}>
              {cart.map((item) => (
                <article
                  key={item.id}
                  className={styles.item}
                >
                  <Link
                    href={`/product/${item.id}`}
                    className={styles.imageBox}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="132px"
                    />

                    <span
                      className={styles.imageMask}
                    />
                  </Link>

                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeading}>
                      <div>
                        <Link href={`/product/${item.id}`}>
                          <h2>{item.name}</h2>
                        </Link>

                        <p>
                          KRVE PRIVATE COLLECTION
                        </p>
                      </div>

                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        <TrashIcon />
                      </button>
                    </div>

                    <div className={styles.optionGrid}>
                      <label>
                        <span>SIZE</span>

                        <select
                          value={item.size}
                          onChange={(event) =>
                            updateSize(
                              item.id,
                              event.target.value,
                            )
                          }
                        >
                          {AVAILABLE_SIZES.map(
                            (size) => (
                              <option
                                key={size}
                                value={size}
                              >
                                {size}
                              </option>
                            ),
                          )}
                        </select>
                      </label>

                      <div
                        className={
                          styles.quantitySection
                        }
                      >
                        <span>QUANTITY</span>

                        <div
                          className={styles.quantity}
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
                            {item.quantity}
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

                    <div className={styles.itemFooter}>
                      <button
                        type="button"
                        className={styles.saveButton}
                        onClick={() => {
                          toggleWishlist(item.id);
                          removeFromCart(item.id);
                        }}
                      >
                        <BookmarkIcon />
                        SAVE FOR LATER
                      </button>

                      <strong>
                        {money.format(
                          item.price * item.quantity,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section className={styles.couponSection}>
              <div className={styles.couponHeading}>
                <div className={styles.couponTitle}>
                  <CouponIcon />

                  <div>
                    <strong>
                      HAVE A COUPON?
                    </strong>

                    <span>
                      Enter your promotional code
                    </span>
                  </div>
                </div>

                {appliedCoupon && (
                  <button
                    type="button"
                    className={styles.removeCoupon}
                    onClick={removeCoupon}
                  >
                    REMOVE
                  </button>
                )}
              </div>

              <div className={styles.couponForm}>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(event) => {
                    setCouponInput(
                      event.target.value.toUpperCase(),
                    );

                    if (
                      couponStatus === "error"
                    ) {
                      setCouponStatus("idle");
                      setCouponMessage("");
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applyCoupon();
                    }
                  }}
                  placeholder="ENTER COUPON CODE"
                  disabled={Boolean(appliedCoupon)}
                  aria-label="Coupon code"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={Boolean(appliedCoupon)}
                >
                  {appliedCoupon ? (
                    <>
                      <CheckIcon />
                      APPLIED
                    </>
                  ) : (
                    "APPLY"
                  )}
                </button>
              </div>

              {couponMessage && (
                <p
                  className={
                    couponStatus === "success"
                      ? styles.couponSuccess
                      : couponStatus === "error"
                        ? styles.couponError
                        : styles.couponNeutral
                  }
                >
                  {couponMessage}
                </p>
              )}

              {!appliedCoupon && (
                <div className={styles.couponHints}>
                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput("WELCOME10")
                    }
                  >
                    WELCOME10
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput("KRVE15")
                    }
                  >
                    KRVE15
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput("FIRST500")
                    }
                  >
                    FIRST500
                  </button>
                </div>
              )}
            </section>

            <section className={styles.summary}>
              <div>
                <span>Subtotal</span>

                <strong>
                  {money.format(cartSubtotal)}
                </strong>
              </div>

              <div>
                <span>
                  Shipping

                  <small>
                    Free shipping on all orders
                  </small>
                </span>

                <strong className={styles.gold}>
                  Complimentary
                </strong>
              </div>

              <div>
                <span>
                  Discount

                  {appliedCoupon ? (
                    <small>
                      {appliedCoupon.code}
                    </small>
                  ) : (
                    <small>
                      No coupon applied
                    </small>
                  )}
                </span>

                <strong
                  className={
                    couponDiscount > 0
                      ? styles.discountValue
                      : undefined
                  }
                >
                  −{money.format(couponDiscount)}
                </strong>
              </div>

              <div>
                <span>Estimated Tax</span>

                <strong>
                  {money.format(estimatedTax)}
                </strong>
              </div>
            </section>

            <div className={styles.total}>
              <span>TOTAL</span>

              <strong>
                {money.format(total)}
              </strong>
            </div>

            <div className={styles.checkoutActions}>
              <Link
                href="/checkout"
                className={styles.primaryButton}
              >
                PROCEED TO CHECKOUT <span>→</span>
              </Link>

              <Link
                href="/collections"
                className={styles.secondaryButton}
              >
                CONTINUE SHOPPING
              </Link>
            </div>

            <div className={styles.security}>
              <ShieldIcon />

              <div>
                <strong>
                  100% SECURE AND ENCRYPTED CHECKOUT
                </strong>

                <p>
                  Your data is safe with bank-level security.
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </main>
  );
}
