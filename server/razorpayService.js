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

// Default QR code expiry: 10 minutes
const QR_EXPIRY_MINUTES = 10;

/**
 * Creates a Razorpay UPI QR Code for a single-use payment
 * @param {Object} data - { amount (INR), currency, playlistId, playlistTitle }
 * @returns {Promise<{ qr_id: string, image_url: string, amount: number, close_by: number }>}
 */
export async function createQRCode(data) {
  const { amount, currency = "INR", playlistId, playlistTitle } = data;

  if (!amount || isNaN(amount)) {
    const error = new Error("Amount is required and must be a number.");
    error.statusCode = 400;
    throw error;
  }

  // Convert to paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amount * 100);

  if (amountInPaise < 100) {
    const error = new Error("Amount must be at least 100 paise (₹1.00).");
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpayInstance();

  // QR expires in 10 minutes from now (Unix timestamp in seconds)
  const closeBy = Math.floor(Date.now() / 1000) + QR_EXPIRY_MINUTES * 60;

  const options = {
    type: "upi_qr",
    name: "Peculiar Beats",
    usage: "single_use",
    fixed_amount: true,
    payment_amount: amountInPaise,
    description: playlistTitle
      ? `${playlistTitle} - Lossless Master WAV + MP3`
      : "Peculiar Beats - Music Purchase",
    close_by: closeBy,
    notes: {
      playlist_id: playlistId || "",
      playlist_title: playlistTitle || "",
    },
  };

  try {
    const qrCode = await razorpay.qrCode.create(options);
    return {
      qr_id: qrCode.id,
      image_url: qrCode.image_url,
      amount: qrCode.payment_amount,
      close_by: qrCode.close_by,
      status: qrCode.status,
    };
  } catch (err) {
    console.error("Razorpay QR creation error:", err);
    const error = new Error(err.description || err.message || "Failed to create QR code.");
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}

/**
 * Checks the payment status of a Razorpay QR code
 * @param {string} qrId - The QR code ID to check
 * @returns {Promise<{ paid: boolean, status: string, payment_id: string|null, close_reason: string|null }>}
 */
export async function checkQRPaymentStatus(qrId) {
  if (!qrId) {
    const error = new Error("QR code ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpayInstance();

  try {
    const qrCode = await razorpay.qrCode.fetch(qrId);

    // Razorpay QR status: "active" | "closed"
    // close_reason: "paid" | "closed" (manually) | null (still active)
    const isPaid = qrCode.close_reason === "paid" || qrCode.payments_count_received > 0;

    // Extract payment ID from payments if available
    let paymentId = null;
    if (isPaid && qrCode.payments && qrCode.payments.items && qrCode.payments.items.length > 0) {
      paymentId = qrCode.payments.items[0].id;
    }

    return {
      paid: isPaid,
      status: qrCode.status,
      payment_id: paymentId,
      close_reason: qrCode.close_reason,
      payments_count: qrCode.payments_count_received || 0,
    };
  } catch (err) {
    console.error("Razorpay QR status check error:", err);
    const error = new Error(err.description || err.message || "Failed to check QR payment status.");
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}

/**
 * Fetches payment details from Razorpay to validate a payment
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment details from Razorpay
 */
export async function fetchPaymentDetails(paymentId) {
  if (!paymentId) {
    const error = new Error("Payment ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const razorpay = getRazorpayInstance();

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      notes: payment.notes || {},
    };
  } catch (err) {
    console.error("Razorpay payment fetch error:", err);
    const error = new Error(err.description || err.message || "Failed to fetch payment details.");
    error.statusCode = err.statusCode || 500;
    throw error;
  }
}
