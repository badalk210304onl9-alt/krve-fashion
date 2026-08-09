"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId =
    searchParams.get("order_id") ||
    "KRVE ORDER";

  const paymentMethod =
    (
      searchParams.get("payment_method") ||
      ""
    ).toLowerCase();

  const paymentStatus =
    (
      searchParams.get("payment_status") ||
      ""
    ).toLowerCase();

  const isCOD =
    paymentMethod === "cod";

  const isPaid =
    paymentStatus === "paid";

  return (
    <main
      style={{
        minHeight: "calc(100vh - 180px)",
        background: "#030303",
        color: "#ffffff",
        padding: "70px 20px 90px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          border:
            "1px solid rgba(216,165,41,0.45)",
          background:
            "linear-gradient(145deg,#080808,#030303)",
          padding: "60px 45px",
          textAlign: "center",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* SUCCESS ICON */}

        <div
          style={{
            width: "86px",
            height: "86px",
            borderRadius: "50%",
            border: "1px solid #d8a529",
            margin: "0 auto 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8b632",
            fontSize: "36px",
            fontFamily: "serif",
            boxShadow:
              "0 0 40px rgba(216,165,41,0.08)",
          }}
        >
          ✓
        </div>

        {/* LABEL */}

        <p
          style={{
            margin: 0,
            color: "#e8b632",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2.5px",
          }}
        >
          ORDER CONFIRMED
        </p>

        {/* TITLE */}

        <h1
          style={{
            margin: "18px 0 14px",
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(36px,5vw,54px)",
            lineHeight: 1.1,
          }}
        >
          Thank You For
          <br />
          Your Order.
        </h1>

        <p
          style={{
            margin: "0 auto",
            maxWidth: "540px",
            color: "#9d9d9d",
            fontSize: "14px",
            lineHeight: 1.8,
          }}
        >
          Your KRVE order has been successfully
          placed. We will keep you updated as your
          order moves from confirmation to delivery.
        </p>

        {/* ORDER NUMBER */}

        <div
          style={{
            margin: "38px 0 0",
            padding: "24px 20px",
            borderTop:
              "1px solid rgba(216,165,41,0.22)",
            borderBottom:
              "1px solid rgba(216,165,41,0.22)",
          }}
        >
          <span
            style={{
              display: "block",
              color: "#777",
              fontSize: "10px",
              letterSpacing: "2px",
              marginBottom: "9px",
            }}
          >
            KRVE ORDER NUMBER
          </span>

          <strong
            style={{
              color: "#e8b632",
              fontSize: "19px",
              letterSpacing: "0.5px",
              wordBreak: "break-word",
            }}
          >
            {orderId}
          </strong>
        </div>

        {/* PAYMENT INFORMATION */}

        <div
          style={{
            marginTop: "32px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            border:
              "1px solid rgba(216,165,41,0.22)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderRight:
                "1px solid rgba(216,165,41,0.18)",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#777",
                fontSize: "10px",
                letterSpacing: "1.5px",
                marginBottom: "10px",
              }}
            >
              PAYMENT METHOD
            </span>

            <strong
              style={{
                color: "#ffffff",
                fontSize: "14px",
              }}
            >
              {isCOD
                ? "Cash on Delivery"
                : "Online Payment"}
            </strong>
          </div>

          <div
            style={{
              padding: "24px",
            }}
          >
            <span
              style={{
                display: "block",
                color: "#777",
                fontSize: "10px",
                letterSpacing: "1.5px",
                marginBottom: "10px",
              }}
            >
              PAYMENT STATUS
            </span>

            <strong
              style={{
                color: "#e8b632",
                fontSize: "14px",
              }}
            >
              {isCOD
                ? "PAYMENT DUE ON DELIVERY"
                : isPaid
                  ? "PAID"
                  : "PROCESSING"}
            </strong>
          </div>
        </div>

        {/* COD MESSAGE */}

        {isCOD ? (
          <div
            style={{
              marginTop: "26px",
              padding: "22px",
              background:
                "rgba(216,165,41,0.055)",
              border:
                "1px solid rgba(216,165,41,0.16)",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#e8b632",
                fontSize: "12px",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              CASH ON DELIVERY
            </strong>

            <p
              style={{
                margin: 0,
                color: "#999",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              No online payment is required right
              now. Please pay the order amount when
              your KRVE package is delivered.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: "26px",
              padding: "22px",
              background:
                "rgba(216,165,41,0.055)",
              border:
                "1px solid rgba(216,165,41,0.16)",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#e8b632",
                fontSize: "12px",
                letterSpacing: "1px",
                marginBottom: "8px",
              }}
            >
              SECURE ONLINE PAYMENT
            </strong>

            <p
              style={{
                margin: 0,
                color: "#999",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {isPaid
                ? "Your online payment has been successfully verified."
                : "Your payment information is being processed securely."}
            </p>
          </div>
        )}

        {/* NEXT STEPS */}

        <div
          style={{
            marginTop: "38px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "#e8b632",
              fontSize: "10px",
              letterSpacing: "2px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            WHAT HAPPENS NEXT
          </p>

          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <Step
              number="01"
              title="Order Confirmed"
              description="Your order has been received by KRVE."
            />

            <Step
              number="02"
              title="Preparing Your Order"
              description="Our team will prepare and quality-check your items."
            />

            <Step
              number="03"
              title="Dispatched"
              description="You will receive shipping and tracking information."
            />

            <Step
              number="04"
              title="Delivered"
              description={
                isCOD
                  ? "Receive your KRVE order and complete payment at delivery."
                  : "Your KRVE order arrives at your delivery address."
              }
            />
          </div>
        </div>

        {/* BUTTONS */}

        <div
          style={{
            marginTop: "42px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Link
            href="/collections"
            style={{
              minHeight: "50px",
              padding: "0 30px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e5af27",
              color: "#050505",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "1.2px",
              fontWeight: 800,
            }}
          >
            CONTINUE SHOPPING →
          </Link>

          <Link
            href="/account"
            style={{
              minHeight: "50px",
              padding: "0 30px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid #d8a529",
              color: "#e8b632",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "1.2px",
              fontWeight: 800,
            }}
          >
            VIEW MY ACCOUNT
          </Link>
        </div>

        {/* FOOTER NOTE */}

        <div
          style={{
            marginTop: "36px",
            paddingTop: "25px",
            borderTop:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "11px",
              lineHeight: 1.7,
            }}
          >
            Please keep your order number for future
            reference.
          </p>
        </div>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        alignItems: "flex-start",
        padding: "16px 0",
        borderBottom:
          "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          minWidth: "38px",
          borderRadius: "50%",
          border:
            "1px solid rgba(216,165,41,0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e8b632",
          fontSize: "10px",
          fontWeight: 700,
        }}
      >
        {number}
      </div>

      <div>
        <strong
          style={{
            display: "block",
            fontSize: "14px",
            marginBottom: "5px",
          }}
        >
          {title}
        </strong>

        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: "12px",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function LoadingOrderSuccess() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030303",
        color: "#e8b632",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        letterSpacing: "2px",
      }}
    >
      PREPARING YOUR KRVE ORDER...
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={<LoadingOrderSuccess />}
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
