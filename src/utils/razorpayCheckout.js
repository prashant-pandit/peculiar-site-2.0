/**
 * Razorpay Payment Integration
 * Supports two payment flows:
 * 1. QR Code Payment (primary) — UPI QR scan for smooth mobile payments
 * 2. Standard Checkout Modal (fallback) — For card/netbanking when QR is unavailable
 */

// ─── Razorpay Script Loader ──────────────────────────────────────────────────

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// ─── QR Code Payment Flow (Primary) ─────────────────────────────────────────

let qrPollingInterval = null;

/**
 * Creates a Razorpay UPI QR code for a playlist purchase
 * @param {Object} options
 * @param {Object} options.playlist - Playlist object with id, title, priceInr, priceInPaise
 * @param {Function} options.onQRReady - Callback with { qr_id, image_url, close_by }
 * @param {Function} options.onPaymentSuccess - Callback with { payment_id, qr_id }
 * @param {Function} options.onError - Callback with error message
 * @param {Function} [options.onExpired] - Callback when QR expires
 */
export async function createPaymentQR({
  playlist,
  onQRReady,
  onPaymentSuccess,
  onError,
  onExpired,
}) {
  try {
    // Extract numeric amount from priceInr (e.g., "₹399" → 399)
    let amount = 399;
    if (playlist.priceInr && playlist.priceInr !== "Free") {
      const match = playlist.priceInr.match(/\d+/);
      if (match) amount = parseInt(match[0], 10);
    }

    // Step 1: Create QR code via backend
    const res = await fetch("/api/create-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "INR",
        playlistId: playlist.id,
        playlistTitle: playlist.title,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.qr_id) {
      throw new Error(data.error || "Failed to create QR code.");
    }

    // Notify caller with QR data
    if (onQRReady) {
      onQRReady({
        qr_id: data.qr_id,
        image_url: data.image_url,
        close_by: data.close_by,
        amount: data.amount,
      });
    }

    // Step 2: Start polling for payment status every 4 seconds
    startQRPolling({
      qrId: data.qr_id,
      closeBy: data.close_by,
      onPaymentSuccess,
      onExpired,
      onError,
    });
  } catch (err) {
    console.error("QR creation error:", err);
    if (onError) onError(err.message);
  }
}

/**
 * Start polling the backend for QR payment status
 */
function startQRPolling({ qrId, closeBy, onPaymentSuccess, onExpired, onError }) {
  // Clear any existing polling
  stopQRPolling();

  qrPollingInterval = setInterval(async () => {
    try {
      // Check if QR has expired
      const now = Math.floor(Date.now() / 1000);
      if (closeBy && now >= closeBy) {
        stopQRPolling();
        if (onExpired) onExpired();
        return;
      }

      const res = await fetch("/api/check-qr-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_id: qrId }),
      });

      const data = await res.json();

      if (data.paid) {
        stopQRPolling();
        if (onPaymentSuccess) {
          onPaymentSuccess({
            payment_id: data.payment_id,
            qr_id: qrId,
          });
        }
      } else if (data.close_reason && data.close_reason !== "paid") {
        // QR was closed for a non-payment reason
        stopQRPolling();
        if (onExpired) onExpired();
      }
    } catch (err) {
      console.error("QR polling error:", err);
      // Don't stop polling on transient errors
    }
  }, 4000); // Poll every 4 seconds
}

/**
 * Stops the QR payment polling interval
 */
export function stopQRPolling() {
  if (qrPollingInterval) {
    clearInterval(qrPollingInterval);
    qrPollingInterval = null;
  }
}

// ─── Download Link Generation ────────────────────────────────────────────────

/**
 * Generates expiring download URLs for a playlist
 * @param {Object} options
 * @param {string} options.playlistId - Playlist ID
 * @param {string} [options.paymentId] - Razorpay payment ID (not required for free playlists)
 * @returns {Promise<Array<{ trackId, title, downloadUrl, expiresAt }>>}
 */
export async function generateDownloadLinks({ playlistId, paymentId }) {
  const body = { playlistId };
  if (paymentId) body.payment_id = paymentId;

  const res = await fetch("/api/generate-download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || !data.downloads) {
    throw new Error(data.error || "Failed to generate download links.");
  }

  return data.downloads;
}

// ─── Standard Checkout Modal (Fallback) ──────────────────────────────────────

/**
 * Initiates Razorpay Standard Checkout (fallback for cards/netbanking)
 * @param {Object} options
 * @param {Object} options.playlist - Playlist object
 * @param {Object} [options.customerInfo] - { name, email, phone }
 * @param {Function} options.onSuccess - Callback on verified payment
 * @param {Function} options.onError - Callback on payment or verification failure
 * @param {Function} [options.onDismiss] - Callback when user closes the modal
 */
export async function initiateRazorpayCheckout({
  playlist,
  track,
  customerInfo = {},
  onSuccess,
  onError,
  onDismiss,
}) {
  // Support both playlist and legacy track objects
  const item = playlist || track;

  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Razorpay SDK could not be loaded. Please check your internet connection.");
    }

    // Determine numeric amount in INR
    let rawAmount = 399;
    if (item.priceInr && item.priceInr !== "Free") {
      const match = item.priceInr.match(/\d+/);
      if (match) rawAmount = parseInt(match[0], 10);
    }

    // Step 1: Call backend to create order
    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: rawAmount,
        currency: "INR",
        receipt: `pb_${item.id.substring(0, 10)}_${Date.now().toString().slice(-6)}`,
        notes: {
          playlist_id: item.id,
          playlist_title: item.title,
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.order_id) {
      throw new Error(orderData.error || "Failed to create payment order. Please try again.");
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key_id;
    if (!keyId) {
      throw new Error("Razorpay Key ID is not configured.");
    }

    // Step 2: Configure Razorpay Checkout options
    const rzpOptions = {
      key: keyId,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Peculiar Beats",
      description: `${item.title} - Lossless Master WAV + MP3`,
      image: item.coverArt || "/images/logo.png",
      order_id: orderData.order_id,
      prefill: {
        name: customerInfo.name || "",
        email: customerInfo.email || "",
        contact: customerInfo.phone || "",
      },
      theme: {
        color: "#BF00FF", // Sonic Vanguard Electric Purple
      },
      modal: {
        ondismiss: () => {
          if (onDismiss) onDismiss();
        },
      },
      handler: async (response) => {
        try {
          // Step 3: Call backend to verify payment signature
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              playlist_id: item.id,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.error || "Payment signature verification failed.");
          }

          if (onSuccess) {
            onSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              playlist: item,
            });
          }
        } catch (verifyErr) {
          console.error("Signature verification error:", verifyErr);
          if (onError) onError(verifyErr.message);
        }
      },
    };

    const rzp = new window.Razorpay(rzpOptions);

    rzp.on("payment.failed", (response) => {
      console.error("Razorpay payment failed:", response.error);
      const errMsg = response.error?.description || "Payment failed. Please try another payment method.";
      if (onError) onError(errMsg);
    });

    rzp.open();
  } catch (err) {
    console.error("Checkout initiation error:", err);
    if (onError) onError(err.message);
  }
}
