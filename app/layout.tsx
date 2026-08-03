import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: "KRVE — The Fashion Studio",
  description: "AI-powered luxury fashion and virtual try-on."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
