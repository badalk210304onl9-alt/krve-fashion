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

    const cleanPhone = form.phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      setFormError(
        "Please enter a valid 10-digit mobile number.",
      );

      return false;
    }

    if (form.postalCode.replace(/\D/g, "").length !== 6) {
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

    if (cart.length === 0 || total <= 0) {
      setFormError(
        "Your shopping bag is empty.",
      );

      return false;
    }

    return true;
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

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again.",
        );
      }

      const createOrderResponse = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: total,

            receipt: `krve_${Date.now()}`,

            customerName:
              `${form.firstName} ${form.lastName}`.trim(),

            customerEmail: form.email,

            customerPhone:
              form.phone.replace(/\D/g, ""),
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

      const razorpay = new window.Razorpay({
        key: orderData.keyId,

        amount: orderData.order.amount,

        currency: orderData.order.currency,

        name: "KRVE",

        description: "KRVE Fashion Order",

        order_id: orderData.order.id,

        prefill: {
          name:
            `${form.firstName} ${form.lastName}`.trim(),

          email: form.email,

          contact:
            form.phone.replace(/\D/g, ""),
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

          items: String(cartCount),
        },

        theme: {
          color: "#d6a72c",
          backdrop_color: "#020202",
        },

        retry: {
          enabled: true,
          max_count: 3,
        },

        modal: {
          escape: true,
          confirm_close: true,

          ondismiss: () => {
            setIsPreparingPayment(false);
          },
        },

        handler: async (
          paymentResponse: RazorpaySuccessResponse,
        ) => {
          try {
            setIsPreparingPayment(true);

            const verificationResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
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

            const saveOrderResponse = await fetch(
              "/api/orders/create",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  customer: {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    phone: form.phone.replace(/\D/g, ""),
                  },

                  customerEmail: form.email,

                  customerPhone:
                    form.phone.replace(/\D/g, ""),

                  subtotal: cartSubtotal,

                  discount: 0,

                  shipping,

                  tax: estimatedTax,

                  total,

                  currency: "INR",

                  couponCode: null,

                  shippingAddress: {
                    recipientName:
                      `${form.firstName} ${form.lastName}`.trim(),

                    phone:
                      form.phone.replace(/\D/g, ""),

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
                      form.phone.replace(/\D/g, ""),

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

                  items: cart.map((item) => ({
                    productId:
                      item.id,

                    productName:
                      item.name,

                    productImageUrl:
                      item.imageUrl ||
                      item.image ||
                      null,

                    sku:
                      item.sku ||
                      null,

                    size:
                      item.size ||
                      null,

                    colour:
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

            const saveOrderData =
              (await saveOrderResponse.json()) as {
                success?: boolean;

                message?: string;

                order?: {
                  id?: string;

                  orderNumber?: string;
                } | null;
              };

            if (
              !saveOrderResponse.ok ||
              !saveOrderData.success
            ) {
              throw new Error(
                saveOrderData.message ||
                  "Payment succeeded, but the order could not be saved. Please contact KRVE support.",
              );
            }

            clearCart();

            const successParams = new URLSearchParams({
              payment_id:
                verificationData.paymentId ||
                paymentResponse.razorpay_payment_id,

              order_id:
                saveOrderData.order?.orderNumber ||
                verificationData.orderId ||
                paymentResponse.razorpay_order_id,
            });

            window.location.href =
              `/order-success?${successParams.toString()}`;
          } catch (verificationError) {
            setIsPreparingPayment(false);

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
          setIsPreparingPayment(false);

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
  
