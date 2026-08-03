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

export type CartItem = Product & {
  quantity: number;
  size: string;
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

const CartContext =
  createContext<CartContextValue | null>(
    null,
  );

const CART_STORAGE_KEY =
  "krve-shopping-bag";

const WISHLIST_STORAGE_KEY =
  "krve-wishlist";

function loadCart(): CartItem[] {
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

    return Array.isArray(
      parsed,
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

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
        loadCart(),
      );

      setWishlist(
        loadWishlist(),
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
        currentCart,
      ) => {
        const existing =
          currentCart.find(
            (
              item,
            ) =>
              item.id ===
              product.id,
          );

        if (existing) {
          return currentCart.map(
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
          ...currentCart,

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
        currentCart,
      ) =>
        currentCart.filter(
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
