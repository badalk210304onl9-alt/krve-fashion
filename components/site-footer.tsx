"use client";

import Link from "next/link";

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const shopLinks = [
  {
    label: "Men",
    href: "/men",
  },
  {
    label: "Women",
    href: "/women",
  },
  {
    label: "Kids",
    href: "/kids",
  },
  {
    label: "Accessories",
    href: "/accessories",
  },
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
];

const customerCareLinks = [
  {
    label: "Contact Us",
    href: "/contact",
  },
  {
    label: "Track Order",
    href: "/track-order",
  },
  {
    label: "Returns & Refunds",
    href: "/returns-refunds",
  },
  {
    label: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    label: "Size Guide",
    href: "/size-guide",
  },
];

const companyLinks = [
  {
    label: "About KRVE",
    href: "/about",
  },
  {
    label: "Careers",
    href: "/careers",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.3fr_0.7fr_0.9fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center"
            >
              <span className="text-3xl font-black tracking-[0.16em] text-white">
                KRVÉ
              </span>
            </Link>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              The Fashion Studio
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Contemporary fashion, elevated essentials and
              technology-led shopping experiences designed
              for a new generation.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="mailto:support@krvefashionstudio.in"
                className="flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
              >
                <Mail
                  size={16}
                  className="shrink-0"
                />

                support@krvefashionstudio.in
              </a>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin
                  size={16}
                  className="shrink-0"
                />

                India
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone
                  size={16}
                  className="shrink-0"
                />

                Customer Support
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={shopLinks}
          />

          <FooterColumn
            title="Customer Care"
            links={customerCareLinks}
          />

          <FooterColumn
            title="Company"
            links={companyLinks}
          />
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} KRVE – The Fashion Studio.
              All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                Secure Shopping
              </span>

              <span>
                Made for India
              </span>

              <span>
                Move into style.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;

  links: {
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map(
          (
            link,
          ) => (
            <li
              key={link.href}
            >
              <Link
                href={link.href}
                className={`text-sm transition ${
                  link.label ===
                  "Careers"
                    ? "font-bold text-blue-300 hover:text-blue-200"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
