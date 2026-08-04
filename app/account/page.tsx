"use client";

import Link from "next/link";

import {
  SignIn,
  UserProfile,
  useClerk,
  useUser,
} from "@clerk/nextjs";

import { useCart } from "@/components/cart-provider";

import styles from "./account.module.css";

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />

      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M4 7h16v13H4z" />

      <path d="M8 7V4h8v3" />

      <path d="M4 11h16" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M12 22s7-6.1 7-13a7 7 0 1 0-14 0c0 6.9 7 13 7 13Z" />

      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M12 2 20 5v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3Z" />

      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" />

      <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
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

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M10 17l5-5-5-5" />

      <path d="M15 12H3" />

      <path d="M14 3h6v18h-6" />
    </svg>
  );
}

function SignedOutAccount() {
  return (
    <main className={styles.signedOutPage}>
      <section className={styles.loginShell}>
        <aside className={styles.loginBrand}>
          <div className={styles.brandLogo}>
            <span>KrvE</span>

            <small>THE FASHION STUDIO</small>
          </div>

          <div className={styles.loginMonogram}>
            K
          </div>

          <div className={styles.brandMessage}>
            <p>KRVE PRIVATE ACCESS</p>

            <h1>
              Your wardrobe.

              <em>Your world.</em>
            </h1>

            <span>
              Sign in to manage orders, saved pieces,
              delivery addresses, personal recommendations
              and account security.
            </span>
          </div>

          <div className={styles.brandBenefits}>
            <div>
              <HeartIcon />

              <span>Saved wishlist</span>
            </div>

            <div>
              <OrderIcon />

              <span>Order history</span>
            </div>

            <div>
              <SparkleIcon />

              <span>AI styling profile</span>
            </div>
          </div>
        </aside>

        <section className={styles.loginPanel}>
          <div className={styles.loginEyebrow}>
            <span />

            MEMBER ACCOUNT
          </div>

          <SignIn
            routing="hash"
            forceRedirectUrl="/account"
            appearance={{
              elements: {
                rootBox: {
                  width: "100%",
                },

                cardBox: {
                  width: "100%",
                  boxShadow: "none",
                },

                card: {
                  width: "100%",
                  padding: "0",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                },

                headerTitle: {
                  color: "#f7efe4",
                  fontFamily: "var(--font-display)",
                  fontSize: "42px",
                  fontWeight: "500",
                  lineHeight: "1",
                },

                headerSubtitle: {
                  color: "#918980",
                  fontSize: "11px",
                },

                socialButtonsBlockButton: {
                  minHeight: "48px",
                  background: "#050505",
                  border:
                    "1px solid rgba(224, 172, 43, 0.35)",
                  borderRadius: "0",
                  color: "#f4ede4",
                },

                socialButtonsBlockButtonText: {
                  color: "#f4ede4",
                  fontSize: "10px",
                  fontWeight: "700",
                },

                dividerLine: {
                  background:
                    "rgba(224, 172, 43, 0.22)",
                },

                dividerText: {
                  color: "#776f67",
                },

                formFieldLabel: {
                  color: "#a49b91",
                  fontSize: "9px",
                  fontWeight: "800",
                  letterSpacing: ".08em",
                },

                formFieldInput: {
                  minHeight: "49px",
                  background: "#030303",
                  border:
                    "1px solid rgba(224, 172, 43, 0.42)",
                  borderRadius: "0",
                  color: "#f5eee5",
                },

                formButtonPrimary: {
                  minHeight: "50px",
                  background:
                    "linear-gradient(135deg, #ca8610, #efbd43, #d99e20)",
                  border: "1px solid #e0ac2b",
                  borderRadius: "0",
                  color: "#050505",
                  fontSize: "9px",
                  fontWeight: "900",
                  letterSpacing: ".12em",
                  boxShadow: "none",
                },

                footerActionText: {
                  color: "#817970",
                },

                footerActionLink: {
                  color: "#e0ac2b",
                  fontWeight: "800",
                },

                formFieldAction: {
                  color: "#e0ac2b",
                },

                identityPreviewText: {
                  color: "#f5eee5",
                },

                formResendCodeLink: {
                  color: "#e0ac2b",
                },
              },
            }}
          />

          <div className={styles.loginSecurity}>
            <ShieldIcon />

            <div>
              <strong>
                SECURE MEMBER ACCESS
              </strong>

              <span>
                Your information is protected by encrypted
                authentication.
              </span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function AccountDashboard() {
  const {
    user,
    isLoaded,
  } = useUser();

  const {
    signOut,
  } = useClerk();

  const {
    cartCount,
    wishlist,
    hydrated,
  } = useCart();

  async function handleSignOut() {
    await signOut({
      redirectUrl: "/",
    });
  }

  if (!isLoaded || !user) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingMark}>
          K
        </div>

        <p>
          Preparing your KRVE account...
        </p>
      </main>
    );
  }

  const customerName =
    user.fullName ||
    user.firstName ||
    user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "KRVE Member";

  const customerEmail =
    user.primaryEmailAddress?.emailAddress ||
    "Email not added";

  const customerInitial =
    customerName.charAt(0).toUpperCase();

  return (
    <main className={styles.accountPage}>
      <section className={styles.accountHero}>
        <div className={styles.heroPattern} />

        <div className={styles.heroIdentity}>
          <div className={styles.avatar}>
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={customerName}
              />
            ) : (
              <span>
                {customerInitial}
              </span>
            )}

            <div className={styles.memberStatus} />
          </div>

          <div className={styles.heroCopy}>
            <p>KRVE PRIVATE MEMBER</p>

            <h1>
              Welcome,

              <em>{customerName}.</em>
            </h1>

            <span>{customerEmail}</span>
          </div>
        </div>

        <div className={styles.heroMembership}>
          <SparkleIcon />

          <div>
            <p>MEMBERSHIP</p>

            <strong>
              KRVE PRIVATE ACCESS
            </strong>

            <span>
              Personal luxury experience enabled
            </span>
          </div>
        </div>
      </section>

      <section className={styles.accountContent}>
        <aside className={styles.accountSidebar}>
          <div className={styles.sidebarHeading}>
            <p>MY KRVE</p>

            <h2>
              Account overview
            </h2>
          </div>

          <nav className={styles.accountNavigation}>
            <a
              href="#overview"
              className={styles.activeNavigation}
            >
              <UserIcon />

              <div>
                <strong>Overview</strong>

                <span>
                  Your private account
                </span>
              </div>

              <b>→</b>
            </a>

            <a href="#profile">
              <ShieldIcon />

              <div>
                <strong>
                  Profile &amp; Security
                </strong>

                <span>
                  Personal information
                </span>
              </div>

              <b>→</b>
            </a>

            <Link href="/wishlist">
              <HeartIcon />

              <div>
                <strong>Wishlist</strong>

                <span>
                  {wishlist.length} saved pieces
                </span>
              </div>

              <b>→</b>
            </Link>

            <Link href="/cart">
              <OrderIcon />

              <div>
                <strong>
                  Shopping Bag
                </strong>

                <span>
                  {cartCount} items
                </span>
              </div>

              <b>→</b>
            </Link>

            <Link href="/ai-stylist">
              <SparkleIcon />

              <div>
                <strong>
                  AI Style Profile
                </strong>

                <span>
                  Personal recommendations
                </span>
              </div>

              <b>→</b>
            </Link>
          </nav>

          <button
            type="button"
            className={styles.signOutButton}
            onClick={handleSignOut}
          >
            <LogoutIcon />

            SIGN OUT
          </button>
        </aside>

        <div className={styles.dashboard}>
          <section
            id="overview"
            className={styles.overviewSection}
          >
            <div className={styles.sectionHeading}>
              <div>
                <p>ACCOUNT OVERVIEW</p>

                <h2>
                  Your private KRVE world.
                </h2>
              </div>

              <span>
                {hydrated
                  ? "ACCOUNT READY"
                  : "LOADING ACCOUNT"}
              </span>
            </div>

            <div className={styles.statGrid}>
              <Link
                href="/wishlist"
                className={styles.statCard}
              >
                <div className={styles.statIcon}>
                  <HeartIcon />
                </div>

                <p>SAVED PIECES</p>

                <strong>
                  {wishlist.length}
                </strong>

                <span>
                  View your private wishlist
                </span>

                <b>→</b>
              </Link>

              <Link
                href="/cart"
                className={styles.statCard}
              >
                <div className={styles.statIcon}>
                  <OrderIcon />
                </div>

                <p>SHOPPING BAG</p>

                <strong>
                  {cartCount}
                </strong>

                <span>
                  Review your current selections
                </span>

                <b>→</b>
              </Link>

              <Link
                href="/ai-stylist"
                className={styles.statCard}
              >
                <div className={styles.statIcon}>
                  <SparkleIcon />
                </div>

                <p>AI STYLE PROFILE</p>

                <strong>
                  ACTIVE
                </strong>

                <span>
                  Discover personalised pieces
                </span>

                <b>→</b>
              </Link>
            </div>
          </section>

          <section className={styles.featureGrid}>
            <article className={styles.ordersCard}>
              <div className={styles.cardHeading}>
                <div>
                  <p>RECENT ORDERS</p>

                  <h2>
                    Your order history
                  </h2>
                </div>

                <OrderIcon />
              </div>

              <div className={styles.emptyOrders}>
                <div className={styles.emptyOrderIcon}>
                  <OrderIcon />
                </div>

                <h3>
                  No completed orders yet.
                </h3>

                <p>
                  Your confirmed KRVE purchases will
                  appear here after your first successful
                  checkout.
                </p>

                <Link href="/collections">
                  EXPLORE COLLECTIONS

                  <ArrowIcon />
                </Link>
              </div>
            </article>

            <article className={styles.addressCard}>
              <div className={styles.cardHeading}>
                <div>
                  <p>DELIVERY ADDRESS</p>

                  <h2>
                    Saved locations
                  </h2>
                </div>

                <AddressIcon />
              </div>

              <div className={styles.addressBody}>
                <div className={styles.addressMark}>
                  <AddressIcon />
                </div>

                <h3>
                  No delivery address saved.
                </h3>

                <p>
                  Your preferred shipping address will be
                  securely saved after checkout.
                </p>

                <Link href="/checkout">
                  ADD DURING CHECKOUT

                  <ArrowIcon />
                </Link>
              </div>
            </article>
          </section>

          <section className={styles.stylistBanner}>
            <div className={styles.bannerIcon}>
              <SparkleIcon />
            </div>

            <div className={styles.bannerCopy}>
              <p>KRVE AI STYLIST</p>

              <h2>
                Discover fashion selected

                <em>around you.</em>
              </h2>

              <span>
                Build your personal style profile and
                receive intelligent luxury-fashion
                recommendations.
              </span>
            </div>

            <Link href="/ai-stylist">
              OPEN AI STYLIST

              <ArrowIcon />
            </Link>
          </section>

          <section
            id="profile"
            className={styles.profileSection}
          >
            <div className={styles.sectionHeading}>
              <div>
                <p>PROFILE &amp; SECURITY</p>

                <h2>
                  Manage your identity.
                </h2>
              </div>

              <ShieldIcon />
            </div>

            <div className={styles.profileShell}>
              <UserProfile
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: {
                      width: "100%",
                    },

                    cardBox: {
                      width: "100%",
                      boxShadow: "none",
                    },

                    card: {
                      width: "100%",
                      background: "#050505",
                      border:
                        "1px solid rgba(224, 172, 43, 0.32)",
                      borderRadius: "0",
                      boxShadow: "none",
                    },

                    navbar: {
                      background: "#070707",
                      borderRight:
                        "1px solid rgba(224, 172, 43, 0.22)",
                    },

                    navbarButton: {
                      color: "#a49c92",
                    },

                    navbarButtonActive: {
                      color: "#e0ac2b",
                      background:
                        "rgba(224, 172, 43, 0.06)",
                    },

                    pageScrollBox: {
                      background: "#050505",
                    },

                    headerTitle: {
                      color: "#f5eee5",
                      fontFamily:
                        "var(--font-display)",
                      fontSize: "32px",
                      fontWeight: "500",
                    },

                    headerSubtitle: {
                      color: "#8d857c",
                    },

                    profileSectionTitleText: {
                      color: "#e0ac2b",
                    },

                    profileSectionPrimaryButton: {
                      color: "#e0ac2b",
                    },

                    formFieldLabel: {
                      color: "#9d958b",
                    },

                    formFieldInput: {
                      background: "#020202",
                      color: "#f5eee5",
                      border:
                        "1px solid rgba(224, 172, 43, 0.38)",
                      borderRadius: "0",
                    },

                    formButtonPrimary: {
                      background:
                        "linear-gradient(135deg, #ca8610, #efbd43, #d99e20)",
                      color: "#050505",
                      borderRadius: "0",
                    },
                  },
                }}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function AccountPage() {
  const {
    isLoaded,
    isSignedIn,
  } = useUser();

  if (!isLoaded) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingMark}>
          K
        </div>

        <p>
          Preparing your KRVE account...
        </p>
      </main>
    );
  }

  if (!isSignedIn) {
    return <SignedOutAccount />;
  }

  return <AccountDashboard />;
}
