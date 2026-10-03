"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import styles from "./returns-refunds.module.css";

type ReturnItem = {
  id: string;
  productId?: string | null;
  productName: string;
  productImageUrl?: string | null;
  sku?: string | null;
  size?: string | null;
  colour?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  returnAvailable: boolean;
  returnStatus?: string | null;
  returnRequestId?: string | null;
};

type ReturnOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  currency: string;
  items: ReturnItem[];
};

type ReturnWindow = {
  days: number;
  deliveredAt: string;
  returnDeadline: string;
  expired: boolean;
};

type ReturnResponse = {
  eligible: boolean;
  reason?: string;
  returnWindow?: ReturnWindow;
  order: ReturnOrder;
};

const RETURN_REASONS = [
  "Size doesn't fit",
  "Wrong product received",
  "Product damaged",
  "Product is defective",
  "Product looks different",
  "Changed my mind",
  "Other",
];

function formatMoney(
  amount: number,
  currency = "INR",
) {
  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      },
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN",
    )}`;
  }
}

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function getDaysRemaining(
  deadline?: string,
) {
  if (!deadline) {
    return 0;
  }

  const remaining =
    new Date(deadline).getTime() -
    Date.now();

  if (remaining <= 0) {
    return 0;
  }

  return Math.ceil(
    remaining /
      (1000 * 60 * 60 * 24),
  );
}

export default function ReturnsRefundsPage() {
  const [orderNumber, setOrderNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [orderData, setOrderData] =
    useState<ReturnResponse | null>(
      null,
    );

  const [selectedItemId, setSelectedItemId] =
    useState<string | null>(null);

  const [reason, setReason] =
    useState(RETURN_REASONS[0]);

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const selectedItem =
    useMemo(() => {
      if (
        !orderData ||
        !selectedItemId
      ) {
        return null;
      }

      return (
        orderData.order.items.find(
          (item) =>
            item.id ===
            selectedItemId,
        ) ?? null
      );
    }, [
      orderData,
      selectedItemId,
    ]);

  async function handleFindOrder(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");
    setOrderData(null);
    setSelectedItemId(null);

    try {
      const response =
        await fetch(
          `/api/returns?orderNumber=${encodeURIComponent(
            orderNumber.trim(),
          )}&email=${encodeURIComponent(
            email.trim(),
          )}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to find your order.",
        );
      }

      setOrderData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to find your order.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReturn(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !orderData ||
      !selectedItem
    ) {
      setError(
        "Please select a product.",
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          "/api/returns/request",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              orderNumber:
                orderData.order
                  .orderNumber,

              email:
                orderData.order
                  .customerEmail,

              orderItemId:
                selectedItem.id,

              reason,

              note: note.trim(),
            }),
          },
        );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to submit return request.",
        );
      }

      setSuccess(
        "Your return request has been submitted successfully.",
      );

      setOrderData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          order: {
            ...current.order,
            items:
              current.order.items.map(
                (item) => {
                  if (
                    item.id !==
                    selectedItem.id
                  ) {
                    return item;
                  }

                  return {
                    ...item,
                    returnAvailable:
                      false,
                    returnStatus:
                      "Pending",
                    returnRequestId:
                      data
                        ?.returnRequest
                        ?.id ??
                      null,
                  };
                },
              ),
          },
        };
      });

      setSelectedItemId(null);
      setNote("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit return request.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const daysRemaining =
    getDaysRemaining(
      orderData?.returnWindow
        ?.returnDeadline,
    );

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.eyebrow}>
            KRVE CUSTOMER CARE
          </div>

          <h1 className={styles.heroTitle}>
            Returns &
            <span> refunds.</span>
          </h1>

          <p className={styles.heroDescription}>
            Information about returning
            a KRVE purchase and how
            refunds are handled.
          </p>

          <div className={styles.goldLine} />
        </header>

        <section
          className={
            styles.policyGrid
          }
        >
          <div className={styles.policyCard}>
            <span className={styles.policyLabel}>
              RETURN WINDOW
            </span>

            <h2>15 days</h2>

            <p>
              From the exact date and
              time your order is
              delivered.
            </p>
          </div>

          <div className={styles.policyCard}>
            <span className={styles.policyLabel}>
              ELIGIBILITY
            </span>

            <h2>
              Delivered orders
            </h2>

            <p>
              Return becomes available
              only after delivery.
            </p>
          </div>

          <div className={styles.policyCard}>
            <span className={styles.policyLabel}>
              AFTER 15 DAYS
            </span>

            <h2>
              Automatically closed
            </h2>

            <p>
              New return requests
              cannot be submitted.
            </p>
          </div>
        </section>

        <section className={styles.formCard}>
          <div className={styles.stepLabel}>
            STEP 01
          </div>

          <h2 className={styles.sectionTitle}>
            Find your order
          </h2>

          <p className={styles.sectionText}>
            Enter your order ID and
            the email address used
            during checkout.
          </p>

          <form
            onSubmit={
              handleFindOrder
            }
            className={styles.orderForm}
          >
            <div className={styles.inputGroup}>
              <label>
                ORDER ID
              </label>

              <input
                value={orderNumber}
                onChange={(event) =>
                  setOrderNumber(
                    event.target.value,
                  )
                }
                required
                placeholder="e.g. KRVE-10245"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                required
                placeholder="Enter the email used for your order"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.goldButton}
            >
              {loading
                ? "CHECKING..."
                : "CHECK ORDER"}
            </button>
          </form>
        </section>

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successBox}>
            {success}
          </div>
        )}

        {orderData && (
          <>
            <section
              className={styles.orderSummary}
            >
              <div>
                <span className={styles.mutedLabel}>
                  ORDER
                </span>

                <h2>
                  {
                    orderData.order
                      .orderNumber
                  }
                </h2>

                <p>
                  {
                    orderData.order
                      .customerEmail
                  }
                </p>
              </div>

              <div>
                <span className={styles.mutedLabel}>
                  DELIVERED
                </span>

                <strong>
                  {formatDate(
                    orderData
                      .returnWindow
                      ?.deliveredAt,
                  )}
                </strong>
              </div>

              <div>
                <span className={styles.mutedLabel}>
                  RETURN DEADLINE
                </span>

                <strong
                  className={
                    orderData.eligible
                      ? styles.goldText
                      : styles.redText
                  }
                >
                  {formatDate(
                    orderData
                      .returnWindow
                      ?.returnDeadline,
                  )}
                </strong>
              </div>
            </section>

            {orderData.eligible ? (
              <div className={styles.openBox}>
                <div>
                  <strong>
                    Return window is
                    currently open.
                  </strong>

                  <p>
                    Approximately{" "}
                    {daysRemaining}{" "}
                    {daysRemaining ===
                    1
                      ? "day"
                      : "days"}{" "}
                    remaining.
                  </p>
                </div>

                <span>
                  RETURN AVAILABLE
                </span>
              </div>
            ) : (
              <div className={styles.closedBox}>
                <strong>
                  Return window closed.
                </strong>

                <p>
                  The 15-day return period
                  from delivery has expired.
                  New return requests for
                  this order cannot be
                  submitted.
                </p>
              </div>
            )}

            <section className={styles.productsSection}>
              <div className={styles.stepLabel}>
                STEP 02
              </div>

              <h2 className={styles.sectionTitle}>
                Select a product
              </h2>

              <div
                className={
                  styles.productsGrid
                }
              >
                {orderData.order.items.map(
                  (item) => {
                    const selected =
                      selectedItemId ===
                      item.id;

                    const requested =
                      Boolean(
                        item.returnStatus,
                      );

                    const available =
                      Boolean(
                        item.returnAvailable &&
                          orderData.eligible,
                      );

                    return (
                      <article
                        key={item.id}
                        className={`${styles.productCard} ${
                          selected
                            ? styles.selectedCard
                            : ""
                        }`}
                      >
                        <div
                          className={
                            styles.productImage
                          }
                        >
                          {item.productImageUrl ? (
                            <img
                              src={
                                item.productImageUrl
                              }
                              alt={
                                item.productName
                              }
                            />
                          ) : (
                            <span>
                              KRVE
                            </span>
                          )}

                          {requested && (
                            <div
                              className={
                                styles.statusBadge
                              }
                            >
                              {item.returnStatus}
                            </div>
                          )}
                        </div>

                        <div
                          className={
                            styles.productInfo
                          }
                        >
                          <h3>
                            {
                              item.productName
                            }
                          </h3>

                          {item.sku && (
                            <p
                              className={
                                styles.sku
                              }
                            >
                              SKU:{" "}
                              {item.sku}
                            </p>
                          )}

                          <div
                            className={
                              styles.productMeta
                            }
                          >
                            <div>
                              <span>
                                SIZE
                              </span>
                              <strong>
                                {item.size ||
                                  "—"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                COLOUR
                              </span>
                              <strong>
                                {item.colour ||
                                  "—"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                QTY
                              </span>
                              <strong>
                                {
                                  item.quantity
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                AMOUNT
                              </span>
                              <strong>
                                {formatMoney(
                                  item.lineTotal,
                                  orderData
                                    .order
                                    .currency,
                                )}
                              </strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              !available ||
                              requested
                            }
                            onClick={() =>
                              setSelectedItemId(
                                item.id,
                              )
                            }
                            className={
                              selected
                                ? styles.selectedButton
                                : available
                                  ? styles.outlineButton
                                  : styles.disabledButton
                            }
                          >
                            {requested
                              ? `RETURN ${String(
                                  item.returnStatus,
                                ).toUpperCase()}`
                              : available
                                ? selected
                                  ? "SELECTED"
                                  : "REQUEST RETURN"
                                : "RETURN WINDOW CLOSED"}
                          </button>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </section>

            {selectedItem &&
              orderData.eligible && (
                <section
                  className={
                    styles.returnForm
                  }
                >
                  <div className={styles.stepLabel}>
                    STEP 03
                  </div>

                  <h2
                    className={
                      styles.sectionTitle
                    }
                  >
                    Return details
                  </h2>

                  <p
                    className={
                      styles.selectedProduct
                    }
                  >
                    {
                      selectedItem.productName
                    }
                  </p>

                  <form
                    onSubmit={
                      handleSubmitReturn
                    }
                  >
                    <div
                      className={
                        styles.inputGroup
                      }
                    >
                      <label>
                        REASON FOR RETURN
                      </label>

                      <select
                        value={reason}
                        onChange={(event) =>
                          setReason(
                            event.target
                              .value,
                          )
                        }
                      >
                        {RETURN_REASONS.map(
                          (returnReason) => (
                            <option
                              key={
                                returnReason
                              }
                              value={
                                returnReason
                              }
                            >
                              {
                                returnReason
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div
                      className={
                        styles.inputGroup
                      }
                    >
                      <label>
                        ADDITIONAL NOTE
                      </label>

                      <textarea
                        value={note}
                        onChange={(event) =>
                          setNote(
                            event.target
                              .value,
                          )
                        }
                        rows={5}
                        placeholder="Tell us anything else about the return..."
                      />
                    </div>

                    <div
                      className={
                        styles.submitArea
                      }
                    >
                      <div>
                        <span>
                          REFUND AMOUNT
                        </span>

                        <strong>
                          {formatMoney(
                            selectedItem.lineTotal,
                            orderData
                              .order
                              .currency,
                          )}
                        </strong>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          submitting
                        }
                        className={
                          styles.goldButton
                        }
                      >
                        {submitting
                          ? "SUBMITTING..."
                          : "SUBMIT RETURN REQUEST"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
          </>
        )}

        <footer className={styles.footerNote}>
          Return eligibility is calculated
          from the exact delivery timestamp
          recorded by KRVE. Once the 15-day
          window expires, new return requests
          are automatically disabled.
        </footer>
      </section>
    </main>
  );
}
