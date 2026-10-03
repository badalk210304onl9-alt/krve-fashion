import styles from "./support.module.css";

export const metadata = {
  title: "Track Order | KRVE The Fashion Studio",
  description: "Track your KRVE order.",
};

export default function TrackOrderPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>
          KRVE CUSTOMER CARE
        </p>

        <h1 className={styles.title}>
          Track your <em>order.</em>
        </h1>

        <p className={styles.intro}>
          Enter your order details below to check the
          latest status of your KRVE purchase.
        </p>

        <div className={styles.goldLine} />

        <section className={styles.card}>
          <h2>Order tracking</h2>

          <form className={styles.form}>
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
              placeholder="e.g. KRVE-10245"
              autoComplete="off"
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
              placeholder="Enter the email used for your order"
              autoComplete="email"
            />

            <button
              type="submit"
              className={styles.button}
            >
              TRACK ORDER
            </button>
          </form>

          <p className={styles.note}>
            Enter your order ID and email address to
            track your KRVE purchase.
          </p>
        </section>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.number}>01</div>

            <div>
              <h3>Order confirmed</h3>

              <p>
                Your order has been received and is
                being prepared.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>02</div>

            <div>
              <h3>Processing</h3>

              <p>
                Your selected pieces are being prepared
                for dispatch.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>03</div>

            <div>
              <h3>Shipped</h3>

              <p>
                Your package has been handed over for
                delivery.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.number}>04</div>

            <div>
              <h3>Delivered</h3>

              <p>
                Your KRVE order has reached its
                destination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
