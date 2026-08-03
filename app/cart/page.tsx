"use client";
import { useCart } from "@/components/cart-provider";
export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  return (
    <main className="page-shell">
      <h1>Shopping Bag</h1>
      {cart.length === 0 ? <p>Your bag is empty.</p> : cart.map((item) => (
        <div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"18px 0",borderBottom:"1px solid #333"}}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </main>
  );
}
