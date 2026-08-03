"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Product,
} from "@/lib/catalog";

export type CartItem = Product & {
  quantity: number;
  size: string;
};

type CartContextValue = {
  cart: CartItem[];
  wishlist: string[];

  cartCount: number;
  cartSubtotal: number;

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

  updateQuantity: (
    id: string,
    quantity: number,
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

const CartContext =
  createContext<CartContextValue | null>(
    null,
  );

const CART_STORAGE_KEY =
  "krve-shopping-bag";

const WISHLIST_STORAGE_KEY =
  "krve-wishlist";

function readStoredCart(): CartItem[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        CART_STORAGE_KEY,
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(
        stored,
      ) as CartItem[];

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function readStoredWishlist(): string[] {
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
      ) as string[];

    return Array.isArray(
      parsed,
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

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

  useEffect(
    () => {
      setCart(
        readStoredCart(),
      );

      setWishlist(
        readStoredWishlist(),
      );

      setHydrated(
        true,
      );
    },
    [],
  );

  useEffect(
    () => {
      if (!hydrated) {
        return;
      }

      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(
          cart,
        ),
      );
    },
    [
      cart,
      hydrated,
    ],
  );

  useEffect(
    () => {
      if (!hydrated) {
        return;
      }

      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(
          wishlist,
        ),
      );
    },
    [
      hydrated,
      wishlist,
    ],
  );

  const addToCart = (
    product: Product,
    size = "M",
  ) => {
    setCart(
      (
        currentItems,
      ) => {
        const existingItem =
          currentItems.find(
            (
              item,
            ) =>
              item.id ===
              product.id,
          );

        if (
          existingItem
        ) {
          return currentItems.map(
            (
              item,
            ) =>
              item.id ===
              product.id
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item,
          );
        }

        return [
          ...currentItems,

          {
            ...product,

            quantity: 1,

            size,
          },
        ];
      },
    );
  };

  const removeFromCart = (
    id: string,
  ) => {
    setCart(
      (
        currentItems,
      ) =>
        currentItems.filter(
          (
            item,
          ) =>
            item.id !==
            id,
        ),
    );
  };

  const increaseQuantity = (
    id: string,
  ) => {
    setCart(
      (
        currentItems,
      ) =>
        currentItems.map(
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

  const decreaseQuantity = (
    id: string,
  ) => {
    setCart(
      (
        currentItems,
      ) =>
        currentItems
          .map(
            (
              item,
            ) =>
              item.id ===
              id
                ? {
                    ...item,

                    quantity:
                      Math.max(
                        0,
                        item.quantity -
                          1,
                      ),
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

  const updateQuantity = (
    id: string,
    quantity: number,
  ) => {
    if (
      quantity <=
      0
    ) {
      removeFromCart(
        id,
      );

      return;
    }

    setCart(
      (
        currentItems,
      ) =>
        currentItems.map(
          (
            item,
          ) =>
            item.id ===
            id
              ? {
                  ...item,

                  quantity,
                }
              : item,
        ),
    );
  };

  const updateSize = (
    id: string,
    size: string,
  ) => {
    setCart(
      (
        currentItems,
      ) =>
        currentItems.map(
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

  const toggleWishlist = (
    id: string,
  ) => {
    setWishlist(
      (
        currentItems,
      ) =>
        currentItems.includes(
          id,
        )
          ? currentItems.filter(
              (
                itemId,
              ) =>
                itemId !==
                id,
            )
          : [
              ...currentItems,
              id,
            ],
    );
  };

  const clearCart = () => {
    setCart(
      [],
    );
  };

  const cartCount =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.quantity,
          0,
        ),
      [
        cart,
      ],
    );

  const cartSubtotal =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.price *
              item.quantity,
          0,
        ),
      [
        cart,
      ],
    );

  const value =
    useMemo<CartContextValue>(
      () => ({
        cart,

        wishlist,

        cartCount,

        cartSubtotal,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        updateQuantity,

        updateSize,

        toggleWishlist,

        clearCart,
      }),
      [
        cart,
        wishlist,
        cartCount,
        cartSubtotal,
      ],
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

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
