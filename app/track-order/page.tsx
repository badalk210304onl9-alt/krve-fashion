"use client";

import {
  FormEvent,
  useState,
} from "react";

import Image from "next/image";

import styles from "./track-order.module.css";

type OrderItem = {
  id: string;
  productId: string | null;
  productName: string;
  productImageUrl: string | null;
  sku: string | null;
  size: string | null;
  colour: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type TimelineItem = {
  id: string;
  status: string;
  location: string | null;
  description: string | null;
  createdAt: string;
};

type Order = {
  orderNumber: string;
  customerName: string;
  status: string;
  paymentStatus: string;
  courier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  updatedAt: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  items: OrderItem[];
  timeline: TimelineItem[];
};

type ApiResponse = {
  order?: Order;
  error?: string;
  message?: string;
};

function formatPrice(
  amount: number,
  currency = "INR",
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function formatDate(
  value: string,
) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

function getStatusLabel(
  status: string,
) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanOrderId =
      orderId.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    if (
      !cleanOrderId ||
      !cleanEmail
    ) {
      setError(
        "Please enter your order ID and email address.",
      );

      setOrder(null);

      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response =
        await fetch(
          "/api/track-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              orderNumber:
                cleanOrderId,
              email:
                cleanEmail,
            }),
            cache: "no-store",
          },
        );

      const payload =
        (await response
          .json()
          .catch(() => null)) as
          | ApiResponse
          | null;

      if (
        !response.ok ||
        !payload?.order
      ) {
        throw new Error(
          payload?.error ||
            payload?.message ||
            "We could not find this order.",
        );
      }

      setOrder(
        payload.order,
      );
    } catch (requestError) {
      console.error(
        "KRVE_TRACK_ORDER_ERROR",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to track this order.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>
          KRVE CUSTOMER CARE
        </p>

        <h1 className={styles.title}>
          Track your{" "}
          <em>order.</em>
        </h1>

        <p className={styles.intro}>
          Enter your order details below
          to check the latest status of
          your KRVE purchase.
        </p>

        <div
          className={
            styles.goldLine
          }
        />

        <section
          className={styles.trackingCard}
        >
          <h2>
            Order tracking
          </h2>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <label
              className={styles.label}
              htmlFor="order-id"
            >
              Order ID
            </label>

            <input
              id="order-id"
              name="orderId"
              className={styles.input}
              value={orderId}
              onChange={(event) =>
                setOrderId(
                  event.target.value,
                )
              }
              placeholder="e.g. KRVE-10245"
              autoComplete="off"
              disabled={loading}
            />

            <label
              className={styles.label}
              htmlFor="email"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="Enter the email used for your order"
              autoComplete="email"
              disabled={loading}
            />

            <button
              type="submit"
              className={
                styles.button
              }
              disabled={loading}
            >
              {loading
                ? "TRACKING..."
                : "TRACK ORDER"}
            </button>
          </form>

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}

          {!error &&
            !order &&
            !loading && (
              <p
                className={
                  styles.note
                }
              >
                Enter your order ID and
                registered email address
                to see your real order,
                products and delivery
                status.
              </p>
            )}
        </section>

        {order && (
          <section
            className={
              styles.resultSection
            }
          >
            <div
              className={
                styles.orderHeader
              }
            >
              <div>
                <p
                  className={
                    styles.smallLabel
                  }
                >
                  ORDER
                </p>

                <h2>
                  {order.orderNumber}
                </h2>

                <p
                  className={
                    styles.date
                  }
                >
                  Placed{" "}
                  {formatDate(
                    order.createdAt,
                  )}
                </p>
              </div>

              <div
                className={
                  styles.statusBox
                }
              >
                <span>
                  CURRENT STATUS
                </span>

                <strong>
                  {getStatusLabel(
                    order.status,
                  )}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.productSection
              }
            >
              <div
                className={
                  styles.sectionHeading
                }
              >
                <span>
                  YOUR KRVE PIECES
                </span>

                <strong>
                  {order.items.length}{" "}
                  {order.items.length ===
                  1
                    ? "ITEM"
                    : "ITEMS"}
                </strong>
              </div>

              <div
                className={
                  styles.productList
                }
              >
                {order.items.map(
                  (item) => (
                    <article
                      key={item.id}
                      className={
                        styles.productCard
                      }
                    >
                      <div
                        className={
                          styles.productImage
                        }
                      >
                        {item.productImageUrl ? (
                          <Image
                            src={
                              item.productImageUrl
                            }
                            alt={
                              item.productName
                            }
                            fill
                            sizes="180px"
                            className={
                              styles.image
                            }
                          />
                        ) : (
                          <div
                            className={
                              styles.noImage
                            }
                          >
                            KRVE
                          </div>
                        )}
                      </div>

                      <div
                        className={
                          styles.productInfo
                        }
                      >
                        <p
                          className={
                            styles.privateLabel
                          }
                        >
                          KRVE PRIVATE
                          COLLECTION
                        </p>

                        <h3>
                          {
                            item.productName
                          }
                        </h3>

                        <div
                          className={
                            styles.meta
                          }
                        >
                          {item.size && (
                            <span>
                              SIZE{" "}
                              {item.size}
                            </span>
                          )}

                          {item.colour && (
                            <span>
                              COLOUR{" "}
                              {
                                item.colour
                              }
                            </span>
                          )}

                          {item.sku && (
                            <span>
                              SKU{" "}
                              {item.sku}
                            </span>
                          )}
                        </div>

                        <div
                          className={
                            styles.quantity
                          }
                        >
                          QTY{" "}
                          {item.quantity}
                        </div>
                      </div>

                      <div
                        className={
                          styles.productPrice
                        }
                      >
                        <strong>
                          {formatPrice(
                            item.lineTotal,
                            order.currency,
                          )}
                        </strong>

                        {item.quantity >
                          1 && (
                          <span>
                            {formatPrice(
                              item.unitPrice,
                              order.currency,
                            )}{" "}
                            each
                          </span>
                        )}
                      </div>
                    </article>
                  ),
                )}
              </div>
            </div>

            <div
              className={
                styles.detailsGrid
              }
            >
              <section
                className={
                  styles.detailCard
                }
              >
                <p
                  className={
                    styles.smallLabel
                  }
                >
                  DELIVERY
                </p>

                <h3>
                  {order.courier ||
                    "Preparing shipment"}
                </h3>

                {order.trackingNumber && (
                  <p>
                    Tracking number:{" "}
                    <strong>
                      {
                        order.trackingNumber
                      }
                    </strong>
                  </p>
                )}

                {order.trackingUrl && (
                  <a
                    href={
                      order.trackingUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className={
                      styles.trackLink
                    }
                  >
                    TRACK SHIPMENT
                  </a>
                )}
              </section>

              <section
                className={
                  styles.detailCard
                }
              >
                <p
                  className={
                    styles.smallLabel
                  }
                >
                  PAYMENT
                </p>

                <h3>
                  {getStatusLabel(
                    order.paymentStatus,
                  )}
                </h3>

                <p>
                  Total{" "}
                  <strong>
                    {formatPrice(
                      order.total,
                      order.currency,
                    )}
                  </strong>
                </p>
              </section>
            </div>

            <section
              className={
                styles.timelineCard
              }
            >
              <div
                className={
                  styles.sectionHeading
                }
              >
                <span>
                  ORDER JOURNEY
                </span>
              </div>

              {order.timeline.length >
              0 ? (
                <div
                  className={
                    styles.timeline
                  }
                >
                  {order.timeline.map(
                    (event, index) => (
                      <div
                        key={
                          event.id
                        }
                        className={
                          styles.timelineItem
                        }
                      >
                        <div
                          className={
                            styles.timelineDot
                          }
                        >
                          {index + 1}
                        </div>

                        <div>
                          <h3>
                            {getStatusLabel(
                              event.status,
                            )}
                          </h3>

                          {event.description && (
                            <p>
                              {
                                event.description
                              }
                            </p>
                          )}

                          {event.location && (
                            <span>
                              {
                                event.location
                              }
                            </span>
                          )}

                          <time>
                            {formatDate(
                              event.createdAt,
                            )}
                          </time>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p
                  className={
                    styles.emptyTimeline
                  }
                >
                  Your order has been
                  confirmed. Tracking
                  updates will appear here
                  as your order progresses.
                </p>
              )}
            </section>

            <section
              className={
                styles.summaryCard
              }
            >
              <div>
                <span>
                  SUBTOTAL
                </span>

                <strong>
                  {formatPrice(
                    order.subtotal,
                    order.currency,
                  )}
                </strong>
              </div>

              {order.discount > 0 && (
                <div>
                  <span>
                    DISCOUNT
                  </span>

                  <strong>
                    -
                    {formatPrice(
                      order.discount,
                      order.currency,
                    )}
                  </strong>
                </div>
              )}

              <div>
                <span>
                  SHIPPING
                </span>

                <strong>
                  {formatPrice(
                    order.shipping,
                    order.currency,
                  )}
                </strong>
              </div>

              {order.tax > 0 && (
                <div>
                  <span>
                    TAX
                  </span>

                  <strong>
                    {formatPrice(
                      order.tax,
                      order.currency,
                    )}
                  </strong>
                </div>
              )}

              <div
                className={
                  styles.totalRow
                }
              >
                <span>
                  TOTAL
                </span>

                <strong>
                  {formatPrice(
                    order.total,
                    order.currency,
                  )}
                </strong>
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}
