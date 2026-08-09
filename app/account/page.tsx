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
  Sparkles,
  TicketPercent,
  UserRound,
} from "lucide-react";

import type {
  User,
} from "@supabase/supabase-js";

import {
  createClient,
} from "@/lib/supabase/client";

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
    useState<User | null>(
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

  useEffect(() => {
    let mounted =
      true;

    async function loadUser() {
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
          If user is already authenticated,
          remove old expired auth parameters
          from the URL.
        */

        if (
          activeUser &&
          window.location.search
        ) {
          router.replace(
            "/account",
          );
        }

        if (!activeUser) {
          const authError =
            searchParams.get(
              "error_description",
            );

          if (authError) {
            setMessage(
              authError
                .replace(
                  /\+/g,
                  " ",
                )
                .trim(),
            );
          }
        }
      } catch (error) {
        console.error(
          "KRVE_ACCOUNT_LOAD_ERROR",
          error,
        );
      } finally {
        if (mounted) {
          setAuthLoaded(
            true,
          );
        }
      }
    }

    void loadUser();

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
    router,
    searchParams,
    supabase,
  ]);

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

    setBusy(
      true,
    );

    try {
      const {
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password:
              form.password,
          },
        );

      if (error) {
        throw error;
      }

      router.replace(
        "/account",
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function register(
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
        `${window.location.origin}/auth/callback?next=/account`;

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
        "Account created. Please check your email and confirm your KRVE account.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function forgotPassword(
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
      const {
        error,
      } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              `${window.location.origin}/account/update-password`,
          },
        );

      if (error) {
        throw error;
      }

      setMessage(
        "Password reset email sent. Open the link in your inbox to set a new password.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send password reset email.",
      );
    } finally {
      setBusy(
        false,
      );
    }
  }

  async function googleLogin() {
    setMessage("");
    setBusy(true);

    try {
      const {
        error,
      } =
        await supabase.auth.signInWithOAuth(
          {
            provider:
              "google",

            options: {
              redirectTo:
                `${window.location.origin}/auth/callback?next=/account`,
            },
          },
        );

      if (error) {
        throw error;
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in could not start.",
      );

      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);

    try {
      await supabase.auth.signOut();

      setUser(null);

      router.replace(
        "/account",
      );

      router.refresh();
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
                    Supabase.
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
