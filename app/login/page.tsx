"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

type ApiResult = {
  success?: boolean;
  message?: string;
  data?: {
    customer?: {
      id: string;
      name?: string;
      fullName?: string;
      email?: string | null;
      phone?: string | null;
    };
    authenticated?: boolean;
  };
  error?: { message?: string };
};

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();

          if (active && data?.authenticated && data?.user) {
            router.replace("/account");
            return;
          }
        }

        if (active) setChecking(false);
      })
      .catch(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  function cleanPhone(value: string) {
    return value.replace(/[^\d]/g, "").slice(0, 10);
  }

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setBusy(true);

    try {
      const response = await fetch("/api/customer/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ phone: `+91${phone}` }),
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResult;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message ||
            result.message ||
            "OTP could not be sent. Please try again."
        );
      }

      setStep("otp");
      setMessage("A verification code has been sent to your mobile number.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send OTP."
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
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
          phone: `+91${phone}`,
          code: otp,
        }),
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResult;

      if (
        !response.ok ||
        !result.success ||
        !result.data?.authenticated
      ) {
        throw new Error(
          result.error?.message ||
            result.message ||
            "OTP verification failed."
        );
      }

      const customer = result.data.customer;

      if (customer) {
        window.localStorage.setItem(
          "krve_customer",
          JSON.stringify(customer)
        );
      }

      setMessage("Welcome to KRVE. Your mobile number is verified.");

      window.setTimeout(() => {
        router.replace("/account");
        router.refresh();
      }, 450);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to verify OTP."
      );
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <main className={styles.loadingPage}>
        <span className={styles.spinner} />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* LEFT FASHION IMAGE */}
      <section className={styles.visual}>
        <Image
          src="/images/krve-login-editorial.jpg"
          alt="KRVE luxury fashion editorial"
          fill
          priority
          sizes="(max-width: 800px) 100vw, 56vw"
          className={styles.visualImage}
        />

        <div className={styles.visualShade} />

        <Link href="/" className={styles.brand}>
          <strong>KRVE</strong>
          <span>THE FASHION STUDIO</span>
        </Link>

        <div className={styles.visualCopy}>
          <span className={styles.kicker}>
            THE KRVE EXPERIENCE
          </span>

          <h1>
            Welcome
            <br />
            <em>Back.</em>
          </h1>

          <p>
            CONTINUE YOUR
            <br />
            FASHION JOURNEY
          </p>

          <i />
        </div>

        <div className={styles.visualFoot}>
          MORE THAN FASHION. IT’S KRVE.
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <section className={styles.loginSide}>
        <div className={styles.topLine}>
          MORE THAN FASHION. IT’S KRVE.
        </div>

        <div className={styles.card}>
          <div className={styles.star}>✧</div>

          <span className={styles.eyebrow}>
            {step === "phone" ? "WELCOME TO KRVE" : "ONE LAST STEP"}
          </span>

          <h2>
            {step === "phone" ? "Login to KRVE" : "Verify your number"}
          </h2>

          <p className={styles.description}>
            {step === "phone"
              ? "Enter your mobile number to receive a secure one-time password."
              : `We’ve sent a 6-digit code to +91 ${phone}. Enter it below to continue.`}
          </p>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className={styles.success} role="status">
              {message}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={sendOtp} className={styles.form}>
              <label className={styles.fieldLabel} htmlFor="phone">
                MOBILE NUMBER
              </label>

              <div className={styles.phoneField}>
                <span>+91</span>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(event) =>
                    setPhone(cleanPhone(event.target.value))
                  }
                  maxLength={10}
                  required
                />
              </div>

              <button
                className={styles.submit}
                type="submit"
                disabled={busy}
              >
                {busy ? "SENDING CODE..." : "SEND OTP"}
                <span>→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className={styles.form}>
              <label className={styles.fieldLabel} htmlFor="otp">
                6-DIGIT OTP
              </label>

              <input
                id="otp"
                className={styles.otpInput}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="• • • • • •"
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
                required
              />

              <button
                className={styles.submit}
                type="submit"
                disabled={busy}
              >
                {busy ? "VERIFYING..." : "VERIFY & CONTINUE"}
                <span>→</span>
              </button>

              <button
                className={styles.textButton}
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                disabled={busy}
              >
                CHANGE MOBILE NUMBER
              </button>

              <button
                className={styles.resend}
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                  setMessage("Tap SEND OTP to request a new code.");
                }}
                disabled={busy}
              >
                RESEND OTP
              </button>
            </form>
          )}

          <div className={styles.divider}>
            <span />
            OR
            <span />
          </div>

          <p className={styles.terms}>
            By continuing, you agree to KRVE’s{" "}
            <Link href="/terms-and-conditions">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className={styles.benefits}>
          <div>
            <b>◇</b>
            <span>
              Premium Quality
              <br />
              Fashion
            </span>
          </div>

          <div>
            <b>♢</b>
            <span>
              Secure &amp; Safe
              <br />
              Shopping
            </span>
          </div>

          <div>
            <b>♧</b>
            <span>
              Dedicated
              <br />
              Support
            </span>
          </div>
        </div>

        <div className={styles.bottomLine}>
          STEP INTO A MORE STYLISH YOU
        </div>
      </section>
    </main>
  );
}
