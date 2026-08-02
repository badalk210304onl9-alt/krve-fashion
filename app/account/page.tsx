"use client";

import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <main className="account-page">
      <section className="account-art"><div><p className="eyebrow">KRVE Private Client</p><h1>Your wardrobe,<br />remembered intelligently.</h1><p>Save measurements, track orders, manage your wishlist and continue your virtual styling journey.</p></div></section>
      <section className="account-panel"><div className="account-card"><div className="account-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign In</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Create Account</button></div><h2>{mode === "login" ? "Welcome back" : "Join KRVE"}</h2><p>{mode === "login" ? "Continue your personalised KRVE experience." : "Create your private customer profile."}</p><form onSubmit={(event) => event.preventDefault()}>{mode === "register" && <label>Full name<input placeholder="Your name" /></label>}<label>Email address<input type="email" placeholder="name@example.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label><button className="primary-button dark-button full" type="submit">{mode === "login" ? "Sign In" : "Create Account"}</button></form><small>Authentication backend will be connected in the next phase.</small></div></section>
    </main>
  );
}
