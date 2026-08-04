import type { Metadata } from "next";

import {
  Cormorant_Garamond,
  Manrope,
} from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AutoLoginModal from "@/components/auto-login-modal";

import { CartProvider } from "@/components/cart-provider";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],

  variable: "--font-display",

  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

const bodyFont = Manrope({
  subsets: ["latin"],

  variable: "--font-body",

  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
});

export const metadata: Metadata = {
  title: "KRVE — The Fashion Studio",

  description:
    "AI-powered luxury fashion, intelligent styling and virtual try-on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#e6b43a",
          colorBackground: "#070707",
          colorForeground: "#f6efe5",
          colorMutedForeground: "#958d84",
          colorInputBackground: "#030303",
          colorInputForeground: "#f6efe5",
          colorBorder: "rgba(230, 180, 58, 0.42)",
          borderRadius: "0px",
          fontFamily: "var(--font-body)",
        },

        elements: {
          card: {
            background: "transparent",
            boxShadow: "none",
            border: "none",
            width: "100%",
          },

          rootBox: {
            width: "100%",
          },

          headerTitle: {
            color: "#f6efe5",
            fontFamily: "var(--font-display)",
            fontSize: "34px",
            fontWeight: "500",
          },

          headerSubtitle: {
            color: "#958d84",
            fontSize: "11px",
          },

          socialButtonsBlockButton: {
            background: "#080808",
            border: "1px solid rgba(230, 180, 58, 0.35)",
            color: "#f6efe5",
            borderRadius: "0px",
            minHeight: "46px",
          },

          socialButtonsBlockButtonText: {
            color: "#f6efe5",
            fontSize: "10px",
            fontWeight: "700",
          },

          dividerLine: {
            background: "rgba(230, 180, 58, 0.22)",
          },

          dividerText: {
            color: "#766f67",
            fontSize: "9px",
          },

          formFieldLabel: {
            color: "#a29a90",
            fontSize: "9px",
            fontWeight: "700",
            letterSpacing: "0.07em",
          },

          formFieldInput: {
            minHeight: "48px",
            background: "#030303",
            border: "1px solid rgba(230, 180, 58, 0.4)",
            borderRadius: "0px",
            color: "#f6efe5",
            fontSize: "11px",
          },

          formButtonPrimary: {
            minHeight: "49px",
            background:
              "linear-gradient(135deg, #ca8610, #efbd43, #d99e20)",
            border: "1px solid #e6b43a",
            borderRadius: "0px",
            color: "#050505",
            fontSize: "10px",
            fontWeight: "900",
            letterSpacing: "0.1em",
            boxShadow: "none",
          },

          footerActionText: {
            color: "#817970",
            fontSize: "9px",
          },

          footerActionLink: {
            color: "#e6b43a",
            fontSize: "9px",
            fontWeight: "700",
          },

          identityPreviewText: {
            color: "#f6efe5",
          },

          identityPreviewEditButtonIcon: {
            color: "#e6b43a",
          },

          formResendCodeLink: {
            color: "#e6b43a",
          },

          otpCodeFieldInput: {
            background: "#030303",
            border: "1px solid rgba(230, 180, 58, 0.45)",
            color: "#e6b43a",
            borderRadius: "0px",
          },

          alertText: {
            color: "#df8585",
            fontSize: "10px",
          },
        },
      }}
    >
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

            <AutoLoginModal />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
