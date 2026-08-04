"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  SignIn,
  useUser,
} from "@clerk/nextjs";

import styles from "./auto-login-modal.module.css";

const POPUP_DELAY = 5000;

const SESSION_STORAGE_KEY =
  "krve_clerk_login_modal_closed";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      aria-hidden="true"
    >
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
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
  const {
    isLoaded,
    isSignedIn,
  } = useUser();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);

    document.body.style.overflow = "";

    window.sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      "true",
    );
  }, []);

  useEffect(() => {
    if (
      !isLoaded ||
      isSignedIn
    ) {
      setIsOpen(false);
      document.body.style.overflow = "";
      return;
    }

    const wasClosed =
      window.sessionStorage.getItem(
        SESSION_STORAGE_KEY,
      );

    if (wasClosed) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    }, POPUP_DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    isLoaded,
    isSignedIn,
  ]);

  useEffect(() => {
    if (isSignedIn) {
      setIsOpen(false);
      document.body.style.overflow = "";

      window.sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        "true",
      );
    }
  }, [isSignedIn]);

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

      document.body.style.overflow = "";
    };
  }, [
    closeModal,
    isOpen,
  ]);

  if (
    !isLoaded ||
    isSignedIn ||
    !isOpen
  ) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
    >
      <button
        type="button"
        className={styles.backdropButton}
        onClick={closeModal}
        aria-label="Close sign-in window"
      />

      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="KRVE customer sign in"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Close sign-in window"
        >
          <CloseIcon />
        </button>

        <aside className={styles.brandPanel}>
          <div className={styles.brand}>
            <span>KrvE</span>

            <small>
              THE FASHION STUDIO
            </small>
          </div>

          <div className={styles.monogram}>
            K
          </div>

          <div className={styles.brandMessage}>
            <p>PRIVATE ACCESS</p>

            <h2>
              Your wardrobe,
              intelligently curated.
            </h2>

            <span>
              Access your orders, wishlist,
              recommendations and virtual
              try-on experience.
            </span>
          </div>
        </aside>

        <div className={styles.authPanel}>
          <div className={styles.authEyebrow}>
            MEMBER LOGIN
          </div>

          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            forceRedirectUrl="/"
            appearance={{
              elements: {
                headerTitle: {
                  fontSize: "35px",
                },

                headerSubtitle: {
                  maxWidth: "340px",
                },

                footer: {
                  background: "transparent",
                },

                footerPages: {
                  display: "none",
                },
              },
            }}
          />

          <button
            type="button"
            className={styles.guestButton}
            onClick={closeModal}
          >
            CONTINUE AS GUEST
          </button>

          <div className={styles.security}>
            <ShieldIcon />

            <span>
              Your personal information is
              protected and encrypted.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
