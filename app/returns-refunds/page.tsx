import styles from "../track-order/support.module.css";

export const metadata = {
  title: "Returns & Refunds | KRVE The Fashion Studio",
  description:
    "KRVE returns and refunds information.",
};

export default function ReturnsRefundsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>
          KRVE CUSTOMER CARE
        </p>

        <h1 className={styles.title}>
          Returns & <em>refunds.</em>
        </h1>

        <p className={styles.intro}>
          Information about returning a KRVE purchase
          and how refunds are handled.
        </p>

        <div className={styles.goldLine} />

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Return eligibility</h2>

            <p>
              Items should be unused, unworn and returned
              with their original packaging and tags,
              subject to the final KRVE policy configured
              for the store.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Start a return</h2>

            <p>
              Keep your order ID and purchase email ready
              when contacting KRVE customer care. The
              support team can confirm whether the item
              is eligible before the return is arranged.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Refunds</h2>

            <p>
              Once an approved return is received and
              inspected, the refund can be initiated
              through the original payment method,
              subject to the store's applicable terms.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Non-returnable items</h2>

            <p>
              Certain products or items marked as final
              sale may not qualify for return.
              Product-specific conditions shown at
              checkout should be followed.
            </p>
          </section>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.number}>
              01
            </div>

            <div>
              <h3>Request</h3>

              <p>
                Contact KRVE customer care with your
                order details.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>
              02
            </div>

            <div>
              <h3>Approval</h3>

              <p>
                Eligibility and return instructions
                are confirmed.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>
              03
            </div>

            <div>
              <h3>Inspection</h3>

              <p>
                The returned item is checked against
                the applicable return conditions.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>
              04
            </div>

            <div>
              <h3>Refund</h3>

              <p>
                An approved refund is processed through
                the applicable payment method.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
