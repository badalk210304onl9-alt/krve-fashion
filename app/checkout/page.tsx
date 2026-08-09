"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useCart } from "@/components/cart-provider";
import { loadRazorpayScript } from "@/lib/load-razorpay";

import styles from "./checkout.module.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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

type RazorpayOrderResponse = {
  success: boolean;
  message?: string;
  keyId?: string;
  order?: {
    id: string;
    amount: number | string;
    currency: string;
    receipt?: string;
    status?: string;
  };
};

type RazorpayVerificationResponse = {
  success: boolean;
  message?: string;
  paymentId?: string;
  orderId?: string;
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type SaveOrderResponse = {
  success?: boolean;
  message?: string;

  order?: {
    id?: string;
    orderNumber?: string;
  } | null;
};

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

export default function CheckoutPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    hydrated,
    clearCart,
  } = useCart();

  const [form, setForm] =
    useState<CheckoutForm>(initialForm);

  const [deliveryMethod, setDeliveryMethod] =
    useState<"standard" | "express">("standard");

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const [isPreparingPayment, setIsPreparingPayment] =
    useState(false);

  const shipping =
    deliveryMethod === "express"
      ? 499
      : 0;

  const estimatedTax = useMemo(
    () => Math.round(cartSubtotal * 0.075),
    [cartSubtotal],
  );

  const total =
    cartSubtotal +
    shipping +
    estimatedTax;

  function updateField(
    field: keyof CheckoutForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function validateForm() {
    const requiredFields: Array<keyof CheckoutForm> = [
      "email",
      "phone",
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "postalCode",
    ];

    const missingField = requiredFields.find(
      (field) => !form[field].trim(),
    );

    if (missingField) {
      setFormError(
        "Please complete all required delivery details.",
      );

      return false;
    }

    if (
      !form.email.includes("@") ||
      !form.email.includes(".")
    ) {
      setFormError(
        "Please enter a valid email address.",
      );

      return false;
    }

    const cleanPhone =
      form.phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      setFormError(
        "Please enter a valid 10-digit mobile number.",
      );

      return false;
    }

    if (
      form.postalCode.replace(/\D/g, "").length !== 6
    ) {
      setFormError(
        "Please enter a valid 6-digit postal code.",
      );

      return false;
    }

    if (!acceptedTerms) {
      setFormError(
        "Please accept the terms and privacy policy.",
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

  async function saveOrderAfterPayment(
    paymentResponse: RazorpaySuccessResponse,
    verificationData: RazorpayVerificationResponse,
  ) {
    const response = await fetch(
      "/api/orders/create",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          customer: {
            firstName:
              form.firstName,

            lastName:
              form.lastName,

            email:
              form.email,

            phone:
              form.phone.replace(
                /\D/g,
                "",
              ),
          },

          customerEmail:
            form.email,

          customerPhone:
            form.phone.replace(
              /\D/g,
              "",
            ),

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
            recipientName:
              `${form.firstName} ${form.lastName}`.trim(),

            phone:
              form.phone.replace(
                /\D/g,
                "",
              ),

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
            recipientName:
              `${form.firstName} ${form.lastName}`.trim(),

            phone:
              form.phone.replace(
                /\D/g,
                "",
              ),

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
            deliveryMethod === "express"
              ? "KRVE Express delivery"
              : "Complimentary delivery",

          items:
            cart.map((item) => ({
              productId:
                item.id,

              productName:
                item.name,

              productImageUrl:
                item.imageUrl ||
                item.image,

              sku:
                item.sku,

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
            })),

          payment: {
            provider:
              "razorpay",

            providerOrderId:
              verificationData.orderId ||
              paymentResponse.razorpay_order_id,

            providerPaymentId:
              verificationData.paymentId ||
              paymentResponse.razorpay_payment_id,

            providerSignature:
              paymentResponse.razorpay_signature,

            amount:
              total,

            currency:
              "INR",

            status:
              "paid",

            rawResponse:
              paymentResponse,
          },
        }),
      },
    );

    const data =
      (await response.json()) as SaveOrderResponse;

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Payment succeeded, but order could not be saved.",
      );
    }

    return data;
  }

  async function handleCheckout(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsPreparingPayment(true);
    setFormError("");

    try {
      const razorpayLoaded =
        await loadRazorpayScript();

      if (
        !razorpayLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again.",
        );
      }

      const createOrderResponse =
        await fetch(
          "/api/razorpay/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount:
                total,

              receipt:
                `krve_${Date.now()}`,

              customerName:
                `${form.firstName} ${form.lastName}`.trim(),

              customerEmail:
                form.email,

              customerPhone:
                form.phone.replace(
                  /\D/g,
                  "",
                ),
            }),
          },
        );

      const orderData =
        (await createOrderResponse.json()) as RazorpayOrderResponse;

      if (
        !createOrderResponse.ok ||
        !orderData.success ||
        !orderData.keyId ||
        !orderData.order
      ) {
        throw new Error(
          orderData.message ||
            "Unable to create Razorpay order.",
        );
      }

      const razorpay =
        new window.Razorpay({
          key:
            orderData.keyId,

          amount:
            orderData.order.amount,

          currency:
            orderData.order.currency,

          name:
            "KRVE",

          description:
            "KRVE Fashion Order",

          order_id:
            orderData.order.id,

          prefill: {
            name:
              `${form.firstName} ${form.lastName}`.trim(),

            email:
              form.email,

            contact:
              form.phone.replace(
                /\D/g,
                "",
              ),
          },

          notes: {
            address: [
              form.address,
              form.apartment,
              form.city,
              form.state,
              form.postalCode,
            ]
              .filter(Boolean)
              .join(", "),

            delivery_method:
              deliveryMethod,

            items:
              String(cartCount),
          },

          theme: {
            color:
              "#d6a72c",

            backdrop_color:
              "#020202",
          },

          retry: {
            enabled:
              true,

            max_count:
              3,
          },

          modal: {
            escape:
              true,

            confirm_close:
              true,

            ondismiss:
              () => {
                setIsPreparingPayment(
                  false,
                );
              },
          },

          handler: async (
            paymentResponse: RazorpaySuccessResponse,
          ) => {
            try {
              setIsPreparingPayment(
                true,
              );

              const verificationResponse =
                await fetch(
                  "/api/razorpay/verify-payment",
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body:
                      JSON.stringify({
                        razorpay_payment_id:
                          paymentResponse.razorpay_payment_id,

                        razorpay_order_id:
                          paymentResponse.razorpay_order_id,

                        razorpay_signature:
                          paymentResponse.razorpay_signature,
                      }),
                  },
                );

              const verificationData =
                (await verificationResponse.json()) as RazorpayVerificationResponse;

              if (
                !verificationResponse.ok ||
                !verificationData.success
              ) {
                throw new Error(
                  verificationData.message ||
                    "Payment verification failed.",
                );
              }

              const savedOrder =
                await saveOrderAfterPayment(
                  paymentResponse,
                  verificationData,
                );

              clearCart();

              const successParams =
                new URLSearchParams({
                  payment_id:
                    verificationData.paymentId ||
                    paymentResponse.razorpay_payment_id,

                  order_id:
                    savedOrder.order?.orderNumber ||
                    verificationData.orderId ||
                    paymentResponse.razorpay_order_id,
                });

              window.location.href =
                `/order-success?${successParams.toString()}`;
            } catch (
              verificationError
            ) {
              setIsPreparingPayment(
                false,
              );

              setFormError(
                verificationError instanceof Error
                  ? verificationError.message
                  : "Payment verification failed. Please contact KRVE support.",
              );
            }
          },
        });

      razorpay.on(
        "payment.failed",
        (response) => {
          setIsPreparingPayment(
            false,
          );

          const description =
            response.error?.description;

          setFormError(
            description ||
              "Payment failed. Please try again.",
          );
        },
      );

      razorpay.open();
    } catch (error) {
      setIsPreparingPayment(false);

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to start Razorpay payment.",
      );
    }
  }

  if (!hydrated) {
    return (
      <main className={styles.loadingPage}>
        <div>
          Preparing secure checkout...
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className={styles.emptyPage}>
        <div className={styles.emptyCard}>
          <span>K</span>

          <p>YOUR BAG IS EMPTY</p>

          <h1>
            Add something exceptional first.
          </h1>

          <Link href="/collections">
            EXPLORE COLLECTIONS →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <div className={styles.checkoutShell}>
        <section className={styles.formSection}>
          <div className={styles.pageHeader}>
            <Link
              href="/cart"
              className={styles.backLink}
            >
              <ArrowLeftIcon />
              BACK TO BAG
            </Link>

            <p>SECURE CHECKOUT</p>

            <h1>
              Complete your order.
            </h1>

            <span>
              Enter your delivery details and proceed
              to secure Razorpay payment.
            </span>
          </div>

          <form onSubmit={handleCheckout}>
            <section className={styles.formBlock}>
              <div className={styles.blockHeading}>
                <span>01</span>

                <div>
                  <h2>
                    Contact Information
                  </h2>

                  <p>
                    Your order confirmation will be sent here.
                  </p>
                </div>
              </div>

              <div className={styles.fieldGrid}>
                <label className={styles.fullField}>
                  <span>
                    EMAIL ADDRESS *
                  </span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className={styles.fullField}>
                  <span>
                    MOBILE NUMBER *
                  </span>

                  <div className={styles.phoneField}>
                    <strong>+91</strong>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value,
                        )
                      }
                      placeholder="98765 43210"
                      autoComplete="tel"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className={styles.formBlock}>
              <div className={styles.blockHeading}>
                <span>02</span>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver your KRVE order?
                  </p>
                </div>
              </div>

              <div className={styles.fieldGrid}>
                <label>
                  <span>
                    FIRST NAME *
                  </span>

                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField(
                        "firstName",
                        event.target.value,
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
                    value={form.lastName}
                    onChange={(event) =>
                      updateField(
                        "lastName",
                        event.target.value,
                      )
                    }
                    placeholder="Last name"
                    autoComplete="family-name"
                  />
                </label>

                <label className={styles.fullField}>
                  <span>
                    ADDRESS *
                  </span>

                  <input
                    type="text"
                    value={form.address}
                    onChange={(event) =>
                      updateField(
                        "address",
                        event.target.value,
                      )
                    }
                    placeholder="House number and street"
                    autoComplete="street-address"
                  />
                </label>

                <label className={styles.fullField}>
                  <span>
                    APARTMENT, SUITE OR LANDMARK
                  </span>

                  <input
                    type="text"
                    value={form.apartment}
                    onChange={(event) =>
                      updateField(
                        "apartment",
                        event.target.value,
                      )
                    }
                    placeholder="Optional"
                  />
                </label>

                <label>
                  <span>CITY *</span>

                  <input
                    type="text"
                    value={form.city}
                    onChange={(event) =>
                      updateField(
                        "city",
                        event.target.value,
                      )
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                </label>

                <label>
                  <span>STATE *</span>

                  <input
                    type="text"
                    value={form.state}
                    onChange={(event) =>
                      updateField(
                        "state",
                        event.target.value,
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
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField(
                        "postalCode",
                        event.target.value,
                      )
                    }
                    placeholder="221005"
                    autoComplete="postal-code"
                  />
                </label>

                <label>
                  <span>COUNTRY</span>

                  <input
                    type="text"
                    value="India"
                    disabled
                  />
                </label>
              </div>
            </section>

            <section className={styles.formBlock}>
              <div className={styles.blockHeading}>
                <span>03</span>

                <div>
                  <h2>
                    Delivery Method
                  </h2>

                  <p>
                    Choose your preferred delivery experience.
                  </p>
                </div>
              </div>

              <div className={styles.deliveryOptions}>
                <label
                  className={
                    deliveryMethod === "standard"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={
                      deliveryMethod === "standard"
                    }
                    onChange={() =>
                      setDeliveryMethod("standard")
                    }
                  />

                  <div>
                    <strong>
                      Complimentary Delivery
                    </strong>

                    <span>
                      Estimated 4–7 business days
                    </span>
                  </div>

                  <b>FREE</b>
                </label>

                <label
                  className={
                    deliveryMethod === "express"
                      ? styles.activeDelivery
                      : ""
                  }
                >
                  <input
                    type="radio"
                    name="delivery"
                    checked={
                      deliveryMethod === "express"
                    }
                    onChange={() =>
                      setDeliveryMethod("express")
                    }
                  />

                  <div>
                    <strong>
                      KRVE Express
                    </strong>

                    <span>
                      Estimated 1–3 business days
                    </span>
                  </div>

                  <b>
                    {money.format(499)}
                  </b>
                </label>
              </div>
            </section>

            <label className={styles.terms}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) =>
                  setAcceptedTerms(
                    event.target.checked,
                  )
                }
              />

              <span className={styles.customCheckbox}>
                {acceptedTerms && <CheckIcon />}
              </span>

              <p>
                I agree to the KRVE Terms of Service,
                Privacy Policy and Return Policy.
              </p>
            </label>

            {formError && (
              <p className={styles.formError}>
                {formError}
              </p>
            )}

            <button
              type="submit"
              className={styles.payButton}
              disabled={isPreparingPayment}
            >
              <LockIcon />

              <span>
                {isPreparingPayment
                  ? "PROCESSING..."
                  : `PAY SECURELY ${money.format(total)}`}
              </span>

              <b>→</b>
            </button>

            <div className={styles.paymentNotice}>
              <ShieldIcon />

              <div>
                <strong>
                  SECURE RAZORPAY PAYMENT
                </strong>

                <p>
                  UPI, cards, net banking and supported payment methods.
                </p>
              </div>
            </div>
          </form>
        </section>

        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <div>
                <p>ORDER SUMMARY</p>
                <h2>Your selections</h2>
              </div>

              <span>
                {cartCount}{" "}
                {cartCount === 1
                  ? "ITEM"
                  : "ITEMS"}
              </span>
            </div>

            <div className={styles.summaryItems}>
              {cart.map((item) => (
                <article
                  key={item.id}
                  className={styles.summaryItem}
                >
                  <div className={styles.summaryImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="90px"
                    />

                    <span>
                      {item.quantity}
                    </span>
                  </div>

                  <div className={styles.summaryDetails}>
                    <h3>{item.name}</h3>

                    <p>
                      Size: {item.size}
                    </p>

                    <strong>
                      {money.format(
                        item.price *
                          item.quantity,
                      )}
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.priceSummary}>
              <div>
                <span>Subtotal</span>

                <strong>
                  {money.format(
                    cartSubtotal,
                  )}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

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
            </div>

            <div className={styles.grandTotal}>
              <span>TOTAL</span>

              <strong>
                {money.format(total)}
              </strong>
            </div>

            <div className={styles.summarySecurity}>
              <LockIcon />

              <p>
                Your payment and personal information are protected.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
