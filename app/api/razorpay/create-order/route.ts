import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartItem = {
  productId?: string;
  quantity?: number;
};

type CheckoutBody = {
  items?: CartItem[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  receipt?: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: string;
  stockQuantity: number;
  inStock?: boolean;
};

function getApiUrl() {
  const url =
    process.env.KRVE_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_API_URL?.trim() ||
    process.env.KRVE_CENTRAL_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_KRVE_CENTRAL_API_URL?.trim();

  if (!url) {
    throw new Error("KRVE Central API URL is not configured.");
  }

  return url.replace(/\/+$/, "");
}

function validMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export async function POST(request: Request) {
  try {
    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
      process.env.RAZORPAY_KEY_ID?.trim();

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay is not configured on the server.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as CheckoutBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 },
      );
    }

    if (body.items.length > 100) {
      return NextResponse.json(
        { success: false, message: "Too many cart items." },
        { status: 400 },
      );
    }

    const subtotal = body.subtotal;
    const discount = body.discount;
    const shipping = body.shipping;
    const tax = body.tax;
    const total = body.total;

    if (
      !validMoney(subtotal) ||
      !validMoney(discount) ||
      !validMoney(shipping) ||
      !validMoney(tax) ||
      !validMoney(total)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid checkout totals." },
        { status: 400 },
      );
    }

    const quantities = new Map<string, number>();

    for (const item of body.items) {
      const productId = String(item.productId || "").trim();
      const quantity = item.quantity;

      if (
        !productId ||
        !Number.isInteger(quantity) ||
        !quantity ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid cart item or quantity." },
          { status: 400 },
        );
      }

      quantities.set(
        productId,
        (quantities.get(productId) || 0) + quantity,
      );
    }

    const apiUrl = getApiUrl();

    const productResponse = await fetch(
      `${apiUrl}/api/products?status=published&limit=100&offset=0`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );

    if (!productResponse.ok) {
      throw new Error("Could not verify KRVE product prices.");
    }

    const productResult = await productResponse.json();

    if (
      productResult?.success !== true ||
      !Array.isArray(productResult?.data?.products)
    ) {
      throw new Error("KRVE Central API returned an invalid product list.");
    }

    const products = productResult.data.products as Product[];

    let verifiedSubtotal = 0;

    for (const [productId, quantity] of quantities.entries()) {
      const product = products.find(
        (entry) =>
          entry.id === productId || entry.slug === productId,
      );

      if (!product || product.status !== "published") {
        return NextResponse.json(
          {
            success: false,
            message: "A product in your cart is no longer available.",
          },
          { status: 400 },
        );
      }

      if (
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !Number.isFinite(product.stockQuantity) ||
        product.stockQuantity < quantity ||
        product.inStock === false
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} is out of stock or has insufficient stock.`,
          },
          { status: 400 },
        );
      }

      verifiedSubtotal += product.price * quantity;
    }

    verifiedSubtotal = Math.round((verifiedSubtotal + Number.EPSILON) * 100) / 100;

    if (Math.abs(verifiedSubtotal - subtotal) > 0.01) {
      return NextResponse.json(
        {
          success: false,
          message: "Product prices changed. Refresh your cart and try again.",
          verifiedSubtotal,
        },
        { status: 409 },
      );
    }

    /*
     * Check arithmetic consistency.
     * IMPORTANT: discount/coupon eligibility must also be validated
     * against trusted server-side coupon rules before live launch.
     */
    if (discount > subtotal) {
      return NextResponse.json(
        { success: false, message: "Invalid discount amount." },
        { status: 400 },
      );
    }

    const calculatedTotal =
      Math.round((subtotal - discount + shipping + tax + Number.EPSILON) * 100) / 100;

    if (Math.abs(calculatedTotal - total) > 0.01 || total <= 0) {
      return NextResponse.json(
        { success: false, message: "Checkout total is invalid. Refresh and try again." },
        { status: 400 },
      );
    }

    const amountInPaise = Math.round(calculatedTotal * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json(
        { success: false, message: "Payment amount must be at least ₹1." },
        { status: 400 },
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const safeReceipt =
      String(body.receipt || `krve_${Date.now()}`)
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 40) || `krve_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: safeReceipt,
      notes: {
        brand: "KRVE",
        customer_email: String(body.customerEmail || "").slice(0, 200),
      },
    });

    return NextResponse.json({
      success: true,
      keyId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("KRVE_RAZORPAY_CREATE_ORDER_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Razorpay order could not be created.",
      },
      { status: 500 },
    );
  }
}
