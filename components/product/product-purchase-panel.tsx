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

              {isMenswear ? (
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
              ) : null}
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

      {/* MENSWEAR SIZE CHART */}
      {isMenswear && (
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
            aria-label="Menswear Size Guide"
          >
            <div className="krve-size-chart-header">
              <div>
                <p>
                  KRVÉ FIT GUIDE
                </p>

                <h2>
                  Menswear
                  <br />
                  Size Guide
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
                <X size={22} />
              </button>
            </div>

            <div className="krve-size-chart-unit">
              <span>
                MEASUREMENTS
              </span>

              <strong>
                IN INCHES
              </strong>
            </div>

            <div className="krve-size-table-scroll">
              <table className="krve-size-chart-table">
                <thead>
                  <tr>
                    <th>
                      Size
                    </th>

                    <th>
                      Chest
                    </th>

                    <th>
                      Waist
                    </th>

                    <th>
                      Shoulder
                    </th>

                    <th>
                      Length
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {menswearSizeChart.map(
                    (
                      item,
                    ) => (
                      <tr
                        key={
                          item.size
                        }
                      >
                        <td>
                          {
                            item.size
                          }
                        </td>

                        <td>
                          {
                            item.chest
                          }
                        </td>

                        <td>
                          {
                            item.waist
                          }
                        </td>

                        <td>
                          {
                            item.shoulder
                          }
                        </td>

                        <td>
                          {
                            item.length
                          }
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <section className="krve-size-fit-note">
              <p>
                OVERSIZED FIT
              </p>

              <h3>
                How should I choose?
              </h3>

              <div>
                <article>
                  <span>
                    01
                  </span>

                  <div>
                    <strong>
                      True oversized look
                    </strong>

                    <p>
                      Choose your
                      regular size.
                    </p>
                  </div>
                </article>

                <article>
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      More structured fit
                    </strong>

                    <p>
                      Choose one
                      size smaller.
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <section className="krve-measure-guide">
              <p>
                HOW TO MEASURE
              </p>

              <div className="krve-measure-grid">
                <article>
                  <strong>
                    Chest
                  </strong>

                  <span>
                    Measure around
                    the fullest part
                    of your chest.
                  </span>
                </article>

                <article>
                  <strong>
                    Waist
                  </strong>

                  <span>
                    Measure around
                    your natural
                    waistline.
                  </span>
                </article>

                <article>
                  <strong>
                    Shoulder
                  </strong>

                  <span>
                    Measure shoulder
                    edge to shoulder
                    edge.
                  </span>
                </article>

                <article>
                  <strong>
                    Length
                  </strong>

                  <span>
                    Measure from
                    shoulder to
                    garment hem.
                  </span>
                </article>
              </div>
            </section>

            <div className="krve-size-chart-footer">
              <button
                type="button"
                onClick={() =>
                  setSizeChartOpen(
                    false,
                  )
                }
              >
                CONTINUE SHOPPING
                <span>
                  →
                </span>
              </button>

              <a href="/size-guide">
                VIEW FULL SIZE GUIDE
              </a>
            </div>
          </aside>
        </div>
      )}

      <style jsx global>{`
        .krve-size-chart-trigger {
          padding: 0;
          border: 0;
          background: transparent;
          color: #e4ad18;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 5px;
          transition: 0.2s ease;
        }

        .krve-size-chart-trigger:hover {
          color: #ffd25b;
        }

        .krve-size-chart-layer {
          position: fixed;
          inset: 0;
          z-index: 99999;
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
          padding: 0;
          border: 0;
          background:
            rgba(
              0,
              0,
              0,
              0.72
            );
          opacity: 0;
          cursor: default;
          backdrop-filter:
            blur(5px);
          transition:
            opacity 0.32s
            ease;
        }

        .krve-size-chart-layer.open
          .krve-size-chart-backdrop {
          opacity: 1;
        }

        .krve-size-chart-drawer {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          width: min(
            780px,
            92vw
          );
          height: 100%;
          flex-direction: column;
          overflow-y: auto;
          border-left: 1px solid
            rgba(
              222,
              169,
              24,
              0.5
            );
          background:
            radial-gradient(
              circle at 100%
                0%,
              rgba(
                217,
                164,
                22,
                0.1
              ),
              transparent 25%
            ),
            #050505;
          color: #f7f2e8;
          box-shadow:
            -30px 0
            80px
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
            transform 0.36s
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
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 40px;
          padding:
            48px 48px
            36px;
          border-bottom:
            1px solid
            rgba(
              218,
              165,
              25,
              0.24
            );
        }

        .krve-size-chart-header
          p {
          margin: 0 0
            14px;
          color: #dba718;
          font-size: 10px;
          font-weight: 800;
          letter-spacing:
            0.22em;
        }

        .krve-size-chart-header
          h2 {
          margin: 0;
          color: #f5efe4;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 43px;
          font-weight: 400;
          line-height: 1;
          letter-spacing:
            -0.035em;
        }

        .krve-size-chart-close {
          display: grid;
          width: 48px;
          height: 48px;
          flex: 0 0
            48px;
          place-items:
            center;
          border: 1px solid
            rgba(
              218,
              165,
              25,
              0.42
            );
          border-radius:
            50%;
          background:
            transparent;
          color: #e8b221;
          cursor: pointer;
          transition:
            0.2s ease;
        }

        .krve-size-chart-close:hover {
          background:
            #dba718;
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
            20px 48px;
          border-bottom:
            1px solid
            #222;
        }

        .krve-size-chart-unit
          span {
          color: #777269;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            0.17em;
        }

        .krve-size-chart-unit
          strong {
          color: #dca91c;
          font-size: 10px;
          letter-spacing:
            0.14em;
        }

        .krve-size-table-scroll {
          overflow-x:
            auto;
          padding:
            0 48px;
        }

        .krve-size-chart-table {
          width: 100%;
          min-width:
            610px;
          border-collapse:
            collapse;
        }

        .krve-size-chart-table
          th {
          padding:
            21px 14px;
          border-bottom:
            1px solid
            rgba(
              218,
              165,
              25,
              0.27
            );
          color: #dca91c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            0.13em;
          text-align: left;
        }

        .krve-size-chart-table
          td {
          padding:
            23px 14px;
          border-bottom:
            1px solid
            #202020;
          color: #aaa49a;
          font-size: 13px;
        }

        .krve-size-chart-table
          td:first-child {
          color: #f2ede3;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 20px;
        }

        .krve-size-chart-table
          tbody
          tr:hover {
          background:
            rgba(
              219,
              167,
              24,
              0.03
            );
        }

        .krve-size-fit-note {
          margin:
            30px 48px 0;
          padding:
            30px;
          border: 1px solid
            rgba(
              218,
              165,
              25,
              0.25
            );
          background:
            rgba(
              219,
              167,
              24,
              0.035
            );
        }

        .krve-size-fit-note
          > p,
        .krve-measure-guide
          > p {
          margin: 0;
          color: #dba718;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            0.2em;
        }

        .krve-size-fit-note
          h3 {
          margin:
            10px 0
            24px;
          color: #f0ebe1;
          font-family:
            Georgia,
            serif;
          font-size: 25px;
          font-weight: 400;
        }

        .krve-size-fit-note
          > div {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 15px;
        }

        .krve-size-fit-note
          article {
          display: flex;
          gap: 14px;
          padding: 16px;
          border: 1px solid
            #282620;
          background:
            #080808;
        }

        .krve-size-fit-note
          article
          > span {
          color: #dca91c;
          font-size: 9px;
          font-weight: 800;
        }

        .krve-size-fit-note
          article
          strong {
          display: block;
          color: #e9e4da;
          font-size: 12px;
        }

        .krve-size-fit-note
          article
          p {
          margin: 6px 0
            0;
          color: #817d75;
          font-size: 11px;
          line-height: 1.5;
        }

        .krve-measure-guide {
          padding:
            36px 48px;
        }

        .krve-measure-grid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 0;
          margin-top:
            18px;
          border-top:
            1px solid
            #292929;
          border-left:
            1px solid
            #292929;
        }

        .krve-measure-grid
          article {
          padding:
            19px;
          border-right:
            1px solid
            #292929;
          border-bottom:
            1px solid
            #292929;
        }

        .krve-measure-grid
          strong {
          display: block;
          margin-bottom:
            7px;
          color: #e5dfd5;
          font-size: 12px;
        }

        .krve-measure-grid
          span {
          color: #77736b;
          font-size: 11px;
          line-height: 1.55;
        }

        .krve-size-chart-footer {
          margin-top:
            auto;
          padding:
            28px 48px
            42px;
          border-top:
            1px solid
            #252525;
        }

        .krve-size-chart-footer
          > button {
          display: flex;
          width: 100%;
          min-height:
            55px;
          align-items:
            center;
          justify-content:
            space-between;
          padding:
            0 22px;
          border: 1px solid
            #dba718;
          background:
            #dba718;
          color: #050505;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          letter-spacing:
            0.13em;
        }

        .krve-size-chart-footer
          > button:hover {
          background:
            #efbd35;
        }

        .krve-size-chart-footer
          > a {
          display: block;
          margin-top:
            18px;
          color: #aaa49a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            0.15em;
          text-align:
            center;
          text-decoration:
            none;
        }

        .krve-size-chart-footer
          > a:hover {
          color: #dca91c;
        }

        @media (
          max-width: 700px
        ) {
          .krve-size-chart-drawer {
            top: auto;
            bottom: 0;
            width: 100%;
            height: min(
              88vh,
              860px
            );
            border-top:
              1px solid
              rgba(
                218,
                165,
                25,
                0.5
              );
            border-left: 0;
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
              27px 22px
              23px;
          }

          .krve-size-chart-header
            h2 {
            font-size:
              31px;
          }

          .krve-size-chart-close {
            width: 42px;
            height: 42px;
            flex-basis:
              42px;
          }

          .krve-size-chart-unit {
            padding:
              16px 22px;
          }

          .krve-size-table-scroll {
            padding:
              0 22px;
          }

          .krve-size-fit-note {
            margin:
              24px 22px
              0;
            padding:
              22px;
          }

          .krve-size-fit-note
            > div {
            grid-template-columns:
              1fr;
          }

          .krve-measure-guide {
            padding:
              28px 22px;
          }

          .krve-size-chart-footer {
            padding:
              24px 22px
              30px;
          }
        }
      `}</style>
    </>
  );
}
