import React, { useEffect } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Lock,
  Music,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useAudioPlayer } from "../../hooks";

export default function PurchaseModal() {
  const { purchaseTrack, closePurchaseModal } = useAudioPlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closePurchaseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePurchaseModal]);

  if (!purchaseTrack) return null;

  const handleProceedToPayment = () => {
    if (purchaseTrack.paymentUrl && purchaseTrack.paymentUrl.startsWith("http")) {
      window.open(purchaseTrack.paymentUrl, "_blank", "noopener,noreferrer");
    } else {
      // Direct instant download fallback / demo
      alert(
        `Redirecting to secure checkout for "${purchaseTrack.title}" (${purchaseTrack.price} / ${purchaseTrack.priceInr}). In production, this links directly to your Stripe or Razorpay Payment Link!`,
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={closePurchaseModal}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-[#140c1a] p-6 shadow-2xl md:p-8 text-on-surface"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 50px -10px rgba(191, 0, 255, 0.25)",
        }}
      >
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={closePurchaseModal}
          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
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

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                <Sparkles size={11} /> Master Audio
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                {purchaseTrack.genre}
              </span>
            </div>
            <h3 className="font-syne text-xl font-bold text-white mt-1">
              {purchaseTrack.title}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {purchaseTrack.subtitle || "Original Extended Club Mix"}
            </p>
          </div>
        </div>

        {/* Price Tag */}
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
              {purchaseTrack.price}
              <span className="text-xs font-normal text-on-surface-variant ml-1.5 font-mono">
                ({purchaseTrack.priceInr})
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
            <span>Instant download link delivered immediately to your screen & email</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleProceedToPayment}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#bf00ff] to-[#ecb1ff] px-6 py-3.5 font-syne font-bold text-black transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            <Download size={18} />
            <span>Unlock & Download Now ({purchaseTrack.price})</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-[11px] text-on-surface-variant">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-green-400" />
              Secure 256-bit Checkout
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap size={13} className="text-primary" />
              Instant Delivery
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
