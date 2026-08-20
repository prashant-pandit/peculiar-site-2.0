import Razorpay from "razorpay";
import crypto from "crypto";

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Creates a Razorpay Order
 * @param {Object} data - { amount (INR or paise), currency, receipt, notes }
 * @returns {Promise<{ order_id: string, amount: number, currency: string, key_id: string }>}
 */
export async function createOrder(data) {
  const { amount, currency = "INR", receipt, notes = {} } = data;

  if (!amount || isNaN(amount)) {
    const error = new Error("Amount is required and must be a number.");
    error.statusCode = 400;
    throw error;
  }

  // Convert to paise if amount is in rupees (e.g. 399 -> 39900 paise)
  // If amount < 100, assume it's in INR and multiply by 100; if it's already >= 100 paise validate.
  const amountInPaise = amount < 100 ? Math.round(amount * 100) : Math.round(amount * 100);

  // Razorpay requires minimum 100 paise (₹1.00)
  if (amountInPaise < 100) {
    const error = new Error("Amount must be at least 100 paise (₹1.00).");
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpayInstance();

  const options = {
    amount: amountInPaise,
    currency,
    receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    notes,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    };
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    const error = new Error(err.description || err.message || "Failed to create Razorpay order.");
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}

/**
 * Verifies the Razorpay payment signature
 * @param {Object} data - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {{ success: boolean, message: string, order_id: string, payment_id: string }}
 */
export function verifyPaymentSignature(data) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    const error = new Error("Missing required payment verification fields.");
    error.statusCode = 400;
    throw error;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    const error = new Error("RAZORPAY_KEY_SECRET is not configured.");
    error.statusCode = 500;
    throw error;
  }

  // Compute expected HMAC SHA256 signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    const error = new Error("Payment signature verification failed. Untrusted payment.");
    error.statusCode = 400;
    throw error;
  }

  return {
    success: true,
    message: "Payment verified successfully.",
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
  };
}
