import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useAudioPlayer } from "../../hooks";
import { initiateRazorpayCheckout } from "../../utils";

export default function PurchaseModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isReleasesPage =
    location.pathname === "/releases" ||
    location.pathname.startsWith("/releases/") ||
    location.pathname.startsWith("/musictrack");

  const {
    purchaseTrack,
    purchaseModalMeta,
    closePurchaseModal,
    replayPreview,
  } = useAudioPlayer();

  const isLimitReached = purchaseModalMeta?.isLimitReached;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isProcessing) {
        closePurchaseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePurchaseModal, isProcessing]);

  // Reset state when modal opens/closes
  useEffect(() => {
    setIsProcessing(false);
    setErrorMessage("");
  }, [purchaseTrack]);

  if (!isReleasesPage || !purchaseTrack) return null;

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    await initiateRazorpayCheckout({
      track: purchaseTrack,
      onSuccess: ({ paymentId }) => {
        setIsProcessing(false);
        closePurchaseModal();
        navigate(`/releases?payment=success&track=${purchaseTrack.id}&payment_id=${paymentId}`);
      },
      onError: (err) => {
        setIsProcessing(false);
        setErrorMessage(typeof err === "string" ? err : "Payment failed or cancelled. Please try again.");
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={() => {
        if (!isProcessing) closePurchaseModal();
      }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/40 bg-[#140c1a] p-5 sm:p-7 text-on-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 50px -10px rgba(191, 0, 255, 0.25)",
        }}
      >
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

        {/* Dedicated Top Header Row */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Sparkles size={12} />
            </span>
            <span className="font-syne text-xs uppercase tracking-wider font-bold text-primary">
              Sonic Vault • Razorpay Checkout
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={closePurchaseModal}
            disabled={isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-on-surface-variant hover:bg-white/15 hover:text-white transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 animate-fadeIn">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* 45-Second Preview Limit Reached Banner */}
        {isLimitReached && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-xs text-white backdrop-blur-sm animate-fadeIn">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-black font-bold">
              <Clock size={15} />
            </span>
            <div className="flex-1">
              <div className="font-bold text-primary uppercase tracking-wider text-[10px]">
                45-Second Preview Ended
              </div>
              <div className="text-on-surface/90 text-xs mt-0.5">
                Unlock the full master track to download and stream without limits.
              </div>
            </div>
          </div>
        )}

        {/* Track Overview Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/40">
            <img
              src={purchaseTrack.coverArt}
              alt={purchaseTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-1 right-1 bg-black/80 text-primary text-[10px] font-mono px-1.5 py-0.5 rounded">
              {purchaseTrack.bpm} BPM
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                <Sparkles size={11} /> Master Audio
              </span>
              <span className="text-xs text-on-surface-variant font-mono truncate">
                {purchaseTrack.genre}
              </span>
            </div>
            <h3 className="font-syne text-xl font-bold text-white mt-1 truncate">
              {purchaseTrack.title}
            </h3>
            <p className="text-xs text-on-surface-variant truncate">
              {purchaseTrack.subtitle || "Original Extended Club Mix"}
            </p>
          </div>
        </div>

        {/* Price Tag Box */}
        <div className="flex items-baseline justify-between p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 mb-5">
          <div>
            <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Instant Download Access
            </div>
            <div className="text-xs text-primary mt-0.5">
              Personal & DJ Performance License Included
            </div>
          </div>
          <div className="text-right">
            <div className="font-syne text-2xl font-extrabold text-white">
              {purchaseTrack.priceInr || "₹399"}
              <span className="text-xs font-normal text-on-surface-variant ml-1.5 font-mono">
                ({purchaseTrack.price || "$4.99"})
              </span>
            </div>
          </div>
        </div>

        {/* Package Inclusions */}
        <div className="space-y-2.5 mb-6 text-sm">
          <div className="flex items-center gap-2.5 text-on-surface/90">
            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
            <span>
              <strong>Lossless 24-bit WAV</strong> Studio Master (Club Ready)
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-on-surface/90">
            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
            <span>
              <strong>320 kbps High-Res MP3</strong> with full ID3 metadata & artwork
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-on-surface/90">
            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
            <span>Extended Mix for seamless DJ transitions</span>
          </div>
          <div className="flex items-center gap-2.5 text-on-surface/90">
            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
            <span>Instant download link delivered immediately on screen & receipt</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#bf00ff] to-[#ecb1ff] px-6 py-3.5 font-syne font-bold text-black transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin text-black" />
                <span>Opening Razorpay Checkout...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Pay & Unlock Now ({purchaseTrack.priceInr || "₹399"})</span>
              </>
            )}
          </button>

          {isLimitReached && (
            <button
              onClick={replayPreview}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-on-surface-variant hover:text-white py-1 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={13} /> Replay 45s Preview
            </button>
          )}

          <div className="flex items-center justify-center gap-4 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-green-400" />
              Razorpay 256-bit Secure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap size={13} className="text-primary" />
              UPI / Cards / NetBanking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
