import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span>♛</span><strong>KRVE</strong><small>THE FASHION STUDIO</small><p>MOVE INTO STYLE</p>
      </div>
      <div className="footer-grid">
        <div><h4>SHOP</h4><Link href="/collections">Collections</Link><Link href="/collections?category=Men">Men</Link><Link href="/collections?category=Women">Women</Link></div>
        <div><h4>EXPERIENCE</h4><Link href="/virtual-try-on">Virtual Try-On</Link><Link href="/account">Account</Link><Link href="/wishlist">Wishlist</Link></div>
        <div><h4>CLIENT CARE</h4><a href="mailto:care@krvefashionstudio.in">care@krvefashionstudio.in</a><span>Mon–Sat · 10 AM–7 PM</span><span>India</span></div>
      </div>
      <div className="footer-bottom"><span>© 2026 KRVE — THE FASHION STUDIO</span><span>PRIVACY · TERMS · SHIPPING · RETURNS</span></div>
    </footer>
  );
}
