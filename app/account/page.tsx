"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

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
  Eye,
  EyeOff,
  Gift,
  Heart,
  History,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Settings,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  UserRound,
} from "lucide-react";

import styles from "./account.module.css";

type Mode =
  | "login"
  | "register"
  | "forgot";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const accountLinks = [
  {
    href: "/account/orders",
    icon: PackageCheck,
    eyebrow: "PURCHASES",
    title: "My Orders",
    description:
      "Track orders, delivery progress and purchase history.",
  },
  {
    href: "/wishlist",
    icon: Heart,
    eyebrow: "SAVED STYLE",
    title: "Wishlist",
    description:
      "Return to the KRVE pieces you have saved.",
  },
  {
    href: "/account/profile",
    icon: UserRound,
    eyebrow: "IDENTITY",
    title: "Profile",
    description:
      "Manage your name, email and personal information.",
  },
  {
    href: "/account/addresses",
    icon: MapPin,
    eyebrow: "DELIVERY",
    title: "Addresses",
    description:
      "Manage your delivery and billing destinations.",
  },
  {
    href: "/account/notifications",
    icon: Bell,
    eyebrow: "COMMUNICATION",
    title: "Notifications",
    description:
      "Control order alerts, launches and account updates.",
  },
  {
    href: "/account/settings",
    icon: Settings,
    eyebrow: "SECURITY",
    title: "Account Settings",
    description:
      "Manage password, privacy and account preferences.",
  },
];

function normalizeAccountUser(raw: any): AccountUser {
  const metadata = raw?.user_metadata ?? raw?.metadata ?? {};
  const firstName = raw?.firstName ?? raw?.first_name ?? metadata?.first_name ?? null;
  const lastName = raw?.lastName ?? raw?.last_name ?? metadata?.last_name ?? null;
  const fullName = raw?.fullName ?? raw?.full_name ?? metadata?.full_name ?? raw?.name ?? null;

  return {
    ...raw,
    id: String(raw?.id ?? raw?.customerId ?? raw?.customer_id ?? ""),
    email: raw?.email ?? raw?.customerEmail ?? raw?.customer_email ?? null,
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
      data?.message || data?.error || "Authentication request failed.",
    );
  }

  return data;
}

async function getCurrentAccountUser(): Promise<AccountUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
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

function AccountContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const [
    mode,
    setMode,
  ] =
    useState<Mode>(
      "login",
    );

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      initialForm,
    );

  const [
    user,
    setUser,
  ] =
    useState<AccountUser | null>(
      null,
    );

  const [
    authLoaded,
    setAuthLoaded,
  ] =
    useState(false);

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    recentOrders,
    setRecentOrders,
  ] =
    useState<AccountOrder[]>([]);

  const [
    ordersLoading,
    setOrdersLoading,
  ] =
    useState(false);

  const [
    ordersError,
    setOrdersError,
  ] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        let data: any = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!mounted) {
          return;
        }

        if (!response.ok) {
          setUser(null);
          return;
        }

        const rawUser =
          data?.user ??
          data?.customer ??
          data?.data?.user ??
          data?.data?.customer ??
          null;

        if (!rawUser) {
          setUser(null);
          return;
        }

        setUser(normalizeAccountUser(rawUser));

        if (window.location.search) {
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
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        let data: OrdersApiResponse | null = null;

        try {
          data = (await response.json()) as OrdersApiResponse;
        } catch {
          data = null;
        }

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              "Your order history could not be loaded.",
          );
        }

        if (active) {
          setRecentOrders(
            Array.isArray(data.orders)
              ? data.orders.slice(0, 3)
              : [],
          );
        }
      } catch (error) {
        if (active) {
          setOrdersError(
            error instanceof Error
              ? error.message
              : "Your order history could not be loaded.",
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

  function updateField(
    field:
      keyof FormState,
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [field]:
          value,
      }),
    );

    setMessage("");
  }

  function changeMode(
    nextMode:
      Mode,
  ) {
    setMode(
      nextMode,
    );

    setMessage("");

    setForm(
      (
        current,
      ) => ({
        ...current,
        password: "",
        confirmPassword:
          "",
      }),
    );
  }

  async function login(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");

    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) {
      setMessage("Please enter your email address and password.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password: form.password }),
      });

      await readAuthResponse(response);
      const currentUser = await getCurrentAccountUser();

      if (!currentUser) {
        throw new Error(
          "Login succeeded, but the KRVE session could not be created. Please try again.",
        );
      }

      setUser(currentUser);
      setForm(initialForm);
      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function register(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();

    if (!firstName || !lastName) {
      setMessage("Please enter your first and last name.");
      return;
    }
    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await readAuthResponse(response);
      const rawUser =
        data?.user ??
        data?.customer ??
        data?.data?.user ??
        data?.data?.customer ??
        null;
      const currentUser = rawUser
        ? normalizeAccountUser(rawUser)
        : await getCurrentAccountUser();

      if (currentUser) {
        setUser(currentUser);
        setForm(initialForm);
        router.replace("/account");
        router.refresh();
        return;
      }

      setMode("login");
      setForm((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));
      setMessage(
        data?.message ||
          "Account created successfully. Please sign in to continue.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function forgotPassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage(
      "Password recovery will be connected after the KRVE Central reset-password endpoint is added.",
    );
  }

  async function googleLogin() {
    setMessage(
      "Google sign-in is not enabled in the current KRVE Central authentication API yet. Please use email and password.",
    );
  }

  async function signOut() {
    setBusy(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      await readAuthResponse(response);
      setUser(null);
      setRecentOrders([]);
      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (
    !authLoaded
  ) {
    return (
      <main
        className={
          styles.loading
        }
      >
        <div
          className={
            styles.loadingLogo
          }
        >
          K
          <small>
            rv
          </small>
          E
        </div>

        <span>
          PRIVATE CLIENT
        </span>
      </main>
    );
  }

  /*
    =====================================================
    SIGNED-IN ACCOUNT
    =====================================================
  */

  if (user) {
    const firstName =
      (
        user.user_metadata
          ?.first_name as
          | string
          | undefined
      )?.trim();

    const lastName =
      (
        user.user_metadata
          ?.last_name as
          | string
          | undefined
      )?.trim();

    const fullName =
      (
        user.user_metadata
          ?.full_name as
          | string
          | undefined
      )?.trim();

    const customerName =
      fullName ||
      `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
      user.email?.split(
        "@",
      )[0] ||
      "KRVE Client";

    const welcomeName =
      firstName ||
      customerName.split(
        " ",
      )[0] ||
      "Client";

    const initial =
      customerName
        .charAt(0)
        .toUpperCase();

    return (
      <main
        className={
          styles.page
        }
      >
        <div
          className={
            styles.backgroundGlow
          }
        />

        <section
          className={
            styles.shell
          }
        >
          {/* HERO */}

          <section
            className={
              styles.hero
            }
          >
            <div
              className={
                styles.heroContent
              }
            >
              <div
                className={
                  styles.eyebrow
                }
              >
                <Crown
                  size={13}
                />

                KRVE PRIVATE
                CLIENT
              </div>

              <h1>
                Welcome back,
                <span>
                  {welcomeName}.
                </span>
              </h1>

              <p>
                Your private space
                for purchases,
                saved pieces,
                delivery details
                and personalised
                KRVE experiences.
              </p>

              <div
                className={
                  styles.profileStrip
                }
              >
                <div
                  className={
                    styles.avatar
                  }
                >
                  {initial}
                </div>

                <div
                  className={
                    styles.profileInfo
                  }
                >
                  <small>
                    MEMBER PROFILE
                  </small>

                  <strong>
                    {customerName}
                  </strong>

                  <span>
                    {user.email}
                  </span>
                </div>

                <ShieldCheck
                  size={21}
                />
              </div>
            </div>

            <div
              className={
                styles.heroArt
              }
            >
              <div
                className={
                  styles.monogramOuter
                }
              >
                <div
                  className={
                    styles.monogramInner
                  }
                >
                  K
                </div>
              </div>

              <span>
                KRVE PRIVATE CLIENT
              </span>
            </div>
          </section>

          {/* QUICK LINKS */}

          <section
            className={
              styles.quickGrid
            }
          >
            <Link
              href="/account/orders"
            >
              <PackageCheck
                size={19}
              />

              <div>
                <small>
                  ORDERS
                </small>

                <strong>
                  My Purchases
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>

            <Link href="/wishlist">
              <Heart
                size={19}
              />

              <div>
                <small>
                  WISHLIST
                </small>

                <strong>
                  Saved Pieces
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>

            <Link
              href="/ai-stylist"
            >
              <Sparkles
                size={19}
              />

              <div>
                <small>
                  KRVE AI
                </small>

                <strong>
                  Personal Styling
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>

            <Link
              href="/account/offers"
            >
              <Gift
                size={19}
              />

              <div>
                <small>
                  PRIVILEGES
                </small>

                <strong>
                  Private Benefits
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>
          </section>

          {/* ACCOUNT CENTRE */}

          <section
            className={
              styles.accountSection
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <span>
                  YOUR PRIVATE SPACE
                </span>

                <h2>
                  Account Centre
                </h2>
              </div>

              <p>
                Manage everything
                connected to your
                KRVE profile.
              </p>
            </div>

            <div
              className={
                styles.accountGrid
              }
            >
              {accountLinks.map(
                (
                  item,
                ) => {
                  const Icon =
                    item.icon;

                  return (
                    <Link
                      href={
                        item.href
                      }
                      key={
                        item.href
                      }
                      className={
                        styles.accountCard
                      }
                    >
                      <div
                        className={
                          styles.accountCardIcon
                        }
                      >
                        <Icon
                          size={20}
                          strokeWidth={
                            1.35
                          }
                        />
                      </div>

                      <small>
                        {
                          item.eyebrow
                        }
                      </small>

                      <h3>
                        {
                          item.title
                        }
                      </h3>

                      <p>
                        {
                          item.description
                        }
                      </p>

                      <div
                        className={
                          styles.cardArrow
                        }
                      >
                        <ArrowRight
                          size={15}
                        />
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </section>

          {/* RECENT ORDERS */}

          <section
            className={
              styles.accountSection
            }
          >
            <div
              className={
                styles.sectionHeader
              }
            >
              <div>
                <span>
                  PURCHASE HISTORY
                </span>

                <h2>
                  Recent Orders
                </h2>
              </div>

              <Link
                href="/account/orders"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "#d8a529",
                  fontSize: "8px",
                  fontWeight: 800,
                  letterSpacing: ".12em",
                  textDecoration: "none",
                }}
              >
                VIEW ALL
                <ArrowRight size={14} />
              </Link>
            </div>

            {ordersLoading ? (
              <div
                className={styles.accountCard}
                style={{ cursor: "default" }}
              >
                <PackageCheck size={20} />
                <div>
                  <small>
                    KRVE ORDERS
                  </small>
                  <h3>
                    Loading your purchases...
                  </h3>
                </div>
              </div>
            ) : ordersError ? (
              <div
                className={styles.accountCard}
                style={{ cursor: "default" }}
              >
                <ShieldCheck size={20} />
                <div>
                  <small>
                    ORDER HISTORY
                  </small>
                  <h3>
                    Orders are temporarily unavailable.
                  </h3>
                  <p>{ordersError}</p>
                </div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div
                className={styles.accountCard}
                style={{ cursor: "default" }}
              >
                <ShoppingBag size={20} />
                <div>
                  <small>
                    PURCHASE HISTORY
                  </small>
                  <h3>
                    No orders yet.
                  </h3>
                  <p>
                    Your KRVE purchases will appear here after checkout.
                  </p>
                </div>
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
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          className={styles.accountCardIcon}
                        >
                          <PackageCheck size={20} strokeWidth={1.35} />
                        </div>
                      )}

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <small>
                          {order.orderNumber}
                        </small>

                        <h3>
                          {firstItem?.name ||
                            `${order.itemCount} KRVE item${order.itemCount === 1 ? "" : "s"}`}
                        </h3>

                        <p>
                          {accountStatusLabel(order.status)}
                          {" • "}
                          {formatAccountDate(order.createdAt)}
                          {" • "}
                          {accountMoney(order.total, order.currency)}
                        </p>
                      </div>

                      <ArrowRight size={15} />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* EXPERIENCE */}

          <section
            className={
              styles.experience
            }
          >
            <div
              className={
                styles.experienceIntro
              }
            >
              <div
                className={
                  styles.experienceEyebrow
                }
              >
                <Sparkles
                  size={14}
                />

                KRVE PRIVATE
                EXPERIENCE
              </div>

              <h2>
                Fashion,
                <span>
                  curated around
                  you.
                </span>
              </h2>

              <p>
                Your profile connects
                shopping, AI styling,
                saved pieces and
                future KRVE services
                into one experience.
              </p>

              <Link
                href="/ai-stylist"
              >
                EXPLORE AI STYLIST

                <ArrowRight
                  size={14}
                />
              </Link>
            </div>

            <div
              className={
                styles.benefits
              }
            >
              <article>
                <Sparkles
                  size={17}
                />

                <div>
                  <strong>
                    Personalised
                    Recommendations
                  </strong>

                  <span>
                    Styling suggestions
                    shaped around your
                    profile.
                  </span>
                </div>
              </article>

              <article>
                <TicketPercent
                  size={17}
                />

                <div>
                  <strong>
                    Private Client
                    Offers
                  </strong>

                  <span>
                    Selected launches,
                    benefits and
                    promotions.
                  </span>
                </div>
              </article>

              <article>
                <History
                  size={17}
                />

                <div>
                  <strong>
                    Connected Shopping
                    History
                  </strong>

                  <span>
                    Keep your purchases
                    connected to one
                    account.
                  </span>
                </div>
              </article>

              <article>
                <ShieldCheck
                  size={17}
                />

                <div>
                  <strong>
                    Secure Account
                  </strong>

                  <span>
                    Protected
                    authentication
                    powered by
                    KRVE Central.
                  </span>
                </div>
              </article>
            </div>
          </section>

          {/* FOOTER ACTION */}

          <section
            className={
              styles.accountFooter
            }
          >
            <div>
              <ShieldCheck
                size={19}
              />

              <div>
                <small>
                  SECURE ACCOUNT
                </small>

                <strong>
                  Your KRVE session
                  is protected.
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={
                signOut
              }
              disabled={
                busy
              }
            >
              <LogOut
                size={15}
              />

              {busy
                ? "SIGNING OUT..."
                : "SIGN OUT"}
            </button>
          </section>
        </section>
      </main>
    );
  }

  /*
    =====================================================
    LOGIN / REGISTER / FORGOT
    =====================================================
  */

  return (
    <main
      className={
        styles.authPage
      }
    >
      <section
        className={
          styles.authShell
        }
      >
        <aside
          className={
            styles.authStory
          }
        >
          <div
            className={
              styles.storyBrand
            }
          >
            <strong>
              K
              <small>
                rv
              </small>
              E
            </strong>

            <span>
              THE FASHION STUDIO
            </span>
          </div>

          <div
            className={
              styles.storyCopy
            }
          >
            <small>
              KRVE PRIVATE ACCESS
            </small>

            <h2>
              Your wardrobe.
              <span>
                Your world.
              </span>
            </h2>

            <p>
              Create one private
              account for purchases,
              saved pieces,
              personalised styling
              and delivery details.
            </p>
          </div>

          <div
            className={
              styles.storySecurity
            }
          >
            <ShieldCheck
              size={16}
            />

            Secure private client
            access
          </div>
        </aside>

        <section
          className={
            styles.authCard
          }
        >
          <div
            className={
              styles.authHeading
            }
          >
            <span>
              {mode ===
              "register"
                ? "PRIVATE CLIENT ONBOARDING"
                : mode ===
                    "forgot"
                  ? "ACCOUNT RECOVERY"
                  : "MEMBER ACCOUNT"}
            </span>

            <h1>
              {mode ===
              "register"
                ? "Create your KRVE account"
                : mode ===
                    "forgot"
                  ? "Reset your password"
                  : "Sign in to KRVE Fashion"}
            </h1>

            <p>
              {mode ===
              "register"
                ? "Join KRVE and keep your fashion experience connected."
                : mode ===
                    "forgot"
                  ? "Enter your email and we will send a secure reset link."
                  : "Welcome back. Sign in to continue."}
            </p>
          </div>

          {mode !==
            "forgot" && (
            <>
              <button
                type="button"
                className={
                  styles.googleButton
                }
                onClick={
                  googleLogin
                }
                disabled={
                  busy
                }
              >
                <span>
                  G
                </span>

                CONTINUE WITH
                GOOGLE
              </button>

              <div
                className={
                  styles.divider
                }
              >
                <i />

                <span>
                  OR
                </span>

                <i />
              </div>
            </>
          )}

          <form
            className={
              styles.authForm
            }
            onSubmit={
              mode ===
              "register"
                ? register
                : mode ===
                    "forgot"
                  ? forgotPassword
                  : login
            }
          >
            {mode ===
              "register" && (
              <div
                className={
                  styles.twoFields
                }
              >
                <label>
                  <span>
                    FIRST NAME
                  </span>

                  <div
                    className={
                      styles.field
                    }
                  >
                    <UserRound
                      size={16}
                    />

                    <input
                      value={
                        form.firstName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "firstName",
                          event.target
                            .value,
                        )
                      }
                      placeholder="First name"
                    />
                  </div>
                </label>

                <label>
                  <span>
                    LAST NAME
                  </span>

                  <div
                    className={
                      styles.field
                    }
                  >
                    <UserRound
                      size={16}
                    />

                    <input
                      value={
                        form.lastName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "lastName",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Last name"
                    />
                  </div>
                </label>
              </div>
            )}

            <label>
              <span>
                EMAIL ADDRESS
              </span>

              <div
                className={
                  styles.field
                }
              >
                <Mail
                  size={16}
                />

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "email",
                      event.target
                        .value,
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            {mode !==
              "forgot" && (
              <label>
                <span>
                  PASSWORD
                </span>

                <div
                  className={
                    styles.field
                  }
                >
                  <LockKeyhole
                    size={16}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.password
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "password",
                        event.target
                          .value,
                      )
                    }
                    placeholder={
                      mode ===
                      "register"
                        ? "Minimum 8 characters"
                        : "Your password"
                    }
                  />

                  <button
                    type="button"
                    className={
                      styles.eyeButton
                    }
                    onClick={() =>
                      setShowPassword(
                        (
                          value,
                        ) =>
                          !value,
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={15}
                      />
                    ) : (
                      <Eye
                        size={15}
                      />
                    )}
                  </button>
                </div>
              </label>
            )}

            {mode ===
              "register" && (
              <label>
                <span>
                  CONFIRM PASSWORD
                </span>

                <div
                  className={
                    styles.field
                  }
                >
                  <LockKeyhole
                    size={16}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.confirmPassword
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "confirmPassword",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Repeat password"
                  />
                </div>
              </label>
            )}

            {mode ===
              "login" && (
              <button
                type="button"
                className={
                  styles.forgotButton
                }
                onClick={() =>
                  changeMode(
                    "forgot",
                  )
                }
              >
                Forgot password?
              </button>
            )}

            {message && (
              <div
                className={
                  styles.authMessage
                }
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className={
                styles.submitButton
              }
              disabled={
                busy
              }
            >
              {busy
                ? "PLEASE WAIT..."
                : mode ===
                    "register"
                  ? "CREATE ACCOUNT"
                  : mode ===
                      "forgot"
                    ? "SEND RESET LINK"
                    : "CONTINUE"}

              {!busy && (
                <ArrowRight
                  size={15}
                />
              )}
            </button>
          </form>

          <div
            className={
              styles.authSwitch
            }
          >
            {mode ===
            "login" ? (
              <>
                <span>
                  Don&apos;t have an
                  account?
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      "register",
                    )
                  }
                >
                  SIGN UP
                </button>
              </>
            ) : (
              <>
                <span>
                  {mode ===
                  "register"
                    ? "Already a private client?"
                    : "Remembered your password?"}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    changeMode(
                      "login",
                    )
                  }
                >
                  SIGN IN
                </button>
              </>
            )}
          </div>

          <div
            className={
              styles.authSecurity
            }
          >
            <Check
              size={13}
            />

            SECURE KRVE ACCOUNT
          </div>
        </section>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main
          className={
            styles.loading
          }
        >
          KRVE
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
