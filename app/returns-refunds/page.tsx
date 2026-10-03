"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

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
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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
    new Date(
      deadline,
    ).getTime() -
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
    useState<string | null>(
      null,
    );

  const [reason, setReason] =
    useState(
      RETURN_REASONS[0],
    );

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

              note:
                note.trim(),
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

      setOrderData(
        (current) => {
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
        },
      );

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

  const returnDeadline =
    orderData?.returnWindow
      ?.returnDeadline;

  const daysRemaining =
    getDaysRemaining(
      returnDeadline,
    );

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8]">
      <section className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 lg:px-16 lg:py-24">
        {/* HEADER */}

        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-[#d4af37]">
            KRVE CUSTOMER CARE
          </p>

          <h1 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-8xl">
            Returns &
            <span className="text-[#d4af37]">
              {" "}
              refunds.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-8 text-[#929292] md:text-lg">
            Changed your mind or received
            something that isn't right?
            Eligible products can be
            returned within 15 days from
            the exact time your order was
            delivered.
          </p>

          <div className="mt-8 h-[2px] w-20 bg-[#d4af37]" />
        </div>

        {/* RETURN POLICY */}

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <div className="border border-[#262626] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#777]">
              RETURN WINDOW
            </p>

            <p className="mt-3 text-2xl font-light">
              15 days
            </p>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              From the exact date and time
              your order is delivered.
            </p>
          </div>

          <div className="border border-[#262626] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#777]">
              ELIGIBILITY
            </p>

            <p className="mt-3 text-2xl font-light">
              Delivered orders
            </p>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              Return becomes available
              only after delivery.
            </p>
          </div>

          <div className="border border-[#262626] bg-[#0d0d0d] p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#777]">
              AFTER 15 DAYS
            </p>

            <p className="mt-3 text-2xl font-light">
              Automatically closed
            </p>

            <p className="mt-2 text-sm leading-6 text-[#777]">
              New return requests cannot
              be submitted.
            </p>
          </div>
        </div>

        {/* FIND ORDER */}

        <section className="mt-10 border border-[#292929] bg-[#0d0d0d] p-6 md:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              STEP 01
            </p>

            <h2 className="mt-3 text-3xl font-light md:text-4xl">
              Find your order
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#777]">
              Enter the order ID and the
              email address used during
              checkout.
            </p>
          </div>

          <form
            onSubmit={
              handleFindOrder
            }
            className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
          >
            <input
              value={orderNumber}
              onChange={(event) =>
                setOrderNumber(
                  event.target.value,
                )
              }
              required
              placeholder="Order ID — KRVE-10245"
              className="h-14 border border-[#333] bg-[#060606] px-5 text-white outline-none placeholder:text-[#555] focus:border-[#d4af37]"
            />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              required
              placeholder="Email address"
              className="h-14 border border-[#333] bg-[#060606] px-5 text-white outline-none placeholder:text-[#555] focus:border-[#d4af37]"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-14 bg-[#d4af37] px-8 text-sm font-bold tracking-[0.12em] text-black transition hover:bg-[#e2c45a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "CHECKING..."
                : "CHECK ORDER"}
            </button>
          </form>
        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-6 border border-red-900/60 bg-red-950/20 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mt-6 border border-[#5e622f] bg-[#12170b] p-5 text-sm text-[#d5e29e]">
            {success}
          </div>
        )}

        {/* ORDER */}

        {orderData && (
          <section className="mt-10">
            {/* ORDER SUMMARY */}

            <div className="border border-[#292929] bg-[#0d0d0d] p-6 md:p-10">
              <div className="flex flex-col justify-between gap-8 lg:flex-row">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#666]">
                    ORDER
                  </p>

                  <p className="mt-3 text-3xl font-light">
                    {
                      orderData
                        .order
                        .orderNumber
                    }
                  </p>

                  <p className="mt-2 text-sm text-[#777]">
                    {
                      orderData
                        .order
                        .customerEmail
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#666]">
                    DELIVERED
                  </p>

                  <p className="mt-3 text-base">
                    {formatDate(
                      orderData
                        .returnWindow
                        ?.deliveredAt,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#666]">
                    RETURN DEADLINE
                  </p>

                  <p
                    className={`mt-3 text-base ${
                      orderData
                        .eligible
                        ? "text-[#d4af37]"
                        : "text-red-400"
                    }`}
                  >
                    {formatDate(
                      orderData
                        .returnWindow
                        ?.returnDeadline,
                    )}
                  </p>
                </div>
              </div>

              {orderData.eligible ? (
                <div className="mt-8 border border-[#42391b] bg-[#151208] p-5">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="font-medium text-[#d4af37]">
                        Return window is
                        currently open.
                      </p>

                      <p className="mt-1 text-sm text-[#777]">
                        You have approximately{" "}
                        <span className="text-white">
                          {daysRemaining}{" "}
                          {daysRemaining ===
                          1
                            ? "day"
                            : "days"}
                        </span>{" "}
                        remaining.
                      </p>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#d4af37]">
                      RETURN AVAILABLE
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-8 border border-red-950/70 bg-red-950/10 p-5">
                  <p className="font-medium text-red-300">
                    Return window closed.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#777]">
                    The 15-day return period
                    from delivery has expired.
                    New return requests for
                    this order cannot be
                    submitted.
                  </p>
                </div>
              )}
            </div>

            {/* PRODUCTS */}

            <div className="mt-10">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  STEP 02
                </p>

                <h2 className="mt-3 text-3xl font-light md:text-4xl">
                  Select a product
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {orderData.order.items.map(
                  (item) => {
                    const isSelected =
                      selectedItemId ===
                      item.id;

                    const isRequested =
                      Boolean(
                        item.returnStatus,
                      );

                    const isAvailable =
                      Boolean(
                        item.returnAvailable &&
                          orderData.eligible,
                      );

                    return (
                      <article
                        key={item.id}
                        className={`overflow-hidden border bg-[#0d0d0d] transition ${
                          isSelected
                            ? "border-[#d4af37]"
                            : "border-[#292929]"
                        }`}
                      >
                        {/* IMAGE */}

                        <div className="relative aspect-[4/5] bg-[#080808]">
                          {item.productImageUrl ? (
                            <img
                              src={
                                item.productImageUrl
                              }
                              alt={
                                item.productName
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-2xl tracking-[0.25em] text-[#333]">
                                KRVE
                              </span>
                            </div>
                          )}

                          {isRequested && (
                            <div className="absolute left-4 top-4 bg-black/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d4af37]">
                              {item.returnStatus}
                            </div>
                          )}
                        </div>

                        {/* DETAILS */}

                        <div className="p-6">
                          <h3 className="text-xl font-light">
                            {
                              item.productName
                            }
                          </h3>

                          {item.sku && (
                            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#555]">
                              SKU:{" "}
                              {item.sku}
                            </p>
                          )}

                          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-[#555]">
                                Size
                              </p>

                              <p className="mt-1 text-[#ccc]">
                                {item.size ||
                                  "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[#555]">
                                Colour
                              </p>

                              <p className="mt-1 text-[#ccc]">
                                {item.colour ||
                                  "—"}
                              </p>
                            </div>

                            <div>
                              <p className="text-[#555]">
                                Quantity
                              </p>

                              <p className="mt-1 text-[#ccc]">
                                {
                                  item.quantity
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-[#555]">
                                Amount
                              </p>

                              <p className="mt-1 text-[#ccc]">
                                {formatMoney(
                                  item.lineTotal,
                                  orderData
                                    .order
                                    .currency,
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={
                              !isAvailable ||
                              isRequested
                            }
                            onClick={() =>
                              setSelectedItemId(
                                item.id,
                              )
                            }
                            className={`mt-6 w-full border px-5 py-4 text-xs font-bold tracking-[0.16em] transition ${
                              isSelected
                                ? "border-[#d4af37] bg-[#d4af37] text-black"
                                : isAvailable
                                  ? "border-[#d4af37] bg-transparent text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                                  : "cursor-not-allowed border-[#292929] bg-[#151515] text-[#555]"
                            }`}
                          >
                            {isRequested
                              ? `RETURN ${String(
                                  item.returnStatus,
                                ).toUpperCase()}`
                              : isAvailable
                                ? isSelected
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
            </div>

            {/* RETURN FORM */}

            {selectedItem &&
              orderData.eligible && (
                <section className="mt-10 border border-[#292929] bg-[#0d0d0d] p-6 md:p-10">
                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      STEP 03
                    </p>

                    <h2 className="mt-3 text-3xl font-light">
                      Return details
                    </h2>

                    <p className="mt-3 text-sm text-[#777]">
                      {
                        selectedItem.productName
                      }
                    </p>
                  </div>

                  <form
                    onSubmit={
                      handleSubmitReturn
                    }
                    className="max-w-3xl"
                  >
                    <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">
                      Reason for return
                    </label>

                    <select
                      value={reason}
                      onChange={(event) =>
                        setReason(
                          event.target.value,
                        )
                      }
                      className="mt-3 h-14 w-full border border-[#333] bg-[#060606] px-5 text-white outline-none focus:border-[#d4af37]"
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

                    <label className="mt-7 block text-xs font-semibold uppercase tracking-[0.16em] text-[#888]">
                      Additional note
                    </label>

                    <textarea
                      value={note}
                      onChange={(event) =>
                        setNote(
                          event.target.value,
                        )
                      }
                      rows={5}
                      placeholder="Tell us anything else about the return..."
                      className="mt-3 w-full resize-y border border-[#333] bg-[#060606] p-5 text-white outline-none placeholder:text-[#555] focus:border-[#d4af37]"
                    />

                    <div className="mt-7 flex flex-col gap-4 border border-[#292929] bg-[#080808] p-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#666]">
                          REFUND AMOUNT
                        </p>

                        <p className="mt-2 text-2xl text-[#d4af37]">
                          {formatMoney(
                            selectedItem.lineTotal,
                            orderData
                              .order
                              .currency,
                          )}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          submitting
                        }
                        className="bg-[#d4af37] px-8 py-4 text-xs font-bold tracking-[0.15em] text-black transition hover:bg-[#e2c45a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting
                          ? "SUBMITTING..."
                          : "SUBMIT RETURN REQUEST"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

            {/* FOOT NOTE */}

            <div className="mt-10 border-t border-[#222] pt-7">
              <p className="max-w-3xl text-sm leading-7 text-[#666]">
                Return eligibility is
                calculated from the exact
                delivery timestamp recorded
                by KRVE. Once the 15-day
                window expires, new return
                requests are automatically
                disabled.
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
