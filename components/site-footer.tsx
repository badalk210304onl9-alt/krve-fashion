import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">KRVE</div>
          <p>Move into style. Luxury fashion designed around your identity, body and ambitions.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link href="/collections">All Collections</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Shopping Bag</Link>
        </div>
        <div>
          <h4>Experience</h4>
          <Link href="/virtual-try-on">Virtual Try-On</Link>
          <Link href="/account">Customer Account</Link>
          <Link href="/collections">New Arrivals</Link>
        </div>
        <div>
          <h4>Client Services</h4>
          <a href="mailto:care@krvefashionstudio.in">care@krvefashionstudio.in</a>
          <span>Mon–Sat · 10 AM–7 PM</span>
          <span>India</span>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 KRVE — The Fashion Studio</span><span>Privacy · Terms · Shipping</span></div>
    </footer>
  );
}
