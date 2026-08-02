"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function CartPage() {
  const { items, total, removeFromCart, changeQuantity } = useCart();
  return (
    <main className="page-shell cart-page">
      <div className="page-hero compact"><p className="eyebrow">Shopping Bag</p><h1>Your KRVE selection</h1></div>
      {items.length === 0 ? <div className="empty-state"><h2>Your bag is empty.</h2><p>Explore the latest KRVE collection and discover your next signature piece.</p><Link className="primary-button dark-button" href="/collections">Continue Shopping</Link></div> : <div className="cart-layout"><div className="cart-list">{items.map((item) => <article className="cart-item" key={item.id}><div className="cart-thumb"><Image src={item.image} alt={item.name} fill className="cover" /></div><div className="cart-copy"><p>{item.category}</p><h3>{item.name}</h3><strong>{money.format(item.price)}</strong><div className="quantity"><button onClick={() => changeQuantity(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, item.quantity + 1)}>+</button></div></div><button className="remove-link" onClick={() => removeFromCart(item.id)}>Remove</button></article>)}</div><aside className="order-summary"><p className="eyebrow dark">Order Summary</p><div><span>Subtotal</span><strong>{money.format(total)}</strong></div><div><span>Shipping</span><strong>Complimentary</strong></div><div className="grand-total"><span>Total</span><strong>{money.format(total)}</strong></div><button className="primary-button dark-button full">Proceed to Checkout</button><p>Secure checkout · GST invoice available</p></aside></div>}
    </main>
  );
}
