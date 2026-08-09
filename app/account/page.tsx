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
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
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
  Star,
  TicketPercent,
  UserRound,
  WalletCards,
} from "lucide-react";

import type {
  User,
} from "@supabase/supabase-js";

import {
  createClient,
} from "@/lib/supabase/client";

type AccountMode =
  | "login"
  | "register"
  | "forgot";

type AccountForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: AccountForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AccountContent() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const supabase =
    useMemo(
      () => createClient(),
      [],
    );

  const [
    mode,
    setMode,
  ] =
    useState<AccountMode>(
      "login",
    );

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    authLoaded,
    setAuthLoaded,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState<AccountForm>(
      initialForm,
    );

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

  useEffect(() => {
    let mounted =
      true;

    async function loadCurrentUser() {
      try {
        const {
          data,
        } =
          await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        const activeUser =
          data.user ??
          null;

        setUser(
          activeUser,
        );

        /*
          Only show URL auth errors when
          there is no valid signed-in user.
          This prevents old/expired email-link
          errors from appearing on the member
          dashboard after a valid session exists.
        */

        if (!activeUser) {
          const description =
            searchParams.get(
              "error_description",
            );

          const error =
            searchParams.get(
              "error",
            );

          if (description) {
            setMessage(
              description.replace(
                /\+/g,
                " ",
              ),
            );
          } else if (
            error &&
            error !==
              "missing_auth_code"
          ) {
            setMessage(
              error.replace(
                /_/g,
                " ",
              ),
            );
          }
        }
      } catch (error) {
        if (
          mounted
        ) {
          console.error(
            "KRVE_ACCOUNT_LOAD_ERROR",
            error,
          );
        }
      } finally {
        if (
          mounted
        ) {
          setAuthLoaded(
            true,
          );
        }
      }
    }

    void loadCurrentUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          session,
        ) => {
          if (!mounted) {
            return;
          }

          setUser(
            session?.user ??
              null,
          );

          setAuthLoaded(
            true,
          );
        },
      );

    return () => {
      mounted =
        false;

      subscription.unsubscribe();
    };
  }, [
    searchParams,
    supabase,
  ]);

  function updateField(
    field:
      keyof AccountForm,
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

  function switchMode(
    nextMode:
      AccountMode,
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

        password:
          "",

        confirmPassword:
          "",
      }),
    );
  }

  async function handleLogin(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    const email =
      form.email
        .trim()
        .toLowerCase();

    if (
      !email ||
      !form.password
    ) {
      setMessage(
        "Please enter your email address and password.",
      );

      return;
    }

    if (
      !email.includes(
        "@",
      )
    ) {
      setMessage(
        "Please enter a valid email address.",
      );

      return;
    }

    setBusy(
      true,
    );

    try {
      const {
        error,
      } =
        await supabase.auth
          .signInWithPassword(
            {
              email,

              password:
                form.password,
            },
          );

      if (error) {
        throw error;
      }

      setMessage(
        "",
      );

      router.replace(
        "/account",
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof
        Error
          ? error.message
          : "We could not sign you in.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function handleRegister(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    const firstName =
      form.firstName.trim();

    const lastName =
      form.lastName.trim();

    const email =
      form.email
        .trim()
        .toLowerCase();

    if (
      !firstName ||
      !lastName
    ) {
      setMessage(
        "Please enter your first and last name.",
      );

      return;
    }

    if (
      !email.includes(
        "@",
      )
    ) {
      setMessage(
        "Please enter a valid email address.",
      );

      return;
    }

    if (
      form.password.length <
      8
    ) {
      setMessage(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setMessage(
        "Passwords do not match.",
      );

      return;
    }

    setBusy(
      true,
    );

    try {
      const redirectTo =
        `${window.location.origin}` +
        `/auth/callback?next=/account`;

      const {
        data,
        error,
      } =
        await supabase.auth.signUp(
          {
            email,

            password:
              form.password,

            options: {
              emailRedirectTo:
                redirectTo,

              data: {
                first_name:
                  firstName,

                last_name:
                  lastName,

                full_name:
                  `${firstName} ${lastName}`,
              },
            },
          },
        );

      if (error) {
        throw error;
      }

      if (
        data.session
      ) {
        router.replace(
          "/account",
        );

        router.refresh();

        return;
      }

      setMessage(
        "Your KRVE account has been created. Please check your email and confirm your account before signing in.",
      );
    } catch (error) {
      setMessage(
        error instanceof
        Error
          ? error.message
          : "We could not create your account.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function handleForgotPassword(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    const email =
      form.email
        .trim()
        .toLowerCase();

    if (
      !email.includes(
        "@",
      )
    ) {
      setMessage(
        "Enter the email address connected to your KRVE account.",
      );

      return;
    }

    setBusy(
      true,
    );

    try {
      const redirectTo =
        `${window.location.origin}` +
        `/account/update-password`;

      const {
        error,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            email,
            {
              redirectTo,
            },
          );

      if (error) {
        throw error;
      }

      setMessage(
        "Password reset email sent. Open the link in your email to create a new password.",
      );
    } catch (error) {
      setMessage(
        error instanceof
        Error
          ? error.message
          : "Password reset request failed.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function handleGoogleSignIn() {
    setMessage("");

    setBusy(
      true,
    );

    try {
      const redirectTo =
        `${window.location.origin}` +
        `/auth/callback?next=/account`;

      const {
        error,
      } =
        await supabase.auth.signInWithOAuth(
          {
            provider:
              "google",

            options: {
              redirectTo,
            },
          },
        );

      if (error) {
        throw error;
      }
    } catch (error) {
      setMessage(
        error instanceof
        Error
          ? error.message
          : "Google sign-in could not start.",
      );

      setBusy(
        false,
      );
    }
  }

  async function handleSignOut() {
    setBusy(
      true,
    );

    try {
      await supabase.auth.signOut();

      setUser(
        null,
      );

      switchMode(
        "login",
      );

      router.replace(
        "/account",
      );

      router.refresh();
    } finally {
      setBusy(
        false,
      );
    }
  }

  if (
    !authLoaded
  ) {
    return (
      <main
        className="krve-loading-page"
      >
        <div
          className="krve-loading-logo"
        >
          K
          <small>
            rv
          </small>
          E
        </div>

        <div
          className="krve-loading-line"
        />

        <span>
          PREPARING YOUR
          PRIVATE CLIENT
          EXPERIENCE
        </span>

        <style jsx>{`
          .krve-loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18px;
            background: #020202;
            color: #d8a529;
          }

          .krve-loading-logo {
            font-family: Georgia, serif;
            font-size: 56px;
            letter-spacing: .04em;
          }

          .krve-loading-logo small {
            font-size: 33px;
          }

          .krve-loading-line {
            width: 120px;
            height: 1px;
            background:
              linear-gradient(
                90deg,
                transparent,
                #d8a529,
                transparent
              );
          }

          .krve-loading-page > span {
            color:
              rgba(
                216,
                165,
                41,
                .7
              );
            font-family:
              Arial,
              sans-serif;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .22em;
          }
        `}</style>
      </main>
    );
  }

  /*
    ========================================================
    LOGGED-IN MEMBER DASHBOARD
    ========================================================
  */

  if (user) {
    const fullName =
      (
        user.user_metadata
          ?.full_name as
          | string
          | undefined
      )?.trim();

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

    const customerName =
      fullName ||
      `${firstName ?? ""} ${lastName ?? ""}`.trim() ||
      user.email?.split(
        "@",
      )[0] ||
      "KRVE Client";

    const customerFirstName =
      firstName ||
      customerName.split(
        " ",
      )[0] ||
      "Client";

    const initial =
      customerName
        .slice(
          0,
          1,
        )
        .toUpperCase();

    const accountItems = [
      {
        href:
          "/account/orders",

        icon:
          PackageCheck,

        eyebrow:
          "Purchases",

        title:
          "My Orders",

        description:
          "Track orders, delivery and purchase history.",
      },

      {
        href:
          "/wishlist",

        icon:
          Heart,

        eyebrow:
          "Saved Style",

        title:
          "Wishlist",

        description:
          "Return to the KRVE pieces you have saved.",
      },

      {
        href:
          "/account/profile",

        icon:
          UserRound,

        eyebrow:
          "Identity",

        title:
          "Profile",

        description:
          "Manage your name, email and personal details.",
      },

      {
        href:
          "/account/addresses",

        icon:
          MapPin,

        eyebrow:
          "Delivery",

        title:
          "Addresses",

        description:
          "Manage delivery and billing destinations.",
      },

      {
        href:
          "/account/notifications",

        icon:
          Bell,

        eyebrow:
          "Communication",

        title:
          "Notifications",

        description:
          "Control order updates, launches and alerts.",
      },

      {
        href:
          "/account/settings",

        icon:
          Settings,

        eyebrow:
          "Security",

        title:
          "Account Settings",

        description:
          "Password, privacy and account preferences.",
      },
    ];

    return (
      <main
        className="member-page"
      >
        <div
          className="page-glow page-glow-one"
        />

        <div
          className="page-glow page-glow-two"
        />

        <section
          className="member-shell"
        >
          {/* TOP BRAND BAR */}

          <header
            className="member-topbar"
          >
            <Link
              href="/"
              className="member-brand"
            >
              <span>
                K
                <small>
                  rv
                </small>
                E
              </span>

              <strong>
                THE FASHION STUDIO
              </strong>
            </Link>

            <div
              className="member-topbar-right"
            >
              <div
                className="member-status"
              >
                <span
                  className="status-dot"
                />

                PRIVATE CLIENT
              </div>

              <Link
                href="/"
                className="store-link"
              >
                RETURN TO STORE

                <ArrowRight
                  size={13}
                />
              </Link>
            </div>
          </header>

          {/* HERO */}

          <section
            className="member-hero"
          >
            <div
              className="hero-copy"
            >
              <div
                className="hero-eyebrow"
              >
                <span />

                <Crown
                  size={13}
                />

                KRVE PRIVATE CLIENT

                <span />
              </div>

              <h1>
                Welcome back,
                <em>
                  {customerFirstName}.
                </em>
              </h1>

              <p>
                Your private KRVE
                space for orders,
                saved pieces,
                personalised style
                and client
                privileges.
              </p>

              <div
                className="hero-identity"
              >
                <div
                  className="identity-avatar"
                >
                  {initial}
                </div>

                <div>
                  <span>
                    MEMBER PROFILE
                  </span>

                  <strong>
                    {customerName}
                  </strong>

                  <small>
                    {user.email}
                  </small>
                </div>

                <ShieldCheck
                  size={22}
                />
              </div>
            </div>

            <aside
              className="hero-monogram"
            >
              <div
                className="hero-ring hero-ring-large"
              />

              <div
                className="hero-ring hero-ring-medium"
              />

              <div
                className="hero-k"
              >
                K
              </div>

              <span>
                PRIVATE CLIENT
              </span>

              <strong>
                KRVE
              </strong>
            </aside>
          </section>

          {/* QUICK STATUS */}

          <section
            className="status-grid"
          >
            <article>
              <div>
                <ShoppingBag
                  size={18}
                />
              </div>

              <span>
                ORDERS
              </span>

              <strong>
                My Purchases
              </strong>

              <Link href="/account/orders">
                View history
                <ChevronRight
                  size={14}
                />
              </Link>
            </article>

            <article>
              <div>
                <Heart
                  size={18}
                />
              </div>

              <span>
                WISHLIST
              </span>

              <strong>
                Saved Pieces
              </strong>

              <Link href="/wishlist">
                View wishlist
                <ChevronRight
                  size={14}
                />
              </Link>
            </article>

            <article>
              <div>
                <Sparkles
                  size={18}
                />
              </div>

              <span>
                KRVE AI
              </span>

              <strong>
                Personal Styling
              </strong>

              <Link href="/ai-stylist">
                Meet stylist
                <ChevronRight
                  size={14}
                />
              </Link>
            </article>

            <article>
              <div>
                <Gift
                  size={18}
                />
              </div>

              <span>
                PRIVILEGES
              </span>

              <strong>
                Private Benefits
              </strong>

              <Link href="/account/offers">
                View offers
                <ChevronRight
                  size={14}
                />
              </Link>
            </article>
          </section>

          {/* ACCOUNT CENTRE */}

          <section
            className="account-centre"
          >
            <div
              className="section-heading"
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
                Everything connected
                to your KRVE
                experience, in one
                place.
              </p>
            </div>

            <div
              className="account-grid"
            >
              {accountItems.map(
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
                      className="account-card"
                    >
                      <div
                        className="card-icon"
                      >
                        <Icon
                          size={21}
                          strokeWidth={
                            1.25
                          }
                        />
                      </div>

                      <div
                        className="card-copy"
                      >
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
                      </div>

                      <div
                        className="card-arrow"
                      >
                        <ArrowRight
                          size={16}
                        />
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </section>

          {/* PRIVATE CLIENT EXPERIENCE */}

          <section
            className="private-experience"
          >
            <div
              className="experience-copy"
            >
              <div
                className="experience-eyebrow"
              >
                <Sparkles
                  size={13}
                />

                KRVE PRIVATE
                EXPERIENCE
              </div>

              <h2>
                Fashion,
                <em>
                  curated around you.
                </em>
              </h2>

              <p>
                Your account connects
                shopping, saved
                pieces, AI styling
                and future KRVE
                experiences into one
                private profile.
              </p>

              <Link
                href="/ai-stylist"
                className="experience-button"
              >
                EXPLORE AI STYLIST

                <ArrowRight
                  size={14}
                />
              </Link>
            </div>

            <div
              className="benefit-list"
            >
              <article>
                <Star
                  size={17}
                />

                <div>
                  <strong>
                    Personalised
                    Recommendations
                  </strong>

                  <span>
                    Style suggestions
                    shaped around your
                    KRVE profile.
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
                    Access selected
                    offers, launches
                    and privileges.
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
                    Keep purchases and
                    preferences
                    connected to your
                    account.
                  </span>
                </div>
              </article>

              <article>
                <WalletCards
                  size={17}
                />

                <div>
                  <strong>
                    Faster Checkout
                  </strong>

                  <span>
                    Reuse saved
                    account details
                    for a smoother
                    purchase journey.
                  </span>
                </div>
              </article>
            </div>
          </section>

          {/* SECURITY / LOGOUT */}

          <section
            className="member-footer-card"
          >
            <div
              className="security-copy"
            >
              <div
                className="security-icon"
              >
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>
                <span>
                  SECURE ACCOUNT
                </span>

                <strong>
                  Your KRVE session
                  is protected.
                </strong>

                <p>
                  Authentication is
                  securely managed
                  through Supabase.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleSignOut
              }
              disabled={
                busy
              }
              className="signout-button"
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

        <style jsx>{`
          .member-page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            background:
              radial-gradient(
                circle at 87% 8%,
                rgba(216,165,41,.09),
                transparent 25%
              ),
              radial-gradient(
                circle at 7% 72%,
                rgba(103,67,6,.08),
                transparent 28%
              ),
              #020202;
            color: #ffffff;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .member-page::before {
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(
                rgba(216,165,41,.017)
                1px,
                transparent
                1px
              ),
              linear-gradient(
                90deg,
                rgba(216,165,41,.017)
                1px,
                transparent
                1px
              );
            background-size:
              58px 58px;
            content: "";
            pointer-events: none;
            mask-image:
              linear-gradient(
                to bottom,
                rgba(0,0,0,.6),
                transparent 80%
              );
          }

          .page-glow {
            position: absolute;
            border-radius: 50%;
            filter:
              blur(130px);
            pointer-events: none;
          }

          .page-glow-one {
            top: -260px;
            right: -100px;
            width: 580px;
            height: 580px;
            background:
              rgba(216,165,41,.07);
          }

          .page-glow-two {
            bottom: -300px;
            left: -180px;
            width: 600px;
            height: 600px;
            background:
              rgba(114,71,5,.07);
          }

          .member-shell {
            position: relative;
            z-index: 2;
            width:
              min(
                92%,
                1280px
              );
            margin: 0 auto;
            padding-bottom: 80px;
          }

          .member-topbar {
            min-height: 104px;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            gap: 24px;
            border-bottom:
              1px solid
              rgba(
                216,
                165,
                41,
                .28
              );
          }

          .member-brand {
            display: flex;
            flex-direction:
              column;
            width: max-content;
            color: #d8a529;
            text-decoration: none;
          }

          .member-brand > span {
            font-family:
              Georgia,
              serif;
            font-size: 41px;
            line-height: .78;
            letter-spacing: .05em;
          }

          .member-brand small {
            font-size: 25px;
          }

          .member-brand strong {
            margin-top: 12px;
            font-size: 7px;
            letter-spacing:
              .19em;
          }

          .member-topbar-right {
            display: flex;
            align-items: center;
            gap: 24px;
          }

          .member-status {
            display: flex;
            align-items: center;
            gap: 9px;
            color:
              rgba(
                255,
                255,
                255,
                .48
              );
            font-size: 8px;
            font-weight: 700;
            letter-spacing:
              .14em;
          }

          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background:
              #d8a529;
            box-shadow:
              0 0 15px
              rgba(
                216,
                165,
                41,
                .8
              );
          }

          .store-link {
            min-height: 39px;
            display: flex;
            align-items: center;
            gap: 9px;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .28
              );
            padding:
              0 14px;
            color:
              rgba(
                255,
                255,
                255,
                .62
              );
            font-size: 8px;
            font-weight: 700;
            letter-spacing:
              .1em;
            text-decoration:
              none;
          }

          .store-link:hover {
            border-color:
              #d8a529;
            color:
              #d8a529;
          }

          .member-hero {
            min-height: 480px;
            display: grid;
            grid-template-columns:
              minmax(0,1.1fr)
              minmax(320px,.7fr);
            align-items: center;
            gap: 50px;
            border-bottom:
              1px solid
              rgba(
                216,
                165,
                41,
                .18
              );
          }

          .hero-copy {
            padding: 66px 0;
          }

          .hero-eyebrow {
            display: flex;
            align-items: center;
            gap: 11px;
            color: #d8a529;
            font-size: 8px;
            font-weight: 800;
            letter-spacing:
              .19em;
          }

          .hero-eyebrow > span {
            width: 35px;
            height: 1px;
            background:
              rgba(
                216,
                165,
                41,
                .55
              );
          }

          .hero-copy h1 {
            max-width: 760px;
            margin:
              24px 0 17px;
            font-family:
              Georgia,
              "Times New Roman",
              serif;
            font-size:
              clamp(
                56px,
                7vw,
                92px
              );
            font-weight: 400;
            line-height: .96;
            letter-spacing:
              -.035em;
          }

          .hero-copy h1 em {
            display: block;
            margin-top: 9px;
            color: #d8a529;
            font-weight: 400;
          }

          .hero-copy > p {
            max-width: 570px;
            color:
              rgba(
                255,
                255,
                255,
                .42
              );
            font-size: 13px;
            line-height: 1.85;
          }

          .hero-identity {
            width:
              min(
                100%,
                550px
              );
            display: grid;
            grid-template-columns:
              54px
              minmax(0,1fr)
              auto;
            align-items: center;
            gap: 15px;
            margin-top: 35px;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .21
              );
            background:
              rgba(
                255,
                255,
                255,
                .012
              );
            padding: 14px 17px;
          }

          .identity-avatar {
            width: 54px;
            height: 54px;
            display: grid;
            place-items:
              center;
            border:
              1px solid
              #d8a529;
            border-radius: 50%;
            color: #e8b632;
            font-family:
              Georgia,
              serif;
            font-size: 23px;
          }

          .hero-identity > div:nth-child(2) {
            min-width: 0;
            display: flex;
            flex-direction:
              column;
          }

          .hero-identity span {
            color: #80661f;
            font-size: 7px;
            font-weight: 800;
            letter-spacing:
              .14em;
          }

          .hero-identity strong {
            margin-top: 5px;
            color:
              rgba(
                255,
                255,
                255,
                .9
              );
            font-family:
              Georgia,
              serif;
            font-size: 17px;
            font-weight: 400;
          }

          .hero-identity small {
            margin-top: 4px;
            overflow: hidden;
            color:
              rgba(
                255,
                255,
                255,
                .34
              );
            font-size: 9px;
            text-overflow:
              ellipsis;
            white-space: nowrap;
          }

          .hero-identity > svg {
            color: #d8a529;
          }

          .hero-monogram {
            position: relative;
            min-height: 390px;
            display: flex;
            flex-direction:
              column;
            align-items: center;
            justify-content:
              center;
            overflow: hidden;
          }

          .hero-ring {
            position: absolute;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .16
              );
            border-radius: 50%;
          }

          .hero-ring-large {
            width: 340px;
            height: 340px;
          }

          .hero-ring-medium {
            width: 250px;
            height: 250px;
            border-color:
              rgba(
                216,
                165,
                41,
                .27
              );
          }

          .hero-k {
            position: relative;
            z-index: 2;
            color:
              rgba(
                216,
                165,
                41,
                .92
              );
            font-family:
              Georgia,
              serif;
            font-size: 150px;
            line-height: .9;
            text-shadow:
              0 0 70px
              rgba(
                216,
                165,
                41,
                .15
              );
          }

          .hero-monogram > span {
            position: relative;
            z-index: 2;
            margin-top: 25px;
            color:
              rgba(
                216,
                165,
                41,
                .55
              );
            font-size: 7px;
            font-weight: 800;
            letter-spacing:
              .24em;
          }

          .hero-monogram > strong {
            position: relative;
            z-index: 2;
            margin-top: 6px;
            color:
              rgba(
                255,
                255,
                255,
                .65
              );
            font-family:
              Georgia,
              serif;
            font-size: 12px;
            font-weight: 400;
            letter-spacing:
              .2em;
          }

          .status-grid {
            display: grid;
            grid-template-columns:
              repeat(
                4,
                minmax(0,1fr)
              );
            border-left:
              1px solid
              rgba(
                216,
                165,
                41,
                .18
              );
            border-bottom:
              1px solid
              rgba(
                216,
                165,
                41,
                .18
              );
          }

          .status-grid article {
            min-height: 190px;
            display: flex;
            flex-direction:
              column;
            align-items:
              flex-start;
            border-top:
              1px solid
              rgba(
                216,
                165,
                41,
                .18
              );
            border-right:
              1px solid
              rgba(
                216,
                165,
                41,
                .18
              );
            padding: 27px;
            transition:
              background .25s ease;
          }

          .status-grid article:hover {
            background:
              rgba(
                216,
                165,
                41,
                .025
              );
          }

          .status-grid article > div {
            width: 39px;
            height: 39px;
            display: grid;
            place-items:
              center;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .32
              );
            color: #d8a529;
          }

          .status-grid article > span {
            margin-top: 24px;
            color: #79601e;
            font-size: 7px;
            font-weight: 800;
            letter-spacing:
              .16em;
          }

          .status-grid article > strong {
            margin-top: 7px;
            color:
              rgba(
                255,
                255,
                255,
                .86
              );
            font-family:
              Georgia,
              serif;
            font-size: 17px;
            font-weight: 400;
          }

          .status-grid :global(a) {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: auto;
            color:
              rgba(
                255,
                255,
                255,
                .35
              );
            font-size: 8px;
            text-decoration:
              none;
          }

          .status-grid :global(a:hover) {
            color: #d8a529;
          }

          .account-centre {
            padding:
              78px 0 30px;
          }

          .section-heading {
            display: flex;
            align-items:
              flex-end;
            justify-content:
              space-between;
            gap: 40px;
            margin-bottom: 33px;
          }

          .section-heading span {
            color: #d8a529;
            font-size: 8px;
            font-weight: 800;
            letter-spacing:
              .2em;
          }

          .section-heading h2 {
            margin:
              10px 0 0;
            font-family:
              Georgia,
              serif;
            font-size:
              clamp(
                38px,
                4vw,
                55px
              );
            font-weight: 400;
          }

          .section-heading p {
            max-width: 390px;
            margin: 0;
            color:
              rgba(
                255,
                255,
                255,
                .34
              );
            font-size: 11px;
            line-height: 1.7;
            text-align: right;
          }

          .account-grid {
            display: grid;
            grid-template-columns:
              repeat(
                3,
                minmax(0,1fr)
              );
            gap: 12px;
          }

          .account-card {
            position: relative;
            min-height: 210px;
            display: grid;
            grid-template-columns:
              auto
              minmax(0,1fr)
              auto;
            align-items:
              flex-start;
            gap: 17px;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .23
              );
            background:
              linear-gradient(
                135deg,
                rgba(
                  216,
                  165,
                  41,
                  .022
                ),
                transparent
                45%
              ),
              #050505;
            padding: 24px;
            color: inherit;
            text-decoration:
              none;
            transition:
              transform .25s ease,
              border-color .25s ease,
              background .25s ease;
          }

          .account-card:hover {
            transform:
              translateY(-3px);
            border-color:
              rgba(
                216,
                165,
                41,
                .7
              );
            background:
              linear-gradient(
                135deg,
                rgba(
                  216,
                  165,
                  41,
                  .05
                ),
                transparent
                50%
              ),
              #060606;
          }

          .card-icon {
            width: 43px;
            height: 43px;
            display: grid;
            place-items:
              center;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .32
              );
            color: #d8a529;
          }

          .card-copy {
            min-width: 0;
          }

          .card-copy span {
            color: #7b621f;
            font-size: 7px;
            font-weight: 800;
            letter-spacing:
              .16em;
            text-transform:
              uppercase;
          }

          .card-copy h3 {
            margin:
              9px 0 9px;
            color: #ffffff;
            font-family:
              Georgia,
              serif;
            font-size: 21px;
            font-weight: 400;
          }

          .card-copy p {
            margin: 0;
            color:
              rgba(
                255,
                255,
                255,
                .34
              );
            font-size: 10px;
            line-height: 1.7;
          }

          .card-arrow {
            width: 32px;
            height: 32px;
            display: grid;
            place-items:
              center;
            border:
              1px solid
              rgba(
                255,
                255,
                255,
                .08
              );
            color:
              rgba(
                255,
                255,
                255,
                .35
              );
            transition:
              color .2s ease,
              border-color .2s ease;
          }

          .account-card:hover
          .card-arrow {
            border-color:
              rgba(
                216,
                165,
                41,
                .45
              );
            color: #d8a529;
          }

          .private-experience {
            display: grid;
            grid-template-columns:
              minmax(0,1.1fr)
              minmax(350px,.9fr);
            gap: 0;
            margin-top: 58px;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .26
              );
            background:
              linear-gradient(
                120deg,
                rgba(
                  216,
                  165,
                  41,
                  .05
                ),
                transparent
                50%
              ),
              #050505;
          }

          .experience-copy {
            min-height: 390px;
            display: flex;
            flex-direction:
              column;
            justify-content:
              center;
            padding:
              50px 54px;
            border-right:
              1px solid
              rgba(
                216,
                165,
                41,
                .2
              );
          }

          .experience-eyebrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #d8a529;
            font-size: 8px;
            font-weight: 800;
            letter-spacing:
              .17em;
          }

          .experience-copy h2 {
            max-width: 620px;
            margin:
              19px 0 17px;
            font-family:
              Georgia,
              serif;
            font-size:
              clamp(
                39px,
                5vw,
                62px
              );
            font-weight: 400;
            line-height: 1;
          }

          .experience-copy h2 em {
            display: block;
            margin-top: 7px;
            color: #d8a529;
            font-weight: 400;
          }

          .experience-copy p {
            max-width: 520px;
            color:
              rgba(
                255,
                255,
                255,
                .38
              );
            font-size: 11px;
            line-height: 1.8;
          }

          .experience-button {
            width: max-content;
            min-height: 45px;
            display: flex;
            align-items: center;
            gap: 9px;
            margin-top: 19px;
            border:
              1px solid
              #d8a529;
            padding:
              0 18px;
            color: #d8a529;
            font-size: 8px;
            font-weight: 800;
            letter-spacing:
              .12em;
            text-decoration:
              none;
          }

          .experience-button:hover {
            background:
              #d8a529;
            color: #050505;
          }

          .benefit-list {
            display: grid;
            grid-template-columns:
              1fr 1fr;
          }

          .benefit-list article {
            min-height: 195px;
            display: flex;
            align-items:
              flex-start;
            gap: 15px;
            border-right:
              1px solid
              rgba(
                216,
                165,
                41,
                .15
              );
            border-bottom:
              1px solid
              rgba(
                216,
                165,
                41,
                .15
              );
            padding: 28px;
            color: #d8a529;
          }

          .benefit-list article:nth-child(2n) {
            border-right: 0;
          }

          .benefit-list article:nth-last-child(-n+2) {
            border-bottom: 0;
          }

          .benefit-list article > div {
            display: flex;
            flex-direction:
              column;
          }

          .benefit-list strong {
            color:
              rgba(
                255,
                255,
                255,
                .82
              );
            font-family:
              Georgia,
              serif;
            font-size: 15px;
            font-weight: 400;
          }

          .benefit-list span {
            margin-top: 8px;
            color:
              rgba(
                255,
                255,
                255,
                .3
              );
            font-size: 9px;
            line-height: 1.7;
          }

          .member-footer-card {
            min-height: 95px;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            gap: 30px;
            margin-top: 25px;
            border-top:
              1px solid
              rgba(
                216,
                165,
                41,
                .22
              );
            border-bottom:
              1px solid
              rgba(
                216,
                165,
                41,
                .22
              );
            padding:
              20px 0;
          }

          .security-copy {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .security-icon {
            width: 45px;
            height: 45px;
            display: grid;
            place-items:
              center;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .3
              );
            color: #d8a529;
          }

          .security-copy > div:last-child {
            display: flex;
            flex-direction:
              column;
          }

          .security-copy span {
            color: #77601f;
            font-size: 7px;
            font-weight: 800;
            letter-spacing:
              .14em;
          }

          .security-copy strong {
            margin-top: 5px;
            color:
              rgba(
                255,
                255,
                255,
                .78
              );
            font-family:
              Georgia,
              serif;
            font-size: 14px;
            font-weight: 400;
          }

          .security-copy p {
            margin:
              4px 0 0;
            color:
              rgba(
                255,
                255,
                255,
                .28
              );
            font-size: 8px;
          }

          .signout-button {
            min-width: 160px;
            min-height: 46px;
            display: flex;
            align-items: center;
            justify-content:
              center;
            gap: 9px;
            border:
              1px solid
              rgba(
                216,
                165,
                41,
                .45
              );
            background:
              transparent;
            color: #d8a529;
            font-size: 8px;
            font-weight: 800;
            letter-spacing:
              .13em;
            cursor: pointer;
          }

          .signout-button:hover {
            background:
              rgba(
                216,
                165,
                41,
                .06
              );
          }

          .signout-button:disabled {
            opacity: .55;
            cursor:
              not-allowed;
          }

          @media (
            max-width: 1050px
          ) {
            .member-hero {
              grid-template-columns:
                1fr;
            }

            .hero-monogram {
              display: none;
            }

            .status-grid {
              grid-template-columns:
                repeat(
                  2,
                  1fr
                );
            }

            .account-grid {
              grid-template-columns:
                repeat(
                  2,
                  minmax(
                    0,
                    1fr
                  )
                );
            }

            .private-experience {
              grid-template-columns:
                1fr;
            }

            .experience-copy {
              border-right: 0;
              border-bottom:
                1px solid
                rgba(
                  216,
                  165,
                  41,
                  .2
                );
            }
          }

          @media (
            max-width: 720px
          ) {
            .member-topbar {
              min-height: 88px;
            }

            .member-status {
              display: none;
            }

            .store-link {
              padding:
                0 10px;
              font-size: 7px;
            }

            .member-brand > span {
              font-size: 34px;
            }

            .member-brand small {
              font-size: 21px;
            }

            .hero-copy {
              padding:
                50px 0;
            }

            .hero-copy h1 {
              font-size:
                clamp(
                  47px,
                  14vw,
                  70px
                );
            }

            .hero-identity {
              grid-template-columns:
                48px
                minmax(0,1fr);
            }

            .hero-identity > svg {
              display: none;
            }

            .identity-avatar {
              width: 48px;
              height: 48px;
            }

            .status-grid {
              grid-template-columns:
                1fr 1fr;
            }

            .status-grid article {
              min-height: 175px;
              padding: 20px;
            }

            .section-heading {
              align-items:
                flex-start;
              flex-direction:
                column;
              gap: 12px;
            }

            .section-heading p {
              text-align: left;
            }

            .account-grid {
              grid-template-columns:
                1fr;
            }

            .account-card {
              min-height: 180px;
            }

            .experience-copy {
              min-height: auto;
              padding:
                40px 25px;
            }

            .benefit-list {
              grid-template-columns:
                1fr;
            }

            .benefit-list article {
              min-height: 145px;
              border-right: 0;
              border-bottom:
                1px solid
                rgba(
                  216,
                  165,
                  41,
                  .15
                ) !important;
            }

            .benefit-list article:last-child {
              border-bottom:
                0 !important;
            }

            .member-footer-card {
              align-items:
                stretch;
              flex-direction:
                column;
            }

            .signout-button {
              width: 100%;
            }
          }

          @media (
            max-width: 480px
          ) {
            .member-shell {
              width:
                calc(
                  100% - 30px
                );
            }

            .member-topbar-right {
              gap: 8px;
            }

            .store-link {
              border: 0;
              padding: 0;
            }

            .hero-eyebrow > span {
              width: 17px;
            }

            .hero-identity {
              padding:
                12px;
            }

            .status-grid {
              grid-template-columns:
                1fr;
            }

            .status-grid article {
              min-height: 155px;
            }

            .account-centre {
              padding-top: 55px;
            }

            .account-card {
              grid-template-columns:
                auto
                minmax(0,1fr);
            }

            .card-arrow {
              display: none;
            }
          }
        `}</style>
      </main>
    );
  }

  /*
    ========================================================
    LOGIN / SIGN UP / FORGOT PASSWORD
    ========================================================
  */

  return (
    <main
      className="auth-page"
    >
      <section
        className="auth-shell"
      >
        <aside
          className="auth-story"
        >
          <Link
            href="/"
            className="auth-logo"
          >
            <span>
              K
              <small>
                rv
              </small>
              E
            </span>

            <strong>
              THE FASHION STUDIO
            </strong>
          </Link>

          <div
            className="story-monogram"
          >
            K
          </div>

          <div
            className="story-copy"
          >
            <span>
              KRVE PRIVATE ACCESS
            </span>

            <h2>
              Your wardrobe.
              <em>
                Your world.
              </em>
            </h2>

            <p>
              Sign in to manage
              orders, saved pieces,
              delivery addresses
              and your personalised
              KRVE fashion
              experience.
            </p>
          </div>

          <div
            className="story-security"
          >
            <ShieldCheck
              size={16}
            />

            Secure customer account
          </div>
        </aside>

        <section
          className="auth-card"
        >
          <div
            className="auth-heading"
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
                  ? "We will send a secure password reset link to your email."
                  : "Welcome back. Please sign in to continue."}
            </p>
          </div>

          {mode !==
            "forgot" && (
            <>
              <button
                type="button"
                className="google-button"
                onClick={
                  handleGoogleSignIn
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
                className="divider"
              >
                <i />

                <small>
                  OR
                </small>

                <i />
              </div>
            </>
          )}

          <form
            onSubmit={
              mode ===
              "register"
                ? handleRegister
                : mode ===
                    "forgot"
                  ? handleForgotPassword
                  : handleLogin
            }
          >
            {mode ===
              "register" && (
              <div
                className="form-two"
              >
                <label>
                  <span>
                    FIRST NAME
                  </span>

                  <div
                    className="auth-field"
                  >
                    <UserRound
                      size={17}
                    />

                    <input
                      type="text"
                      value={
                        form.firstName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "firstName",
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </div>
                </label>

                <label>
                  <span>
                    LAST NAME
                  </span>

                  <div
                    className="auth-field"
                  >
                    <UserRound
                      size={17}
                    />

                    <input
                      type="text"
                      value={
                        form.lastName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "lastName",
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder="Last name"
                      autoComplete="family-name"
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
                className="auth-field"
              >
                <Mail
                  size={17}
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
                      event
                        .target
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
                  className="auth-field"
                >
                  <LockKeyhole
                    size={17}
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
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder={
                      mode ===
                      "register"
                        ? "Minimum 8 characters"
                        : "Your password"
                    }
                    autoComplete={
                      mode ===
                      "register"
                        ? "new-password"
                        : "current-password"
                    }
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={16}
                      />
                    ) : (
                      <Eye
                        size={16}
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
                  className="auth-field"
                >
                  <LockKeyhole
                    size={17}
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
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                </div>
              </label>
            )}

            {mode ===
              "login" && (
              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  switchMode(
                    "forgot",
                  )
                }
              >
                Forgot password?
              </button>
            )}

            {message ? (
              <div
                className="auth-message"
              >
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              className="submit-button"
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
            className="auth-switch"
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
                    switchMode(
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
                    switchMode(
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
            className="auth-secure"
          >
            <Check
              size={14}
            />

            SECURE KRVE ACCOUNT
          </div>
        </section>
      </section>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 48px 20px;
          background:
            radial-gradient(
              circle at 84% 8%,
              rgba(216,165,41,.08),
              transparent 28%
            ),
            #020202;
          color: #ffffff;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .auth-shell {
          width:
            min(
              1120px,
              100%
            );
          min-height: 650px;
          display: grid;
          grid-template-columns:
            .9fr 1.15fr;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .42
            );
          background: #050505;
          box-shadow:
            0 35px 100px
            rgba(
              0,
              0,
              0,
              .55
            );
        }

        .auth-story {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction:
            column;
          justify-content:
            space-between;
          padding: 42px;
          background:
            linear-gradient(
              135deg,
              rgba(
                216,
                165,
                41,
                .09
              ),
              transparent
              44%
            ),
            repeating-linear-gradient(
              120deg,
              rgba(
                255,
                255,
                255,
                .016
              )
              0 15px,
              transparent
              15px 33px
            ),
            #030303;
        }

        .auth-logo {
          position: relative;
          z-index: 2;
          width: max-content;
          display: flex;
          flex-direction:
            column;
          color: #d8a529;
          text-decoration: none;
        }

        .auth-logo > span {
          font-family:
            Georgia,
            serif;
          font-size: 43px;
          line-height: .78;
        }

        .auth-logo small {
          font-size: 25px;
        }

        .auth-logo strong {
          margin-top: 12px;
          font-size: 7px;
          letter-spacing:
            .18em;
        }

        .story-monogram {
          position: absolute;
          top: 50%;
          left: 50%;
          color:
            rgba(
              216,
              165,
              41,
              .08
            );
          font-family:
            Georgia,
            serif;
          font-size: 210px;
          transform:
            translate(
              -50%,
              -50%
            );
        }

        .story-copy {
          position: relative;
          z-index: 2;
        }

        .story-copy > span {
          color: #d8a529;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            .17em;
        }

        .story-copy h2 {
          margin:
            17px 0 15px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              38px,
              4vw,
              49px
            );
          font-weight: 400;
          line-height: 1.02;
        }

        .story-copy h2 em {
          display: block;
          margin-top: 5px;
          color: #d8a529;
          font-weight: 400;
        }

        .story-copy p {
          max-width: 370px;
          margin: 0;
          color:
            rgba(
              255,
              255,
              255,
              .4
            );
          font-size: 11px;
          line-height: 1.8;
        }

        .story-security {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 9px;
          color: #725c20;
          font-size: 8px;
        }

        .auth-card {
          align-self: center;
          padding:
            48px 56px;
        }

        .auth-heading > span {
          color: #d8a529;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            .16em;
        }

        .auth-heading h1 {
          margin:
            15px 0 8px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              32px,
              4vw,
              41px
            );
          font-weight: 400;
          line-height: 1.1;
        }

        .auth-heading p {
          margin: 0;
          color:
            rgba(
              255,
              255,
              255,
              .36
            );
          font-size: 10px;
          line-height: 1.6;
        }

        .google-button {
          width: 100%;
          min-height: 50px;
          margin-top: 27px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .24
            );
          background:
            #080808;
          color: #ffffff;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            .1em;
          cursor: pointer;
        }

        .google-button > span {
          width: 22px;
          height: 22px;
          display:
            inline-grid;
          place-items: center;
          margin-right: 10px;
          border-radius: 50%;
          background: #ffffff;
          color: #4285f4;
          font-size: 13px;
          font-weight: 900;
        }

        .google-button:disabled {
          opacity: .55;
          cursor:
            not-allowed;
        }

        .divider {
          display: grid;
          grid-template-columns:
            1fr auto 1fr;
          align-items: center;
          gap: 11px;
          margin: 22px 0;
        }

        .divider i {
          height: 1px;
          background:
            rgba(
              216,
              165,
              41,
              .22
            );
        }

        .divider small {
          color:
            rgba(
              255,
              255,
              255,
              .3
            );
          font-size: 7px;
        }

        form {
          display: grid;
          gap: 16px;
        }

        .form-two {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 11px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #b29242;
          font-size: 7px;
          font-weight: 700;
          letter-spacing:
            .12em;
        }

        .auth-field {
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .24
            );
          background:
            #090909;
          padding:
            0 13px;
          color: #d8a529;
        }

        .auth-field:focus-within {
          border-color:
            #d8a529;
        }

        .auth-field input {
          width: 100%;
          height: 48px;
          border: 0;
          outline: 0;
          background:
            transparent;
          color: #ffffff;
          font-size: 11px;
        }

        .auth-field input::placeholder {
          color:
            rgba(
              255,
              255,
              255,
              .24
            );
        }

        .eye-button {
          width: 30px;
          height: 30px;
          display: grid;
          place-items:
            center;
          border: 0;
          background:
            transparent;
          color:
            rgba(
              255,
              255,
              255,
              .38
            );
          cursor: pointer;
        }

        .forgot-button {
          justify-self: end;
          border: 0;
          background:
            transparent;
          padding: 0;
          color: #d8a529;
          font-size: 8px;
          cursor: pointer;
        }

        .auth-message {
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .25
            );
          background:
            rgba(
              216,
              165,
              41,
              .04
            );
          padding:
            11px 12px;
          color: #e7c76f;
          font-size: 10px;
          line-height: 1.55;
        }

        .submit-button {
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content:
            center;
          gap: 10px;
          border: 0;
          background:
            linear-gradient(
              90deg,
              #b97d0e,
              #efbd42,
              #c98a14
            );
          color: #050505;
          font-size: 8px;
          font-weight: 900;
          letter-spacing:
            .13em;
          cursor: pointer;
        }

        .submit-button:disabled {
          opacity: .55;
          cursor:
            not-allowed;
        }

        .auth-switch {
          margin-top: 21px;
          padding-top: 18px;
          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              .055
            );
          text-align: center;
          color:
            rgba(
              255,
              255,
              255,
              .32
            );
          font-size: 8px;
        }

        .auth-switch button {
          margin-left: 6px;
          border: 0;
          background:
            transparent;
          color: #d8a529;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .auth-secure {
          margin-top: 21px;
          display: flex;
          align-items: center;
          justify-content:
            center;
          gap: 8px;
          color:
            rgba(
              255,
              255,
              255,
              .25
            );
          font-size: 7px;
          letter-spacing:
            .1em;
        }

        @media (
          max-width: 850px
        ) {
          .auth-shell {
            grid-template-columns:
              1fr;
          }

          .auth-story {
            min-height: 300px;
          }

          .auth-card {
            padding:
              42px 28px;
          }
        }

        @media (
          max-width: 520px
        ) {
          .auth-page {
            padding: 0;
          }

          .auth-shell {
            border: 0;
          }

          .auth-story {
            min-height: 280px;
            padding:
              30px 21px;
          }

          .auth-card {
            padding:
              36px 21px;
          }

          .form-two {
            grid-template-columns:
              1fr;
          }

          .story-monogram {
            font-size: 160px;
          }
        }
      `}</style>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight:
              "100vh",

            display:
              "grid",

            placeItems:
              "center",

            background:
              "#020202",

            color:
              "#d8a529",

            fontFamily:
              "Georgia, serif",

            fontSize:
              "42px",
          }}
        >
          KRVE
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
