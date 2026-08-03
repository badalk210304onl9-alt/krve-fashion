"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="inner-site-footer">
      <div>
        <span>♛</span>
        <strong>KRVE</strong>
        <small>THE FASHION STUDIO</small>
      </div>

      <nav>
        <Link href="/collections">Collections</Link>
        <Link href="/virtual-try-on">Virtual Try-On</Link>
        <Link href="/account">Account</Link>
      </nav>

      <p>© 2026 KRVE — THE FASHION STUDIO</p>
    </footer>
  );
}
