"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RotateCcw,
  X,
  AlertCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";

type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded";

type ReturnStatus =
  | "none"
  | "requested"
  | "approved"
  | "rejected"
  | "completed";

type Order = {
  id: string;

  orderNumber: string;

  createdAt: string;

  /*
   * IMPORTANT:
   * Backend should send the actual delivery date
   * for delivered orders.
   */
  deliveredAt?: string | null;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  paymentMethod: string;

  total: number;

  currency: string;

  itemCount: number;

  returnStatus?: ReturnStatus;

  items: Array<{
    id: string;

    name: string;

    image?: string | null;

    size?: string | null;

    colour?: string | null;

    quantity: number;

    price: number;
  }>;
};

type ApiResponse = {
  success?: boolean;

  message?: string;

  orders?: Order[];
};

type ReturnResponse = {
  success?: boolean;

  message?: string;

  returnId?: string;
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

const RETURN_WINDOW_DAYS = 15;

function formatDate(
  value: string,
) {
  const date =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    date,
  );
}

function statusLabel(
  status: OrderStatus,
) {
  switch (
    status
  ) {
    case "processing":
      return "Processing";

    case "shipped":
      return "Shipped";

    case "delivered":
      return "Delivered";

    case "cancelled":
      return "Cancelled";

    default:
      return "Confirmed";
  }
}

function paymentLabel(
  status: PaymentStatus,
) {
  switch (
    status
  ) {
    case "paid":
      return "Paid";

    case "failed":
      return "Failed";

    case "refunded":
      return "Refunded";

    default:
      return "Payment Pending";
  }
}

function OrderStatusIcon({
  status,
}: {
  status: OrderStatus;
}) {
  if (
    status ===
    "delivered"
  ) {
    return (
      <CheckCircle2
        size={18}
      />
    );
  }

  if (
    status ===
    "shipped"
  ) {
    return (
      <Truck
        size={18}
      />
    );
  }

  if (
    status ===
    "processing"
  ) {
    return (
      <Clock3
        size={18}
      />
    );
  }

  return (
    <PackageCheck
      size={18}
    />
  );
}

/*
 * Return eligibility
 *
 * Return starts from the actual delivered date.
 * Customer gets 15 calendar days.
 */
function getReturnInfo(
  order: Order,
) {
  if (
    order.status !==
    "delivered"
  ) {
    return {
      eligible: false,
      expired: false,
      daysLeft: 0,
      deliveryDate: null,
      returnUntil: null,
      reason:
        "Return becomes available after delivery.",
    };
  }

  if (
    !order.deliveredAt
  ) {
    return {
      eligible: false,
      expired: false,
      daysLeft: 0,
      deliveryDate: null,
      returnUntil: null,
      reason:
        "Delivery date is not available yet.",
    };
  }

  const delivered =
    new Date(
      order.deliveredAt,
    );

  if (
    Number.isNaN(
      delivered.getTime(),
    )
  ) {
    return {
      eligible: false,
      expired: false,
      daysLeft: 0,
      deliveryDate: null,
      returnUntil: null,
      reason:
        "Delivery date is invalid.",
    };
  }

  const returnUntil =
    new Date(
      delivered,
    );

  returnUntil.setDate(
    returnUntil.getDate() +
      RETURN_WINDOW_DAYS,
  );

  const now =
    new Date();

  /*
   * Compare calendar dates rather than
   * exact hours so that the customer's
   * 15-day window is consistent.
   */
  const today =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

  const deadline =
    new Date(
      returnUntil.getFullYear(),
      returnUntil.getMonth(),
      returnUntil.getDate(),
    );

  const deliveredDate =
    new Date(
      delivered.getFullYear(),
      delivered.getMonth(),
      delivered.getDate(),
    );

  const difference =
    deadline.getTime() -
    today.getTime();

  const daysLeft =
    Math.max(
      0,
      Math.ceil(
        difference /
          (1000 *
            60 *
            60 *
            24),
      ),
    );

  const expired =
    today.getTime() >
    deadline.getTime();

  return {
    eligible:
      !expired,
    expired,
    daysLeft,
    deliveryDate:
      deliveredDate,
    returnUntil:
      deadline,
    reason: expired
      ? "The 15-day return period has ended."
      : `${daysLeft} day${
          daysLeft === 1
            ? ""
            : "s"
        } left to return this product.`,
  };
}

export default function OrdersPage() {
  const supabase =
    useMemo(
      () =>
        createClient(),
      [],
    );

  const [
    orders,
    setOrders,
  ] =
    useState<Order[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    returningOrderId,
    setReturningOrderId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    returnError,
    setReturnError,
  ] =
    useState("");

  const [
    returnSuccess,
    setReturnSuccess,
  ] =
    useState("");

  const [
    confirmReturnOrder,
    setConfirmReturnOrder,
  ] =
    useState<Order | null>(
      null,
    );

  useEffect(() => {
    let active =
      true;

    async function loadOrders() {
      try {
        setLoading(
          true,
        );

        setError(
          "",
        );

        const {
          data,
        } =
          await supabase.auth.getUser();

        if (
          !data.user
        ) {
          window.location.href =
            "/account";

          return;
        }

        const response =
          await fetch(
            "/api/account/orders",
            {
              method:
                "GET",

              headers: {
                Accept:
                  "application/json",
              },

              cache:
                "no-store",
            },
          );

        let responseData:
          ApiResponse | null =
          null;

        try {
          responseData =
            (await response.json()) as ApiResponse;
        } catch {
          responseData =
            null;
        }

        if (
          !response.ok ||
          !responseData
            ?.success
        ) {
          throw new Error(
            responseData
              ?.message ||
              "Your orders could not be loaded.",
          );
        }

        if (
          active
        ) {
          setOrders(
            Array.isArray(
              responseData.orders,
            )
              ? responseData.orders
              : [],
          );
        }
      } catch (
        error
      ) {
        if (
          active
        ) {
          setError(
            error instanceof
            Error
              ? error.message
              : "Your orders could not be loaded.",
          );
        }
      } finally {
        if (
          active
        ) {
          setLoading(
            false,
          );
        }
      }
    }

    void loadOrders();

    return () => {
      active =
        false;
    };
  }, [
    supabase,
  ]);

  async function submitReturn(
    order: Order,
  ) {
    try {
      setReturningOrderId(
        order.id,
      );

      setReturnError(
        "",
      );

      setReturnSuccess(
        "",
      );

      const returnInfo =
        getReturnInfo(
          order,
        );

      if (
        !returnInfo.eligible
      ) {
        throw new Error(
          returnInfo.reason,
        );
      }

      /*
       * Customer must be authenticated.
       */
      const {
        data,
      } =
        await supabase.auth.getUser();

      if (
        !data.user
      ) {
        window.location.href =
          "/account";

        return;
      }

      /*
       * This route should create the
       * return request server-side.
       *
       * The server must re-check:
       * - customer ownership
       * - delivered status
       * - deliveredAt
       * - 15-day return window
       *
       * Never trust the frontend alone.
       */
      const response =
        await fetch(
          `/api/account/orders/${encodeURIComponent(
            order.id,
          )}/return`,
          {
            method:
              "POST",

            headers: {
              Accept:
                "application/json",

              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId:
                  order.id,
              }),

            cache:
              "no-store",
          },
        );

      let responseData:
        ReturnResponse | null =
        null;

      try {
        responseData =
          (await response.json()) as ReturnResponse;
      } catch {
        responseData =
          null;
      }

      if (
        !response.ok ||
        !responseData
          ?.success
      ) {
        throw new Error(
          responseData
            ?.message ||
            "Return request could not be submitted.",
        );
      }

      setOrders(
        (
          current,
        ) =>
          current.map(
            (
              currentOrder,
            ) =>
              currentOrder.id ===
              order.id
                ? {
                    ...currentOrder,

                    returnStatus:
                      "requested",
                  }
                : currentOrder,
          ),
      );

      setReturnSuccess(
        `Return request submitted for order ${order.orderNumber}.`,
      );

      setConfirmReturnOrder(
        null,
      );
    } catch (
      error
    ) {
      setReturnError(
        error instanceof
        Error
          ? error.message
          : "Return request could not be submitted.",
      );
    } finally {
      setReturningOrderId(
        null,
      );
    }
  }

  const filteredOrders =
    orders.filter(
      (
        order,
      ) => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (
          !query
        ) {
          return true;
        }

        return (
          order.orderNumber
            .toLowerCase()
            .includes(
              query,
            ) ||
          order.items.some(
            (
              item,
            ) =>
              item.name
                .toLowerCase()
                .includes(
                  query,
                ),
          )
        );
      },
    );

  const activeOrders =
    orders.filter(
      (
        order,
      ) =>
        order.status !==
          "delivered" &&
        order.status !==
          "cancelled",
    ).length;

  const deliveredOrders =
    orders.filter(
      (
        order,
      ) =>
        order.status ===
        "delivered",
    ).length;

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#020202",

        color:
          "#ffffff",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        padding:
          "46px 0 80px",
      }}
    >
      <section
        style={{
          width:
            "min(1180px, calc(100% - 64px))",

          margin:
            "0 auto",
        }}
      >
        <Link
          href="/account"
          style={{
            width:
              "max-content",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "8px",

            color:
              "rgba(255,255,255,.48)",

            textDecoration:
              "none",

            fontSize:
              "8px",

            fontWeight:
              800,

            letterSpacing:
              ".12em",
          }}
        >
          <ArrowLeft
            size={14}
          />

          BACK TO ACCOUNT
        </Link>

        <header
          style={{
            display:
              "flex",

            alignItems:
              "flex-end",

            justifyContent:
              "space-between",

            gap:
              "30px",

            padding:
              "42px 0 31px",

            borderBottom:
              "1px solid rgba(216,165,41,.22)",
          }}
        >
          <div>
            <span
              style={{
                color:
                  "#d8a529",

                fontSize:
                  "8px",

                fontWeight:
                  800,

                letterSpacing:
                  ".18em",
              }}
            >
              KRVE PRIVATE CLIENT
            </span>

            <h1
              style={{
                margin:
                  "10px 0 0",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "clamp(42px,5vw,62px)",

                fontWeight:
                  400,

                lineHeight:
                  1,
              }}
            >
              My Orders
            </h1>

            <p
              style={{
                margin:
                  "13px 0 0",

                maxWidth:
                  "520px",

                color:
                  "rgba(255,255,255,.35)",

                fontSize:
                  "11px",

                lineHeight:
                  1.7,
              }}
            >
              View your KRVE purchases,
              payment status, delivery
              progress and return window
              in one place.
            </p>
          </div>

          <div
            style={{
              minWidth:
                "120px",

              textAlign:
                "right",
            }}
          >
            <ShoppingBag
              size={24}
              color="#d8a529"
              strokeWidth={
                1.3
              }
            />

            <div
              style={{
                marginTop:
                  "9px",

                color:
                  "#d8a529",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "25px",
              }}
            >
              {
                orders.length
              }
            </div>

            <span
              style={{
                color:
                  "rgba(255,255,255,.3)",

                fontSize:
                  "7px",

                letterSpacing:
                  ".13em",
              }}
            >
              TOTAL ORDERS
            </span>
          </div>
        </header>

        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(3, 1fr)",

            marginTop:
              "25px",

            borderTop:
              "1px solid rgba(216,165,41,.18)",

            borderLeft:
              "1px solid rgba(216,165,41,.18)",
          }}
        >
          <StatCard
            icon={
              <Box
                size={
                  18
                }
              />
            }
            label="TOTAL ORDERS"
            value={
              String(
                orders.length,
              )
            }
          />

          <StatCard
            icon={
              <Truck
                size={
                  18
                }
              />
            }
            label="ACTIVE ORDERS"
            value={
              String(
                activeOrders,
              )
            }
          />

          <StatCard
            icon={
              <CheckCircle2
                size={
                  18
                }
              />
            }
            label="DELIVERED"
            value={
              String(
                deliveredOrders,
              )
            }
          />
        </section>

        {returnSuccess ? (
          <div
            style={{
              marginTop:
                "20px",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "9px",

              border:
                "1px solid rgba(216,165,41,.35)",

              background:
                "rgba(216,165,41,.05)",

              padding:
                "13px 15px",

              color:
                "#d8a529",

              fontSize:
                "9px",
            }}
          >
            <CheckCircle2
              size={16}
            />

            {
              returnSuccess
            }
          </div>
        ) : null}

        {returnError ? (
          <div
            style={{
              marginTop:
                "20px",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "9px",

              border:
                "1px solid rgba(190,80,60,.4)",

              background:
                "rgba(190,80,60,.06)",

              padding:
                "13px 15px",

              color:
                "#e39b89",

              fontSize:
                "9px",
            }}
          >
            <AlertCircle
              size={16}
            />

            {
              returnError
            }
          </div>
        ) : null}

        <section
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "20px",

            marginTop:
              "38px",
          }}
        >
          <div>
            <span
              style={{
                color:
                  "#d8a529",

                fontSize:
                  "7px",

                fontWeight:
                  800,

                letterSpacing:
                  ".16em",
              }}
            >
              PURCHASE HISTORY
            </span>

            <h2
              style={{
                margin:
                  "7px 0 0",

                fontFamily:
                  "Georgia, serif",

                fontWeight:
                  400,

                fontSize:
                  "30px",
              }}
            >
              Your KRVE purchases
            </h2>
          </div>

          <div
            style={{
              width:
                "min(340px,100%)",

              height:
                "46px",

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              border:
                "1px solid rgba(216,165,41,.22)",

              padding:
                "0 13px",

              color:
                "#d8a529",

              background:
                "#060606",
            }}
          >
            <Search
              size={16}
            />

            <input
              type="search"
              placeholder="Search order or product"
              value={
                search
              }
              onChange={(
                event,
              ) =>
                setSearch(
                  event
                    .target
                    .value,
                )
              }
              style={{
                width:
                  "100%",

                height:
                  "42px",

                border:
                  0,

                outline:
                  0,

                background:
                  "transparent",

                color:
                  "#ffffff",

                fontSize:
                  "10px",
              }}
            />
          </div>
        </section>

        {loading ? (
          <section
            style={{
              marginTop:
                "25px",

              minHeight:
                "280px",

              display:
                "grid",

              placeItems:
                "center",

              border:
                "1px solid rgba(216,165,41,.18)",

              background:
                "#050505",
            }}
          >
            <div
              style={{
                textAlign:
                  "center",
              }}
            >
              <PackageCheck
                size={29}
                color="#d8a529"
                strokeWidth={
                  1.2
                }
              />

              <p
                style={{
                  color:
                    "rgba(255,255,255,.4)",

                  fontSize:
                    "9px",

                  letterSpacing:
                    ".12em",
                }}
              >
                LOADING YOUR ORDERS...
              </p>
            </div>
          </section>
        ) : null}

        {!loading &&
        error ? (
          <section
            style={{
              marginTop:
                "25px",

              border:
                "1px solid rgba(216,165,41,.25)",

              background:
                "rgba(216,165,41,.035)",

              padding:
                "35px",

              textAlign:
                "center",
            }}
          >
            <ShieldCheck
              size={28}
              color="#d8a529"
              strokeWidth={
                1.25
              }
            />

            <h3
              style={{
                margin:
                  "16px 0 7px",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "23px",

                fontWeight:
                  400,
              }}
            >
              Orders are not connected yet.
            </h3>

            <p
              style={{
                margin:
                  "0 auto",

                maxWidth:
                  "470px",

                color:
                  "rgba(255,255,255,.35)",

                fontSize:
                  "10px",

                lineHeight:
                  1.7,
              }}
            >
              {error}
            </p>
          </section>
        ) : null}

        {!loading &&
        !error &&
        filteredOrders.length ===
          0 ? (
          <section
            style={{
              marginTop:
                "25px",

              minHeight:
                "315px",

              display:
                "flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              justifyContent:
                "center",

              border:
                "1px solid rgba(216,165,41,.18)",

              background:
                "#050505",

              textAlign:
                "center",

              padding:
                "30px",
            }}
          >
            <div
              style={{
                width:
                  "68px",

                height:
                  "68px",

                display:
                  "grid",

                placeItems:
                  "center",

                border:
                  "1px solid rgba(216,165,41,.4)",

                borderRadius:
                  "50%",

                color:
                  "#d8a529",
              }}
            >
              <ShoppingBag
                size={25}
                strokeWidth={
                  1.3
                }
              />
            </div>

            <span
              style={{
                marginTop:
                  "19px",

                color:
                  "#d8a529",

                fontSize:
                  "7px",

                fontWeight:
                  800,

                letterSpacing:
                  ".18em",
              }}
            >
              YOUR PURCHASE HISTORY
            </span>

            <h3
              style={{
                margin:
                  "9px 0 8px",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "28px",

                fontWeight:
                  400,
              }}
            >
              No orders found.
            </h3>

            <p
              style={{
                margin:
                  0,

                maxWidth:
                  "430px",

                color:
                  "rgba(255,255,255,.32)",

                fontSize:
                  "10px",

                lineHeight:
                  1.7,
              }}
            >
              Your KRVE purchases will appear here
              after you place an order.
            </p>

            <Link
              href="/collections"
              style={{
                minHeight:
                  "44px",

                display:
                  "inline-flex",

                alignItems:
                  "center",

                gap:
                  "8px",

                marginTop:
                  "22px",

                border:
                  "1px solid #d8a529",

                padding:
                  "0 17px",

                color:
                  "#d8a529",

                fontSize:
                  "8px",

                fontWeight:
                  800,

                letterSpacing:
                  ".1em",

                textDecoration:
                  "none",
              }}
            >
              EXPLORE COLLECTIONS

              <ArrowRight
                size={14}
              />
            </Link>
          </section>
        ) : null}

        {!loading &&
        !error &&
        filteredOrders.length >
          0 ? (
          <section
            style={{
              display:
                "grid",

              gap:
                "13px",

              marginTop:
                "25px",
            }}
          >
            {filteredOrders.map(
              (
                order,
              ) => {
                const returnInfo =
                  getReturnInfo(
                    order,
                  );

                const returnRequested =
                  order.returnStatus ===
                    "requested" ||
                  order.returnStatus ===
                    "approved" ||
                  order.returnStatus ===
                    "completed";

                return (
                  <article
                    key={
                      order.id
                    }
                    style={{
                      border:
                        "1px solid rgba(216,165,41,.2)",

                      background:
                        "#050505",
                    }}
                  >
                    <div
                      style={{
                        minHeight:
                          "70px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "space-between",

                        gap:
                          "20px",

                        padding:
                          "15px 20px",

                        borderBottom:
                          "1px solid rgba(216,165,41,.13)",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap:
                            "13px",
                        }}
                      >
                        <div
                          style={{
                            width:
                              "39px",

                            height:
                              "39px",

                            display:
                              "grid",

                            placeItems:
                              "center",

                            border:
                              "1px solid rgba(216,165,41,.3)",

                            color:
                              "#d8a529",
                          }}
                        >
                          <OrderStatusIcon
                            status={
                              order.status
                            }
                          />
                        </div>

                        <div>
                          <span
                            style={{
                              color:
                                "#7f6520",

                              fontSize:
                                "7px",

                              fontWeight:
                                800,

                              letterSpacing:
                                ".14em",
                            }}
                          >
                            ORDER NUMBER
                          </span>

                          <strong
                            style={{
                              display:
                                "block",

                              marginTop:
                                "4px",

                              fontFamily:
                                "Georgia, serif",

                              fontWeight:
                                400,

                              fontSize:
                                "16px",
                            }}
                          >
                            {
                              order.orderNumber
                            }
                          </strong>
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          gap:
                            "27px",

                          alignItems:
                            "center",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display:
                                "block",

                              color:
                                "#777",

                              fontSize:
                                "7px",
                            }}
                          >
                            ORDERED
                          </span>

                          <strong
                            style={{
                              display:
                                "block",

                              marginTop:
                                "4px",

                              color:
                                "rgba(255,255,255,.68)",

                              fontSize:
                                "9px",

                              fontWeight:
                                500,
                            }}
                          >
                            {formatDate(
                              order.createdAt,
                            )}
                          </strong>
                        </div>

                        {order.deliveredAt ? (
                          <div>
                            <span
                              style={{
                                display:
                                  "block",

                                color:
                                  "#777",

                                fontSize:
                                  "7px",
                              }}
                            >
                              DELIVERED
                            </span>

                            <strong
                              style={{
                                display:
                                  "block",

                                marginTop:
                                  "4px",

                                color:
                                  "rgba(255,255,255,.68)",

                                fontSize:
                                  "9px",

                                fontWeight:
                                  500,
                              }}
                            >
                              {formatDate(
                                order.deliveredAt,
                              )}
                            </strong>
                          </div>
                        ) : null}

                        <div>
                          <span
                            style={{
                              display:
                                "block",

                              color:
                                "#777",

                              fontSize:
                                "7px",
                            }}
                          >
                            TOTAL
                          </span>

                          <strong
                            style={{
                              display:
                                "block",

                              marginTop:
                                "4px",

                              color:
                                "#d8a529",

                              fontFamily:
                                "Georgia, serif",

                              fontSize:
                                "15px",
                            }}
                          >
                            {money.format(
                              order.total,
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "minmax(0,1fr) 250px",

                        gap:
                          "25px",

                        padding:
                          "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display:
                              "flex",

                            flexWrap:
                              "wrap",

                            gap:
                              "8px",

                            marginBottom:
                              "16px",
                          }}
                        >
                          <StatusPill>
                            {
                              statusLabel(
                                order.status,
                              )
                            }
                          </StatusPill>

                          <StatusPill>
                            {
                              paymentLabel(
                                order.paymentStatus,
                              )
                            }
                          </StatusPill>

                          <StatusPill>
                            {
                              order.paymentMethod
                            }
                          </StatusPill>
                        </div>

                        <div
                          style={{
                            display:
                              "grid",

                            gap:
                              "10px",
                          }}
                        >
                          {order.items
                            .slice(
                              0,
                              3,
                            )
                            .map(
                              (
                                item,
                              ) => (
                                <div
                                  key={
                                    item.id
                                  }
                                  style={{
                                    display:
                                      "flex",

                                    justifyContent:
                                      "space-between",

                                    gap:
                                      "15px",

                                    borderBottom:
                                      "1px solid rgba(255,255,255,.05)",

                                    paddingBottom:
                                      "9px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display:
                                        "flex",

                                      gap:
                                        "12px",

                                      alignItems:
                                        "center",
                                    }}
                                  >
                                    {item.image ? (
                                      <img
                                        src={
                                          item.image
                                        }
                                        alt={
                                          item.name
                                        }
                                        style={{
                                          width:
                                            "48px",

                                          height:
                                            "60px",

                                          objectFit:
                                            "cover",

                                          border:
                                            "1px solid rgba(216,165,41,.18)",

                                          background:
                                            "#090909",
                                        }}
                                      />
                                    ) : null}

                                    <div>
                                      <strong
                                        style={{
                                          display:
                                            "block",

                                          fontFamily:
                                            "Georgia, serif",

                                          fontWeight:
                                            400,

                                          fontSize:
                                            "13px",
                                        }}
                                      >
                                        {
                                          item.name
                                        }
                                      </strong>

                                      <span
                                        style={{
                                          display:
                                            "block",

                                          marginTop:
                                            "4px",

                                          color:
                                            "rgba(255,255,255,.3)",

                                          fontSize:
                                            "8px",
                                        }}
                                      >
                                        Qty{" "}
                                        {
                                          item.quantity
                                        }
                                        {item.size
                                          ? ` · Size ${item.size}`
                                          : ""}
                                        {item.colour
                                          ? ` · ${item.colour}`
                                          : ""}
                                      </span>
                                    </div>
                                  </div>

                                  <span
                                    style={{
                                      color:
                                        "rgba(255,255,255,.65)",

                                      fontSize:
                                        "10px",
                                    }}
                                  >
                                    {money.format(
                                      item.price *
                                        item.quantity,
                                    )}
                                  </span>
                                </div>
                              ),
                            )}
                        </div>
                      </div>

                      <div
                        style={{
                          display:
                            "flex",

                          flexDirection:
                            "column",

                          justifyContent:
                            "space-between",

                          gap:
                            "15px",

                          borderLeft:
                            "1px solid rgba(216,165,41,.12)",

                          paddingLeft:
                            "20px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color:
                                "#7d6420",

                              fontSize:
                                "7px",

                              fontWeight:
                                800,

                              letterSpacing:
                                ".14em",
                            }}
                          >
                            CURRENT STATUS
                          </span>

                          <strong
                            style={{
                              display:
                                "block",

                              marginTop:
                                "7px",

                              fontFamily:
                                "Georgia, serif",

                              fontSize:
                                "19px",

                              fontWeight:
                                400,
                            }}
                          >
                            {statusLabel(
                              order.status,
                            )}
                          </strong>

                          {order.status ===
                            "delivered" ? (
                            <div
                              style={{
                                marginTop:
                                  "14px",

                                padding:
                                  "11px",

                                border:
                                  "1px solid rgba(216,165,41,.16)",

                                background:
                                  "rgba(216,165,41,.025)",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",

                                  alignItems:
                                    "center",

                                  gap:
                                    "7px",

                                  color:
                                    "#d8a529",

                                  fontSize:
                                    "8px",

                                  fontWeight:
                                    800,
                                }}
                              >
                                <CalendarDays
                                  size={
                                    14
                                  }
                                />

                                RETURN WINDOW
                              </div>

                              {order.deliveredAt ? (
                                <>
                                  <span
                                    style={{
                                      display:
                                        "block",

                                      marginTop:
                                        "8px",

                                      color:
                                        "rgba(255,255,255,.36)",

                                      fontSize:
                                        "8px",

                                      lineHeight:
                                        1.6,
                                    }}
                                  >
                                    Delivered on{" "}
                                    {formatDate(
                                      order.deliveredAt,
                                    )}
                                  </span>

                                  <span
                                    style={{
                                      display:
                                        "block",

                                      marginTop:
                                        "3px",

                                      color:
                                        returnInfo.expired
                                          ? "#a66b60"
                                          : "#d8a529",

                                      fontSize:
                                        "8px",

                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    {returnInfo.expired
                                      ? "Return period expired"
                                      : `${returnInfo.daysLeft} day${
                                          returnInfo.daysLeft ===
                                          1
                                            ? ""
                                            : "s"
                                        } remaining`}
                                  </span>
                                </>
                              ) : (
                                <span
                                  style={{
                                    display:
                                      "block",

                                    marginTop:
                                      "8px",

                                    color:
                                      "rgba(255,255,255,.36)",

                                    fontSize:
                                      "8px",

                                    lineHeight:
                                      1.6,
                                  }}
                                >
                                  Delivery date is
                                  required to calculate
                                  the 15-day return window.
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>

                        <Link
                          href={`/account/orders/${encodeURIComponent(
                            order.id,
                          )}`}
                          style={{
                            minHeight:
                              "42px",

                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "space-between",

                            border:
                              "1px solid rgba(216,165,41,.35)",

                            padding:
                              "0 13px",

                            color:
                              "#d8a529",

                            textDecoration:
                              "none",

                            fontSize:
                              "8px",

                            fontWeight:
                              800,

                            letterSpacing:
                              ".1em",
                          }}
                        >
                          VIEW ORDER

                          <ChevronRight
                            size={14}
                          />
                        </Link>

                        {order.status ===
                        "delivered" ? (
                          returnRequested ? (
                            <div
                              style={{
                                minHeight:
                                  "42px",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                gap:
                                  "8px",

                                border:
                                  "1px solid rgba(216,165,41,.3)",

                                background:
                                  "rgba(216,165,41,.035)",

                                color:
                                  "#d8a529",

                                fontSize:
                                  "8px",

                                fontWeight:
                                  800,

                                letterSpacing:
                                  ".1em",
                              }}
                            >
                              <CheckCircle2
                                size={
                                  14
                                }
                              />

                              RETURN REQUESTED
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                !returnInfo.eligible ||
                                returningOrderId ===
                                  order.id
                              }
                              onClick={() => {
                                setReturnError(
                                  "",
                                );

                                setReturnSuccess(
                                  "",
                                );

                                setConfirmReturnOrder(
                                  order,
                                );
                              }}
                              style={{
                                minHeight:
                                  "42px",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                gap:
                                  "8px",

                                border:
                                  returnInfo.eligible
                                    ? "1px solid #d8a529"
                                    : "1px solid rgba(255,255,255,.08)",

                                background:
                                  returnInfo.eligible
                                    ? "rgba(216,165,41,.07)"
                                    : "rgba(255,255,255,.02)",

                                color:
                                  returnInfo.eligible
                                    ? "#d8a529"
                                    : "rgba(255,255,255,.22)",

                                fontSize:
                                  "8px",

                                fontWeight:
                                  800,

                                letterSpacing:
                                  ".1em",

                                cursor:
                                  returnInfo.eligible
                                    ? "pointer"
                                    : "not-allowed",
                              }}
                            >
                              <RotateCcw
                                size={
                                  14
                                }
                              />

                              {returnInfo.expired
                                ? "RETURN PERIOD EXPIRED"
                                : returningOrderId ===
                                  order.id
                                ? "SUBMITTING..."
                                : "RETURN PRODUCT"}
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </section>
        ) : null}

        <footer
          style={{
            minHeight:
              "76px",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            marginTop:
              "30px",

            borderTop:
              "1px solid rgba(216,165,41,.18)",

            borderBottom:
              "1px solid rgba(216,165,41,.18)",

            color:
              "#d8a529",
          }}
        >
          <ShieldCheck
            size={19}
          />

          <div>
            <span
              style={{
                display:
                  "block",

                color:
                  "#7d6420",

                fontSize:
                  "7px",

                fontWeight:
                  800,

                letterSpacing:
                  ".13em",
              }}
            >
              PRIVATE CLIENT
            </span>

            <strong
              style={{
                display:
                  "block",

                marginTop:
                  "4px",

                color:
                  "rgba(255,255,255,.65)",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "13px",

                fontWeight:
                  400,
              }}
            >
              Your purchase history is private.
            </strong>
          </div>
        </footer>
      </section>

      {/* RETURN CONFIRMATION MODAL */}

      {confirmReturnOrder ? (
        <div
          style={{
            position:
              "fixed",

            inset:
              0,

            zIndex:
              100,

            display:
              "grid",

            placeItems:
              "center",

            padding:
              "20px",

            background:
              "rgba(0,0,0,.78)",
          }}
        >
          <div
            style={{
              position:
                "relative",

              width:
                "min(470px,100%)",

              border:
                "1px solid rgba(216,165,41,.4)",

              background:
                "#060606",

              padding:
                "30px",

              boxShadow:
                "0 30px 100px rgba(0,0,0,.7)",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setConfirmReturnOrder(
                  null,
                )
              }
              style={{
                position:
                  "absolute",

                top:
                  "15px",

                right:
                  "15px",

                width:
                  "32px",

                height:
                  "32px",

                display:
                  "grid",

                placeItems:
                  "center",

                border:
                  "1px solid rgba(255,255,255,.1)",

                background:
                  "transparent",

                color:
                  "rgba(255,255,255,.5)",

                cursor:
                  "pointer",
              }}
            >
              <X
                size={15}
              />
            </button>

            <RotateCcw
              size={29}
              color="#d8a529"
              strokeWidth={
                1.2
              }
            />

            <span
              style={{
                display:
                  "block",

                marginTop:
                  "18px",

                color:
                  "#d8a529",

                fontSize:
                  "7px",

                fontWeight:
                  800,

                letterSpacing:
                  ".16em",
              }}
            >
              RETURN REQUEST
            </span>

            <h2
              style={{
                margin:
                  "9px 0 10px",

                fontFamily:
                  "Georgia, serif",

                fontSize:
                  "29px",

                fontWeight:
                  400,
              }}
            >
              Return this order?
            </h2>

            <p
              style={{
                margin:
                  0,

                color:
                  "rgba(255,255,255,.4)",

                fontSize:
                  "10px",

                lineHeight:
                  1.8,
              }}
            >
              You are requesting a return for
              order{" "}
              <strong
                style={{
                  color:
                    "#d8a529",
                }}
              >
                {
                  confirmReturnOrder.orderNumber
                }
              </strong>
              .
            </p>

            {confirmReturnOrder.deliveredAt ? (
              <div
                style={{
                  marginTop:
                    "20px",

                  display:
                    "grid",

                  gap:
                    "8px",

                  border:
                    "1px solid rgba(216,165,41,.16)",

                  padding:
                    "14px",
                }}
              >
                <span
                  style={{
                    color:
                      "rgba(255,255,255,.35)",

                    fontSize:
                      "8px",
                  }}
                >
                  Delivered on{" "}
                  {formatDate(
                    confirmReturnOrder.deliveredAt,
                  )}
                </span>

                <span
                  style={{
                    color:
                      "#d8a529",

                    fontSize:
                      "9px",

                    fontWeight:
                      800,
                  }}
                >
                  Return must be requested within
                  15 days of delivery.
                </span>
              </div>
            ) : null}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "10px",

                marginTop:
                  "22px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setConfirmReturnOrder(
                    null,
                  )
                }
                style={{
                  minHeight:
                    "45px",

                  border:
                    "1px solid rgba(255,255,255,.12)",

                  background:
                    "transparent",

                  color:
                    "rgba(255,255,255,.6)",

                  fontSize:
                    "8px",

                  fontWeight:
                    800,

                  letterSpacing:
                    ".1em",

                  cursor:
                    "pointer",
                }}
              >
                CANCEL
              </button>

              <button
                type="button"
                disabled={
                  returningOrderId ===
                  confirmReturnOrder.id
                }
                onClick={() =>
                  void submitReturn(
                    confirmReturnOrder,
                  )
                }
                style={{
                  minHeight:
                    "45px",

                  border:
                    0,

                  background:
                    "linear-gradient(90deg,#b87c0d,#edbd45,#ca8b14)",

                  color:
                    "#050505",

                  fontSize:
                    "8px",

                  fontWeight:
                    900,

                  letterSpacing:
                    ".1em",

                  cursor:
                    "pointer",

                  opacity:
                    returningOrderId ===
                    confirmReturnOrder.id
                      ? 0.55
                      : 1,
                }}
              >
                {returningOrderId ===
                confirmReturnOrder.id
                  ? "SUBMITTING..."
                  : "CONFIRM RETURN"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;
}) {
  return (
    <article
      style={{
        minHeight:
          "105px",

        display:
          "flex",

        alignItems:
          "center",

        gap:
          "14px",

        borderRight:
          "1px solid rgba(216,165,41,.18)",

        borderBottom:
          "1px solid rgba(216,165,41,.18)",

        padding:
          "18px",

        color:
          "#d8a529",
      }}
    >
      <div
        style={{
          width:
            "40px",

          height:
            "40px",

          display:
            "grid",

          placeItems:
            "center",

          border:
            "1px solid rgba(216,165,41,.3)",
        }}
      >
        {icon}
      </div>

      <div>
        <span
          style={{
            display:
              "block",

            color:
              "#78601d",

            fontSize:
              "7px",

            fontWeight:
              800,

            letterSpacing:
              ".14em",
          }}
        >
          {label}
        </span>

        <strong
          style={{
            display:
              "block",

            marginTop:
              "5px",

            color:
              "#ffffff",

            fontFamily:
              "Georgia, serif",

            fontSize:
              "24px",

            fontWeight:
              400,
          }}
        >
          {value}
        </strong>
      </div>
    </article>
  );
}

function StatusPill({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <span
      style={{
        minHeight:
          "25px",

        display:
          "inline-flex",

        alignItems:
          "center",

        border:
          "1px solid rgba(216,165,41,.24)",

        padding:
          "0 9px",

        color:
          "#d8a529",

        fontSize:
          "7px",

        fontWeight:
          800,

        letterSpacing:
          ".09em",

        textTransform:
          "uppercase",
      }}
    >
      {children}
    </span>
  );
}
