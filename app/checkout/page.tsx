"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  useCart,
} from "@/components/cart-provider";

import styles from "./checkout.module.css";

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  );

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

      <path
        d="
          M8 10
          V7
          a4 4 0 0 1 8 0
          v3
        "
      />
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
      <path
        d="
          M12 2
          20 5
          v6
          c0 5-3.4 8.6-8 11
          -4.6-2.4-8-6-8-11
          V5
          l8-3Z
        "
      />

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
    isPreparingPayment,
    setIsPreparingPayment,
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
        [field]: value,
      }),
    );

    if (formError) {
      setFormError("");
    }
  }

  function validateForm() {
    const requiredFields: Array<
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
        (
          field,
        ) =>
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
      )
    ) {
      setFormError(
        "Please enter a valid email address.",
      );

      return false;
    }

    if (
      form.phone.replace(
        /\D/g,
        "",
      ).length <
      10
    ) {
      setFormError(
        "Please enter a valid mobile number.",
      );

      return false;
    }

    if (!acceptedTerms) {
      setFormError(
        "Please accept the terms and privacy policy.",
      );

      return false;
    }

    return true;
  }

  function handleCheckout(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !validateForm()
    ) {
      return;
    }

    setIsPreparingPayment(
      true,
    );

    /*
      RAZORPAY WILL BE CONNECTED HERE.

      Later this function will:

      1. Create an order from the backend.
      2. Receive Razorpay order_id.
      3. Open Razorpay Checkout.
      4. Verify payment signature.
      5. Save the completed KRVE order.
    */

    window.setTimeout(
      () => {
        setIsPreparingPayment(
          false,
        );

        window.alert(
          "Checkout is ready. Razorpay payment integration will be connected to this button.",
        );
      },
      700,
    );
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
    cart.length ===
    0
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

          <Link
            href="/collections"
          >
            EXPLORE COLLECTIONS
            →
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
              Enter your delivery
              details and proceed
              to secure payment.
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
                    Delivery
                    Address
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
                  />
                </label>

                <label
                  className={
                    styles.fullField
                  }
                >
                  <span>
                    APARTMENT,
                    SUITE, LANDMARK
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

                  <b>FREE</b>
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
                {acceptedTerms && (
                  <CheckIcon />
                )}
              </span>

              <p>
                I agree to the
                KRVE Terms of
                Service, Privacy
                Policy and Return
                Policy.
              </p>
            </label>

            {formError && (
              <p
                className={
                  styles.formError
                }
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              className={
                styles.payButton
              }
              disabled={
                isPreparingPayment
              }
            >
              <LockIcon />

              <span>
                {isPreparingPayment
                  ? "PREPARING PAYMENT..."
                  : `PAY SECURELY ${money.format(
                      total,
                    )}`}
              </span>

              <b>→</b>
            </button>

            <div
              className={
                styles.paymentNotice
              }
            >
              <ShieldIcon />

              <div>
                <strong>
                  SECURE PAYMENT
                </strong>

                <p>
                  Razorpay will be
                  connected to this
                  checkout button.
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
                (
                  item,
                ) => (
                  <article
                    key={
                      item.id
                    }
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
                        {
                          item.size
                        }
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
                Your payment and
                personal information
                are protected.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
