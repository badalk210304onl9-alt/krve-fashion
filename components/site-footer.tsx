import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-monogram">KRVE</div>
      <div className="footer-grid">
        <div className="footer-intro">
          <p className="eyebrow">The House of Intelligent Tailoring</p>
          <h2>Move into style.</h2>
          <p>
            A modern fashion house built around identity, precision and the future of fit.
          </p>
        </div>

        <div>
          <h4>The House</h4>
          <Link href="/collections">New Collection</Link>
          <Link href="/collections?category=Tailoring">Tailoring</Link>
          <Link href="/virtual-try-on">Digital Atelier</Link>
        </div>

        <div>
          <h4>Private Client</h4>
          <Link href="/account">My Account</Link>
          <Link href="/wishlist">Saved Pieces</Link>
          <Link href="/cart">Shopping Bag</Link>
        </div>

        <div>
          <h4>Client Services</h4>
          <a href="mailto:care@krvefashionstudio.in">care@krvefashionstudio.in</a>
          <span>Monday—Saturday</span>
          <span>10:00—19:00 IST</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 KRVE — THE FASHION STUDIO</span>
        <div>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Shipping</span>
        </div>
      </div>
    </footer>
  );
}
