"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  useCart,
} from "@/components/cart-provider";

import styles from "./checkout.module.css";

declare global {
  interface Window {
    Cashfree?: (config: {
      mode:
        | "sandbox"
        | "production";
    }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?:
          | "_self"
          | "_blank"
          | "_top"
          | "_modal";
      }) => Promise<unknown>;
    };
  }
}

type CheckoutForm = {
  email: string;
  phone: string;

  firstName: string;
  lastName: string;

  address: string;
  apartment: string;

  city: string;
  state: string;

  postalCode: string;
};

type PaymentMethod =
  | "cashfree"
  | "cod";

type CashfreeCreateResponse = {
  success?: boolean;

  message?: string;

  environment?:
    | "sandbox"
    | "production";

  order?: {
    id?: string;

    cashfreeOrderId?:
      string | null;

    paymentSessionId?:
      string;

    status?: string;

    amount?: number;

    currency?: string;
  };
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

  payment?: {
    id?: string;

    provider?: string;

    providerOrderId?:
      string | null;

    providerPaymentId?:
      string | null;

    status?: string;
  } | null;
};

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",

      currency: "INR",

      maximumFractionDigits:
        0,
    },
  );

const initialForm: CheckoutForm = {
  email: "",
  phone: "",

  firstName: "",
  lastName: "",

  address: "",
  apartment: "",

  city: "",
  state: "",

  postalCode: "",
};

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      aria-hidden="true"
    >
      <path d="M12 2 20 5v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3Z" />

      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 10h18" />

      <path d="M7 15h3" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="23"
      height="23"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
      />

      <path d="M7 9h.01" />

      <path d="M17 15h.01" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function loadCashfreeScript() {
  return new Promise<boolean>(
    (resolve) => {
      if (
        typeof window ===
        "undefined"
      ) {
        resolve(false);
        return;
      }

      if (window.Cashfree) {
        resolve(true);
        return;
      }

      const existing =
        document.querySelector(
          'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]',
        );

      if (existing) {
        existing.addEventListener(
          "load",
          () => resolve(true),
          {
            once: true,
          },
        );

        existing.addEventListener(
          "error",
          () => resolve(false),
          {
            once: true,
          },
        );

        return;
      }

      const script =
        document.createElement(
          "script",
        );

      script.src =
        "https://sdk.cashfree.com/js/v3/cashfree.js";

      script.async = true;

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        resolve(false);

      document.head.appendChild(
        script,
      );
    },
  );
}

export default function CheckoutPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    hydrated,
    clearCart,
  } = useCart();

  const [
    form,
    setForm,
  ] =
    useState<CheckoutForm>(
      initialForm,
    );

  const [
    deliveryMethod,
    setDeliveryMethod,
  ] =
    useState<
      "standard" | "express"
    >("standard");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cashfree",
    );

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] =
    useState(false);

  const [
    formError,
    setFormError,
  ] =
    useState("");

  const [
    processing,
    setProcessing,
  ] =
    useState(false);

  const shipping =
    deliveryMethod ===
    "express"
      ? 499
      : 0;

  const estimatedTax =
    useMemo(
      () =>
        Math.round(
          cartSubtotal *
            0.075,
        ),
      [
        cartSubtotal,
      ],
    );

  const total =
    cartSubtotal +
    shipping +
    estimatedTax;

  useEffect(() => {
    void loadCashfreeScript();
  }, []);

  function updateField(
    field:
      keyof CheckoutForm,
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,

        [field]:
          value,
      }),
    );

    if (formError) {
      setFormError("");
    }
  }

  function validateForm() {
    const requiredFields:
      Array<
        keyof CheckoutForm
      > = [
        "email",
        "phone",
        "firstName",
        "lastName",
        "address",
        "city",
        "state",
        "postalCode",
      ];

    const missingField =
      requiredFields.find(
        (field) =>
          !form[
            field
          ].trim(),
      );

    if (missingField) {
      setFormError(
        "Please complete all required delivery details.",
      );

      return false;
    }

    if (
      !form.email.includes(
        "@",
      ) ||
      !form.email.includes(
        ".",
      )
    ) {
      setFormError(
        "Please enter a valid email address.",
      );

      return false;
    }

    const cleanPhone =
      form.phone.replace(
        /\D/g,
        "",
      );

    if (
      cleanPhone.length <
      10
    ) {
      setFormError(
        "Please enter a valid 10-digit mobile number.",
      );

      return false;
    }

    const cleanPostalCode =
      form.postalCode.replace(
        /\D/g,
        "",
      );

    if (
      cleanPostalCode.length !==
      6
    ) {
      setFormError(
        "Please enter a valid 6-digit postal code.",
      );

      return false;
    }

    if (!acceptedTerms) {
      setFormError(
        "Please accept the Terms of Service, Privacy Policy and Return Policy.",
      );

      return false;
    }

    if (
      cart.length === 0 ||
      total <= 0
    ) {
      setFormError(
        "Your shopping bag is empty.",
      );

      return false;
    }

    return true;
  }

  function buildOrderPayload(
    payment: {
      provider:
        "cashfree" | "cod";

      providerOrderId?:
        string | null;

      providerPaymentId?:
        string | null;

      amount: number;

      status:
        "paid" | "pending";

      rawResponse?:
        unknown;
    },
  ) {
    const cleanPhone =
      form.phone.replace(
        /\D/g,
        "",
      );

    const recipientName =
      `${form.firstName} ${form.lastName}`.trim();

    return {
      customer: {
        firstName:
          form.firstName,

        lastName:
          form.lastName,

        email:
          form.email,

        phone:
          cleanPhone,
      },

      customerEmail:
        form.email,

      customerPhone:
        cleanPhone,

      subtotal:
        cartSubtotal,

      discount:
        0,

      shipping,

      tax:
        estimatedTax,

      total,

      currency:
        "INR",

      couponCode:
        null,

      shippingAddress: {
        recipientName,

        phone:
          cleanPhone,

        addressLine1:
          form.address,

        addressLine2:
          form.apartment,

        city:
          form.city,

        state:
          form.state,

        postalCode:
          form.postalCode,

        country:
          "India",
      },

      billingAddress: {
        recipientName,

        phone:
          cleanPhone,

        addressLine1:
          form.address,

        addressLine2:
          form.apartment,

        city:
          form.city,

        state:
          form.state,

        postalCode:
          form.postalCode,

        country:
          "India",
      },

      notes:
        [
          deliveryMethod ===
          "express"
            ? "KRVE Express delivery"
            : "Complimentary delivery",

          payment.provider ===
          "cod"
            ? "Cash on Delivery"
            : "Cashfree online payment",
        ].join(" | "),

      items:
        cart.map(
          (item) => ({
            productId:
              item.id,

            productName:
              item.name,

            productImageUrl:
              item.image,

            sku:
              item.sku ??
              null,

            size:
              item.size,

            colour:
              item.colours?.[0] ??
              null,

            unitPrice:
              item.price,

            quantity:
              item.quantity,

            lineTotal:
              item.price *
              item.quantity,
          }),
        ),

      payment: {
        provider:
          payment.provider,

        providerOrderId:
          payment.providerOrderId ??
          null,

        providerPaymentId:
          payment.providerPaymentId ??
          null,

        providerSignature:
          null,

        amount:
          payment.amount,

        currency:
          "INR",

        status:
          payment.status,

        rawResponse:
          payment.rawResponse ??
          {},
      },
    };
  }
    async function saveOrder(
    payload: ReturnType<
      typeof buildOrderPayload
    >,
  ) {
    const response =
      await fetch(
        "/api/orders/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              payload,
            ),
        },
      );

    let data:
      SaveOrderResponse | null =
      null;

    try {
      data =
        (await response.json()) as SaveOrderResponse;
    } catch {
      data = null;
    }

    if (
      !response.ok ||
      !data?.success
    ) {
      throw new Error(
        data?.message ||
          "KRVE order could not be saved.",
      );
    }

    return data;
  }

  async function placeCodOrder() {
    const payload =
      buildOrderPayload({
        provider:
          "cod",

        providerOrderId:
          `COD_${Date.now()}`,

        providerPaymentId:
          null,

        amount:
          total,

        status:
          "pending",

        rawResponse: {
          paymentMethod:
            "Cash on Delivery",

          createdAt:
            new Date().toISOString(),
        },
      });

    const savedOrder =
      await saveOrder(
        payload,
      );

    clearCart();

    const params =
      new URLSearchParams();

    if (
      savedOrder.order
        ?.orderNumber
    ) {
      params.set(
        "order_id",
        savedOrder.order
          .orderNumber,
      );
    }

    params.set(
      "payment_method",
      "cod",
    );

    params.set(
      "payment_status",
      "pending",
    );

    window.location.href =
      `/order-success?${params.toString()}`;
  }

  async function startCashfreePayment() {
    const scriptLoaded =
      await loadCashfreeScript();

    if (
      !scriptLoaded ||
      !window.Cashfree
    ) {
      throw new Error(
        "Cashfree Checkout could not be loaded. Please check your internet connection and try again.",
      );
    }

    const cleanPhone =
      form.phone.replace(
        /\D/g,
        "",
      );

    const createResponse =
      await fetch(
        "/api/cashfree/create-order",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              amount:
                total,

              customer: {
                name:
                  `${form.firstName} ${form.lastName}`.trim(),

                email:
                  form.email,

                phone:
                  cleanPhone,
              },
            }),
        },
      );

    let createData:
      CashfreeCreateResponse | null =
      null;

    try {
      createData =
        (await createResponse.json()) as CashfreeCreateResponse;
    } catch {
      createData =
        null;
    }

    if (
      !createResponse.ok ||
      !createData?.success
    ) {
      throw new Error(
        createData?.message ||
          "Cashfree payment order could not be created.",
      );
    }

    const paymentSessionId =
      createData.order
        ?.paymentSessionId;

    const cashfreeOrderId =
      createData.order?.id;

    if (
      !paymentSessionId ||
      !cashfreeOrderId
    ) {
      throw new Error(
        "Cashfree payment session is missing.",
      );
    }

    /*
      Save checkout information temporarily.

      After Cashfree redirects customer back
      to /payment/cashfree, we will verify
      payment server-side and then create
      the actual KRVE order.
    */

    const pendingCheckout = {
      cashfreeOrderId,

      total,

      orderPayload:
        buildOrderPayload({
          provider:
            "cashfree",

          providerOrderId:
            cashfreeOrderId,

          providerPaymentId:
            null,

          amount:
            total,

          /*
            IMPORTANT:
            This is only temporary browser
            data. We DO NOT save it to D1
            as paid yet.
          */

          status:
            "pending",

          rawResponse: {
            cashfreeOrderId,

            createdAt:
              new Date().toISOString(),
          },
        }),
    };

    window.sessionStorage.setItem(
      "krve_pending_cashfree_checkout",
      JSON.stringify(
        pendingCheckout,
      ),
    );

    const cashfree =
      window.Cashfree({
        mode:
          createData.environment ===
          "production"
            ? "production"
            : "sandbox",
      });

    /*
      Hosted Checkout.

      Cashfree uses paymentSessionId
      returned from Create Order.
    */

    const checkoutResult =
      await cashfree.checkout({
        paymentSessionId,

        redirectTarget:
          "_self",
      });

    /*
      With redirectTarget "_self",
      Cashfree normally navigates away.

      This catch is here only in case the
      SDK returns without redirecting.
    */

    console.log(
      "CASHFREE_CHECKOUT_RESULT",
      checkoutResult,
    );
  }

  async function handleCheckout(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormError("");
    setProcessing(true);

    try {
      if (
        paymentMethod ===
        "cod"
      ) {
        await placeCodOrder();
        return;
      }

      await startCashfreePayment();
    } catch (error) {
      console.error(
        "KRVE_CHECKOUT_ERROR",
        error,
      );

      setProcessing(false);

      setFormError(
        error instanceof Error
          ? error.message
          : "Checkout could not be completed. Please try again.",
      );
    }
  }

  if (!hydrated) {
    return (
      <main
        className={
          styles.loadingPage
        }
      >
        <div>
          Preparing secure
          checkout...
        </div>
      </main>
    );
  }

  if (
    cart.length === 0
  ) {
    return (
      <main
        className={
          styles.emptyPage
        }
      >
        <div
          className={
            styles.emptyCard
          }
        >
          <span>K</span>

          <p>
            YOUR BAG IS EMPTY
          </p>

          <h1>
            Add something
            exceptional first.
          </h1>

          <Link href="/collections">
            EXPLORE COLLECTIONS →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        styles.checkoutPage
      }
    >
      <div
        className={
          styles.checkoutShell
        }
      >
        <section
          className={
            styles.formSection
          }
        >
          <div
            className={
              styles.pageHeader
            }
          >
            <Link
              href="/cart"
              className={
                styles.backLink
              }
            >
              <ArrowLeftIcon />

              BACK TO BAG
            </Link>

            <p>
              SECURE CHECKOUT
            </p>

            <h1>
              Complete your
              order.
            </h1>

            <span>
              Choose your delivery
              and payment method
              securely.
            </span>
          </div>

          <form
            onSubmit={
              handleCheckout
            }
          >
            <section
              className={
                styles.formBlock
              }
            >
              <div
                className={
                  styles.blockHeading
                }
              >
                <span>01</span>

                <div>
                  <h2>
                    Contact
                    Information
                  </h2>

                  <p>
                    Your order
                    confirmation will
                    be sent here.
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.fieldGrid
                }
              >
                <label
                  className={
                    styles.fullField
                  }
                >
                  <span>
                    EMAIL ADDRESS *
                  </span>

                  <input
                    type="email"
                    value={
                      form.email
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "email",
                        event.target
                          .value,
                      )
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label
                  className={
                    styles.fullField
                  }
                >
                  <span>
                    MOBILE NUMBER *
                  </span>

                  <div
                    className={
                      styles.phoneField
                    }
                  >
                    <strong>
                      +91
                    </strong>

                    <input
                      type="tel"
                      value={
                        form.phone
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "phone",
                          event.target
                            .value,
                        )
                      }
                      placeholder="98765 43210"
                      autoComplete="tel"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section
              className={
                styles.formBlock
              }
            >
              <div
                className={
                  styles.blockHeading
                }
              >
                <span>02</span>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we
                    deliver your KRVE
                    order?
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.fieldGrid
                }
              >
                <label>
                  <span>
                    FIRST NAME *
                  </span>

                  <input
                    type="text"
                    value={
                      form.firstName
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "firstName",
                        event.target
                          .value,
                      )
                    }
                    placeholder="First name"
                    autoComplete="given-name"
                  />
                </label>

                <label>
                  <span>
                    LAST NAME *
                  </span>

                  <input
                    type="text"
                    value={
                      form.lastName
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "lastName",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </label>

                <label
                  className={
                    styles.fullField
                  }
                >
                  <span>
                    ADDRESS *
                  </span>

                  <input
                    type="text"
                    value={
                      form.address
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "address",
                        event.target
                          .value,
                      )
                    }
                    placeholder="House number and street"
                    autoComplete="street-address"
                  />
                </label>

                <label
                  className={
                    styles.fullField
                  }
                >
                  <span>
                    APARTMENT, SUITE
                    OR LANDMARK
                  </span>

                  <input
                    type="text"
                    value={
                      form.apartment
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "apartment",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Optional"
                  />
                </label>

                <label>
                  <span>
                    CITY *
                  </span>

                  <input
                    type="text"
                    value={
                      form.city
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "city",
                        event.target
                          .value,
                      )
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                </label>

                <label>
                  <span>
                    STATE *
                  </span>

                  <input
                    type="text"
                    value={
                      form.state
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "state",
                        event.target
                          .value,
                      )
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                </label>

                <label>
                  <span>
                    POSTAL CODE *
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={
                      form.postalCode
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "postalCode",
                        event.target
                          .value,
                      )
                    }
                    placeholder="221005"
                    autoComplete="postal-code"
                  />
                </label>

                <label>
                  <span>
                    COUNTRY
                  </span>

                  <input
                    type="text"
                    value="India"
                    disabled
                  />
                </label>
              </div>
            </section>
                        <section
              className={
                styles.formBlock
              }
            >
              <div
                className={
                  styles.blockHeading
                }
              >
                <span>03</span>

                <div>
                  <h2>
                    Delivery Method
                  </h2>

                  <p>
                    Choose your
                    preferred delivery
                    experience.
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.deliveryOptions
                }
              >
                <label
                  className={
                    deliveryMethod ===
                    "standard"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={
                      deliveryMethod ===
                      "standard"
                    }
                    onChange={() =>
                      setDeliveryMethod(
                        "standard",
                      )
                    }
                  />

                  <div>
                    <strong>
                      Complimentary
                      Delivery
                    </strong>

                    <span>
                      Estimated 4–7
                      business days
                    </span>
                  </div>

                  <b>
                    FREE
                  </b>
                </label>

                <label
                  className={
                    deliveryMethod ===
                    "express"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={
                      deliveryMethod ===
                      "express"
                    }
                    onChange={() =>
                      setDeliveryMethod(
                        "express",
                      )
                    }
                  />

                  <div>
                    <strong>
                      KRVE Express
                    </strong>

                    <span>
                      Estimated 1–3
                      business days
                    </span>
                  </div>

                  <b>
                    {money.format(
                      499,
                    )}
                  </b>
                </label>
              </div>
            </section>

            <section
              className={
                styles.formBlock
              }
            >
              <div
                className={
                  styles.blockHeading
                }
              >
                <span>04</span>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you
                    would like to pay.
                  </p>
                </div>
              </div>

              <div
                className={
                  styles.deliveryOptions
                }
              >
                <label
                  className={
                    paymentMethod ===
                    "cashfree"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod ===
                      "cashfree"
                    }
                    onChange={() => {
                      setPaymentMethod(
                        "cashfree",
                      );

                      setFormError(
                        "",
                      );
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "12px",
                    }}
                  >
                    <CardIcon />

                    <div>
                      <strong>
                        Pay Online
                      </strong>

                      <span>
                        UPI, Cards,
                        Net Banking,
                        Wallets & more
                        via Cashfree
                      </span>
                    </div>
                  </div>

                  <b>
                    SECURE
                  </b>
                </label>

                <label
                  className={
                    paymentMethod ===
                    "cod"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod ===
                      "cod"
                    }
                    onChange={() => {
                      setPaymentMethod(
                        "cod",
                      );

                      setFormError(
                        "",
                      );
                    }}
                  />

                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "12px",
                    }}
                  >
                    <CashIcon />

                    <div>
                      <strong>
                        Cash on
                        Delivery
                      </strong>

                      <span>
                        Pay when your
                        KRVE order is
                        delivered
                      </span>
                    </div>
                  </div>

                  <b>
                    COD
                  </b>
                </label>
              </div>
            </section>

            <label
              className={
                styles.terms
              }
            >
              <input
                type="checkbox"
                checked={
                  acceptedTerms
                }
                onChange={(
                  event,
                ) =>
                  setAcceptedTerms(
                    event.target
                      .checked,
                  )
                }
              />

              <span
                className={
                  styles.customCheckbox
                }
              >
                {acceptedTerms ? (
                  <CheckIcon />
                ) : null}
              </span>

              <p>
                I agree to the KRVE
                Terms of Service,
                Privacy Policy and
                Return Policy.
              </p>
            </label>

            {formError ? (
              <p
                className={
                  styles.formError
                }
              >
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className={
                styles.payButton
              }
              disabled={
                processing
              }
            >
              {paymentMethod ===
              "cashfree" ? (
                <LockIcon />
              ) : (
                <CashIcon />
              )}

              <span>
                {processing
                  ? paymentMethod ===
                    "cod"
                    ? "PLACING ORDER..."
                    : "OPENING SECURE PAYMENT..."
                  : paymentMethod ===
                    "cod"
                    ? `PLACE COD ORDER ${money.format(
                        total,
                      )}`
                    : `PAY ONLINE ${money.format(
                        total,
                      )}`}
              </span>

              <b>
                →
              </b>
            </button>

            <div
              className={
                styles.paymentNotice
              }
            >
              <ShieldIcon />

              <div>
                <strong>
                  {paymentMethod ===
                  "cashfree"
                    ? "SECURE CASHFREE PAYMENT"
                    : "CASH ON DELIVERY"}
                </strong>

                <p>
                  {paymentMethod ===
                  "cashfree"
                    ? "Your online payment is processed securely through Cashfree Payments."
                    : "No online payment is required now. Pay at the time of delivery."}
                </p>
              </div>
            </div>
          </form>
        </section>

        <aside
          className={
            styles.summarySection
          }
        >
          <div
            className={
              styles.summaryCard
            }
          >
            <div
              className={
                styles.summaryHeader
              }
            >
              <div>
                <p>
                  ORDER SUMMARY
                </p>

                <h2>
                  Your selections
                </h2>
              </div>

              <span>
                {cartCount}{" "}
                {cartCount === 1
                  ? "ITEM"
                  : "ITEMS"}
              </span>
            </div>

            <div
              className={
                styles.summaryItems
              }
            >
              {cart.map(
                (item) => (
                  <article
                    key={`${item.id}-${item.size}`}
                    className={
                      styles.summaryItem
                    }
                  >
                    <div
                      className={
                        styles.summaryImage
                      }
                    >
                      <Image
                        src={
                          item.image
                        }
                        alt={
                          item.name
                        }
                        fill
                        sizes="90px"
                      />

                      <span>
                        {
                          item.quantity
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.summaryDetails
                      }
                    >
                      <h3>
                        {
                          item.name
                        }
                      </h3>

                      <p>
                        Size:{" "}
                        {item.size}
                      </p>

                      <strong>
                        {money.format(
                          item.price *
                            item.quantity,
                        )}
                      </strong>
                    </div>
                  </article>
                ),
              )}
            </div>

            <div
              className={
                styles.priceSummary
              }
            >
              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  {money.format(
                    cartSubtotal,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <strong
                  className={
                    shipping === 0
                      ? styles.goldText
                      : ""
                  }
                >
                  {shipping === 0
                    ? "Complimentary"
                    : money.format(
                        shipping,
                      )}
                </strong>
              </div>

              <div>
                <span>
                  Estimated Tax
                </span>

                <strong>
                  {money.format(
                    estimatedTax,
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Payment
                </span>

                <strong
                  className={
                    styles.goldText
                  }
                >
                  {paymentMethod ===
                  "cashfree"
                    ? "Online"
                    : "Cash on Delivery"}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.grandTotal
              }
            >
              <span>
                TOTAL
              </span>

              <strong>
                {money.format(
                  total,
                )}
              </strong>
            </div>

            <div
              className={
                styles.summarySecurity
              }
            >
              <LockIcon />

              <p>
                Your order and personal
                information are
                protected.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
