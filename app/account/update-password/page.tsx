"use client";

import Link from "next/link";

import {
  FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

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
    success,
    setSuccess,
  ] =
    useState(false);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setSuccess(false);

    if (
      password.length <
      8
    ) {
      setMessage(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match.",
      );

      return;
    }

    setBusy(true);

    try {
      const supabase =
        createClient();

      const {
        error,
      } =
        await supabase.auth.updateUser(
          {
            password,
          },
        );

      if (error) {
        throw error;
      }

      setSuccess(true);

      setMessage(
        "Your KRVE password has been updated successfully.",
      );

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(
        error instanceof
        Error
          ? error.message
          : "Password could not be updated.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="krve-password-page"
    >
      <div
        className="krve-password-glow krve-password-glow-one"
      />

      <div
        className="krve-password-glow krve-password-glow-two"
      />

      <header
        className="krve-password-header"
      >
        <Link
          href="/"
          className="krve-password-logo"
        >
          <span>
            K
            <small>
              rv
            </small>
            E
          </span>

          <strong>
            The Fashion Studio
          </strong>
        </Link>

        <Link
          href="/account"
          className="krve-password-back"
        >
          <ArrowLeft
            size={15}
          />

          Back to Account
        </Link>
      </header>

      <section
        className="krve-password-shell"
      >
        <div
          className="krve-password-card"
        >
          <div
            className="krve-password-icon"
          >
            <ShieldCheck
              size={30}
              strokeWidth={1.25}
            />
          </div>

          <span
            className="krve-password-eyebrow"
          >
            KRVE ACCOUNT SECURITY
          </span>

          <h1>
            Create a new
            password.
          </h1>

          <p
            className="krve-password-description"
          >
            Choose a secure password
            for your KRVE private
            client account.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <label>
              <span>
                NEW PASSWORD
              </span>

              <div
                className="krve-password-field"
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
                    password
                  }
                  onChange={(
                    event,
                  ) =>
                    setPassword(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
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

            <label>
              <span>
                CONFIRM NEW PASSWORD
              </span>

              <div
                className="krve-password-field"
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
                    confirmPassword
                  }
                  onChange={(
                    event,
                  ) =>
                    setConfirmPassword(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                />
              </div>
            </label>

            {message ? (
              <div
                className={
                  success
                    ? "krve-password-message success"
                    : "krve-password-message"
                }
              >
                {success ? (
                  <Check
                    size={15}
                  />
                ) : null}

                <span>
                  {message}
                </span>
              </div>
            ) : null}

            <button
              type="submit"
              className="krve-password-submit"
              disabled={
                busy
              }
            >
              {busy
                ? "UPDATING PASSWORD..."
                : "UPDATE PASSWORD"}
            </button>
          </form>

          {success ? (
            <Link
              href="/account"
              className="krve-password-continue"
            >
              CONTINUE TO MY ACCOUNT →
            </Link>
          ) : null}

          <div
            className="krve-password-security"
          >
            <ShieldCheck
              size={16}
            />

            <span>
              Your password is
              handled securely by
              Supabase authentication.
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        .krve-password-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(216,165,41,.08),
              transparent 30%
            ),
            #020202;
          color: #ffffff;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .krve-password-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        .krve-password-glow-one {
          top: -220px;
          right: 3%;
          width: 500px;
          height: 500px;
          background:
            rgba(
              216,
              165,
              41,
              .08
            );
        }

        .krve-password-glow-two {
          bottom: -270px;
          left: -120px;
          width: 540px;
          height: 540px;
          background:
            rgba(
              125,
              81,
              8,
              .08
            );
        }

        .krve-password-header {
          position: relative;
          z-index: 2;
          width:
            min(
              92%,
              1400px
            );
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 20px;
          margin: 0 auto;
          border-bottom:
            1px solid
            rgba(
              216,
              165,
              41,
              .28
            );
        }

        .krve-password-logo {
          display: flex;
          flex-direction:
            column;
          color: #d8a529;
          text-decoration: none;
        }

        .krve-password-logo > span {
          font-family:
            Georgia,
            serif;
          font-size: 36px;
          line-height: .8;
        }

        .krve-password-logo small {
          font-size: 21px;
        }

        .krve-password-logo strong {
          margin-top: 10px;
          font-family:
            Arial,
            sans-serif;
          font-size: 7px;
          letter-spacing:
            .17em;
          text-transform:
            uppercase;
        }

        .krve-password-back {
          min-height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .32
            );
          padding: 0 14px;
          color:
            rgba(
              255,
              255,
              255,
              .55
            );
          font-size: 8px;
          letter-spacing:
            .1em;
          text-decoration: none;
          text-transform:
            uppercase;
        }

        .krve-password-shell {
          position: relative;
          z-index: 2;
          width:
            min(
              92%,
              620px
            );
          margin: 0 auto;
          padding:
            70px 0 90px;
        }

        .krve-password-card {
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .42
            );
          background:
            linear-gradient(
              145deg,
              rgba(
                216,
                165,
                41,
                .03
              ),
              transparent
              45%
            ),
            #060606;
          padding:
            50px 46px;
          box-shadow:
            0 40px 100px
            rgba(
              0,
              0,
              0,
              .5
            );
        }

        .krve-password-icon {
          width: 72px;
          height: 72px;
          display: grid;
          place-items:
            center;
          margin:
            0 auto 24px;
          border:
            1px solid
            #d8a529;
          border-radius: 50%;
          color: #e8b632;
        }

        .krve-password-eyebrow {
          display: block;
          color: #d8a529;
          text-align: center;
          font-size: 9px;
          font-weight: 800;
          letter-spacing:
            .18em;
        }

        .krve-password-card h1 {
          margin:
            15px 0 9px;
          text-align: center;
          font-family:
            Georgia,
            serif;
          font-size:
            clamp(
              35px,
              5vw,
              46px
            );
          font-weight: 400;
          line-height: 1.08;
        }

        .krve-password-description {
          max-width: 430px;
          margin:
            0 auto;
          color:
            rgba(
              255,
              255,
              255,
              .4
            );
          text-align: center;
          font-size: 12px;
          line-height: 1.7;
        }

        form {
          display: grid;
          gap: 19px;
          margin-top: 34px;
        }

        label > span {
          display: block;
          margin-bottom: 8px;
          color: #b99a4e;
          font-size: 8px;
          font-weight: 700;
          letter-spacing:
            .12em;
        }

        .krve-password-field {
          min-height: 52px;
          display: flex;
          align-items: center;
          gap: 10px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .27
            );
          background:
            #090909;
          padding:
            0 13px;
          color: #d8a529;
        }

        .krve-password-field:focus-within {
          border-color:
            #d8a529;
        }

        .krve-password-field input {
          width: 100%;
          height: 50px;
          border: 0;
          outline: 0;
          background:
            transparent;
          color: #ffffff;
          font-size: 12px;
        }

        .krve-password-field input::placeholder {
          color:
            rgba(
              255,
              255,
              255,
              .24
            );
        }

        .krve-password-field button {
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

        .krve-password-message {
          display: flex;
          align-items:
            flex-start;
          gap: 8px;
          border:
            1px solid
            rgba(
              210,
              77,
              77,
              .28
            );
          background:
            rgba(
              210,
              77,
              77,
              .05
            );
          padding:
            12px 13px;
          color: #dd7777;
          font-size: 11px;
          line-height: 1.5;
        }

        .krve-password-message.success {
          border-color:
            rgba(
              216,
              165,
              41,
              .28
            );
          background:
            rgba(
              216,
              165,
              41,
              .05
            );
          color: #e7c76f;
        }

        .krve-password-submit {
          min-height: 53px;
          border: 0;
          background:
            linear-gradient(
              90deg,
              #b97d0e,
              #efbd42,
              #ca8b14
            );
          color: #050505;
          font-size: 9px;
          font-weight: 900;
          letter-spacing:
            .13em;
          cursor: pointer;
        }

        .krve-password-submit:disabled {
          opacity: .6;
          cursor:
            not-allowed;
        }

        .krve-password-continue {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content:
            center;
          margin-top: 13px;
          border:
            1px solid
            rgba(
              216,
              165,
              41,
              .45
            );
          color: #d8a529;
          font-size: 8px;
          font-weight: 800;
          letter-spacing:
            .12em;
          text-decoration: none;
        }

        .krve-password-security {
          display: flex;
          align-items:
            center;
          justify-content:
            center;
          gap: 8px;
          margin-top: 25px;
          color:
            rgba(
              255,
              255,
              255,
              .28
            );
          font-size: 9px;
          line-height: 1.5;
          text-align: center;
        }

        @media (
          max-width: 560px
        ) {
          .krve-password-header {
            min-height: 78px;
          }

          .krve-password-logo > span {
            font-size: 30px;
          }

          .krve-password-back {
            padding:
              0 9px;
            font-size: 7px;
          }

          .krve-password-shell {
            width:
              calc(
                100% - 30px
              );
            padding:
              42px 0 60px;
          }

          .krve-password-card {
            padding:
              38px 21px;
          }
        }
      `}</style>
    </main>
  );
}
