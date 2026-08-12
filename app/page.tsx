"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Bot,
  Bookmark,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Crown,
  Gem,
  Globe2,
  Heart,
  History,
  LockKeyhole,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  Star,
  Trash2,
  UserPlus,
  UserRound,
  WalletCards,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  collection: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
  sizeOptions: string[];
};

type AiMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const navigation = [
  {
    label: "Shop",
    href: "/collections",
  },
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Virtual Try-On",
    href: "/virtual-try-on",
  },
  {
    label: "AI Stylist",
    href: "/ai-stylist",
  },
  {
    label: "About Us",
    href: "/about",
  },
];

const services = [
  {
    icon: Globe2,
    title: "Free Worldwide Shipping",
    description: "On orders above ₹4,999",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "Finest materials",
  },
  {
    icon: UserRound,
    title: "AI Personal Stylist",
    description: "Style that matches you",
  },
  {
    icon: LockKeyhole,
    title: "Secure Shopping",
    description: "100% protected checkout",
  },
];

const products = [
  {
    name: "KrvE Signature Blazer",
    price: "₹18,999",
    href: "/product/krve-signature-blazer",
    image:
      "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=900&q=90",
  },
  {
    name: "KrvE Luxe Shirt",
    price: "₹10,999",
    href: "/product/krve-luxe-shirt",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=90",
  },
  {
    name: "KrvE Travel Duffle",
    price: "₹20,999",
    href: "/product/krve-travel-duffle",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=90",
  },
  {
    name: "KrvE Elite Sneakers",
    price: "₹14,999",
    href: "/product/krve-elite-sneakers",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=90",
  },
];

const highlights = [
  {
    icon: Gem,
    title: "Exclusive Collections",
    description: "Unique and limited designs",
  },
  {
    icon: Sparkles,
    title: "Luxury Materials",
    description: "Premium and sustainable",
  },
  {
    icon: ShieldCheck,
    title: "Crafted to Perfection",
    description: "Attention to every detail",
  },
];

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "KrvE Noir Blazer",
    collection: "KRVE Private Collection",
    size: "L",
    quantity: 1,
    price: 24999,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=95",
    sizeOptions: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "KrvE Icon Sneakers",
    collection: "KRVE Private Collection",
    size: "42",
    quantity: 1,
    price: 15999,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=95",
    sizeOptions: ["40", "41", "42", "43", "44"],
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Welcome to KRVE AI. Tell me the occasion, preferred style, colour, or budget and I will curate a refined look for you.",
    },
  ]);
  const [cartItems, setCartItems] =
    useState<CartItem[]>(initialCartItems);

  const [wishlistItems, setWishlistItems] = useState(products.slice(0, 3));

  const [cartReady, setCartReady] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("krve-cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      } catch {
        window.localStorage.removeItem("krve-cart");
      }
    }

    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) {
      return;
    }

    window.localStorage.setItem(
      "krve-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems, cartReady]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen || aiOpen || accountOpen || wishlistOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen, aiOpen, accountOpen, wishlistOpen]);

  useEffect(() => {
    function closePanelsWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setAiOpen(false);
        setAccountOpen(false);
        setWishlistOpen(false);
        setSearchQuery("");
        setAiInput("");
      }
    }

    window.addEventListener("keydown", closePanelsWithEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        closePanelsWithEscape
      );
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [searchOpen]);

  useEffect(() => {
    if (aiOpen) {
      window.requestAnimationFrame(() => {
        aiInputRef.current?.focus();
      });
    }
  }, [aiOpen]);



  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shipping =
    subtotal === 0 || subtotal >= 4999 ? 0 : 299;

  const couponDiscount = useMemo(() => {
    if (appliedCoupon === "WELCOME10") {
      return Math.min(Math.round(subtotal * 0.1), 2500);
    }

    if (appliedCoupon === "KRVE15") {
      return subtotal >= 15000
        ? Math.min(Math.round(subtotal * 0.15), 5000)
        : 0;
    }

    if (appliedCoupon === "LUXURY2000") {
      return subtotal >= 10000 ? 2000 : 0;
    }

    return 0;
  }, [appliedCoupon, subtotal]);

  const discount = couponDiscount;

  const amountBeforeTax = Math.max(
    subtotal + shipping - discount,
    0
  );

  const estimatedTax = Math.round(amountBeforeTax * 0.08);

  const grandTotal = amountBeforeTax + estimatedTax;

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearchQuery) {
      return [];
    }

    return products.filter((product) => {
      const searchableText =
        `${product.name} ${product.price}`.toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    });
  }, [normalizedSearchQuery]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function removeWishlistItem(name: string) {
    setWishlistItems((current) =>
      current.filter((item) => item.name !== name)
    );
  }

  function addWishlistItemToCart(product: (typeof products)[number]) {
    setCartItems((current) => {
      const existing = current.find(
        (item) => item.name === product.name
      );

      if (existing) {
        return current.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          id: Date.now(),
          name: product.name,
          collection: "KRVE Private Collection",
          size: "M",
          quantity: 1,
          price: Number(product.price.replace(/[₹,]/g, "")),
          image: product.image,
          sizeOptions: ["S", "M", "L", "XL"],
        },
      ];
    });

    setWishlistOpen(false);
    setCartOpen(true);
  }

  function closeAi() {
    setAiOpen(false);
    setAiInput("");
  }

  function getAiReply(message: string) {
    const query = message.toLowerCase();

    if (query.includes("wedding") || query.includes("shaadi")) {
      return "For a wedding, I recommend the KRVE Signature Blazer with a crisp luxe shirt and polished formal footwear. Choose deep black, midnight navy, or rich burgundy for an elevated evening presence.";
    }

    if (query.includes("office") || query.includes("formal")) {
      return "For a refined office look, pair the KRVE Signature Blazer with the KRVE Luxe Shirt. Keep the palette monochrome or navy and finish with minimal accessories.";
    }

    if (query.includes("casual") || query.includes("travel")) {
      return "For a luxury casual or travel look, combine the KRVE Luxe Shirt with KRVE Elite Sneakers and the KRVE Travel Duffle. The result is relaxed, clean, and premium.";
    }

    if (
      query.includes("budget") ||
      query.includes("price") ||
      query.includes("under")
    ) {
      return "Tell me your exact budget in ₹ and I will curate the strongest KRVE combination within it. You can also mention whether you need one statement piece or a complete outfit.";
    }

    if (query.includes("black")) {
      return "Black is ideal for a sharp KRVE signature look. Start with the KRVE Signature Blazer, add a tonal shirt, and use subtle gold or silver accessories for contrast.";
    }

    return "Based on your request, I would begin with the KRVE Signature Blazer as the statement piece, then balance it with either the KRVE Luxe Shirt for formal styling or KRVE Elite Sneakers for a modern luxury finish.";
  }

  function sendAiMessage(message?: string) {
    const finalMessage = (message ?? aiInput).trim();

    if (!finalMessage || aiThinking) {
      return;
    }

    const userMessage: AiMessage = {
      id: Date.now(),
      role: "user",
      text: finalMessage,
    };

    setAiMessages((current) => [...current, userMessage]);
    setAiInput("");
    setAiThinking(true);

    window.setTimeout(() => {
      const assistantMessage: AiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: getAiReply(finalMessage),
      };

      setAiMessages((current) => [...current, assistantMessage]);
      setAiThinking(false);
    }, 650);
  }

  function applyCoupon() {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponMessage("Please enter a coupon code.");
      setAppliedCoupon("");
      return;
    }

    if (normalizedCode === "WELCOME10") {
      setAppliedCoupon(normalizedCode);
      setCouponMessage("WELCOME10 applied successfully.");
      return;
    }

    if (normalizedCode === "KRVE15") {
      if (subtotal < 15000) {
        setAppliedCoupon("");
        setCouponMessage(
          "KRVE15 is valid on orders above ₹15,000."
        );
        return;
      }

      setAppliedCoupon(normalizedCode);
      setCouponMessage("KRVE15 applied successfully.");
      return;
    }

    if (normalizedCode === "LUXURY2000") {
      if (subtotal < 10000) {
        setAppliedCoupon("");
        setCouponMessage(
          "LUXURY2000 is valid on orders above ₹10,000."
        );
        return;
      }

      setAppliedCoupon(normalizedCode);
      setCouponMessage("LUXURY2000 applied successfully.");
      return;
    }

    setAppliedCoupon("");
    setCouponMessage("This coupon code is not valid.");
  }

  function removeCoupon() {
    setCouponCode("");
    setAppliedCoupon("");
    setCouponMessage("");
  }

  function increaseQuantity(id: number) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(
                  item.quantity - 1,
                  0
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function updateSize(id: number, size: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              size,
            }
          : item
      )
    );
  }

  return (
    <main className="krve-site">
      {/* Announcement Bar */}
      <section className="krve-announcement">
        <Link href="/ai-stylist">
          <Sparkles size={14} fill="currentColor" />

          <span>
            Meet Your Personal AI Stylist — Get Recommendations
          </span>

          <ChevronRight size={15} />
        </Link>

        <button
          type="button"
          aria-label="Close announcement"
        >
          ×
        </button>
      </section>

      {/* Header */}
      <header className="krve-header">
        <div className="krve-header-inner">
          <Link
            href="/"
            className="krve-logo"
            aria-label="KRVE homepage"
          >
            <span>
              K<small>rv</small>E
            </span>

            <strong>The Fashion Studio</strong>
          </Link>

          <nav
            className="krve-navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="krve-header-actions">
            <button
              type="button"
              className="krve-luxury-search-button"
              aria-label="Open luxury product search"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              aria-label="Open KRVE AI Stylist"
              className="krve-ai-action"
              onClick={() => setAiOpen(true)}
            >
              <WandSparkles
                size={25}
                strokeWidth={1.5}
              />

              <span>AI</span>
            </button>

            <Link
              href="/account/login"
              aria-label="Sign in to KRVE"
              className="krve-account-trigger"
            >
              <UserRound size={23} strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              aria-label="Open wishlist"
              className="krve-wishlist-trigger"
              onClick={() => setWishlistOpen(true)}
            >
              <Heart size={23} strokeWidth={1.5} />

              {wishlistItems.length > 0 && (
                <span>{wishlistItems.length}</span>
              )}
            </button>

            <button
              type="button"
              aria-label="Open shopping bag"
              className="krve-cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
              />

              <span>{cartCount}</span>
            </button>

            <button
              type="button"
              className="krve-mobile-menu"
              aria-label="Open menu"
            >
              <Menu size={25} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="krve-hero">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2200&q=95"
          alt="KRVE luxury fashion model"
          fill
          priority
          sizes="100vw"
          className="krve-hero-image"
        />

        <div className="krve-hero-shade" />
        <div className="krve-hero-glow" />

        <div className="krve-hero-inner">
          <div className="krve-hero-copy">
            <div className="krve-eyebrow">
              <span />

              <p>AI-Powered Fashion</p>
            </div>

            <h1>
              Fashion that
              <span>understands you</span>
            </h1>

            <p className="krve-hero-description">
              Experience the future of luxury fashion with
              AI-powered style recommendations.
            </p>

            <div className="krve-hero-actions">
              <Link
                href="/collections"
                className="krve-primary-button"
              >
                Explore Collections

                <ArrowRight size={16} />
              </Link>

              <Link
                href="/virtual-try-on"
                className="krve-secondary-button"
              >
                Virtual Try-On

                <Sparkles size={14} />
              </Link>
            </div>
          </div>

          <div
            className="krve-monogram"
            aria-hidden="true"
          >
            <Crown size={80} strokeWidth={0.75} />

            <div>
              <span>K</span>
              <strong>KrvE</strong>
            </div>
          </div>
        </div>
      </section>
            {/* Services */}
      <section className="krve-service-strip">
        <div className="krve-service-grid">
          {services.map(
            ({ icon: Icon, title, description }) => (
              <article key={title}>
                <Icon size={29} strokeWidth={1.35} />

                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="krve-arrivals">
        <div className="krve-section-heading">
          <div>
            <h2>New Arrivals</h2>

            <div className="krve-heading-decoration">
              <span />
              <Sparkles
                size={11}
                fill="currentColor"
              />
              <span />
            </div>
          </div>

          <Link href="/collections/new-arrivals">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="krve-arrivals-layout">
          {/* Products */}
          <div className="krve-product-grid">
            {products.map((product) => (
              <article
                key={product.name}
                className="krve-product-card"
              >
                <Link
                  href={product.href}
                  className="krve-product-image"
                  aria-label={`View ${product.name}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />

                  <span className="krve-product-overlay" />
                </Link>

                <button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  className="krve-product-wishlist"
                >
                  <Heart size={18} strokeWidth={1.4} />
                </button>

                <div className="krve-product-information">
                  <Link href={product.href}>
                    {product.name}
                  </Link>

                  <p>{product.price}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Virtual Try-On Card */}
          <article className="krve-tryon-card">
            <div className="krve-tryon-copy">
              <h2>AI Virtual Try-On Studio</h2>

              <p>
                Upload your photo and see how our outfits look
                on you in real-time.
              </p>

              <Link href="/virtual-try-on">
                Try Now
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="krve-tryon-gallery">
              <div className="krve-tryon-main">
                <Image
                  src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=95"
                  alt="KRVE virtual try-on model"
                  fill
                  sizes="300px"
                />
              </div>

              <div className="krve-tryon-side">
                <div>
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=95"
                    alt="KRVE AI styling preview"
                    fill
                    sizes="180px"
                  />
                </div>

                <div>
                  <Image
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=95"
                    alt="KRVE formal outfit preview"
                    fill
                    sizes="180px"
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="krve-highlight-strip">
        <div className="krve-highlight-grid">
          {highlights.map(
            ({ icon: Icon, title, description }) => (
              <article key={title}>
                <Icon size={26} strokeWidth={1.35} />

                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              </article>
            )
          )}

          <article>
            <UserRound size={26} strokeWidth={1.35} />

            <div>
              <h2>Trusted by Thousands</h2>

              <div className="krve-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={10}
                    fill="currentColor"
                  />
                ))}

                <span>4.9/5 (2K+ Reviews)</span>
              </div>
            </div>
          </article>
        </div>
      </section>


      {/* Luxury Search Overlay */}
      <div
        className={`krve-luxury-search-overlay ${
          searchOpen ? "is-open" : ""
        }`}
        aria-hidden={!searchOpen}
      >
        <button
          type="button"
          className="krve-luxury-search-backdrop"
          aria-label="Close product search"
          onClick={closeSearch}
        />

        <section className="krve-luxury-search-panel">
          <div className="krve-luxury-search-topline">
            <span>KRVE Private Search</span>

            <button
              type="button"
              aria-label="Close product search"
              onClick={closeSearch}
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </div>

          <div className="krve-luxury-search-heading">
            <p>Discover Your Signature Piece</p>
            <h2>Search the KRVE Collection</h2>
          </div>

          <div className="krve-luxury-search-input-wrap">
            <Search size={23} strokeWidth={1.25} />

            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search blazers, shirts, sneakers, bags..."
              aria-label="Search KRVE products"
            />

            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="krve-luxury-search-content">
            {!normalizedSearchQuery ? (
              <div className="krve-luxury-search-discover">
                <span>Curated Suggestions</span>

                <div>
                  {["Blazer", "Shirt", "Sneakers", "Duffle"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchQuery(term)}
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="krve-luxury-search-results-head">
                  <span>
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "Result"
                      : "Results"}
                  </span>
                  <strong>Matching “{searchQuery}”</strong>
                </div>

                <div className="krve-luxury-search-results-grid">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.name}
                      href={product.href}
                      className="krve-luxury-search-card"
                      onClick={closeSearch}
                    >
                      <div className="krve-luxury-search-card-image">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="180px"
                        />
                      </div>

                      <div className="krve-luxury-search-card-copy">
                        <span>KRVE Private Collection</span>
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>

                      <div className="krve-luxury-search-card-arrow">
                        <ArrowRight
                          size={17}
                          strokeWidth={1.35}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="krve-luxury-search-empty">
                <Search size={34} strokeWidth={1.15} />
                <h3>No Signature Piece Found</h3>
                <p>
                  Try searching for blazer, shirt, sneakers or
                  duffle.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>




      {/* KRVE Wishlist */}
      <div
        className={`krve-wishlist-overlay ${
          wishlistOpen ? "is-open" : ""
        }`}
        aria-hidden={!wishlistOpen}
      >
        <button
          type="button"
          className="krve-wishlist-backdrop"
          aria-label="Close wishlist"
          onClick={() => setWishlistOpen(false)}
        />

        <aside className="krve-wishlist-panel">
          <header className="krve-wishlist-panel-header">
            <div>
              <span>KRVE Saved Selection</span>
              <h2>My Wishlist</h2>
              <p>
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "Piece" : "Pieces"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Close wishlist"
              onClick={() => setWishlistOpen(false)}
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </header>

          <section className="krve-wishlist-hero">
            <Heart size={22} strokeWidth={1.25} />
            <div>
              <span>Your Private Edit</span>
              <p>
                Save your favourite KRVE pieces and return to them
                whenever you are ready.
              </p>
            </div>
          </section>

          <div className="krve-wishlist-content">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((product) => (
                <article
                  key={product.name}
                  className="krve-wishlist-item"
                >
                  <Link
                    href={product.href}
                    className="krve-wishlist-item-image"
                    onClick={() => setWishlistOpen(false)}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="130px"
                    />
                  </Link>

                  <div className="krve-wishlist-item-copy">
                    <span>KRVE Private Collection</span>

                    <Link
                      href={product.href}
                      onClick={() => setWishlistOpen(false)}
                    >
                      {product.name}
                    </Link>

                    <p>{product.price}</p>

                    <div className="krve-wishlist-item-actions">
                      <button
                        type="button"
                        onClick={() =>
                          addWishlistItemToCart(product)
                        }
                      >
                        <ShoppingBag size={15} />
                        Add to Bag
                      </button>

                      <button
                        type="button"
                        aria-label={`Remove ${product.name} from wishlist`}
                        onClick={() =>
                          removeWishlistItem(product.name)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="krve-wishlist-empty">
                <div>
                  <Heart size={32} strokeWidth={1.2} />
                </div>

                <h3>Your Wishlist Is Empty</h3>

                <p>
                  Save the KRVE pieces that speak to your personal
                  style.
                </p>

                <Link
                  href="/collections"
                  onClick={() => setWishlistOpen(false)}
                >
                  Explore Collection
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {wishlistItems.length > 0 && (
            <footer className="krve-wishlist-footer">
              <div>
                <ShieldCheck size={18} strokeWidth={1.3} />

                <span>
                  <strong>Saved Securely</strong>
                  <small>
                    Sign in to sync your wishlist across devices.
                  </small>
                </span>
              </div>

              <Link
                href="/account/login"
                onClick={() => setWishlistOpen(false)}
              >
                Sign In
              </Link>
            </footer>
          )}
        </aside>
      </div>

      {/* KRVE Account Centre */}
      <div
        className={`krve-account-overlay ${
          accountOpen ? "is-open" : ""
        }`}
        aria-hidden={!accountOpen}
      >
        <button
          type="button"
          className="krve-account-backdrop"
          aria-label="Close account centre"
          onClick={() => setAccountOpen(false)}
        />

        <aside className="krve-account-panel">
          <header className="krve-account-panel-header">
            <div>
              <span>KRVE Private Client</span>
              <h2>My Account</h2>
            </div>

            <button
              type="button"
              aria-label="Close account centre"
              onClick={() => setAccountOpen(false)}
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </header>

          <section className="krve-account-profile-card">
            <div className="krve-account-avatar">
              <UserRound size={28} strokeWidth={1.25} />
            </div>

            <div>
              <span>Welcome to KRVE</span>
              <h3>Guest Customer</h3>
              <p>Sign in to access your orders and saved style.</p>
            </div>

            <BadgeCheck
              size={22}
              strokeWidth={1.25}
              className="krve-account-badge"
            />
          </section>

          <div className="krve-account-auth-actions">
            <Link
              href="/account/login"
              onClick={() => setAccountOpen(false)}
            >
              <LogIn size={16} />
              Sign In
            </Link>

            <Link
              href="/account/register"
              onClick={() => setAccountOpen(false)}
            >
              <UserPlus size={16} />
              Create Account
            </Link>
          </div>

          <nav className="krve-account-menu">
            <span className="krve-account-section-label">
              Shopping
            </span>

            <Link
              href="/account/orders"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <PackageCheck size={19} strokeWidth={1.35} />
                <span>
                  <strong>My Orders</strong>
                  <small>Track, return and reorder</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <Heart size={19} strokeWidth={1.35} />
                <span>
                  <strong>Wishlist</strong>
                  <small>Your saved KRVE pieces</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/account/recently-viewed"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <History size={19} strokeWidth={1.35} />
                <span>
                  <strong>Recently Viewed</strong>
                  <small>Continue exploring your selection</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/account/offers"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <TicketPercent size={19} strokeWidth={1.35} />
                <span>
                  <strong>Offers & Vouchers</strong>
                  <small>Private client benefits</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <span className="krve-account-section-label">
              Personal Details
            </span>

            <Link
              href="/account/profile"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <UserRound size={19} strokeWidth={1.35} />
                <span>
                  <strong>Profile Information</strong>
                  <small>Name, email and phone number</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/account/addresses"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <MapPin size={19} strokeWidth={1.35} />
                <span>
                  <strong>Saved Addresses</strong>
                  <small>Delivery and billing addresses</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/account/payments"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <WalletCards size={19} strokeWidth={1.35} />
                <span>
                  <strong>Payment Methods</strong>
                  <small>Cards, UPI and wallet preferences</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/account/notifications"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <Bell size={19} strokeWidth={1.35} />
                <span>
                  <strong>Notifications</strong>
                  <small>Orders, launches and offers</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <span className="krve-account-section-label">
              Support & Security
            </span>

            <Link
              href="/account/settings"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <Settings size={19} strokeWidth={1.35} />
                <span>
                  <strong>Account Settings</strong>
                  <small>Password, privacy and preferences</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>

            <Link
              href="/help"
              onClick={() => setAccountOpen(false)}
            >
              <div>
                <CircleHelp size={19} strokeWidth={1.35} />
                <span>
                  <strong>Help & Support</strong>
                  <small>FAQs and customer assistance</small>
                </span>
              </div>
              <ChevronRight size={16} />
            </Link>
          </nav>

          <footer className="krve-account-footer">
            <div>
              <ShieldCheck size={18} strokeWidth={1.3} />
              <span>
                <strong>Private & Secure</strong>
                <small>Your account information is protected.</small>
              </span>
            </div>

            <button type="button">
              <LogOut size={16} />
              Sign Out
            </button>
          </footer>
        </aside>
      </div>

      {/* KRVE AI Stylist */}
      <div
        className={`krve-ai-overlay ${aiOpen ? "is-open" : ""}`}
        aria-hidden={!aiOpen}
      >
        <button
          type="button"
          className="krve-ai-backdrop"
          aria-label="Close KRVE AI Stylist"
          onClick={closeAi}
        />

        <section className="krve-ai-panel">
          <header className="krve-ai-panel-header">
            <div className="krve-ai-identity">
              <div className="krve-ai-mark">
                <WandSparkles size={24} strokeWidth={1.25} />
              </div>

              <div>
                <span>KRVE Intelligence</span>
                <h2>Personal AI Stylist</h2>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close KRVE AI Stylist"
              onClick={closeAi}
            >
              <X size={20} strokeWidth={1.4} />
            </button>
          </header>

          <div className="krve-ai-intro">
            <span>Private Styling Consultation</span>
            <h3>Style, Curated Around You</h3>
            <p>
              Describe your occasion, preferred colours, fit, or
              budget. KRVE AI will recommend a refined combination
              from the collection.
            </p>
          </div>

          <div className="krve-ai-quick-prompts">
            {[
              "Style me for a wedding",
              "Create a formal office look",
              "Suggest a luxury travel outfit",
              "Build an all-black look",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendAiMessage(prompt)}
              >
                <Sparkles size={13} />
                {prompt}
              </button>
            ))}
          </div>

          <div className="krve-ai-conversation">
            {aiMessages.map((message) => (
              <article
                key={message.id}
                className={`krve-ai-message is-${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="krve-ai-message-icon">
                    <Bot size={16} strokeWidth={1.35} />
                  </div>
                )}

                <div>
                  <span>
                    {message.role === "assistant"
                      ? "KRVE AI"
                      : "You"}
                  </span>
                  <p>{message.text}</p>
                </div>
              </article>
            ))}

            {aiThinking && (
              <article className="krve-ai-message is-assistant">
                <div className="krve-ai-message-icon">
                  <Bot size={16} strokeWidth={1.35} />
                </div>

                <div>
                  <span>KRVE AI</span>
                  <div className="krve-ai-thinking">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </article>
            )}
          </div>

          <form
            className="krve-ai-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendAiMessage();
            }}
          >
            <div>
              <WandSparkles size={18} strokeWidth={1.25} />

              <input
                ref={aiInputRef}
                value={aiInput}
                onChange={(event) =>
                  setAiInput(event.target.value)
                }
                placeholder="Ask KRVE AI about your next look..."
                aria-label="Message KRVE AI Stylist"
              />

              <button
                type="submit"
                disabled={!aiInput.trim() || aiThinking}
                aria-label="Send message"
              >
                <ArrowRight size={17} />
              </button>
            </div>

            <p>
              AI recommendations are based on the current KRVE
              collection.
            </p>
          </form>
        </section>
      </div>

      {/* Floating AI Button */}
      <button
        type="button"
        aria-label="Open KRVE AI"
        className="krve-floating-ai"
        onClick={() => setAiOpen(true)}
      >
        <Bot size={24} strokeWidth={1.4} />
      </button>

      {/* Cart Background Overlay */}
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={() => setCartOpen(false)}
        className={`krve-cart-backdrop ${
          cartOpen ? "is-open" : ""
        }`}
      />

      {/* Luxury Cart Drawer */}
      <aside
        aria-label="Shopping bag"
        aria-hidden={!cartOpen}
        className={`krve-cart-drawer ${
          cartOpen ? "is-open" : ""
        }`}
      >
        {/* Drawer Header */}
        <header className="krve-cart-drawer-header">
          <div>
            <h2>Your Bag</h2>

            <p>
              {cartCount}{" "}
              {cartCount === 1 ? "Item" : "Items"}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close shopping bag"
            onClick={() => setCartOpen(false)}
            className="krve-cart-close"
          >
            <X size={20} strokeWidth={1.35} />
          </button>
        </header>

        {/* Cart Product List */}
        <div className="krve-cart-products">
          {cartItems.length === 0 ? (
            <div className="krve-cart-empty">
              <div>
                <ShoppingBag
                  size={32}
                  strokeWidth={1.25}
                />
              </div>

              <h3>Your Bag Is Empty</h3>

              <p>
                Explore the KRVE collection and select pieces
                designed for your personal style.
              </p>

              <Link
                href="/collections"
                onClick={() => setCartOpen(false)}
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <article
                key={item.id}
                className="krve-cart-line"
              >
                <div className="krve-cart-line-image">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="130px"
                  />
                </div>

                <div className="krve-cart-line-content">
                  <div className="krve-cart-line-heading">
                    <div>
                      <h3>{item.name}</h3>

                      <p>{item.collection}</p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2
                        size={17}
                        strokeWidth={1.35}
                      />
                    </button>
                  </div>

                  <div className="krve-cart-line-controls">
                    <label>
                      <span>Size</span>

                      <div>
                        <select
                          value={item.size}
                          onChange={(event) =>
                            updateSize(
                              item.id,
                              event.target.value
                            )
                          }
                        >
                          {(Array.isArray(item.sizeOptions) &&
                          item.sizeOptions.length > 0
                            ? item.sizeOptions
                            : [item.size || "M"]).map((size) => (
                            <option
                              key={size}
                              value={size}
                            >
                              {size}
                            </option>
                          ))}
                        </select>

                        <ChevronDown size={14} />
                      </div>
                    </label>

                    <div>
                      <span>Quantity</span>

                      <div className="krve-cart-quantity">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="krve-cart-line-footer">
                    <button type="button">
                      <Bookmark
                        size={14}
                        strokeWidth={1.35}
                      />
                      Save for Later
                    </button>

                    <div>
                      {item.quantity > 1 && (
                        <small>
                          ₹{formatPrice(item.price)} ×{" "}
                          {item.quantity}
                        </small>
                      )}

                      <strong>
                        ₹
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
                {/* Cart Summary */}
        {cartItems.length > 0 && (
          <footer className="krve-cart-summary">
            <div className="krve-coupon-box">
              <div className="krve-coupon-title">
                <TicketPercent size={17} strokeWidth={1.35} />

                <div>
                  <span>Apply Coupon</span>
                  <small>Enter your KRVE promotional code</small>
                </div>
              </div>

              <div className="krve-coupon-field">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(
                      event.target.value.toUpperCase()
                    );
                    setCouponMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      applyCoupon();
                    }
                  }}
                  placeholder="ENTER COUPON CODE"
                  aria-label="Coupon code"
                />

                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="is-remove"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyCoupon}
                  >
                    Apply
                  </button>
                )}
              </div>

              {couponMessage && (
                <p
                  className={`krve-coupon-message ${
                    appliedCoupon ? "is-success" : "is-error"
                  }`}
                >
                  {couponMessage}
                </p>
              )}

              <div className="krve-coupon-suggestions">
                <button
                  type="button"
                  onClick={() => {
                    setCouponCode("WELCOME10");
                    setCouponMessage("");
                  }}
                >
                  WELCOME10
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCouponCode("KRVE15");
                    setCouponMessage("");
                  }}
                >
                  KRVE15
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCouponCode("LUXURY2000");
                    setCouponMessage("");
                  }}
                >
                  LUXURY2000
                </button>
              </div>
            </div>

            <div className="krve-cart-summary-rows">
              <div>
                <span>Subtotal</span>

                <strong>
                  ₹{formatPrice(subtotal)}
                </strong>
              </div>

              <div>
                <span>
                  Shipping

                  <small>
                    Free shipping on orders above ₹4,999
                  </small>
                </span>

                <strong>
                  {shipping === 0
                    ? "Complimentary"
                    : `₹${formatPrice(shipping)}`}
                </strong>
              </div>

              {discount > 0 && (
                <div className="krve-cart-discount-row">
                  <span>
                    Discount

                    <small>
                      {appliedCoupon} applied
                    </small>
                  </span>

                  <strong>
                    − ₹{formatPrice(discount)}
                  </strong>
                </div>
              )}

              <div>
                <span>
                  Estimated Tax

                  <small>
                    Calculated at checkout
                  </small>
                </span>

                <strong>
                  ₹{formatPrice(estimatedTax)}
                </strong>
              </div>
            </div>

            <div className="krve-cart-total">
              <span>Total</span>

              <strong>
                ₹{formatPrice(grandTotal)}
              </strong>
            </div>

            <Link
              href="/checkout"
              className="krve-checkout-button"
            >
              Proceed to Checkout

              <ArrowRight size={17} />
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="krve-continue-button"
            >
              Continue Shopping
            </button>

            <div className="krve-cart-security">
              <ShieldCheck
                size={24}
                strokeWidth={1.25}
              />

              <div>
                <p>
                  100% Secure and Encrypted Checkout
                </p>

                <span>
                  Your payment and personal details are
                  protected with bank-level security.
                </span>
              </div>
            </div>
          </footer>
        )}
      </aside>
    </main>
  );
  }
