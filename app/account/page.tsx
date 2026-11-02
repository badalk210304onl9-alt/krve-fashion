"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Bell,
  Check,
  Crown,
  Gift,
  Heart,
  History,
  LogOut,
  MapPin,
  PackageCheck,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TicketPercent,
  UserRound,
} from "lucide-react";

import styles from "./account.module.css";

type AccountUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
    [key: string]: unknown;
  } | null;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  fullName?: string | null;
};

type AccountOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  itemCount: number;
  items: Array<{
    id: string;
    name: string;
    image?: string | null;
    size?: string | null;
    colour?: string | null;
    quantity: number;
    price: number;
  }>;
};

type OrdersApiResponse = {
  success?: boolean;
  message?: string;
  orders?: AccountOrder[];
};

function normalizeAccountUser(raw: any): AccountUser {
  const metadata = raw?.user_metadata ?? raw?.metadata ?? {};

  const firstName =
    raw?.firstName ??
    raw?.first_name ??
    metadata?.first_name ??
    null;

  const lastName =
    raw?.lastName ??
    raw?.last_name ??
    metadata?.last_name ??
    null;

  const fullName =
    raw?.fullName ??
    raw?.full_name ??
    metadata?.full_name ??
    raw?.name ??
    null;

  return {
    ...raw,
    id: String(
      raw?.id ??
      raw?.customerId ??
      raw?.customer_id ??
      ""
    ),
    email:
      raw?.email ??
      raw?.customerEmail ??
      raw?.customer_email ??
      null,
    firstName,
    lastName,
    fullName,
    name: raw?.name ?? fullName ?? null,
    user_metadata: {
      ...metadata,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
    },
  };
}

async function readAuthResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Authentication request failed."
    );
  }

  return data;
}

async function getCurrentAccountUser(): Promise<AccountUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  const data = await readAuthResponse(response);

  const rawUser =
    data?.user ??
    data?.customer ??
    data?.data?.user ??
    data?.data?.customer ??
    null;

  return rawUser ? normalizeAccountUser(rawUser) : null;
}

function formatAccountDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function accountStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "processing":
      return "Processing";
    case "packed":
      return "Packed";
    case "shipped":
      return "Shipped";
    case "out_for_delivery":
      return "Out for delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
    case "canceled":
      return "Cancelled";
    default:
      return "Confirmed";
  }
}

function accountMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const accountLinks = [
  {
    href: "/account/orders",
    icon: PackageCheck,
    eyebrow: "PURCHASES",
    title: "My Orders",
    description: "Track orders, delivery progress and purchase history.",
  },
  {
    href: "/wishlist",
    icon: Heart,
    eyebrow: "SAVED STYLE",
    title: "Wishlist",
    description: "Return to the KRVE pieces you have saved.",
  },
  {
    href: "/account/profile",
    icon: UserRound,
    eyebrow: "IDENTITY",
    title: "Profile",
    description: "Manage your name, email and personal information.",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    eyebrow: "DELIVERY",
    title: "Addresses",
    description: "Manage your delivery and billing destinations.",
  },
  {
    href: "/account/notifications",
    icon: Bell,
    eyebrow: "COMMUNICATION",
    title: "Notifications",
    description: "Control order alerts and account updates.",
  },
  {
    href: "/account/settings",
    icon: Settings,
    eyebrow: "SECURITY",
    title: "Account Settings",
    description: "Manage password, privacy and account preferences.",
  },
];

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<AccountUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [recentOrders, setRecentOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const currentUser = await getCurrentAccountUser();

        if (!mounted) return;

        setUser(currentUser);

        if (currentUser && window.location.search) {
          router.replace("/account");
        }
      } catch (error) {
        console.error("KRVE_ACCOUNT_AUTH_LOAD_ERROR", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoaded(true);
        }
      }
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  useEffect(() => {
    if (!user) {
      setRecentOrders([]);
      setOrdersError("");
      return;
    }

    let active = true;

    async function loadRecentOrders() {
      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await fetch("/api/account/orders", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const data =
          (await response.json()) as OrdersApiResponse;

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
            "Your order history could not be loaded."
          );
        }

        if (active) {
          setRecentOrders(
            Array.isArray(data.orders)
              ? data.orders.slice(0, 3)
              : []
          );
        }
      } catch (error) {
        if (active) {
          setOrdersError(
            error instanceof Error
              ? error.message
              : "Your order history could not be loaded."
          );
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    }

    void loadRecentOrders();

    return () => {
      active = false;
    };
  }, [user]);

  // SEND OTP
  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const phone = mobile.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          mobile: phone,
          countryCode: "+91",
        }),
      });

      await readAuthResponse(response);

      setMobile(phone);
      setOtpSent(true);
      setMessage("OTP sent successfully. Please check your mobile.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send OTP."
      );
    } finally {
      setBusy(false);
    }
  }

  // VERIFY OTP
  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter the 6-digit OTP.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          mobile,
          countryCode: "+91",
          otp,
        }),
      });

      await readAuthResponse(response);

      const currentUser = await getCurrentAccountUser();

      if (!currentUser) {
        throw new Error(
          "OTP verified, but the KRVE login session was not created."
        );
      }

      setUser(currentUser);
      setOtp("");
      setMessage("");

      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "OTP verification failed."
      );
    } finally {
      setBusy(false);
    }
  }

  function changeMobile() {
    setOtpSent(false);
    setOtp("");
    setMessage("");
  }

  // SIGN OUT
  async function signOut() {
    setBusy(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      await readAuthResponse(response);

      setUser(null);
      setRecentOrders([]);

      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign out."
      );
    } finally {
      setBusy(false);
    }
  }

  if (!authLoaded) {
    return (
      <main className={styles.loading}>
        <div className={styles.loadingLogo}>
          K<small>rv</small>E
        </div>
        <span>PRIVATE CLIENT</span>
      </main>
    );
  }

  // SIGNED-IN ACCOUNT DASHBOARD
  if (user) {
    const firstName =
      user.user_metadata?.first_name?.trim() || "";

    const lastName =
      user.user_metadata?.last_name?.trim() || "";

    const fullName =
      user.user_metadata?.full_name?.trim() || "";

    const customerName =
      fullName ||
      `${firstName} ${lastName}`.trim() ||
      user.email?.split("@")[0] ||
      "KRVE Client";

    const welcomeName =
      firstName ||
      customerName.split(" ")[0] ||
      "Client";

    return (
      <main className={styles.page}>
        <div className={styles.backgroundGlow} />

        <section className={styles.shell}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.eyebrow}>
                <Crown size={13} />
                KRVE PRIVATE CLIENT
              </div>

              <h1>
                Welcome back,
                <span>{welcomeName}.</span>
              </h1>

              <p>
                Your private space for purchases, saved pieces,
                delivery details and personalised KRVE experiences.
              </p>

              <div className={styles.profileStrip}>
                <div className={styles.avatar}>
                  {customerName.charAt(0).toUpperCase()}
                </div>

                <div className={styles.profileInfo}>
                  <small>MEMBER PROFILE</small>
                  <strong>{customerName}</strong>
                  <span>{user.email || "KRVE Member"}</span>
                </div>

                <ShieldCheck size={21} />
              </div>
            </div>

            <div className={styles.heroArt}>
              <div className={styles.monogramOuter}>
                <div className={styles.monogramInner}>K</div>
              </div>
              <span>KRVE PRIVATE CLIENT</span>
            </div>
          </section>

          <section className={styles.quickGrid}>
            <Link href="/account/orders">
              <PackageCheck size={19} />
              <div>
                <small>ORDERS</small>
                <strong>My Purchases</strong>
              </div>
              <ArrowRight size={15} />
            </Link>

            <Link href="/wishlist">
              <Heart size={19} />
              <div>
                <small>WISHLIST</small>
                <strong>Saved Pieces</strong>
              </div>
              <ArrowRight size={15} />
            </Link>

            <Link href="/ai-stylist">
              <Sparkles size={19} />
              <div>
                <small>KRVE AI</small>
                <strong>Personal Styling</strong>
              </div>
              <ArrowRight size={15} />
            </Link>

            <Link href="/account/offers">
              <Gift size={19} />
              <div>
                <small>PRIVILEGES</small>
                <strong>Private Benefits</strong>
              </div>
              <ArrowRight size={15} />
            </Link>
          </section>

          <section className={styles.accountSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span>YOUR PRIVATE SPACE</span>
                <h2>Account Centre</h2>
              </div>
              <p>
                Manage everything connected to your KRVE profile.
              </p>
            </div>

            <div className={styles.accountGrid}>
              {accountLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={styles.accountCard}
                  >
                    <div className={styles.accountCardIcon}>
                      <Icon size={20} strokeWidth={1.35} />
                    </div>

                    <small>{item.eyebrow}</small>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <div className={styles.cardArrow}>
                      <ArrowRight size={15} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={styles.accountSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span>PURCHASE HISTORY</span>
                <h2>Recent Orders</h2>
              </div>

              <Link
                href="/account/orders"
                style={{
                  color: "#d8a529",
                  fontSize: "10px",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                VIEW ALL →
              </Link>
            </div>

            {ordersLoading ? (
              <div className={styles.accountCard}>
                <PackageCheck size={20} />
                <h3>Loading your purchases...</h3>
              </div>
            ) : ordersError ? (
              <div className={styles.accountCard}>
                <ShieldCheck size={20} />
                <h3>Orders are temporarily unavailable.</h3>
                <p>{ordersError}</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className={styles.accountCard}>
                <ShoppingBag size={20} />
                <h3>No orders yet.</h3>
                <p>
                  Your KRVE purchases will appear here after checkout.
                </p>
              </div>
            ) : (
              <div className={styles.accountGrid}>
                {recentOrders.map((order) => {
                  const firstItem = order.items?.[0];

                  return (
                    <Link
                      href={`/account/orders/${encodeURIComponent(order.id)}`}
                      key={order.id}
                      className={styles.accountCard}
                    >
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name}
                          style={{
                            width: 58,
                            height: 72,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <PackageCheck size={20} />
                      )}

                      <small>{order.orderNumber}</small>

                      <h3>
                        {firstItem?.name ||
                          `${order.itemCount} KRVE items`}
                      </h3>

                      <p>
                        {accountStatusLabel(order.status)}
                        {" · "}
                        {formatAccountDate(order.createdAt)}
                        {" · "}
                        {accountMoney(order.total, order.currency)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.experience}>
            <div className={styles.experienceIntro}>
              <div className={styles.experienceEyebrow}>
                <Sparkles size={14} />
                KRVE PRIVATE EXPERIENCE
              </div>

              <h2>
                Fashion,
                <span>curated around you.</span>
              </h2>

              <p>
                Your profile connects shopping, AI styling,
                saved pieces and future KRVE services.
              </p>

              <Link href="/ai-stylist">
                EXPLORE AI STYLIST
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.benefits}>
              <article>
                <Sparkles size={17} />
                <div>
                  <strong>Personalised Recommendations</strong>
                  <span>Styling suggestions shaped around your profile.</span>
                </div>
              </article>

              <article>
                <TicketPercent size={17} />
                <div>
                  <strong>Private Client Offers</strong>
                  <span>Selected launches, benefits and promotions.</span>
                </div>
              </article>

              <article>
                <History size={17} />
                <div>
                  <strong>Connected Shopping History</strong>
                  <span>Keep your purchases connected to one account.</span>
                </div>
              </article>

              <article>
                <ShieldCheck size={17} />
                <div>
                  <strong>Secure Account</strong>
                  <span>Protected authentication powered by KRVE Central.</span>
                </div>
              </article>
            </div>
          </section>

          <section className={styles.accountFooter}>
            <div>
              <ShieldCheck size={19} />
              <div>
                <small>SECURE ACCOUNT</small>
                <strong>Your KRVE session is protected.</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={signOut}
              disabled={busy}
            >
              <LogOut size={15} />
              {busy ? "SIGNING OUT..." : "SIGN OUT"}
            </button>
          </section>
        </section>
      </main>
    );
  }

  // MOBILE OTP LOGIN PAGE
  return (
    <main className={styles.otpPage}>
      <section className={styles.otpShell}>
        <div className={styles.otpVisual}>
          <div className={styles.otpBrand}>
            <strong>KRVE</strong>
            <span>THE FASHION STUDIO</span>
          </div>

          <div className={styles.otpWelcome}>
            <h1>
              Welcome
              <em>Back</em>
            </h1>

            <p>
              CONTINUE YOUR
              <br />
              FASHION JOURNEY
            </p>

            <div className={styles.otpGoldLine} />
          </div>

          <div className={styles.otpVisualBottom}>
            <span>MORE THAN FASHION. IT’S KRVE.</span>
          </div>
        </div>

        <div className={styles.otpRight}>
          <div className={styles.otpTopline}>
            MORE THAN FASHION. IT’S KRVE.
          </div>

          <section className={styles.otpCard}>
            <div className={styles.otpStar}>✧</div>

            <h2>
              {otpSent ? "VERIFY OTP" : "LOGIN TO KRVE"}
            </h2>

            <p>
              {otpSent
                ? `Enter the OTP sent to +91 ${mobile}`
                : "Enter your mobile number to receive OTP"}
            </p>

            <form
              onSubmit={otpSent ? verifyOtp : sendOtp}
              className={styles.otpForm}
            >
              {!otpSent ? (
                <div className={styles.otpInput}>
                  <span className={styles.otpPhone}>☎</span>
                  <span className={styles.countryCode}>+91</span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="Enter Mobile Number"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    required
                  />
                </div>
              ) : (
                <div className={styles.otpInput}>
                  <span className={styles.otpPhone}>✧</span>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    required
                  />
                </div>
              )}

              {message && (
                <div className={styles.otpMessage}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className={styles.otpSubmit}
                disabled={busy}
              >
                {busy
                  ? "PLEASE WAIT..."
                  : otpSent
                    ? "VERIFY & LOGIN"
                    : "SEND OTP"}

                {!busy && <ArrowRight size={20} />}
              </button>
            </form>

            {otpSent && (
              <button
                type="button"
                className={styles.otpBack}
                onClick={changeMobile}
              >
                CHANGE MOBILE NUMBER
              </button>
            )}

            <div className={styles.otpDivider}>
              <span />
              OR
              <span />
            </div>

            <div className={styles.otpTerms}>
              By continuing, you agree to KRVE’s{" "}
              <Link href="/terms">Terms &amp; Conditions</Link>
              {" "}and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </div>
          </section>

          <div className={styles.otpRightBottom}>
            STEP INTO A MORE STYLISH YOU
          </div>
        </div>
      </section>

      <div className={styles.otpBenefits}>
        <div>
          <span>◇</span>
          <p>Premium Quality<br />Fashion</p>
        </div>

        <div>
          <span>♢</span>
          <p>Secure &amp; Safe<br />Shopping</p>
        </div>

        <div>
          <span>♧</span>
          <p>Dedicated<br />Support</p>
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.loading}>
          KRVE
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
