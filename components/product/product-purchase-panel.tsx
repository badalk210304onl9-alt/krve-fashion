"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";

import type {
  KrveProduct,
} from "@/lib/api";

type ProductPurchasePanelProps = {
  product: KrveProduct;

  selectedColour?: string;

  onSelectedColourChange?: (
    colour: string,
  ) => void;

  selectedImage?: string;

  hideHeaderPrice?: boolean;

  hideColourSelector?: boolean;
};

type StoredCartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  size: string;
  colour: string;
  quantity: number;
};

function formatPrice(
  price: number,
  currency = "INR",
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function getDiscountPercentage(
  price: number,
  compareAtPrice:
    | number
    | null,
) {
  if (
    !compareAtPrice ||
    compareAtPrice <= price
  ) {
    return null;
  }

  return Math.round(
    ((compareAtPrice - price) /
      compareAtPrice) *
      100,
  );
}

function getProductImage(
  product: KrveProduct,
) {
  return (
    product.imageUrl ||
    product.image ||
    product.gallery?.[0] ||
    ""
  );
}

export default function ProductPurchasePanel({
  product,
  selectedColour:
    controlledColour,
  onSelectedColourChange,
  selectedImage,
  hideHeaderPrice = false,
  hideColourSelector = false,
}: ProductPurchasePanelProps) {
  const [
    selectedSize,
    setSelectedSize,
  ] =
    useState(
      product.sizes[0] || "",
    );

  const [
    internalColour,
    setInternalColour,
  ] =
    useState(
      product.colours[0] || "",
    );

  const selectedColour =
    controlledColour ??
    internalColour;

  const [
    quantity,
    setQuantity,
  ] =
    useState(1);

  const [
    addedToCart,
    setAddedToCart,
  ] =
    useState(false);

  const [
    wishlistAdded,
    setWishlistAdded,
  ] =
    useState(false);

  const discount =
    getDiscountPercentage(
      product.price,
      product.compareAtPrice,
    );

  const savings =
    product.compareAtPrice &&
    product.compareAtPrice >
      product.price
      ? product.compareAtPrice -
        product.price
      : 0;

  const maximumQuantity =
    Math.max(
      1,
      Math.min(
        product.stockQuantity,
        10,
      ),
    );

  const selectionReady =
    (!product.sizes.length ||
      selectedSize) &&
    (!product.colours.length ||
      selectedColour);

  const deliveryDate =
    useMemo(() => {
      const date =
        new Date();

      date.setDate(
        date.getDate() + 4,
      );

      return new Intl.DateTimeFormat(
        "en-IN",
        {
          weekday: "short",
          day: "numeric",
          month: "short",
        },
      ).format(date);
    }, []);

  function selectColour(
    colour: string,
  ) {
    setInternalColour(
      colour,
    );

    onSelectedColourChange?.(
      colour,
    );
  }

  function saveToCart() {
    if (
      !product.inStock ||
      !selectionReady
    ) {
      return false;
    }

    const cartItem:
      StoredCartItem = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      image:
        selectedImage ||
        getProductImage(
          product,
        ),
      price: product.price,
      currency:
        product.currency,
      size: selectedSize,
      colour:
        selectedColour,
      quantity,
    };

    try {
      const currentCart =
        JSON.parse(
          window.localStorage.getItem(
            "krve-cart",
          ) || "[]",
        ) as StoredCartItem[];

      const existingIndex =
        currentCart.findIndex(
          (item) =>
            item.id ===
              cartItem.id &&
            item.size ===
              cartItem.size &&
            item.colour ===
              cartItem.colour,
        );

      if (
        existingIndex >= 0
      ) {
        currentCart[
          existingIndex
        ] = {
          ...currentCart[
            existingIndex
          ],

          image:
            cartItem.image,

          quantity:
            currentCart[
              existingIndex
            ].quantity +
            cartItem.quantity,
        };
      } else {
        currentCart.push(
          cartItem,
        );
      }

      window.localStorage.setItem(
        "krve-cart",
        JSON.stringify(
          currentCart,
        ),
      );

      window.dispatchEvent(
        new CustomEvent(
          "krve-cart-updated",
          {
            detail:
              currentCart,
          },
        ),
      );

      setAddedToCart(
        true,
      );

      window.setTimeout(
        () => {
          setAddedToCart(
            false,
          );
        },
        2500,
      );

      return true;
    } catch (error) {
      console.error(
        "KRVE_CART_SAVE_ERROR",
        error,
      );

      return false;
    }
  }

  function buyNow() {
    const saved =
      saveToCart();

    if (saved) {
      window.location.href =
        "/checkout";
    }
  }

  function toggleWishlist() {
    try {
      const currentWishlist =
        JSON.parse(
          window.localStorage.getItem(
            "krve-wishlist",
          ) || "[]",
        ) as string[];

      const nextWishlist =
        currentWishlist.includes(
          product.id,
        )
          ? currentWishlist.filter(
              (id) =>
                id !==
                product.id,
            )
          : [
              ...currentWishlist,
              product.id,
            ];

      window.localStorage.setItem(
        "krve-wishlist",
        JSON.stringify(
          nextWishlist,
        ),
      );

      setWishlistAdded(
        nextWishlist.includes(
          product.id,
        ),
      );

      window.dispatchEvent(
        new CustomEvent(
          "krve-wishlist-updated",
          {
            detail:
              nextWishlist,
          },
        ),
      );
    } catch (error) {
      console.error(
        "KRVE_WISHLIST_ERROR",
        error,
      );
    }
  }

  return (
    <section className="krve-purchase-panel">
      {!hideHeaderPrice ? (
        <>
          <div className="krve-purchase-top">
            <div>
              <p className="krve-purchase-label">
                KRVE PRIVATE
                COLLECTION
              </p>

              <h2>
                {product.name}
              </h2>
            </div>

            <button
              type="button"
              className={`krve-wishlist-control ${
                wishlistAdded
                  ? "active"
                  : ""
              }`}
              onClick={
                toggleWishlist
              }
              aria-label="Add to wishlist"
            >
              <Heart
                size={21}
                fill={
                  wishlistAdded
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

          <div className="krve-price-row">
            {discount !==
              null && (
              <span className="krve-discount">
                {discount}% OFF
              </span>
            )}

            {product.compareAtPrice !==
              null &&
              product.compareAtPrice >
                product.price && (
                <del>
                  {formatPrice(
                    product.compareAtPrice,
                    product.currency,
                  )}
                </del>
              )}

            <strong>
              {formatPrice(
                product.price,
                product.currency,
              )}
            </strong>
          </div>

          {savings > 0 && (
            <p className="krve-saving">
              You save{" "}
              {formatPrice(
                savings,
                product.currency,
              )}
            </p>
          )}

          <p className="krve-tax-note">
            Inclusive of all
            taxes
          </p>
        </>
      ) : null}

      {product.sizes.length >
        0 && (
        <section className="krve-selection-section">
          <div className="krve-selection-heading">
            <strong>
              Select Size
            </strong>

            <button
              type="button"
            >
              Size Chart
            </button>
          </div>

          <div className="krve-size-list">
            {product.sizes.map(
              (size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    setSelectedSize(
                      size,
                    )
                  }
                  className={
                    selectedSize ===
                    size
                      ? "selected"
                      : ""
                  }
                >
                  {selectedSize ===
                    size && (
                    <Check
                      size={
                        12
                      }
                    />
                  )}

                  {size}
                </button>
              ),
            )}
          </div>
        </section>
      )}

      {!hideColourSelector &&
      product.colours.length >
        0 ? (
        <section className="krve-selection-section">
          <div className="krve-selection-heading">
            <strong>
              Select Colour
            </strong>
          </div>

          <div className="krve-colour-list">
            {product.colours.map(
              (colour) => (
                <button
                  type="button"
                  key={colour}
                  onClick={() =>
                    selectColour(
                      colour,
                    )
                  }
                  className={
                    selectedColour ===
                    colour
                      ? "selected"
                      : ""
                  }
                >
                  <span />

                  {colour}
                </button>
              ),
            )}
          </div>
        </section>
      ) : null}

      <div className="krve-stock-line">
        <div
          className={
            product.inStock
              ? "available"
              : "unavailable"
          }
        />

        <span>
          {product.inStock
            ? `${product.stockQuantity} units available`
            : "Currently out of stock"}
        </span>
      </div>

      <div className="krve-delivery-mini">
        <span>
          Delivery by
        </span>

        <strong>
          {deliveryDate}
        </strong>

        <ChevronDown
          size={16}
        />
      </div>

      <div className="krve-quantity-row">
        <span>
          Quantity
        </span>

        <div>
          <button
            type="button"
            onClick={() =>
              setQuantity(
                (current) =>
                  Math.max(
                    1,
                    current - 1,
                  ),
              )
            }
            disabled={
              quantity <= 1
            }
          >
            <Minus size={15} />
          </button>

          <strong>
            {quantity}
          </strong>

          <button
            type="button"
            onClick={() =>
              setQuantity(
                (current) =>
                  Math.min(
                    maximumQuantity,
                    current + 1,
                  ),
              )
            }
            disabled={
              quantity >=
              maximumQuantity
            }
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="krve-main-actions">
        <button
          type="button"
          className="krve-add-cart"
          onClick={
            saveToCart
          }
          disabled={
            !product.inStock ||
            !selectionReady
          }
        >
          {addedToCart ? (
            <>
              <Check
                size={19}
              />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag
                size={19}
              />
              Add to Cart
            </>
          )}
        </button>

        <button
          type="button"
          className="krve-buy-now"
          onClick={buyNow}
          disabled={
            !product.inStock ||
            !selectionReady
          }
        >
          <Zap size={18} />
          Buy Now
        </button>
      </div>

      <a
        href={`/virtual-try-on?product=${encodeURIComponent(
          product.slug,
        )}`}
        className="krve-ai-try-button"
      >
        <Sparkles
          size={18}
        />

        Try with KRVE AI
        Virtual Try-On
      </a>
    </section>
  );
}
