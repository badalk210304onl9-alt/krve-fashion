"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import styles from "./auto-login-modal.module.css";

const MODAL_SESSION_KEY =
  "krve-login-popup-seen";

type LoginStep =
  | "login"
  | "otp";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M12 2 20 5v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

export default function AutoLoginModal() {
  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);

  const [
    step,
    setStep,
  ] =
    useState<LoginStep>(
      "login",
    );

  const [
    identifier,
    setIdentifier,
  ] =
    useState("");

  const [
    otp,
    setOtp,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    const alreadySeen =
      window.sessionStorage.getItem(
        MODAL_SESSION_KEY,
      );

    if (alreadySeen) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setIsOpen(true);

          document.body.style.overflow =
            "hidden";
        },
        5000,
      );

    return () => {
      window.clearTimeout(
        timer,
      );

      document.body.style.overflow =
        "";
    };
  }, []);

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
        closeModal();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen]);

  function closeModal() {
    setIsOpen(false);

    window.sessionStorage.setItem(
      MODAL_SESSION_KEY,
      "true",
    );

    document.body.style.overflow =
      "";
  }

  function validateIdentifier() {
    const value =
      identifier.trim();

    if (!value) {
      setError(
        "Please enter your email address or mobile number.",
      );

      return false;
    }

    const isEmail =
      value.includes("@") &&
      value.includes(".");

    const mobileDigits =
      value.replace(
        /\D/g,
        "",
      );

    const isMobile =
      mobileDigits.length >=
      10;

    if (
      !isEmail &&
      !isMobile
    ) {
      setError(
        "Please enter a valid email address or mobile number.",
      );

      return false;
    }

    return true;
  }

  function handleRequestOtp(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !validateIdentifier()
    ) {
      return;
    }

    setError("");
    setStep("otp");
  }

  function handleVerifyOtp(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      otp.trim().length !==
      6
    ) {
      setError(
        "Please enter the 6-digit OTP.",
      );

      return;
    }

    setError("");

    /*
      Actual OTP verification API
      will be connected here later.
    */

    closeModal();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={
        styles.overlay
      }
      role="presentation"
    >
      <button
        type="button"
        className={
          styles.overlayCloseArea
        }
        onClick={
          closeModal
        }
        aria-label="Close login popup"
      />

      <section
        className={
          styles.modal
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="krve-login-title"
      >
        <button
          type="button"
          className={
            styles.closeButton
          }
          onClick={
            closeModal
          }
          aria-label="Close login popup"
        >
          <CloseIcon />
        </button>

        <div
          className={
            styles.brandPanel
          }
        >
          <div
            className={
              styles.brand
            }
          >
            <span>
              KrvE
            </span>

            <small>
              THE FASHION STUDIO
            </small>
          </div>

          <div
            className={
              styles.brandContent
            }
          >
            <p>
              PRIVATE ACCESS
            </p>

            <h2>
              Your wardrobe,
              intelligently
              curated.
            </h2>

            <span>
              Sign in to access
              orders, wishlist,
              recommendations and
              virtual try-on.
            </span>
          </div>

          <div
            className={
              styles.monogram
            }
          >
            K
          </div>
        </div>

        <div
          className={
            styles.formPanel
          }
        >
          {step ===
          "login" ? (
            <>
              <div
                className={
                  styles.formHeader
                }
              >
                <p>
                  MEMBER LOGIN
                </p>

                <h1
                  id="krve-login-title"
                >
                  Welcome to
                  KRVE.
                </h1>

                <span>
                  Enter your email
                  address or mobile
                  number to continue.
                </span>
              </div>

              <form
                onSubmit={
                  handleRequestOtp
                }
              >
                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    EMAIL OR MOBILE
                    NUMBER
                  </span>

                  <div
                    className={
                      styles.inputShell
                    }
                  >
                    <UserIcon />

                    <input
                      type="text"
                      value={
                        identifier
                      }
                      onChange={(
                        event,
                      ) => {
                        setIdentifier(
                          event.target
                            .value,
                        );

                        setError("");
                      }}
                      placeholder="Enter email or mobile number"
                      autoFocus
                      autoComplete="email"
                    />
                  </div>
                </label>

                {error && (
                  <p
                    className={
                      styles.error
                    }
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.primaryButton
                  }
                >
                  REQUEST OTP

                  <ArrowIcon />
                </button>
              </form>

              <div
                className={
                  styles.divider
                }
              >
                <span />
                <p>OR</p>
                <span />
              </div>

              <button
                type="button"
                className={
                  styles.guestButton
                }
                onClick={
                  closeModal
                }
              >
                CONTINUE AS GUEST
              </button>

              <p
                className={
                  styles.createAccount
                }
              >
                New to KRVE?

                <button
                  type="button"
                >
                  Create an account
                </button>
              </p>
            </>
          ) : (
            <>
              <div
                className={
                  styles.formHeader
                }
              >
                <p>
                  OTP VERIFICATION
                </p>

                <h1
                  id="krve-login-title"
                >
                  Verify your
                  identity.
                </h1>

                <span>
                  Enter the 6-digit
                  OTP sent to{" "}
                  <strong>
                    {identifier}
                  </strong>
                </span>
              </div>

              <form
                onSubmit={
                  handleVerifyOtp
                }
              >
                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    6-DIGIT OTP
                  </span>

                  <input
                    className={
                      styles.otpInput
                    }
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={
                      otp
                    }
                    onChange={(
                      event,
                    ) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          "",
                        );

                      setOtp(value);
                      setError("");
                    }}
                    placeholder="••••••"
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </label>

                {error && (
                  <p
                    className={
                      styles.error
                    }
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={
                    styles.primaryButton
                  }
                >
                  VERIFY & CONTINUE

                  <ArrowIcon />
                </button>
              </form>

              <div
                className={
                  styles.otpActions
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep(
                      "login",
                    );

                    setOtp("");
                    setError("");
                  }}
                >
                  CHANGE EMAIL OR
                  NUMBER
                </button>

                <button
                  type="button"
                >
                  RESEND OTP
                </button>
              </div>
            </>
          )}

          <div
            className={
              styles.security
            }
          >
            <ShieldIcon />

            <span>
              Your personal
              information is
              protected and
              encrypted.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
