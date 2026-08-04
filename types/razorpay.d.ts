export {};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions,
    ) => RazorpayCheckoutInstance;
  }
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;

    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
};

type RazorpayCheckoutOptions = {
  key: string;

  amount: number | string;

  currency: string;

  name: string;

  description?: string;

  image?: string;

  order_id: string;

  handler: (
    response: RazorpaySuccessResponse,
  ) => void | Promise<void>;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
    backdrop_color?: string;
  };

  retry?: {
    enabled: boolean;
    max_count?: number;
  };

  modal?: {
    escape?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
  };
};

type RazorpayCheckoutInstance = {
  open: () => void;

  close: () => void;

  on: (
    event: "payment.failed",
    callback: (
      response: RazorpayFailureResponse,
    ) => void,
  ) => void;
};
