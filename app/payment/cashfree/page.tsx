"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type PendingCheckout = {
  cashfreeOrderId?: string;

  total?: number;

  orderPayload?: {
    customer?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };

    customerEmail?: string;
    customerPhone?: string;

    subtotal?: number;
    discount?: number;
    shipping?: number;
    tax?: number;
    total?: number;

    currency?: string;

    couponCode?: string | null;

    shippingAddress?: Record<
      string,
      unknown
    >;

    billingAddress?: Record<
      string,
      unknown
    >;

    notes?: string | null;

    items?: Array<{
      productId?: string | null;
      productName?: string;
      productImageUrl?: string | null;
      sku?: string | null;
      size?: string | null;
      colour?: string | null;
      unitPrice?: number;
      quantity?: number;
      lineTotal?: number;
    }>;

    payment?: {
      provider?: string;

      providerOrderId?:
        string | null;

      providerPaymentId?:
        string | null;

      providerSignature?:
        string | null;

      amount?: number;

      currency?: string;

      status?: string;

      rawResponse?: unknown;
    };
  };
};

type VerifyCashfreeResponse = {
  success?: boolean;

  paid?: boolean;

  message?: string;

  environment?:
    | "sandbox"
    | "production";

  order?: {
    id?: string;

    cashfreeOrderId?:
      string | null;

    status?: string;

    amount?: number;

    currency?: string;
  };

  payment?: {
    id?: string | null;

    status?: string | null;

    amount?: number;

    currency?: string;

    bankReference?:
      string | null;

    paymentGroup?:
      string | null;

    paymentMethod?:
      unknown;

    paymentTime?:
      string | null;
  } | null;
};

type SaveOrderResponse = {
  success?: boolean;

  message?: string;

  order?: {
    id?: string;

    orderNumber?: string;

    status?: string;

    paymentStatus?: string;
  } | null;
};

type PageState =
  | "verifying"
  | "success"
  | "pending"
  | "failed";

export default function CashfreePaymentReturnPage() {
  const [
    pageState,
    setPageState,
  ] =
    useState<PageState>(
      "verifying",
    );

  const [
    message,
    setMessage,
  ] =
    useState(
      "Verifying your secure payment...",
    );

  const [
    krveOrderNumber,
    setKrveOrderNumber,
  ] =
    useState("");

  const [
    cashfreeOrderId,
    setCashfreeOrderId,
  ] =
    useState("");

  useEffect(() => {
    async function verifyAndSaveOrder() {
      try {
        const params =
          new URLSearchParams(
            window.location.search,
          );

        const orderIdFromUrl =
          params.get(
            "order_id",
          )?.trim() ??
          "";

        if (!orderIdFromUrl) {
          throw new Error(
            "Cashfree order ID is missing.",
          );
        }

        setCashfreeOrderId(
          orderIdFromUrl,
        );

        const rawPending =
          window.sessionStorage.getItem(
            "krve_pending_cashfree_checkout",
          );

        if (!rawPending) {
          throw new Error(
            "Checkout session could not be found. Please contact KRVE support if payment was deducted.",
          );
        }

        let pendingCheckout:
          PendingCheckout;

        try {
          pendingCheckout =
            JSON.parse(
              rawPending,
            ) as PendingCheckout;
        } catch {
          throw new Error(
            "Stored checkout information is invalid.",
          );
        }

        if (
          !pendingCheckout.orderPayload
        ) {
          throw new Error(
            "Pending order details are missing.",
          );
        }

        /*
          ==========================================
          VERIFY PAYMENT WITH CASHFREE SERVER
          ==========================================
        */

        const verifyResponse =
          await fetch(
            "/api/cashfree/verify-order",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  orderId:
                    orderIdFromUrl,
                }),

              cache:
                "no-store",
            },
          );

        let verifyData:
          VerifyCashfreeResponse | null =
          null;

        try {
          verifyData =
            (await verifyResponse.json()) as VerifyCashfreeResponse;
        } catch {
          verifyData =
            null;
        }

        if (
          !verifyResponse.ok ||
          !verifyData?.success
        ) {
          throw new Error(
            verifyData?.message ||
              "Cashfree payment verification failed.",
          );
        }

        /*
          ==========================================
          PAYMENT NOT PAID
          ==========================================
        */

        if (!verifyData.paid) {
          const paymentStatus =
            verifyData.order?.status ||
            verifyData.payment
              ?.status ||
            "PENDING";

          setPageState(
            "pending",
          );

          setMessage(
            `Payment status is ${paymentStatus}. Your order has not been marked as paid yet.`,
          );

          return;
        }

        /*
          ==========================================
          PAYMENT VERIFIED AS PAID
          ==========================================
        */

        const providerPaymentId =
          verifyData.payment?.id;

        if (!providerPaymentId) {
          throw new Error(
            "Cashfree payment ID is missing after successful verification.",
          );
        }

        const finalPayload = {
          ...pendingCheckout.orderPayload,

          payment: {
            ...pendingCheckout
              .orderPayload
              .payment,

            provider:
              "cashfree",

            providerOrderId:
              orderIdFromUrl,

            providerPaymentId,

            amount:
              Number(
                verifyData.payment
                  ?.amount ??
                  pendingCheckout.total ??
                  pendingCheckout
                    .orderPayload
                    .total ??
                  0,
              ),

            currency:
              verifyData.payment
                ?.currency ||
              verifyData.order
                ?.currency ||
              "INR",

            status:
              "paid",

            rawResponse: {
              cashfreeOrder:
                verifyData.order,

              cashfreePayment:
                verifyData.payment,

              verifiedAt:
                new Date().toISOString(),
            },
          },
        };

        /*
          ==========================================
          SAVE VERIFIED ORDER TO KRVE CENTRAL API
          ==========================================
        */

        const saveResponse =
          await fetch(
            "/api/orders/create",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  finalPayload,
                ),

              cache:
                "no-store",
            },
          );

        let saveData:
          SaveOrderResponse | null =
          null;

        try {
          saveData =
            (await saveResponse.json()) as SaveOrderResponse;
        } catch {
          saveData =
            null;
        }

        if (
          !saveResponse.ok ||
          !saveData?.success
        ) {
          throw new Error(
            saveData?.message ||
              "Payment succeeded, but KRVE order could not be saved.",
          );
        }

        const orderNumber =
          saveData.order
            ?.orderNumber ||
          "";

        setKrveOrderNumber(
          orderNumber,
        );

        /*
          Payment and KRVE order are both complete.
        */

        window.sessionStorage.removeItem(
          "krve_pending_cashfree_checkout",
        );

        /*
          Clear the persistent cart as well.

          CartProvider normally syncs from
          localStorage, so clearing common
          KRVE cart keys prevents old cart
          items from returning after redirect.
        */

        window.localStorage.removeItem(
          "krve-shopping-bag",
        );

        window.localStorage.removeItem(
          "krve-cart",
        );

        setPageState(
          "success",
        );

        setMessage(
          "Your payment has been verified and your KRVE order has been confirmed.",
        );
      } catch (error) {
        console.error(
          "KRVE_CASHFREE_RETURN_ERROR",
          error,
        );

        setPageState(
          "failed",
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not complete your order verification.",
        );
      }
    }

    void verifyAndSaveOrder();
  }, []);

  if (
    pageState ===
    "verifying"
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",

          background:
            "#030303",

          color:
            "#ffffff",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            "24px",
        }}
      >
        <div
          style={{
            width:
              "100%",

            maxWidth:
              "520px",

            border:
              "1px solid rgba(216,165,41,.42)",

            padding:
              "52px 36px",

            textAlign:
              "center",

            background:
              "#070707",
          }}
        >
          <div
            style={{
              width:
                "70px",

              height:
                "70px",

              borderRadius:
                "50%",

              border:
                "1px solid #d8a529",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              margin:
                "0 auto 26px",

              color:
                "#e8b632",

              fontFamily:
                "serif",

              fontSize:
                "32px",
            }}
          >
            K
          </div>

          <p
            style={{
              color:
                "#d8a529",

              fontSize:
                "11px",

              letterSpacing:
                "2px",

              fontWeight:
                700,
            }}
          >
            KRVE SECURE PAYMENT
          </p>

          <h1
            style={{
              margin:
                "18px 0 12px",

              fontFamily:
                "serif",

              fontWeight:
                400,

              fontSize:
                "34px",
            }}
          >
            Verifying payment.
          </h1>

          <p
            style={{
              color:
                "#9d9d9d",

              lineHeight:
                1.7,

              fontSize:
                "14px",
            }}
          >
            Please do not close or refresh this page while we confirm your Cashfree payment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#030303",

        color:
          "#ffffff",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        padding:
          "24px",
      }}
    >
      <div
        style={{
          width:
            "100%",

          maxWidth:
            "590px",

          border:
            "1px solid rgba(216,165,41,.42)",

          padding:
            "52px 36px",

          textAlign:
            "center",

          background:
            "#070707",
        }}
      >
        <div
          style={{
            width:
              "74px",

            height:
              "74px",

            borderRadius:
              "50%",

            border:
              `1px solid ${
                pageState ===
                "success"
                  ? "#d8a529"
                  : pageState ===
                      "pending"
                    ? "#d8a529"
                    : "#b54b4b"
              }`,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            margin:
              "0 auto 26px",

            color:
              pageState ===
              "failed"
                ? "#e76c6c"
                : "#e8b632",

            fontFamily:
              "serif",

            fontSize:
              "32px",
          }}
        >
          {pageState ===
          "success"
            ? "✓"
            : pageState ===
                "pending"
              ? "…"
              : "!"}
        </div>

        <p
          style={{
            color:
              pageState ===
              "failed"
                ? "#e76c6c"
                : "#d8a529",

            fontSize:
              "11px",

            letterSpacing:
              "2px",

            fontWeight:
              700,
          }}
        >
          {pageState ===
          "success"
            ? "ORDER CONFIRMED"
            : pageState ===
                "pending"
              ? "PAYMENT PENDING"
              : "PAYMENT VERIFICATION ISSUE"}
        </p>

        <h1
          style={{
            margin:
              "18px 0 14px",

            fontFamily:
              "serif",

            fontWeight:
              400,

            fontSize:
              "38px",

            lineHeight:
              1.15,
          }}
        >
          {pageState ===
          "success"
            ? "Thank you for choosing KRVE."
            : pageState ===
                "pending"
              ? "Your payment is still processing."
              : "We need to verify your payment."}
        </h1>

        <p
          style={{
            color:
              "#a2a2a2",

            lineHeight:
              1.8,

            fontSize:
              "14px",

            margin:
              "0 auto",

            maxWidth:
              "470px",
          }}
        >
          {message}
        </p>

        {krveOrderNumber ? (
          <div
            style={{
              margin:
                "28px 0 0",

              borderTop:
                "1px solid rgba(216,165,41,.2)",

              borderBottom:
                "1px solid rgba(216,165,41,.2)",

              padding:
                "18px",
            }}
          >
            <span
              style={{
                display:
                  "block",

                color:
                  "#777",

                fontSize:
                  "10px",

                letterSpacing:
                  "1.8px",

                marginBottom:
                  "7px",
              }}
            >
              KRVE ORDER NUMBER
            </span>

            <strong
              style={{
                color:
                  "#e8b632",

                fontSize:
                  "18px",
              }}
            >
              {krveOrderNumber}
            </strong>
          </div>
        ) : null}

        {!krveOrderNumber &&
        cashfreeOrderId ? (
          <div
            style={{
              marginTop:
                "24px",

              color:
                "#777",

              fontSize:
                "12px",
            }}
          >
            Payment reference:{" "}
            {cashfreeOrderId}
          </div>
        ) : null}

        <div
          style={{
            display:
              "flex",

            flexWrap:
              "wrap",

            gap:
              "12px",

            justifyContent:
              "center",

            marginTop:
              "32px",
          }}
        >
          {pageState ===
          "pending" ? (
            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              style={{
                minHeight:
                  "46px",

                padding:
                  "0 24px",

                border:
                  "none",

                background:
                  "#e3ae25",

                color:
                  "#050505",

                cursor:
                  "pointer",

                fontWeight:
                  700,

                fontSize:
                  "12px",

                letterSpacing:
                  "1px",
              }}
            >
              CHECK PAYMENT AGAIN
            </button>
          ) : null}

          <Link
            href="/collections"
            style={{
              minHeight:
                "46px",

              padding:
                "0 24px",

              display:
                "inline-flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              border:
                "1px solid #d8a529",

              background:
                pageState ===
                "success"
                  ? "#e3ae25"
                  : "transparent",

              color:
                pageState ===
                "success"
                  ? "#050505"
                  : "#e8b632",

              fontWeight:
                700,

              textDecoration:
                "none",

              fontSize:
                "12px",

              letterSpacing:
                "1px",
            }}
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        {pageState ===
        "failed" ? (
          <p
            style={{
              marginTop:
                "26px",

              color:
                "#787878",

              fontSize:
                "12px",

              lineHeight:
                1.7,
            }}
          >
            If money has been deducted, do not make another payment immediately. Keep the Cashfree payment reference and contact KRVE support.
          </p>
        ) : null}
      </div>
    </main>
  );
}
