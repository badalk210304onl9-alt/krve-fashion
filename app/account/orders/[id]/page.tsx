"use client";

import Link from "next/link";
import {
  useParams,
} from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type OrderItem = {
  id: string;
  name: string;
  image?: string | null;
  size?: string | null;
  colour?: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status:
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus:
    | "paid"
    | "pending"
    | "failed"
    | "refunded";
  paymentMethod: string;
  total: number;
  currency: string;
  itemCount: number;
  items: OrderItem[];
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  order?: Order;
};

const money =
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
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
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(
    date,
  );
}

function statusLabel(
  status: Order["status"],
) {
  if (
    status === "processing"
  ) {
    return "Processing";
  }

  if (
    status === "shipped"
  ) {
    return "Shipped";
  }

  if (
    status === "delivered"
  ) {
    return "Delivered";
  }

  if (
    status === "cancelled"
  ) {
    return "Cancelled";
  }

  return "Confirmed";
}

function paymentLabel(
  status: Order["paymentStatus"],
) {
  if (
    status === "paid"
  ) {
    return "Paid";
  }

  if (
    status === "failed"
  ) {
    return "Failed";
  }

  if (
    status === "refunded"
  ) {
    return "Refunded";
  }

  return "Payment Pending";
}

export default function OrderDetailsPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const orderId =
    params.id;

  const [
    order,
    setOrder,
  ] =
    useState<Order | null>(
      null,
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

  useEffect(() => {
    let active =
      true;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/account/orders/${encodeURIComponent(
              orderId,
            )}`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
              cache:
                "no-store",
            },
          );

        let data:
          ApiResponse | null =
          null;

        try {
          data =
            (await response.json()) as ApiResponse;
        } catch {
          data = null;
        }

        if (
          !response.ok ||
          !data?.success ||
          !data.order
        ) {
          throw new Error(
            data?.message ||
              "Order details could not be loaded.",
          );
        }

        if (active) {
          setOrder(
            data.order,
          );
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Order details could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [
    orderId,
  ]);

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
            "min(1120px, calc(100% - 64px))",
          margin:
            "0 auto",
        }}
      >
        <Link
          href="/account/orders"
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
              "rgba(255,255,255,.45)",
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
          BACK TO MY ORDERS
        </Link>

        {loading ? (
          <section
            style={{
              minHeight:
                "360px",
              display:
                "grid",
              placeItems:
                "center",
              marginTop:
                "35px",
              border:
                "1px solid rgba(216,165,41,.2)",
            }}
          >
            <div
              style={{
                textAlign:
                  "center",
              }}
            >
              <PackageCheck
                size={30}
                color="#d8a529"
              />

              <p
                style={{
                  marginTop:
                    "12px",
                  color:
                    "#d8a529",
                  fontSize:
                    "8px",
                  letterSpacing:
                    ".14em",
                }}
              >
                LOADING ORDER...
              </p>
            </div>
          </section>
        ) : null}

        {!loading &&
        error ? (
          <section
            style={{
              marginTop:
                "35px",
              padding:
                "45px",
              border:
                "1px solid rgba(216,165,41,.2)",
              textAlign:
                "center",
            }}
          >
            <ShieldCheck
              size={30}
              color="#d8a529"
            />

            <h1
              style={{
                margin:
                  "15px 0 8px",
                fontFamily:
                  "Georgia, serif",
                fontWeight:
                  400,
                fontSize:
                  "30px",
              }}
            >
              Order could not be opened.
            </h1>

            <p
              style={{
                color:
                  "rgba(255,255,255,.38)",
                fontSize:
                  "10px",
              }}
            >
              {error}
            </p>
          </section>
        ) : null}

        {!loading &&
        !error &&
        order ? (
          <>
            <header
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap:
                  "30px",
                alignItems:
                  "flex-end",
                marginTop:
                  "38px",
                paddingBottom:
                  "28px",
                borderBottom:
                  "1px solid rgba(216,165,41,.2)",
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
                      ".17em",
                  }}
                >
                  KRVE ORDER
                </span>

                <h1
                  style={{
                    margin:
                      "10px 0 0",
                    fontFamily:
                      "Georgia, serif",
                    fontSize:
                      "clamp(38px,5vw,58px)",
                    fontWeight:
                      400,
                  }}
                >
                  {
                    order.orderNumber
                  }
                </h1>

                <p
                  style={{
                    margin:
                      "10px 0 0",
                    color:
                      "rgba(255,255,255,.35)",
                    fontSize:
                      "10px",
                  }}
                >
                  Ordered on{" "}
                  {formatDate(
                    order.createdAt,
                  )}
                </p>
              </div>

              <div
                style={{
                  textAlign:
                    "right",
                }}
              >
                <span
                  style={{
                    color:
                      "#7f6520",
                    fontSize:
                      "7px",
                    fontWeight:
                      800,
                    letterSpacing:
                      ".13em",
                  }}
                >
                  ORDER TOTAL
                </span>

                <strong
                  style={{
                    display:
                      "block",
                    marginTop:
                      "5px",
                    color:
                      "#d8a529",
                    fontFamily:
                      "Georgia, serif",
                    fontWeight:
                      400,
                    fontSize:
                      "30px",
                  }}
                >
                  {money.format(
                    order.total,
                  )}
                </strong>
              </div>
            </header>

            <section
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(3,1fr)",
                marginTop:
                  "24px",
                borderTop:
                  "1px solid rgba(216,165,41,.18)",
                borderLeft:
                  "1px solid rgba(216,165,41,.18)",
              }}
            >
              <InfoBox
                title="ORDER STATUS"
                value={statusLabel(
                  order.status,
                )}
              />

              <InfoBox
                title="PAYMENT STATUS"
                value={paymentLabel(
                  order.paymentStatus,
                )}
              />

              <InfoBox
                title="PAYMENT METHOD"
                value={
                  order.paymentMethod
                }
              />
            </section>

            <section
              style={{
                marginTop:
                  "34px",
                display:
                  "grid",
                gridTemplateColumns:
                  "minmax(0,1fr) 320px",
                gap:
                  "28px",
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
                      ".15em",
                  }}
                >
                  ORDER ITEMS
                </span>

                <h2
                  style={{
                    margin:
                      "8px 0 18px",
                    fontFamily:
                      "Georgia, serif",
                    fontSize:
                      "30px",
                    fontWeight:
                      400,
                  }}
                >
                  Your selections
                </h2>

                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "10px",
                  }}
                >
                  {order.items.map(
                    (
                      item,
                    ) => (
                      <article
                        key={
                          item.id
                        }
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr auto",
                          gap:
                            "20px",
                          border:
                            "1px solid rgba(216,165,41,.18)",
                          padding:
                            "18px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color:
                                "#78601d",
                              fontSize:
                                "7px",
                              fontWeight:
                                800,
                              letterSpacing:
                                ".13em",
                            }}
                          >
                            KRVE ITEM
                          </span>

                          <h3
                            style={{
                              margin:
                                "7px 0 6px",
                              fontFamily:
                                "Georgia, serif",
                              fontWeight:
                                400,
                              fontSize:
                                "17px",
                            }}
                          >
                            {
                              item.name
                            }
                          </h3>

                          <p
                            style={{
                              margin:
                                0,
                              color:
                                "rgba(255,255,255,.32)",
                              fontSize:
                                "9px",
                            }}
                          >
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                            {item.size
                              ? ` · Size: ${item.size}`
                              : ""}
                            {item.colour
                              ? ` · Colour: ${item.colour}`
                              : ""}
                          </p>
                        </div>

                        <strong
                          style={{
                            alignSelf:
                              "center",
                            color:
                              "#d8a529",
                            fontFamily:
                              "Georgia, serif",
                            fontSize:
                              "17px",
                            fontWeight:
                              400,
                          }}
                        >
                          {money.format(
                            item.price *
                              item.quantity,
                          )}
                        </strong>
                      </article>
                    ),
                  )}
                </div>
              </div>

              <aside
                style={{
                  border:
                    "1px solid rgba(216,165,41,.2)",
                  padding:
                    "24px",
                  height:
                    "max-content",
                }}
              >
                <span
                  style={{
                    color:
                      "#d8a529",
                    fontSize:
                      "7px",
                    fontWeight:
                      800,
                    letterSpacing:
                      ".15em",
                  }}
                >
                  DELIVERY JOURNEY
                </span>

                <h2
                  style={{
                    margin:
                      "8px 0 25px",
                    fontFamily:
                      "Georgia, serif",
                    fontSize:
                      "25px",
                    fontWeight:
                      400,
                  }}
                >
                  Order Progress
                </h2>

                <ProgressStep
                  active
                  icon={
                    <CheckCircle2
                      size={17}
                    />
                  }
                  title="Order Confirmed"
                  text="Your KRVE order has been received."
                />

                <ProgressStep
                  active={
                    order.status ===
                      "processing" ||
                    order.status ===
                      "shipped" ||
                    order.status ===
                      "delivered"
                  }
                  icon={
                    <Clock3
                      size={17}
                    />
                  }
                  title="Processing"
                  text="Your items are being prepared."
                />

                <ProgressStep
                  active={
                    order.status ===
                      "shipped" ||
                    order.status ===
                      "delivered"
                  }
                  icon={
                    <Truck
                      size={17}
                    />
                  }
                  title="Shipped"
                  text="Your order is on the way."
                />

                <ProgressStep
                  active={
                    order.status ===
                    "delivered"
                  }
                  icon={
                    <PackageCheck
                      size={17}
                    />
                  }
                  title="Delivered"
                  text="Your KRVE order has arrived."
                />
              </aside>
            </section>

            <footer
              style={{
                marginTop:
                  "32px",
                minHeight:
                  "72px",
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "12px",
                borderTop:
                  "1px solid rgba(216,165,41,.18)",
                borderBottom:
                  "1px solid rgba(216,165,41,.18)",
                color:
                  "#d8a529",
              }}
            >
              <ShieldCheck
                size={18}
              />

              <div>
                <small
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
                      ".13em",
                  }}
                >
                  PRIVATE CLIENT ORDER
                </small>

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
                    fontWeight:
                      400,
                    fontSize:
                      "13px",
                  }}
                >
                  This order is connected to your secure KRVE account.
                </strong>
              </div>
            </footer>
          </>
        ) : null}
      </section>
    </main>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <article
      style={{
        minHeight:
          "92px",
        display:
          "flex",
        flexDirection:
          "column",
        justifyContent:
          "center",
        borderRight:
          "1px solid rgba(216,165,41,.18)",
        borderBottom:
          "1px solid rgba(216,165,41,.18)",
        padding:
          "18px",
      }}
    >
      <span
        style={{
          color:
            "#78601d",
          fontSize:
            "7px",
          fontWeight:
            800,
          letterSpacing:
            ".13em",
        }}
      >
        {title}
      </span>

      <strong
        style={{
          marginTop:
            "6px",
          color:
            "#d8a529",
          fontFamily:
            "Georgia, serif",
          fontSize:
            "18px",
          fontWeight:
            400,
          textTransform:
            "capitalize",
        }}
      >
        {value}
      </strong>
    </article>
  );
}

function ProgressStep({
  active,
  icon,
  title,
  text,
}: {
  active: boolean;
  icon:
    React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        display:
          "grid",
        gridTemplateColumns:
          "38px 1fr",
        gap:
          "12px",
        padding:
          "0 0 23px",
        opacity:
          active
            ? 1
            : 0.28,
      }}
    >
      <div
        style={{
          width:
            "36px",
          height:
            "36px",
          display:
            "grid",
          placeItems:
            "center",
          border:
            active
              ? "1px solid #d8a529"
              : "1px solid rgba(255,255,255,.15)",
          borderRadius:
            "50%",
          color:
            active
              ? "#d8a529"
              : "#ffffff",
        }}
      >
        {icon}
      </div>

      <div>
        <strong
          style={{
            display:
              "block",
            fontFamily:
              "Georgia, serif",
            fontSize:
              "14px",
            fontWeight:
              400,
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display:
              "block",
            marginTop:
              "4px",
            color:
              "rgba(255,255,255,.32)",
            fontSize:
              "8px",
            lineHeight:
              1.5,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
