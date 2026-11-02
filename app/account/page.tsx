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
  ShieldCheck,
  ShoppingBag,
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

  if (!response.ok) {
    return null;
  }

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    return null;
  }

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

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const mobile = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMessage("Please enter a valid 10-digit Indian mobile number.");
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
        body: JSON.stringify({ phone: mobile }),
        cache: "no-store",
      });

      const data = await readAuthResponse(response);
      if (data?.success !== true) {
        throw new Error(data?.message || "Unable to send OTP. Please try again.");
      }

      setOtpSent(true);
      setMessage("OTP sent. Please check your mobile phone.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      setBusy(false);
    }
  }

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
        body: JSON.stringify({ phone: `+91${phone}`, code: otp }),
        cache: "no-store",
      });

      const data = await readAuthResponse(response);
      const rawUser =
        data?.data?.customer ??
        data?.customer ??
        data?.data?.user ??
        data?.user ??
        null;

      if (!data?.success || !rawUser) {
        throw new Error(data?.message || "OTP verification failed. Please try again.");
      }

      const currentUser = normalizeAccountUser(rawUser);
      setUser(currentUser);
      setMessage("Mobile number verified successfully.");
      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify OTP.");
    } finally {
      setBusy(false);
    }
  }

  async function resendOtp() {
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone }),
        cache: "no-store",
      });
      const data = await readAuthResponse(response);
      if (data?.success !== true) {
        throw new Error(data?.message || "Unable to resend OTP.");
      }
      setMessage("A new OTP has been sent.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend OTP.");
    } finally {
      setBusy(false);
    }
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
                  PURCHASES
                </small>

                <strong>
                  My Orders
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>

            <Link
              href="/wishlist"
            >
              <Heart
                size={19}
              />

              <div>
                <small>
                  SAVED STYLE
                </small>

                <strong>
                  Wishlist
                </strong>
              </div>

              <ArrowRight
                size={15}
              />
            </Link>

            <Link
              href="/account/profile"
            >
              <UserRound
                size={19}
              />

              <div>
                <small>
                  IDENTITY
                </small>

                <strong>
                  Profile
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
              styles.section
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <div>
                <span>
                  YOUR KRVE
                  SPACE
                </span>

                <h2>
                  Account centre
                </h2>
              </div>

              <p>
                Everything you need,
                in one place.
              </p>
            </div>

            <div
              className={
                styles.accountGrid
              }
            >
              {accountLinks.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <Link
                      href={
                        item.href
                      }
                      className={
                        styles.accountCard
                      }
                      key={
                        item.href
                      }
                    >
                      <div
                        className={
                          styles.accountCardIcon
                        }
                      >
                        <Icon
                          size={19}
                        />
                      </div>

                      <span>
                        {
                          item.eyebrow
                        }
                      </span>

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

                      <ArrowRight
                        size={15}
                      />
                    </Link>
                  );
                },
              )}
            </div>
          </section>

          {/* RECENT ORDERS */}

          <section
            className={
              styles.section
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <div>
                <span>
                  PURCHASE HISTORY
                </span>

                <h2>
                  Recent orders
                </h2>
              </div>

              <Link
                href="/account/orders"
                className={
                  styles.viewAll
                }
              >
                VIEW ALL
                <ArrowRight
                  size={14}
                />
              </Link>
            </div>

            {ordersLoading ? (
              <div
                className={
                  styles.emptyState
                }
              >
                Loading your orders...
              </div>
            ) : ordersError ? (
              <div
                className={
                  styles.emptyState
                }
              >
                {ordersError}
              </div>
            ) : recentOrders.length ===
              0 ? (
              <div
                className={
                  styles.emptyState
                }
              >
                <ShoppingBag
                  size={25}
                />

                <strong>
                  Your KRVE journey
                  starts here.
                </strong>

                <p>
                  Your recent purchases
                  will appear here.
                </p>

                <Link
                  href="/collections"
                >
                  EXPLORE COLLECTIONS
                  <ArrowRight
                    size={14}
                  />
                </Link>
              </div>
            ) : (
              <div
                className={
                  styles.ordersList
                }
              >
                {recentOrders.map(
                  (order) => (
                    <Link
                      href={`/account/orders/${order.id}`}
                      className={
                        styles.orderRow
                      }
                      key={
                        order.id
                      }
                    >
                      <div
                        className={
                          styles.orderIcon
                        }
                      >
                        <PackageCheck
                          size={20}
                        />
                      </div>

                      <div
                        className={
                          styles.orderInfo
                        }
                      >
                        <strong>
                          {order.orderNumber}
                        </strong>

                        <span>
                          {formatAccountDate(
                            order.createdAt,
                          )}
                          {" · "}
                          {order.itemCount}{" "}
                          {order.itemCount ===
                          1
                            ? "item"
                            : "items"}
                        </span>
                      </div>

                      <div
                        className={
                          styles.orderTotal
                        }
                      >
                        <strong>
                          {accountMoney(
                            order.total,
                            order.currency,
                          )}
                        </strong>

                        <span>
                          {accountStatusLabel(
                            order.status,
                          )}
                        </span>
                      </div>

                      <ArrowRight
                        size={15}
                      />
                    </Link>
                  ),
                )}
              </div>
            )}
          </section>

          {/* PERSONAL STYLE */}

          <section
            className={
              styles.styleBanner
            }
          >
            <div>
              <span>
                THE KRVE EXPERIENCE
              </span>

              <h2>
                Your style.
                <em>
                  Your signature.
                </em>
              </h2>

              <p>
                Discover a more
                personal way to
                explore fashion with
                KRVE.
              </p>

              <Link
                href="/virtual-try-on"
              >
                EXPLORE YOUR STYLE
                <ArrowRight
                  size={15}
                />
              </Link>
            </div>

            <div
              className={
                styles.styleBannerIcon
              }
            >
              <Sparkles
                size={48}
              />
            </div>
          </section>

          {/* ACCOUNT FOOTER */}

          <section
            className={
              styles.accountFooter
            }
          >
            <div>
              <ShieldCheck
                size={18}
              />

              <span>
                SECURE ACCOUNT
                <strong>
                  Your KRVE session
                  is protected.
                </strong>
              </span>
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
          <div className={styles.authHeading}>
            <span>{otpSent ? "SECURE VERIFICATION" : "MEMBER ACCOUNT"}</span>

            <h1>
              {otpSent ? "Verify your number" : "Login to KRVE"}
            </h1>

            <p>
              {otpSent
                ? `Enter the 6-digit OTP sent to +91 ${phone}.`
                : "Enter your mobile number to receive a secure one-time password."}
            </p>
          </div>

          <form
            className={styles.authForm}
            onSubmit={otpSent ? verifyOtp : sendOtp}
          >
            {!otpSent ? (
              <label>
                <span>MOBILE NUMBER</span>

                <div className={styles.field}>
                  <span className={styles.phonePrefix}>+91</span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                      setMessage("");
                    }}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
              </label>
            ) : (
              <label>
                <span>6-DIGIT OTP</span>

                <div className={styles.field}>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                      setMessage("");
                    }}
                    placeholder="Enter OTP"
                    maxLength={6}
                    required
                  />
                </div>
              </label>
            )}

            {message && (
              <div
                className={styles.authMessage}
                role="status"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={busy}
            >
              {busy
                ? "PLEASE WAIT..."
                : otpSent
                  ? "VERIFY & CONTINUE"
                  : "SEND OTP"}

              {!busy && (
                <ArrowRight
                  size={15}
                />
              )}
            </button>

            {otpSent && (
              <div className={styles.authSwitch}>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setMessage("");
                  }}
                  disabled={busy}
                >
                  CHANGE MOBILE NUMBER
                </button>

                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={busy}
                >
                  RESEND OTP
                </button>
              </div>
            )}
          </form>

          <div className={styles.authSecurity}>
            <Check size={13} />
            SECURE KRVE ACCOUNT · OTP PROTECTED
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
