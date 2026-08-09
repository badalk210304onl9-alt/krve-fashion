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

type Order = {
  id: string;

  orderNumber: string;

  createdAt: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;

  paymentMethod: string;

  total: number;

  currency: string;

  itemCount: number;

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

        /*
          This API route will be added
          in the next step.

          It will verify the current
          Supabase session server-side
          and then fetch only this
          customer's orders from KRVE
          Central API.
        */

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
        {/* BACK */}

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

        {/* HEADER */}

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
              payment status and delivery
              progress in one place.
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

        {/* STATS */}

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

        {/* SEARCH */}

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

        {/* LOADING */}

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

        {/* ERROR */}

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

        {/* EMPTY */}

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

        {/* ORDERS */}

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
              ) => (
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
                        "minmax(0,1fr) 210px",

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
                                  </span>
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
                    </div>
                  </div>
                </article>
              ),
            )}
          </section>
        ) : null}

        {/* SECURITY */}

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
