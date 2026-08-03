import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="krveFooter">
      <div className="krveFooterBrand">
        <span>♛</span>
        <strong>KRVE</strong>
        <small>THE FASHION STUDIO</small>
        <p>MOVE INTO STYLE</p>
      </div>

      <div className="krveFooterGrid">
        <div>
          <h4>SHOP</h4>
          <Link href="/collections">Collections</Link>
          <Link href="/collections?category=Men">Men</Link>
          <Link href="/collections?category=Women">Women</Link>
          <Link href="/collections?category=Accessories">Accessories</Link>
        </div>

        <div>
          <h4>EXPERIENCE</h4>
          <Link href="/virtual-try-on">Virtual Try-On</Link>
          <Link href="/account">My Account</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Shopping Bag</Link>
        </div>

        <div>
          <h4>CLIENT CARE</h4>
          <a href="mailto:care@krvefashionstudio.in">
            care@krvefashionstudio.in
          </a>
          <span>Mon–Sat · 10 AM–7 PM</span>
          <span>India</span>
        </div>
      </div>

      <div className="krveFooterBottom">
        <span>© 2026 KRVE — THE FASHION STUDIO</span>
        <span>PRIVACY · TERMS · SHIPPING · RETURNS</span>
      </div>
    </footer>
  );
}
