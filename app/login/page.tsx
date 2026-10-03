"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./login.module.css";

type Mode =
  | "login"
  | "register";

type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
};

type AuthResponse = {
  success?: boolean;

  data?: {
    customer?: Customer;
    token?: string;
    expiresAt?: string;
  };

  error?: {
    message?: string;
  };

  message?: string;
};

export default function LoginPage() {
  const router =
    useRouter();

  const [mode, setMode] =
    useState<Mode>("login");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const token =
      window.localStorage.getItem(
        "krve_customer_token",
      );

    if (token) {
      router.replace(
        "/account",
      );

      return;
    }

    setCheckingSession(false);
  }, [router]);

  function changeMode(
    nextMode: Mode,
  ) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      mode === "register" &&
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "/api/customer/login"
          : "/api/customer/register";

      const payload =
        mode === "login"
          ? {
              email,
              password,
            }
          : {
              firstName,
              lastName,
              email,
              phone,
              password,
            };

      const response =
        await fetch(endpoint, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload,
          ),
        });

      const result =
        (await response.json()) as AuthResponse;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error?.message ||
            result.message ||
            "Something went wrong. Please try again.",
        );
      }

      const token =
        result.data?.token;

      const customer =
        result.data?.customer;

      if (!token) {
        throw new Error(
          "Login was successful but no customer session was received.",
        );
      }

      window.localStorage.setItem(
        "krve_customer_token",
        token,
      );

      if (customer) {
        window.localStorage.setItem(
          "krve_customer",
          JSON.stringify(
            customer,
          ),
        );
      }

      if (
        result.data?.expiresAt
      ) {
        window.localStorage.setItem(
          "krve_customer_session_expires",
          result.data.expiresAt,
        );
      }

      setSuccess(
        mode === "login"
          ? "Welcome back to KRVE."
          : "Your KRVE account has been created.",
      );

      setTimeout(() => {
        router.replace(
          "/account",
        );

        router.refresh();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to KRVE.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className={styles.loadingPage}>
        <div
          className={
            styles.loadingSpinner
          }
        />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section
        className={styles.card}
      >
        <div
          className={styles.brand}
        >
          <Link href="/">
            KRVE
          </Link>

          <span>
            THE FASHION STUDIO
          </span>
        </div>

        <div
          className={styles.heading}
        >
          <p
            className={
              styles.eyebrow
            }
          >
            {mode === "login"
              ? "WELCOME BACK"
              : "JOIN KRVE"}
          </p>

          <h1>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h1>

          <p>
            {mode === "login"
              ? "Access your KRVE orders, wishlist and personalised shopping experience."
              : "Create your KRVE account and manage your orders, returns and profile in one place."}
          </p>
        </div>

        <div
          className={styles.tabs}
        >
          <button
            type="button"
            className={
              mode === "login"
                ? styles.activeTab
                : ""
            }
            onClick={() =>
              changeMode(
                "login",
              )
            }
          >
            SIGN IN
          </button>

          <button
            type="button"
            className={
              mode === "register"
                ? styles.activeTab
                : ""
            }
            onClick={() =>
              changeMode(
                "register",
              )
            }
          >
            CREATE ACCOUNT
          </button>
        </div>

        {error && (
          <div
            className={
              styles.error
            }
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className={
              styles.success
            }
          >
            {success}
          </div>
        )}

        <form
          onSubmit={submit}
          className={styles.form}
        >
          {mode ===
            "register" && (
            <div
              className={
                styles.twoColumns
              }
            >
              <label>
                <span>
                  FIRST NAME
                </span>

                <input
                  type="text"
                  value={
                    firstName
                  }
                  onChange={(event) =>
                    setFirstName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label>
                <span>
                  LAST NAME
                </span>

                <input
                  type="text"
                  value={
                    lastName
                  }
                  onChange={(event) =>
                    setLastName(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </label>
            </div>
          )}

          <label>
            <span>
              EMAIL ADDRESS
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target
                    .value,
                )
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          {mode ===
            "register" && (
            <label>
              <span>
                MOBILE NUMBER
              </span>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target
                      .value,
                  )
                }
                placeholder="+91 XXXXX XXXXX"
                autoComplete="tel"
              />
            </label>
          )}

          <label>
            <span>
              PASSWORD
            </span>

            <div
              className={
                styles.passwordField
              }
            >
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target
                      .value,
                  )
                }
                placeholder="Minimum 8 characters"
                autoComplete={
                  mode ===
                  "login"
                    ? "current-password"
                    : "new-password"
                }
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) =>
                      !value,
                  )
                }
              >
                {showPassword
                  ? "HIDE"
                  : "SHOW"}
              </button>
            </div>
          </label>

          {mode ===
            "register" && (
            <label>
              <span>
                CONFIRM PASSWORD
              </span>

              <div
                className={
                  styles.passwordField
                }
              >
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) =>
                        !value,
                    )
                  }
                >
                  {showConfirmPassword
                    ? "HIDE"
                    : "SHOW"}
                </button>
              </div>
            </label>
          )}

          {mode ===
            "login" && (
            <div
              className={
                styles.formOptions
              }
            >
              <label
                className={
                  styles.remember
                }
              >
                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className={
                  styles.forgot
                }
                onClick={() =>
                  setError(
                    "Password reset will be connected in the next step.",
                  )
                }
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={
              styles.submit
            }
          >
            {loading
              ? "PLEASE WAIT..."
              : mode ===
                "login"
              ? "SIGN IN"
              : "CREATE ACCOUNT"}
          </button>
        </form>

        <div
          className={
            styles.divider
          }
        >
          <span />
          <p>KRVE</p>
          <span />
        </div>

        <p
          className={
            styles.bottomText
          }
        >
          {mode === "login"
            ? "New to KRVE?"
            : "Already have a KRVE account?"}

          <button
            type="button"
            onClick={() =>
              changeMode(
                mode === "login"
                  ? "register"
                  : "login",
              )
            }
          >
            {mode === "login"
              ? " Create account"
              : " Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
