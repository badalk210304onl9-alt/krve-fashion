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
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://krve-fashion.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "KRVE — The Fashion Studio",
    template: "%s | KRVE",
  },

  description:
    "KRVE — The Fashion Studio is an emerging fashion and e-commerce brand offering contemporary fashion, intelligent styling experiences and AI-powered virtual try-on.",

  applicationName: "KRVE — The Fashion Studio",

  keywords: [
    "KRVE",
    "KRVE The Fashion Studio",
    "KRVE Fashion",
    "KRVE clothing",
    "fashion brand India",
    "online fashion store India",
    "luxury fashion India",
    "menswear India",
    "womenswear India",
    "kidswear India",
    "AI fashion",
    "AI stylist",
    "virtual try on",
    "fashion ecommerce",
  ],

  authors: [
    {
      name: "KRVE — The Fashion Studio",
      url: siteUrl,
    },
  ],

  creator: "KRVE — The Fashion Studio",
  publisher: "KRVE — The Fashion Studio",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "KRVE — The Fashion Studio",
    title: "KRVE — The Fashion Studio",
    description:
      "Discover contemporary fashion, intelligent styling and AI-powered virtual try-on with KRVE — The Fashion Studio.",
  },

  twitter: {
    card: "summary_large_image",
    title: "KRVE — The Fashion Studio",
    description:
      "Discover contemporary fashion, intelligent styling and AI-powered virtual try-on with KRVE.",
  },

  verification: {
    google:
      "nIAj_VeM5fHBEYZxchM_0HzUCBh3oboNJARgzOArn3o",
  },

  category: "fashion",
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
          colorNeutral: "#958d84",
          colorDanger: "#df8585",
          borderRadius: "0px",
          fontFamily: "var(--font-body)",
        },

        elements: {
          rootBox: {
            width: "100%",
          },

          cardBox: {
            width: "100%",
            boxShadow: "none",
          },

          card: {
            width: "100%",
            background: "transparent",
            border: "none",
            boxShadow: "none",
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
            minHeight: "46px",
            background: "#080808",
            border: "1px solid rgba(230, 180, 58, 0.35)",
            borderRadius: "0px",
            color: "#f6efe5",
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
            borderRadius: "0px",
            color: "#e6b43a",
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
          className={`${displayFont.variable} ${bodyFont.variable}`}
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
