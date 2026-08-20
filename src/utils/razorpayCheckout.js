/**
 * Razorpay Standard Web Checkout Integration
 * Handles order creation, modal launch, and server-side signature verification.
 */

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

/**
 * Initiates Razorpay Standard Checkout
 * @param {Object} options
 * @param {Object} options.track - Music track object
 * @param {Object} [options.customerInfo] - { name, email, phone }
 * @param {Function} options.onSuccess - Callback on verified payment
 * @param {Function} options.onError - Callback on payment or verification failure
 * @param {Function} [options.onDismiss] - Callback when user closes the modal
 */
export async function initiateRazorpayCheckout({
  track,
  customerInfo = {},
  onSuccess,
  onError,
  onDismiss,
}) {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Razorpay SDK could not be loaded. Please check your internet connection.");
    }

    // Determine numeric amount in INR (default to 399 if priceInr is '₹399' or price is '$4.99')
    let rawAmount = 399;
    if (track.priceInr) {
      const match = track.priceInr.match(/\d+/);
      if (match) rawAmount = parseInt(match[0], 10);
    }

    // Step 1: Call backend to create order
    const orderRes = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: rawAmount,
        currency: "INR",
        receipt: `pb_${track.id.substring(0, 10)}_${Date.now().toString().slice(-6)}`,
        notes: {
          track_id: track.id,
          track_title: track.title,
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
      description: `${track.title} - Lossless Master WAV + MP3`,
      image: track.coverArt || "/images/logo.png",
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
              track_id: track.id,
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
              track,
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
