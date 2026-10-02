"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/lib/catalog";

/* =========================================================
   TYPES
========================================================= */

export type CartItem = Product & {
  quantity: number;
  size: string;
  colour?: string;
  colours?: string[];
};

type CartContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  cartSubtotal: number;
  hydrated: boolean;

  addToCart: (
    product: Product,
    size?: string,
  ) => void;

  removeFromCart: (
    id: string,
  ) => void;

  increaseQuantity: (
    id: string,
  ) => void;

  decreaseQuantity: (
    id: string,
  ) => void;

  updateSize: (
    id: string,
    size: string,
  ) => void;

  toggleWishlist: (
    id: string,
  ) => void;

  clearCart: () => void;
};

/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext<CartContextValue | null>(
    null,
  );

/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_STORAGE_KEY =
  "krve-cart";

const LEGACY_CART_STORAGE_KEY =
  "krve-shopping-bag";

const WISHLIST_STORAGE_KEY =
  "krve-wishlist";

/* =========================================================
   CART NORMALIZER
========================================================= */

function normalizeCartItem(
  item: any,
): CartItem | null {
  if (
    !item ||
    typeof item !== "object" ||
    !item.id
  ) {
    return null;
  }

  const quantity = Math.max(
    1,
    Number(item.quantity ?? 1),
  );

  const colour =
    typeof item.colour ===
    "string"
      ? item.colour
      : Array.isArray(
            item.colours,
          )
        ? item.colours[0] ?? ""
        : "";

  const colours =
    Array.isArray(
      item.colours,
    )
      ? item.colours
      : colour
        ? [colour]
        : [];

  return {
    ...item,

    quantity,

    size:
      typeof item.size ===
      "string"
        ? item.size
        : "",

    colour,

    colours,
  } as CartItem;
}

/* =========================================================
   LOAD CART
========================================================= */

function loadCart(): CartItem[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    /*
      First read the new/main cart key.
    */

    let stored =
      window.localStorage.getItem(
        CART_STORAGE_KEY,
      );

    /*
      If the new cart is empty/not present,
      support old KRVE cart data too.
    */

    if (!stored) {
      stored =
        window.localStorage.getItem(
          LEGACY_CART_STORAGE_KEY,
        );
    }

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(
        stored,
      );

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return [];
    }

    const normalized =
      parsed
        .map(
          normalizeCartItem,
        )
        .filter(
          (
            item,
          ): item is CartItem =>
            Boolean(item),
        );

    /*
      Always migrate legacy data
      into the new cart key.
    */

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(
        normalized,
      ),
    );

    return normalized;
  } catch (error) {
    console.error(
      "KRVE_CART_LOAD_ERROR",
      error,
    );

    return [];
  }
}

/* =========================================================
   LOAD WISHLIST
========================================================= */

function loadWishlist(): string[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        WISHLIST_STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(
        stored,
      );

    return Array.isArray(
      parsed,
    )
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "KRVE_WISHLIST_LOAD_ERROR",
      error,
    );

    return [];
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    cart,
    setCart,
  ] =
    useState<CartItem[]>(
      [],
    );

  const [
    wishlist,
    setWishlist,
  ] =
    useState<string[]>(
      [],
    );

  const [
    hydrated,
    setHydrated,
  ] =
    useState(false);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const initialCart =
      loadCart();

    const initialWishlist =
      loadWishlist();

    setCart(
      initialCart,
    );

    setWishlist(
      initialWishlist,
    );

    setHydrated(
      true,
    );
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(
          cart,
        ),
      );
    } catch (error) {
      console.error(
        "KRVE_CART_SAVE_ERROR",
        error,
      );
    }
  }, [
    cart,
    hydrated,
  ]);

  /* =======================================================
     SAVE WISHLIST
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(
          wishlist,
        ),
      );
    } catch (error) {
      console.error(
        "KRVE_WISHLIST_SAVE_ERROR",
        error,
      );
    }
  }, [
    wishlist,
    hydrated,
  ]);

  /* =======================================================
     IMPORTANT:
     LISTEN FOR PRODUCT PAGE CART UPDATES
  ======================================================= */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    function handleCartUpdated(
      event: Event,
    ) {
      try {
        const customEvent =
          event as CustomEvent;

        /*
          ProductPurchasePanel already sends
          krve-cart-updated with the latest cart.

          We intentionally reload from localStorage
          so both systems always use exactly the same
          data.
        */

        const detail =
          customEvent.detail;

        if (
          Array.isArray(
            detail,
          )
        ) {
          const normalized =
            detail
              .map(
                normalizeCartItem,
              )
              .filter(
                (
                  item,
                ): item is CartItem =>
                  Boolean(item),
              );

          setCart(
            normalized,
          );

          window.localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(
              normalized,
            ),
          );

          return;
        }

        setCart(
          loadCart(),
        );
      } catch (error) {
        console.error(
          "KRVE_CART_EVENT_ERROR",
          error,
        );

        setCart(
          loadCart(),
        );
      }
    }

    function handleStorage(
      event: StorageEvent,
    ) {
      if (
        event.key ===
        CART_STORAGE_KEY
      ) {
        setCart(
          loadCart(),
        );
      }

      /*
        Also support old cart key
        during migration.
      */

      if (
        event.key ===
        LEGACY_CART_STORAGE_KEY
      ) {
        setCart(
          loadCart(),
        );
      }
    }

    window.addEventListener(
      "krve-cart-updated",
      handleCartUpdated,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "krve-cart-updated",
        handleCartUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (
    product: Product,
    size = "M",
  ) => {
    setCart(
      (
        currentCart,
      ) => {
        const existing =
          currentCart.find(
            (
              item,
            ) =>
              item.id ===
                product.id &&
              item.size ===
                size,
          );

        let nextCart: CartItem[];

        if (existing) {
          nextCart =
            currentCart.map(
              (
                item,
              ) =>
                item.id ===
                  product.id &&
                item.size ===
                  size
                  ? {
                      ...item,

                      quantity:
                        item.quantity +
                        1,
                    }
                  : item,
            );
        } else {
          nextCart = [
            ...currentCart,

            {
              ...product,

              quantity: 1,

              size,

              colour:
                product.colours?.[0] ??
                "",

              colours:
                product.colours ??
                [],
            },
          ];
        }

        try {
          window.localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(
              nextCart,
            ),
          );

          window.dispatchEvent(
            new CustomEvent(
              "krve-cart-updated",
              {
                detail:
                  nextCart,
              },
            ),
          );
        } catch (error) {
          console.error(
            "KRVE_CART_ADD_SAVE_ERROR",
            error,
          );
        }

        return nextCart;
      },
    );
  };

  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (
    id: string,
  ) => {
    setCart(
      (
        currentCart,
      ) => {
        const nextCart =
          currentCart.filter(
            (
              item,
            ) =>
              item.id !==
              id,
          );

        return nextCart;
      },
    );
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (
    id: string,
  ) => {
    setCart(
      (
        currentCart,
      ) =>
        currentCart.map(
          (
            item,
          ) =>
            item.id ===
            id
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item,
        ),
    );
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (
    id: string,
  ) => {
    setCart(
      (
        currentCart,
      ) =>
        currentCart
          .map(
            (
              item,
            ) =>
              item.id ===
              id
                ? {
                    ...item,

                    quantity:
                      item.quantity -
                      1,
                  }
                : item,
          )
          .filter(
            (
              item,
            ) =>
              item.quantity >
              0,
          ),
    );
  };

  /* =======================================================
     UPDATE SIZE
  ======================================================= */

  const updateSize = (
    id: string,
    size: string,
  ) => {
    setCart(
      (
        currentCart,
      ) =>
        currentCart.map(
          (
            item,
          ) =>
            item.id ===
            id
              ? {
                  ...item,

                  size,
                }
              : item,
        ),
    );
  };

  /* =======================================================
     WISHLIST
  ======================================================= */

  const toggleWishlist = (
    id: string,
  ) => {
    setWishlist(
      (
        currentWishlist,
      ) =>
        currentWishlist.includes(
          id,
        )
          ? currentWishlist.filter(
              (
                itemId,
              ) =>
                itemId !==
                id,
            )
          : [
              ...currentWishlist,
              id,
            ],
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCart([]);

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        "[]",
      );

      /*
        Keep legacy storage clean too.
      */

      window.localStorage.removeItem(
        LEGACY_CART_STORAGE_KEY,
      );

      window.dispatchEvent(
        new CustomEvent(
          "krve-cart-updated",
          {
            detail: [],
          },
        ),
      );
    } catch (error) {
      console.error(
        "KRVE_CART_CLEAR_ERROR",
        error,
      );
    }
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item,
          ) =>
            total +
            Math.max(
              0,
              Number(
                item.quantity ??
                  0,
              ),
            ),
          0,
        ),
      [
        cart,
      ],
    );

  /* =======================================================
     CART SUBTOTAL
  ======================================================= */

  const cartSubtotal =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item,
          ) =>
            total +
            Number(
              item.price ??
                0,
            ) *
              Math.max(
                0,
                Number(
                  item.quantity ??
                    0,
                ),
              ),
          0,
        ),
      [
        cart,
      ],
    );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo<CartContextValue>(
      () => ({
        cart,

        wishlist,

        cartCount,

        cartSubtotal,

        hydrated,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        updateSize,

        toggleWishlist,

        clearCart,
      }),
      [
        cart,
        wishlist,
        cartCount,
        cartSubtotal,
        hydrated,
      ],
    );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCart() {
  const context =
    useContext(
      CartContext,
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider.",
    );
  }

  return context;
}
