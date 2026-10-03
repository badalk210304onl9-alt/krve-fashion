import styles from "../track-order/support.module.css";

export const metadata = {
  title: "Shipping Policy | KRVE The Fashion Studio",
  description:
    "KRVE shipping policy and delivery information.",
};

export default function ShippingPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>
          KRVE CUSTOMER CARE
        </p>

        <h1 className={styles.title}>
          Shipping <em>policy.</em>
        </h1>

        <p className={styles.intro}>
          Everything you need to know about order
          processing, dispatch, delivery and tracking
          for KRVE purchases.
        </p>

        <div className={styles.goldLine} />

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Order processing</h2>

            <p>
              Orders are prepared after confirmation.
              Processing times can vary depending on
              product availability and the order placed.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Delivery</h2>

            <p>
              Delivery timing depends on the destination
              and the shipping service selected or
              assigned to the order.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Shipping charges</h2>

            <p>
              Any applicable shipping charges are
              displayed during checkout before the order
              is completed.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Tracking</h2>

            <p>
              Once an order is dispatched, available
              tracking information can be used to follow
              the shipment through the carrier.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Delayed delivery</h2>

            <p>
              Delivery dates can be affected by carrier
              delays, weather, holidays, address issues
              or other circumstances outside the store's
              direct control.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Incorrect address</h2>

            <p>
              Please check your delivery address carefully
              before completing checkout. Contact customer
              care as soon as possible if an address needs
              attention.
            </p>
          </section>
        </div>

        <p className={styles.note}>
          Final delivery times, charges and carrier
          conditions should be connected to the actual
          KRVE/Shopify checkout and fulfillment
          configuration before launch.
        </p>
      </div>
    </main>
  );
}
