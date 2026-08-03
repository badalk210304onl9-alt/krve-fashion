import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import "./globals.css";

import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import {
  CartProvider,
} from "@/components/cart-provider";

const displayFont =
  Cormorant_Garamond({
    subsets: ["latin"],
    variable:
      "--font-display",
    weight: [
      "400",
      "500",
      "600",
      "700",
    ],
  });

const bodyFont =
  Manrope({
    subsets: ["latin"],
    variable:
      "--font-body",
    weight: [
      "400",
      "500",
      "600",
      "700",
      "800",
    ],
  });

export const metadata: Metadata = {
  title:
    "KRVE — The Fashion Studio",

  description:
    "AI-powered luxury fashion, intelligent styling and virtual try-on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${displayFont.variable}
          ${bodyFont.variable}
        `}
      >
        <CartProvider>
          <SiteHeader />

          {children}

          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
