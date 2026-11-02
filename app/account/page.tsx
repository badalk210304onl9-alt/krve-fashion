"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

type User = {
  id: string;
  email?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
};

type Mode = "login" | "register" | "forgot";

const gold = "#d9a94b";

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message || data?.error || "Something went wrong. Please try again."
    );
  }

  return data;
}

function normalizeUser(raw: any): User | null {
  if (!raw) return null;

  const metadata = raw.user_metadata ?? raw.metadata ?? {};

  return {
    id: String(raw.id ?? raw.customerId ?? ""),
    email: raw.email ?? raw.customerEmail ?? null,
    name:
      raw.name ??
      raw.fullName ??
      metadata.full_name ??
      null,
    firstName:
      raw.firstName ??
      raw.first_name ??
      metadata.first_name ??
      null,
    lastName:
      raw.lastName ??
      raw.last_name ??
      metadata.last_name ??
      null,
    user_metadata: metadata,
  };
}

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (response.status === 401) {
          if (active) setUser(null);
          return;
        }

        const data = await readResponse(response);
        const raw =
          data?.user ??
          data?.customer ??
          data?.data?.user ??
          data?.data?.customer;

        if (active) setUser(normalizeUser(raw));
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoaded(true);
      }
    }

    void loadAccount();

    return () => {
      active = false;
    };
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setMessage("");
    setPassword("");
    setConfirmPassword("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
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
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      await readResponse(response);

      const me = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await readResponse(me);
      const raw =
        data?.user ??
        data?.customer ??
        data?.data?.user ??
        data?.data?.customer;

      const currentUser = normalizeUser(raw);

      if (!currentUser) {
        throw new Error("Login succeeded, but your session could not be loaded.");
      }

      setUser(currentUser);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to sign in."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setMessage("Please enter your first and last name.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
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
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const data = await readResponse(response);
      const raw =
        data?.user ??
        data?.customer ??
        data?.data?.user ??
        data?.data?.customer;

      if (raw) {
        setUser(normalizeUser(raw));
        router.refresh();
      } else {
        switchMode("login");
        setMessage(
          data?.message || "Account created. Please sign in to continue."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create account."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Password recovery is not connected yet. Please contact KRVE support."
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

      await readResponse(response);
      setUser(null);
      setPassword("");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to sign out."
      );
    } finally {
      setBusy(false);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "70vh",
    padding: "54px 20px 70px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(ellipse at 50% 35%, #21170b 0%, #090806 52%, #050505 100%)",
    color: "#f4ead8",
  };

  const shellStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "790px",
    border: "1px solid rgba(217,169,75,.55)",
    borderRadius: "13px",
    background: "rgba(12,10,7,.97)",
    boxShadow: "0 25px 90px rgba(0,0,0,.65)",
    overflow: "hidden",
    position: "relative",
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    height: "52px",
    padding: "0 15px",
    background: "#090807",
    border: "1px solid rgba(217,169,75,.35)",
    borderRadius: "5px",
    color: "#f7eddb",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "9px",
    color: gold,
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: ".16em",
  };

  const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "53px",
    border: "1px solid #e2b95e",
    borderRadius: "4px",
    background: "linear-gradient(100deg,#bd862b,#edc36e,#c28b32)",
    color: "#100c05",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: ".16em",
    cursor: "pointer",
  };

  if (!loaded) {
    return (
      <main style={pageStyle}>
        <div style={{ color: gold, letterSpacing: ".2em", fontSize: "11px" }}>
          KRVE · PRIVATE CLIENT
        </div>
      </main>
    );
  }

  if (user) {
    const name =
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email?.split("@")[0] ||
      "KRVE Client";

    return (
      <main style={pageStyle}>
        <section style={{ ...shellStyle, maxWidth: "650px", padding: "42px" }}>
          <div style={{ textAlign: "center" }}>
            <Crown color={gold} size={28} />
            <p style={{ color: gold, fontSize: "10px", letterSpacing: ".2em" }}>
              KRVE PRIVATE CLIENT
            </p>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "38px", fontWeight: 400 }}>
              Welcome back, {name}.
            </h1>
            <p style={{ color: "#a99c88", fontSize: "13px" }}>
              Your KRVE account is ready.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "12px", marginTop: "35px" }}>
            <Link href="/account/orders" style={accountLinkStyle}>
              <Package size={19} color={gold} />
              <span>MY ORDERS</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/wishlist" style={accountLinkStyle}>
              <Check size={19} color={gold} />
              <span>WISHLIST</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/account/profile" style={accountLinkStyle}>
              <UserRound size={19} color={gold} />
              <span>MY PROFILE</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {message && <p style={{ color: "#e5a4a0" }}>{message}</p>}

          <button
            onClick={signOut}
            disabled={busy}
            style={{ ...primaryButtonStyle, marginTop: "30px" }}
          >
            <LogOut size={14} style={{ verticalAlign: "middle", marginRight: 9 }} />
            {busy ? "PLEASE WAIT..." : "SIGN OUT"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={shellStyle}>
        <button
          type="button"
          aria-label="Close account"
          onClick={() => router.push("/")}
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            border: 0,
            background: "transparent",
            color: "#d9c49c",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <X size={22} />
        </button>

        <div
          style={{
            padding: "27px 34px 21px",
            borderBottom: "1px solid rgba(217,169,75,.24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: "35px", lineHeight: 1, color: "#e6c27b" }}>
              KrvE
            </div>
            <div style={{ fontSize: "8px", letterSpacing: ".28em", color: "#c5a96d", marginTop: "7px" }}>
              THE FASHION STUDIO
            </div>
          </div>

          <div style={{ color: gold, fontSize: "9px", letterSpacing: ".2em", marginRight: "38px" }}>
            MORE THAN FASHION. IT’S KRVE.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          }}
        >
          <aside
            style={{
              minHeight: "430px",
              padding: "42px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background:
                "linear-gradient(145deg,rgba(39,27,13,.75),rgba(9,8,7,.96))",
              borderRight: "1px solid rgba(217,169,75,.16)",
            }}
          >
            <span style={{ color: gold, fontSize: "10px", letterSpacing: ".25em", fontWeight: 800 }}>
              KRVE PRIVATE ACCESS
            </span>

            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(34px,4vw,53px)", lineHeight: 1.12, fontWeight: 400, margin: "22px 0 16px" }}>
              Your wardrobe.
              <em style={{ display: "block", color: "#d9ad59" }}>Your world.</em>
            </h1>

            <p style={{ color: "#a99d8c", fontSize: "13px", lineHeight: 1.9, maxWidth: "300px" }}>
              Your private space for purchases, saved pieces, personalised styling and delivery details.
            </p>

            <div style={{ marginTop: "55px", color: "#c6a45d", fontSize: "10px", letterSpacing: ".08em" }}>
              <ShieldCheck size={16} style={{ verticalAlign: "middle", marginRight: 9 }} />
              SECURE PRIVATE CLIENT ACCESS
            </div>
          </aside>

          <section style={{ padding: "45px 36px 34px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ textAlign: "center", marginBottom: "27px" }}>
              <Crown size={25} color={gold} />
              <p style={{ color: gold, fontSize: "10px", letterSpacing: ".24em", fontWeight: 800, margin: "16px 0 12px" }}>
                {mode === "register" ? "PRIVATE CLIENT ONBOARDING" : mode === "forgot" ? "ACCOUNT RECOVERY" : "MEMBER ACCOUNT"}
              </p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(25px,3vw,36px)", fontWeight: 400, margin: 0 }}>
                {mode === "register" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back."}
              </h2>
              <p style={{ color: "#a99d8c", fontSize: "12px", marginTop: "12px" }}>
                {mode === "register" ? "Join the KRVE private client experience." : mode === "forgot" ? "Enter your email to continue." : "Sign in to continue your KRVE experience."}
              </p>
            </div>

            <form
              onSubmit={mode === "register" ? handleRegister : mode === "forgot" ? handleForgot : handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "17px" }}
            >
              {mode === "register" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <label>
                    <span style={labelStyle}>FIRST NAME</span>
                    <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" style={fieldStyle} />
                  </label>
                  <label>
                    <span style={labelStyle}>LAST NAME</span>
                    <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" style={fieldStyle} />
                  </label>
                </div>
              )}

              <label>
                <span style={labelStyle}>EMAIL ADDRESS</span>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color={gold} style={{ position: "absolute", left: 14, top: 18 }} />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ ...fieldStyle, paddingLeft: "42px" }}
                  />
                </div>
              </label>

              {mode !== "forgot" && (
                <label>
                  <span style={labelStyle}>PASSWORD</span>
                  <div style={{ position: "relative" }}>
                    <LockKeyhole size={16} color={gold} style={{ position: "absolute", left: 14, top: 18 }} />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "register" ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      style={{ ...fieldStyle, paddingLeft: "42px", paddingRight: "43px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                      style={{ position: "absolute", right: 13, top: 16, border: 0, background: "transparent", color: "#938675", cursor: "pointer" }}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>
              )}

              {mode === "register" && (
                <label>
                  <span style={labelStyle}>CONFIRM PASSWORD</span>
                  <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" style={fieldStyle} />
                </label>
              )}

              {mode === "login" && (
                <button type="button" onClick={() => switchMode("forgot")} style={{ alignSelf: "flex-end", border: 0, background: "transparent", color: gold, fontSize: "10px", cursor: "pointer" }}>
                  FORGOT PASSWORD?
                </button>
              )}

              {message && (
                <p role="alert" style={{ color: "#e6a39c", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>
                  {message}
                </p>
              )}

              <button type="submit" disabled={busy} style={primaryButtonStyle}>
                {busy ? "PLEASE WAIT..." : mode === "register" ? "CREATE ACCOUNT" : mode === "forgot" ? "SEND RESET REQUEST" : "CONTINUE"}
                {!busy && <ArrowRight size={16} style={{ verticalAlign: "middle", marginLeft: 10 }} />}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "23px", paddingTop: "19px", borderTop: "1px solid rgba(217,169,75,.15)", fontSize: "11px", color: "#948878" }}>
              {mode === "login" ? "Don’t have an account?" : "Already a KRVE client?"}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                style={{ border: 0, background: "transparent", color: gold, fontWeight: 900, marginLeft: "9px", cursor: "pointer", fontSize: "10px", letterSpacing: ".1em" }}
              >
                {mode === "login" ? "SIGN UP" : "SIGN IN"}
              </button>
            </div>

            <div style={{ textAlign: "center", color: "#766b5b", fontSize: "9px", letterSpacing: ".08em", marginTop: "18px" }}>
              <Check size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />
              SECURE KRVE ACCOUNT
            </div>
          </section>
        </div>

        <div style={{ padding: "15px 25px", borderTop: "1px solid rgba(217,169,75,.2)", display: "flex", justifyContent: "center", gap: "25px", flexWrap: "wrap", color: "#c4ad83", fontSize: "10px" }}>
          <span><ShieldCheck size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />SECURE & SAFE SHOPPING</span>
          <span><Check size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />PREMIUM CLIENT EXPERIENCE</span>
          <span><Phone size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />DEDICATED SUPPORT</span>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 700px) {
          main > section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          main > section > div:nth-child(2) > aside {
            min-height: auto !important;
            padding: 28px 25px !important;
          }
          main > section > div:nth-child(2) > aside h1 {
            font-size: 34px !important;
            margin: 12px 0 !important;
          }
          main > section > div:nth-child(2) > aside p {
            margin-bottom: 0 !important;
          }
          main > section > div:nth-child(2) > aside div:last-child {
            margin-top: 20px !important;
          }
          main > section > div:nth-child(2) > section {
            padding: 30px 22px !important;
          }
        }
      `}</style>
    </main>
  );
}

const accountLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  padding: "17px",
  border: "1px solid rgba(217,169,75,.28)",
  borderRadius: "5px",
  color: "#e8dcc8",
  textDecoration: "none",
  fontSize: "10px",
  letterSpacing: ".08em",
};
