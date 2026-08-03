import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer exact-footer">
      <div>
        <strong>KRVE</strong>
        <p>AI-powered luxury fashion, intelligent tailoring and immersive virtual try-on.</p>
      </div>
      <nav>
        <Link href="/collections">Collections</Link>
        <Link href="/virtual-try-on">Virtual Try-On</Link>
        <Link href="/account">Account</Link>
      </nav>
      <span>© 2026 KRVE — THE FASHION STUDIO</span>
    </footer>
  );
}
