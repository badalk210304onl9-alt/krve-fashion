const RAZORPAY_CHECKOUT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

let razorpayLoader:
  Promise<boolean> | null = null;

export function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayLoader) {
    return razorpayLoader;
  }

  razorpayLoader = new Promise<boolean>(
    (resolve) => {
      const existingScript =
        document.querySelector<HTMLScriptElement>(
          `script[src="${RAZORPAY_CHECKOUT_URL}"]`,
        );

      if (existingScript) {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        existingScript.addEventListener(
          "load",
          () => resolve(true),
          {
            once: true,
          },
        );

        existingScript.addEventListener(
          "error",
          () => resolve(false),
          {
            once: true,
          },
        );

        return;
      }

      const script =
        document.createElement("script");

      script.src = RAZORPAY_CHECKOUT_URL;
      script.async = true;

      script.onload = () => {
        resolve(Boolean(window.Razorpay));
      };

      script.onerror = () => {
        razorpayLoader = null;
        resolve(false);
      };

      document.body.appendChild(script);
    },
  );

  return razorpayLoader;
}
