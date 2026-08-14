import Link from "next/link";

const shopLinks = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Accessories", href: "/accessories" },
  { label: "New Arrivals", href: "/new-arrivals" },
];

const customerCareLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/returns-refunds" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Size Guide", href: "/size-guide" },
];

const companyLinks = [
  { label: "About KRVE", href: "/about" },

  // CAREERS IS HERE
  { label: "Careers", href: "/careers" },

  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link href="/" className="inline-block">
              <div className="text-3xl font-black tracking-[0.16em]">
                KRVÉ
              </div>

              <div className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                The Fashion Studio
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Contemporary fashion, elevated essentials and
              technology-led shopping experiences designed
              for a new generation.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-400">
              <p>
                Email: support@krvefashionstudio.in
              </p>

              <p>
                Location: India
              </p>
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Instagram
              </a>

              <a
                href="#"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Facebook
              </a>

              <a
                href="#"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* SHOP */}
          <FooterColumn
            title="Shop"
            links={shopLinks}
          />

          {/* CUSTOMER CARE */}
          <FooterColumn
            title="Customer Care"
            links={customerCareLinks}
          />

          {/* COMPANY */}
          <FooterColumn
            title="Company"
            links={companyLinks}
            highlight="Careers"
          />

        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} KRVE – The Fashion Studio.
              All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>Secure Shopping</span>
              <span>Made for India</span>
              <span>Move into style.</span>
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
  highlight,
}: {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
  highlight?: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
        {title}
      </h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={
                link.label === highlight
                  ? "text-sm font-bold text-blue-300 transition hover:text-blue-200"
                  : "text-sm text-slate-400 transition hover:text-white"
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
