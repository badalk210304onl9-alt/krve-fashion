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
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
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
      () =>
        createClient(),
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
    const error =
      searchParams.get(
        "error",
      );

    if (error) {
      setMessage(
        decodeURIComponent(
          error,
        ),
      );
    }

    async function loadCurrentUser() {
      try {
        const {
          data,
        } =
          await supabase.auth.getUser();

        setUser(
          data.user ??
            null,
        );
      } finally {
        setAuthLoaded(
          true,
        );
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
    newMode:
      AccountMode,
  ) {
    setMode(
      newMode,
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

      setMessage(
        "Welcome back to KRVE.",
      );

      router.refresh();
    } catch (
      error
    ) {
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
        setMessage(
          "Your KRVE account has been created successfully.",
        );

        router.refresh();

        return;
      }

      setMessage(
        "Account created. Please check your email and confirm your KRVE account, then sign in.",
      );
    } catch (
      error
    ) {
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
        await supabase.auth.resetPasswordForEmail(
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
    } catch (
      error
    ) {
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
    } catch (
      error
    ) {
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
        className="krve-account-loading"
      >
        <div>
          <strong>
            K
            <small>
              rv
            </small>
            E
          </strong>

          <span>
            LOADING PRIVATE
            CLIENT ACCOUNT...
          </span>
        </div>

        <style jsx>{`
          .krve-account-loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #020202;
            color: #d8a529;
          }

          .krve-account-loading div {
            display: grid;
            gap: 18px;
            text-align: center;
          }

          .krve-account-loading strong {
            font-family: Georgia, serif;
            font-size: 52px;
            font-weight: 400;
          }

          .krve-account-loading small {
            font-size: 31px;
          }

          .krve-account-loading span {
            font-family: Arial, sans-serif;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.2em;
          }
        `}</style>
      </main>
    );
  }

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

    const customerName =
      fullName ||
      firstName ||
      user.email?.split(
        "@",
      )[0] ||
      "KRVE Client";

    const initial =
      customerName
        .slice(
          0,
          1,
        )
        .toUpperCase();

    return (
      <main
        className="krve-member-page"
      >
        <div
          className="member-glow member-glow-one"
        />

        <div
          className="member-glow member-glow-two"
        />

        <section
          className="member-card"
        >
          <Link
            href="/"
            className="member-logo"
          >
            K
            <small>
              rv
            </small>
            E

            <strong>
              THE FASHION STUDIO
            </strong>
          </Link>

          <div
            className="member-avatar"
          >
            {initial}
          </div>

          <span
            className="member-eyebrow"
          >
            KRVE PRIVATE CLIENT
          </span>

          <h1>
            Welcome,
            <br />
            {customerName}.
          </h1>

          <p
            className="member-email"
          >
            {user.email}
          </p>

          <div
            className="member-grid"
          >
            <Link href="/account/orders">
              <span>
                My Orders
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

            <Link href="/wishlist">
              <span>
                Wishlist
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

            <Link href="/account/profile">
              <span>
                Profile
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

            <Link href="/account/addresses">
              <span>
                Addresses
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

            <Link href="/account/notifications">
              <span>
                Notifications
              </span>

              <ArrowRight
                size={16}
              />
            </Link>

            <Link href="/account/settings">
              <span>
                Account Settings
              </span>

              <ArrowRight
                size={16}
              />
            </Link>
          </div>

          <button
            type="button"
            className="signout-button"
            onClick={
              handleSignOut
            }
            disabled={
              busy
            }
          >
            <LogOut
              size={16}
            />

            {busy
              ? "SIGNING OUT..."
              : "SIGN OUT"}
          </button>

          <Link
            href="/"
            className="return-store"
          >
            RETURN TO STORE
          </Link>
        </section>

        <style jsx>{`
          .krve-member-page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            display: grid;
            place-items: center;
            padding: 60px 20px;
            background:
              radial-gradient(
                circle at 78% 10%,
                rgba(216,165,41,.1),
                transparent 30%
              ),
              radial-gradient(
                circle at 5% 90%,
                rgba(125,81,8,.08),
                transparent 28%
              ),
              #020202;
            color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
          }

          .member-glow {
            position: absolute;
            border-radius: 50%;
            filter: blur(120px);
            pointer-events: none;
          }

          .member-glow-one {
            top: -220px;
            right: 4%;
            width: 500px;
            height: 500px;
            background: rgba(216,165,41,.07);
          }

          .member-glow-two {
            bottom: -260px;
            left: -100px;
            width: 520px;
            height: 520px;
            background: rgba(127,82,5,.08);
          }

          .member-card {
            position: relative;
            z-index: 2;
            width: min(100%, 760px);
            border: 1px solid rgba(216,165,41,.4);
            background:
              linear-gradient(
                145deg,
                rgba(216,165,41,.025),
                transparent 40%
              ),
              #060606;
            padding: 54px;
            text-align: center;
            box-shadow:
              0 40px 100px rgba(0,0,0,.55);
          }

          .member-logo {
            display: inline-flex;
            flex-direction: column;
            color: #d8a529;
            text-decoration: none;
            font-family: Georgia, serif;
            font-size: 39px;
            line-height: .78;
          }

          .member-logo small {
            font-size: 23px;
          }

          .member-logo strong {
            margin-top: 12px;
            font-family: Arial, sans-serif;
            font-size: 7px;
            letter-spacing: .18em;
          }

          .member-avatar {
            width: 82px;
            height: 82px;
            display: grid;
            place-items: center;
            margin: 38px auto 22px;
            border: 1px solid #d8a529;
            border-radius: 50%;
            color: #e8b632;
            font-family: Georgia, serif;
            font-size: 37px;
          }

          .member-eyebrow {
            color: #d8a529;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .2em;
          }

          .member-card h1 {
            margin: 14px 0 9px;
            font-family: Georgia, serif;
            font-size:
              clamp(36px,5vw,52px);
            font-weight: 400;
            line-height: 1.08;
          }

          .member-email {
            margin: 0;
            color: rgba(255,255,255,.42);
            font-size: 12px;
          }

          .member-grid {
            display: grid;
            grid-template-columns:
              repeat(
                2,
                minmax(0,1fr)
              );
            gap: 10px;
            margin-top: 36px;
          }

          .member-grid :global(a) {
            min-height: 57px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border: 1px solid rgba(216,165,41,.24);
            padding: 0 18px;
            color: rgba(255,255,255,.8);
            text-decoration: none;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            transition:
              border-color .2s ease,
              color .2s ease,
              background .2s ease;
          }

          .member-grid :global(a:hover) {
            border-color: #d8a529;
            background: rgba(216,165,41,.035);
            color: #e8b632;
          }

          .signout-button {
            width: 100%;
            min-height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            margin-top: 25px;
            border: 1px solid rgba(216,165,41,.55);
            background: transparent;
            color: #d8a529;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .14em;
            cursor: pointer;
          }

          .signout-button:disabled {
            opacity: .6;
          }

          .return-store {
            display: inline-block;
            margin-top: 24px;
            color: rgba(255,255,255,.32);
            font-size: 8px;
            font-weight: 700;
            letter-spacing: .14em;
            text-decoration: none;
          }

          @media (
            max-width: 600px
          ) {
            .member-card {
              padding: 40px 22px;
            }

            .member-grid {
              grid-template-columns:
                1fr;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main
      className="krve-auth-page"
    >
      <section
        className="krve-auth-shell"
      >
        <aside
          className="krve-auth-story"
        >
          <Link
            href="/"
            className="krve-story-logo"
          >
            K
            <small>
              rv
            </small>
            E

            <strong>
              THE FASHION STUDIO
            </strong>
          </Link>

          <div
            className="krve-story-copy"
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
            className="krve-story-security"
          >
            <ShieldCheck
              size={17}
            />

            <span>
              Secure customer
              account
            </span>
          </div>
        </aside>

        <section
          className="krve-auth-card"
        >
          <div
            className="krve-card-heading"
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
                  ? "We will send a secure reset link to your email."
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
                className="krve-divider"
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
                className="two-columns"
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
                    className="password-eye"
                    onClick={() =>
                      setShowPassword(
                        (
                          current,
                        ) =>
                          !current,
                      )
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

            {message && (
              <div
                className="auth-message"
              >
                {message}
              </div>
            )}

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
            className="auth-security"
          >
            <Check
              size={14}
            />

            Supabase secure
            authentication
          </div>
        </section>
      </section>

      <style jsx>{`
        .krve-auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 44px 20px;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(216,165,41,.07),
              transparent 28%
            ),
            #020202;
          color: #ffffff;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .krve-auth-shell {
          width:
            min(
              1140px,
              100%
            );
          min-height: 650px;
          display: grid;
          grid-template-columns:
            .9fr
            1.2fr;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .42
            );
          background:
            #060606;
          box-shadow:
            0 40px 100px
            rgba(0,0,0,.48);
        }

        .krve-auth-story {
          display: flex;
          flex-direction: column;
          justify-content:
            space-between;
          padding: 43px;
          background:
            linear-gradient(
              135deg,
              rgba(
                216,
                165,
                41,
                .085
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
                .018
              )
              0 16px,
              transparent
              16px 34px
            ),
            #030303;
        }

        .krve-story-logo {
          width: max-content;
          display: flex;
          flex-direction:
            column;
          color: #d8a529;
          text-decoration: none;
          font-family:
            Georgia,
            serif;
          font-size: 43px;
          line-height: .78;
        }

        .krve-story-logo small {
          font-size: 25px;
        }

        .krve-story-logo strong {
          margin-top: 13px;
          font-family:
            Arial,
            sans-serif;
          font-size: 7px;
          letter-spacing:
            .18em;
        }

        .krve-story-copy > span {
          color: #d8a529;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            .14em;
        }

        .krve-story-copy h2 {
          margin:
            18px 0 15px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              38px,
              4vw,
              48px
            );
          font-weight: 400;
          line-height: 1.03;
        }

        .krve-story-copy h2 em {
          display: block;
          margin-top: 4px;
          color: #e8b632;
          font-weight: 400;
        }

        .krve-story-copy p {
          max-width: 390px;
          margin: 0;
          color:
            rgba(
              255,
              255,
              255,
              .42
            );
          font-size: 12px;
          line-height: 1.8;
        }

        .krve-story-security {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #846b2b;
          font-size: 9px;
        }

        .krve-auth-card {
          align-self: center;
          padding:
            55px 60px;
        }

        .krve-card-heading > span {
          color: #d8a529;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            .16em;
        }

        .krve-card-heading h1 {
          margin:
            14px 0 7px;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              31px,
              4vw,
              39px
            );
          font-weight: 400;
          line-height: 1.08;
        }

        .krve-card-heading p {
          margin: 0;
          color:
            rgba(
              255,
              255,
              255,
              .38
            );
          font-size: 11px;
        }

        .google-button {
          width: 100%;
          min-height: 51px;
          margin-top: 30px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .25
            );
          background: #080808;
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            .08em;
          cursor: pointer;
        }

        .google-button > span {
          display:
            inline-grid;
          width: 22px;
          height: 22px;
          place-items:
            center;
          margin-right: 10px;
          border-radius: 50%;
          background: #ffffff;
          color: #4285f4;
          font-size: 13px;
          font-weight: 900;
        }

        .krve-divider {
          display: grid;
          grid-template-columns:
            1fr auto 1fr;
          align-items: center;
          gap: 12px;
          margin: 23px 0;
        }

        .krve-divider i {
          height: 1px;
          background:
            rgba(
              216,
              165,
              41,
              .24
            );
        }

        .krve-divider small {
          color:
            rgba(
              255,
              255,
              255,
              .35
            );
          font-size: 7px;
        }

        form {
          display: grid;
          gap: 17px;
        }

        .two-columns {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 12px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #b99a4e;
          font-size: 8px;
          font-weight: 700;
          letter-spacing:
            .11em;
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
              .25
            );
          background: #0a0a0a;
          padding: 0 13px;
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
          font-size: 12px;
        }

        .auth-field input::placeholder {
          color:
            rgba(
              255,
              255,
              255,
              .26
            );
        }

        .password-eye {
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
              .4
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
          font-size: 9px;
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
          font-size: 11px;
          line-height: 1.55;
        }

        .submit-button {
          min-height: 53px;
          display: flex;
          align-items: center;
          justify-content:
            center;
          gap: 10px;
          border: 0;
          background:
            linear-gradient(
              90deg,
              #bd810f,
              #efbd42,
              #c98a14
            );
          color: #050505;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            .12em;
          cursor: pointer;
        }

        .submit-button:disabled,
        .google-button:disabled {
          opacity: .6;
          cursor:
            not-allowed;
        }

        .auth-switch {
          margin-top: 22px;
          padding-top: 19px;
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
              .35
            );
          font-size: 9px;
        }

        .auth-switch button {
          margin-left: 7px;
          border: 0;
          background:
            transparent;
          color: #d8a529;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .auth-security {
          margin-top: 22px;
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
              .3
            );
          font-size: 9px;
        }

        @media (
          max-width: 850px
        ) {
          .krve-auth-shell {
            grid-template-columns:
              1fr;
          }

          .krve-auth-story {
            min-height: 310px;
          }

          .krve-auth-card {
            padding:
              43px 29px;
          }
        }

        @media (
          max-width: 520px
        ) {
          .krve-auth-page {
            padding: 0;
          }

          .krve-auth-shell {
            border: 0;
          }

          .krve-auth-story {
            min-height: 290px;
            padding:
              30px 21px;
          }

          .krve-auth-card {
            padding:
              37px 21px;
          }

          .two-columns {
            grid-template-columns:
              1fr;
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

            background:
              "#020202",

            color:
              "#d8a529",

            display:
              "grid",

            placeItems:
              "center",
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
