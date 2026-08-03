import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer krve-footer">
      <div className="krve-footer-intro">
        <div>
          <div className="footer-brand">KRVE</div>
          <p>The Fashion Studio</p>
        </div>
        <h2>Move into style.</h2>
      </div>

      <div className="footer-grid">
        <div>
          <p>
            A private fashion house blending luxury tailoring, intelligent fit
            and digital styling into one seamless client experience.
          </p>
        </div>
        <div>
          <h4>House</h4>
          <Link href="/collections">Collections</Link>
          <Link href="/collections?category=Tailoring">Tailoring</Link>
          <Link href="/virtual-try-on">Virtual Studio</Link>
        </div>
        <div>
          <h4>Client</h4>
          <Link href="/account">Account</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Shopping Bag</Link>
        </div>
        <div>
          <h4>Private Services</h4>
          <a href="mailto:care@krvefashionstudio.in">care@krvefashionstudio.in</a>
          <span>Mon–Sat · 10 AM–7 PM</span>
          <span>India</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 KRVE — The Fashion Studio</span>
        <span>Privacy · Terms · Shipping</span>
      </div>
    </footer>
  );
}
