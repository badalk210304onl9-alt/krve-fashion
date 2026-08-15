"use client";

import {
  useEffect,
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
  X,
  Zap,
} from "lucide-react";

import type {
  KrveProduct,
} from "@/lib/api";

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   SIZE CHART DATA
========================================================= */

const menswearSizeChart = [
  {
    size: "XS",
    chest: "34–36",
    waist: "28–30",
    shoulder: "16–17",
    length: "26–27",
  },
  {
    size: "S",
    chest: "36–38",
    waist: "30–32",
    shoulder: "17–18",
    length: "27–28",
  },
  {
    size: "M",
    chest: "38–40",
    waist: "32–34",
    shoulder: "18–19",
    length: "28–29",
  },
  {
    size: "L",
    chest: "40–42",
    waist: "34–36",
    shoulder: "19–20",
    length: "29–30",
  },
  {
    size: "XL",
    chest: "42–44",
    waist: "36–38",
    shoulder: "20–21",
    length: "30–31",
  },
  {
    size: "XXL",
    chest: "44–46",
    waist: "38–40",
    shoulder: "21–22",
    length: "31–32",
  },
];

const womenswearSizeChart = [
  {
    size: "XS",
    bust: "30–32",
    waist: "24–26",
    hip: "34–36",
    length: "24–25",
  },
  {
    size: "S",
    bust: "32–34",
    waist: "26–28",
    hip: "36–38",
    length: "25–26",
  },
  {
    size: "M",
    bust: "34–36",
    waist: "28–30",
    hip: "38–40",
    length: "26–27",
  },
  {
    size: "L",
    bust: "36–38",
    waist: "30–32",
    hip: "40–42",
    length: "27–28",
  },
  {
    size: "XL",
    bust: "38–40",
    waist: "32–34",
    hip: "42–44",
    length: "28–29",
  },
  {
    size: "XXL",
    bust: "40–42",
    waist: "34–36",
    hip: "44–46",
    length: "29–30",
  },
];

const kidswearSizeChart = [
  {
    size: "2–3Y",
    height: "92–98",
    chest: "20–21",
    waist: "19–20",
  },
  {
    size: "4–5Y",
    height: "104–110",
    chest: "22–23",
    waist: "20–21",
  },
  {
    size: "6–7Y",
    height: "116–122",
    chest: "24–25",
    waist: "21–22",
  },
  {
    size: "8–9Y",
    height: "128–134",
    chest: "26–27",
    waist: "22–23",
  },
  {
    size: "10–11Y",
    height: "140–146",
    chest: "28–29",
    waist: "23–24",
  },
  {
    size: "12–13Y",
    height: "152–158",
    chest: "30–31",
    waist: "24–25",
  },
];

/* =========================================================
   HELPERS
========================================================= */

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

/* =========================================================
   MAIN COMPONENT
========================================================= */

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
  ] = useState(
    product.sizes[0] || "",
  );

  const [
    internalColour,
    setInternalColour,
  ] = useState(
    product.colours[0] || "",
  );

  const selectedColour =
    controlledColour ??
    internalColour;

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    addedToCart,
    setAddedToCart,
  ] = useState(false);

  const [
    wishlistAdded,
    setWishlistAdded,
  ] = useState(false);

  const [
    sizeChartOpen,
    setSizeChartOpen,
  ] = useState(false);

  const isMenswear =
    product.category ===
    "menswear";

  const isWomenswear =
    product.category ===
    "womenswear";

  const isKidswear =
    product.category ===
    "kidswear";

  const hasSizeChart =
    isMenswear ||
    isWomenswear ||
    isKidswear;

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

  useEffect(() => {
    if (!sizeChartOpen) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSizeChartOpen(
          false,
        );
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [sizeChartOpen]);

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

      price:
        product.price,

      currency:
        product.currency,

      size:
        selectedSize,

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

  function renderSizeTable() {
    if (isMenswear) {
      return (
        <>
          <div className="krve-size-chart-unit">
            <span>
              MENSWEAR
            </span>

            <strong>
              MEASUREMENTS IN INCHES
            </strong>
          </div>

          <div className="krve-size-table-scroll">
            <table className="krve-size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Shoulder</th>
                  <th>Length</th>
                </tr>
              </thead>

              <tbody>
                {menswearSizeChart.map(
                  (item) => (
                    <tr key={item.size}>
                      <td>{item.size}</td>
                      <td>{item.chest}</td>
                      <td>{item.waist}</td>
                      <td>{item.shoulder}</td>
                      <td>{item.length}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (isWomenswear) {
      return (
        <>
          <div className="krve-size-chart-unit">
            <span>
              WOMEN
            </span>

            <strong>
              MEASUREMENTS IN INCHES
            </strong>
          </div>

          <div className="krve-size-table-scroll">
            <table className="krve-size-chart-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust</th>
                  <th>Waist</th>
                  <th>Hip</th>
                  <th>Length</th>
                </tr>
              </thead>

              <tbody>
                {womenswearSizeChart.map(
                  (item) => (
                    <tr key={item.size}>
                      <td>{item.size}</td>
                      <td>{item.bust}</td>
                      <td>{item.waist}</td>
                      <td>{item.hip}</td>
                      <td>{item.length}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    if (isKidswear) {
      return (
        <>
          <div className="krve-size-chart-unit">
            <span>
              KIDS
            </span>

            <strong>
              HEIGHT IN CM • OTHER MEASUREMENTS IN INCHES
            </strong>
          </div>

          <div className="krve-size-table-scroll">
            <table className="krve-size-chart-table">
              <thead>
                <tr>
                  <th>Age / Size</th>
                  <th>Height</th>
                  <th>Chest</th>
                  <th>Waist</th>
                </tr>
              </thead>

              <tbody>
                {kidswearSizeChart.map(
                  (item) => (
                    <tr key={item.size}>
                      <td>{item.size}</td>
                      <td>{item.height}</td>
                      <td>{item.chest}</td>
                      <td>{item.waist}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </>
      );
    }

    return null;
  }

  function getSizeChartTitle() {
    if (isMenswear) {
      return "Menswear Size Guide";
    }

    if (isWomenswear) {
      return "Womenswear Size Guide";
    }

    if (isKidswear) {
      return "Kidswear Size Guide";
    }

    return "Size Guide";
  }

  return (
    <>
      <section className="krve-purchase-panel">
        {!hideHeaderPrice ? (
          <>
            <div className="krve-purchase-top">
              <div>
                <p className="krve-purchase-label">
                  KRVE PRIVATE COLLECTION
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
              Inclusive of all taxes
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

              {hasSizeChart && (
                <button
                  type="button"
                  className="krve-size-chart-trigger"
                  onClick={() =>
                    setSizeChartOpen(
                      true,
                    )
                  }
                  aria-haspopup="dialog"
                  aria-expanded={
                    sizeChartOpen
                  }
                >
                  Size Chart
                </button>
              )}
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
                        size={12}
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
              <Minus
                size={15}
              />
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
              <Plus
                size={15}
              />
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
            onClick={
              buyNow
            }
            disabled={
              !product.inStock ||
              !selectionReady
            }
          >
            <Zap
              size={18}
            />

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

          Try with KRVE AI Virtual Try-On
        </a>
      </section>

      {hasSizeChart && (
        <div
          className={`krve-size-chart-layer ${
            sizeChartOpen
              ? "open"
              : ""
          }`}
          aria-hidden={
            !sizeChartOpen
          }
        >
          <button
            type="button"
            aria-label="Close size chart"
            className="krve-size-chart-backdrop"
            onClick={() =>
              setSizeChartOpen(
                false,
              )
            }
          />

          <aside
            className="krve-size-chart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={
              getSizeChartTitle()
            }
          >
            <div className="krve-size-chart-header">
              <div>
                <p>
                  KRVÉ FIT GUIDE
                </p>

                <h2>
                  {getSizeChartTitle()}
                </h2>
              </div>

              <button
                type="button"
                className="krve-size-chart-close"
                onClick={() =>
                  setSizeChartOpen(
                    false,
                  )
                }
                aria-label="Close size chart"
              >
                <X
                  size={22}
                />
              </button>
            </div>

            {renderSizeTable()}
          </aside>
        </div>
      )}

      <style jsx global>{`
        .krve-size-chart-trigger {
          padding: 0;
          border: 0;
          background: transparent;
          color: #e0aa18;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .krve-size-chart-trigger:hover {
          color: #ffd45e;
        }

        .krve-size-chart-layer {
          position: fixed;
          inset: 0;
          z-index: 999999;
          visibility: hidden;
          pointer-events: none;
        }

        .krve-size-chart-layer.open {
          visibility: visible;
          pointer-events: auto;
        }

        .krve-size-chart-backdrop {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          margin: 0;
          padding: 0;

          border: 0;

          background:
            rgba(
              0,
              0,
              0,
              0.76
            );

          opacity: 0;

          backdrop-filter:
            blur(6px);

          transition:
            opacity 0.32s ease;
        }

        .krve-size-chart-layer.open
          .krve-size-chart-backdrop {
          opacity: 1;
        }

        .krve-size-chart-drawer {
          position: absolute;

          top: 0;
          right: 0;

          width: min(
            1000px,
            92vw
          );

          height: 100%;

          overflow-y: auto;

          border-left:
            1px solid
            rgba(
              218,
              165,
              25,
              0.48
            );

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(
                218,
                165,
                25,
                0.07
              ),
              transparent 28%
            ),
            #050505;

          color: #f6f0e7;

          box-shadow:
            -35px 0
            90px
            rgba(
              0,
              0,
              0,
              0.65
            );

          transform:
            translateX(
              100%
            );

          transition:
            transform
            0.36s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            );
        }

        .krve-size-chart-layer.open
          .krve-size-chart-drawer {
          transform:
            translateX(0);
        }

        .krve-size-chart-header {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 40px;

          padding:
            48px 60px;

          border-bottom:
            1px solid
            rgba(
              218,
              165,
              25,
              0.25
            );
        }

        .krve-size-chart-header p {
          margin:
            0 0 12px;

          color: #dda91d;

          font-size: 10px;

          font-weight: 800;

          letter-spacing:
            0.22em;
        }

        .krve-size-chart-header h2 {
          margin: 0;

          color: #f6f0e7;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 44px;

          font-weight: 400;

          line-height: 1.05;

          letter-spacing:
            -0.035em;
        }

        .krve-size-chart-close {
          display: grid;

          width: 52px;
          height: 52px;

          flex: 0 0
            52px;

          place-items:
            center;

          border:
            1px solid
            rgba(
              218,
              165,
              25,
              0.5
            );

          border-radius:
            50%;

          background:
            transparent;

          color: #e2ac1c;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }

        .krve-size-chart-close:hover {
          background:
            #dda91d;

          color: #050505;
        }

        .krve-size-chart-unit {
          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap: 20px;

          padding:
            22px 60px;

          border-bottom:
            1px solid
            #252525;
        }

        .krve-size-chart-unit span {
          color: #dda91d;

          font-size: 10px;

          font-weight: 800;

          letter-spacing:
            0.18em;
        }

        .krve-size-chart-unit strong {
          color: #8a857d;

          font-size: 10px;

          font-weight: 500;

          letter-spacing:
            0.06em;
        }

        .krve-size-table-scroll {
          overflow-x: auto;

          padding:
            38px 60px
            60px;
        }

        .krve-size-chart-table {
          width: 100%;

          min-width:
            760px;

          border-collapse:
            collapse;

          border:
            1px solid
            rgba(
              218,
              165,
              25,
              0.28
            );

          background:
            #040404;
        }

        .krve-size-chart-table thead {
          background:
            rgba(
              218,
              165,
              25,
              0.055
            );
        }

        .krve-size-chart-table th {
          padding:
            25px 22px;

          border-bottom:
            1px solid
            rgba(
              218,
              165,
              25,
              0.3
            );

          color: #e1ab18;

          font-size: 11px;

          font-weight: 800;

          letter-spacing:
            0.14em;

          text-align: left;
        }

        .krve-size-chart-table td {
          padding:
            27px 22px;

          border-bottom:
            1px solid
            #252525;

          color: #aaa49a;

          font-size: 15px;

          line-height: 1.4;
        }

        .krve-size-chart-table
          tr:last-child
          td {
          border-bottom: none;
        }

        .krve-size-chart-table
          td:first-child {
          color: #f4eee5;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 22px;
        }

        .krve-size-chart-table tbody tr {
          transition:
            background
            0.2s ease;
        }

        .krve-size-chart-table
          tbody
          tr:hover {
          background:
            rgba(
              218,
              165,
              25,
              0.035
            );
        }

        @media (
          max-width: 700px
        ) {
          .krve-size-chart-drawer {
            top: auto;
            bottom: 0;

            width: 100%;

            height: auto;

            max-height:
              90vh;

            border-left:
              none;

            border-top:
              1px solid
              rgba(
                218,
                165,
                25,
                0.5
              );

            transform:
              translateY(
                100%
              );
          }

          .krve-size-chart-layer.open
            .krve-size-chart-drawer {
            transform:
              translateY(0);
          }

          .krve-size-chart-header {
            padding:
              25px 22px;
          }

          .krve-size-chart-header h2 {
            font-size: 31px;
          }

          .krve-size-chart-header p {
            font-size: 8px;
          }

          .krve-size-chart-close {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }

          .krve-size-chart-unit {
            align-items:
              flex-start;

            flex-direction:
              column;

            gap: 7px;

            padding:
              16px 22px;
          }

          .krve-size-chart-unit strong {
            font-size: 8px;
          }

          .krve-size-table-scroll {
            padding:
              22px 22px
              32px;
          }

          .krve-size-chart-table {
            min-width:
              650px;
          }

          .krve-size-chart-table th {
            padding:
              18px 15px;

            font-size: 9px;
          }

          .krve-size-chart-table td {
            padding:
              20px 15px;

            font-size: 13px;
          }

          .krve-size-chart-table
            td:first-child {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}
