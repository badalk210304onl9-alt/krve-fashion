"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  wishlist: string[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem("krve-cart");
      const storedWishlist = window.localStorage.getItem("krve-wishlist");
      if (storedCart) setItems(JSON.parse(storedCart) as CartItem[]);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist) as string[]);
    } catch {
      setItems([]);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("krve-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem("krve-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    wishlist,
    addToCart: (product) => {
      setItems((current) => {
        const found = current.find((item) => item.id === product.id);
        if (found) {
          return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...current, { ...product, quantity: 1 }];
      });
    },
    removeFromCart: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    changeQuantity: (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    toggleWishlist: (id) => setWishlist((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]),
    cartCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }), [items, wishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
