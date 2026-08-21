import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Music2,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { useAudioPlayer } from "../../hooks";
import { createPaymentQR, stopQRPolling, generateDownloadLinks, initiateRazorpayCheckout } from "../../utils";

export default function PurchaseModal() {
  const location = useLocation();
  const navigate = useNavigate();

  // Payment flow states: 'overview' | 'qr' | 'success'
  const [step, setStep] = useState("overview");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // QR state
  const [qrData, setQrData] = useState(null); // { qr_id, image_url, close_by }
  const [qrTimeLeft, setQrTimeLeft] = useState(0);
  const [isQrExpired, setIsQrExpired] = useState(false);

  // Download state
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [downloadExpiry, setDownloadExpiry] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Success state
  const [paymentId, setPaymentId] = useState(null);

  const countdownRef = useRef(null);

  const isReleasesPage =
    location.pathname === "/releases" ||
    location.pathname.startsWith("/releases/") ||
    location.pathname.startsWith("/musictrack");

  const {
    purchasePlaylist,
    purchaseModalMeta,
    closePurchaseModal,
    replayPreview,
    unlockPlaylist,
  } = useAudioPlayer();

  const isLimitReached = purchaseModalMeta?.isLimitReached;

  // Cleanup on unmount or modal close
  useEffect(() => {
    return () => {
      stopQRPolling();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Reset state when modal opens/closes
  useEffect(() => {
    setStep("overview");
    setIsProcessing(false);
    setErrorMessage("");
    setQrData(null);
    setQrTimeLeft(0);
    setIsQrExpired(false);
    setDownloadLinks([]);
    setDownloadExpiry(null);
    setPaymentId(null);
    stopQRPolling();
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, [purchasePlaylist]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isProcessing && step !== "success") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePurchaseModal, isProcessing, step]);

  // QR countdown timer
  useEffect(() => {
    if (!qrData?.close_by || step !== "qr") return;

    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = qrData.close_by - now;
      if (remaining <= 0) {
        setQrTimeLeft(0);
        setIsQrExpired(true);
        stopQRPolling();
        if (countdownRef.current) clearInterval(countdownRef.current);
      } else {
        setQrTimeLeft(remaining);
      }
    };

    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [qrData, step]);

  const handleClose = useCallback(() => {
    stopQRPolling();
    if (countdownRef.current) clearInterval(countdownRef.current);
    closePurchaseModal();
  }, [closePurchaseModal]);

  if (!isReleasesPage || !purchasePlaylist) return null;

  const playlist = purchasePlaylist;

  // Format countdown time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ─── Step 1: Generate QR ────────────────────────────────────────────────────

  const handleGenerateQR = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    setIsQrExpired(false);

    await createPaymentQR({
      playlist,
      onQRReady: (data) => {
        setQrData(data);
        setStep("qr");
        setIsProcessing(false);
      },
      onPaymentSuccess: ({ payment_id }) => {
        setPaymentId(payment_id);
        handlePaymentSuccess(payment_id);
      },
      onExpired: () => {
        setIsQrExpired(true);
        setQrTimeLeft(0);
      },
      onError: (err) => {
        setIsProcessing(false);
        setErrorMessage(typeof err === "string" ? err : "Failed to generate QR code. Please try again.");
      },
    });
  };

  // ─── Fallback: Standard Checkout ────────────────────────────────────────────

  const handleFallbackCheckout = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    await initiateRazorpayCheckout({
      playlist,
      onSuccess: ({ paymentId: pId }) => {
        setPaymentId(pId);
        handlePaymentSuccess(pId);
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

  // ─── Payment Success Handler ────────────────────────────────────────────────

  const handlePaymentSuccess = async (pId) => {
    stopQRPolling();
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Unlock the playlist
    unlockPlaylist(playlist.id, pId);
    setStep("success");
    setIsProcessing(false);

    // Generate download links
    try {
      setIsDownloading(true);
      const links = await generateDownloadLinks({
        playlistId: playlist.id,
        paymentId: pId,
      });
      setDownloadLinks(links);
      if (links.length > 0) {
        setDownloadExpiry(links[0].expiresAt);
      }
    } catch (err) {
      console.error("Download link generation error:", err);
      setErrorMessage("Payment successful! Download links could not be generated. You can try again from the catalog.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Download Handlers ──────────────────────────────────────────────────────

  const handleDownloadTrack = (link) => {
    if (link.downloadUrl) {
      const a = document.createElement("a");
      a.href = link.downloadUrl;
      a.download = `${link.trackId}-master.wav`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadAll = () => {
    downloadLinks.forEach((link, i) => {
      setTimeout(() => handleDownloadTrack(link), i * 500);
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={() => {
        if (!isProcessing && step !== "success") handleClose();
      }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/40 bg-[#140c1a] p-5 sm:p-7 text-on-surface shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 0 50px -10px rgba(191, 0, 255, 0.25)",
        }}
      >
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
              {step === "qr" ? <QrCode size={12} /> : step === "success" ? <CheckCircle2 size={12} /> : <Sparkles size={12} />}
            </span>
            <span className="font-syne text-xs uppercase tracking-wider font-bold text-primary">
              {step === "qr" ? "Scan QR to Pay" : step === "success" ? "Payment Confirmed" : "Sonic Vault • Purchase Playlist"}
            </span>
          </div>

          <button
            onClick={handleClose}
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

        {/* ── STEP: OVERVIEW ─────────────────────────────────────────────── */}
        {step === "overview" && (
          <>
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
                    Unlock the full playlist to download and stream all tracks without limits.
                  </div>
                </div>
              </div>
            )}

            {/* Playlist Overview Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/40">
                <img
                  src={playlist.coverArt}
                  alt={playlist.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1 right-1 bg-black/80 text-primary text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {playlist.tracks.length} Tracks
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                    <Sparkles size={11} /> Playlist
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono truncate">
                    {playlist.genre}
                  </span>
                </div>
                <h3 className="font-syne text-xl font-bold text-white mt-1 truncate">
                  {playlist.title}
                </h3>
                <p className="text-xs text-on-surface-variant truncate">
                  {playlist.subtitle || "Full Playlist Download"}
                </p>
              </div>
            </div>

            {/* Track List */}
            <div className="mb-5 rounded-xl border border-outline-variant/20 bg-surface-container/30 divide-y divide-outline-variant/10">
              {playlist.tracks.map((track, idx) => (
                <div key={track.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span className="text-[10px] font-mono text-on-surface-variant w-5 text-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <Music2 size={14} className="text-primary/60 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{track.title}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">
                      {track.bpm} BPM • {track.key} • {track.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Tag Box */}
            <div className="flex items-baseline justify-between p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30 mb-5">
              <div>
                <div className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Full Playlist Download
                </div>
                <div className="text-xs text-primary mt-0.5">
                  {playlist.tracks.length} Master Tracks • DJ License Included
                </div>
              </div>
              <div className="text-right">
                <div className="font-syne text-2xl font-extrabold text-white">
                  {playlist.priceInr || "₹399"}
                  {playlist.price && playlist.price !== "Free" && (
                    <span className="text-xs font-normal text-on-surface-variant ml-1.5 font-mono">
                      ({playlist.price})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Package Inclusions */}
            <div className="space-y-2.5 mb-6 text-sm">
              <div className="flex items-center gap-2.5 text-on-surface/90">
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                <span>
                  <strong>Lossless 24-bit WAV</strong> Studio Masters (Club Ready)
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
                <span>All {playlist.tracks.length} tracks delivered as instant download</span>
              </div>
              <div className="flex items-center gap-2.5 text-on-surface/90">
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                <span>Download links expire after 1 hour for security</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary: QR Payment */}
              <button
                onClick={handleGenerateQR}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#bf00ff] to-[#ecb1ff] px-6 py-3.5 font-syne font-bold text-black transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-black" />
                    <span>Generating QR Code...</span>
                  </>
                ) : (
                  <>
                    <QrCode size={18} />
                    <span>Pay via UPI QR ({playlist.priceInr || "₹399"})</span>
                  </>
                )}
              </button>

              {/* Secondary: Standard Checkout fallback */}
              <button
                onClick={handleFallbackCheckout}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant/40 bg-surface-container/50 px-6 py-2.5 text-xs font-semibold text-on-surface hover:bg-surface-container-high hover:text-white transition-all disabled:opacity-50"
              >
                <Zap size={14} />
                <span>Pay with Card / NetBanking</span>
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
                  <Smartphone size={13} className="text-primary" />
                  UPI / GPay / PhonePe
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── STEP: QR CODE ──────────────────────────────────────────────── */}
        {step === "qr" && qrData && (
          <>
            {/* Countdown Timer */}
            <div className="mb-5 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <Timer size={16} className={isQrExpired ? "text-red-400" : "text-primary"} />
                <span className="text-xs font-semibold text-white">
                  {isQrExpired ? "QR Code Expired" : "Time Remaining"}
                </span>
              </div>
              <span className={`font-mono text-lg font-bold ${isQrExpired ? "text-red-400" : qrTimeLeft <= 60 ? "text-yellow-400" : "text-primary"}`}>
                {isQrExpired ? "0:00" : formatTime(qrTimeLeft)}
              </span>
            </div>

            {/* Playlist mini-header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/30">
                <img src={playlist.coverArt} alt={playlist.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white truncate">{playlist.title}</div>
                <div className="text-xs text-on-surface-variant">
                  {playlist.tracks.length} Tracks • {playlist.priceInr}
                </div>
              </div>
            </div>

            {/* QR Code Display */}
            {isQrExpired ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-48 h-48 rounded-2xl bg-red-950/30 border border-red-500/30 flex flex-col items-center justify-center mb-4">
                  <Clock size={40} className="text-red-400 mb-2" />
                  <span className="text-sm font-bold text-red-400">Expired</span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 text-center">
                  This QR code has expired. Generate a new one to continue.
                </p>
                <button
                  onClick={handleGenerateQR}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#bf00ff] to-[#ecb1ff] px-6 py-3 font-syne font-bold text-black text-sm hover:brightness-110 transition-all disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      <span>Generate New QR</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                {/* QR Image */}
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg shadow-primary/10">
                  <img
                    src={qrData.image_url}
                    alt="UPI Payment QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Scan Instructions */}
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-white">
                    Scan with any UPI app
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant text-center mb-4 max-w-xs">
                  Open Google Pay, PhonePe, Paytm, or any UPI app and scan this QR code to complete your purchase.
                </p>

                {/* Waiting indicator */}
                <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Waiting for payment...</span>
                </div>
              </div>
            )}

            {/* Back to overview */}
            <button
              onClick={() => {
                stopQRPolling();
                setStep("overview");
              }}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs text-on-surface-variant hover:text-white py-2 transition-colors"
            >
              ← Back to payment options
            </button>
          </>
        )}

        {/* ── STEP: SUCCESS ──────────────────────────────────────────────── */}
        {step === "success" && (
          <>
            {/* Success Banner */}
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/40 bg-green-950/30 p-4 animate-fadeIn">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-black font-bold">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Payment Confirmed
                </div>
                <div className="text-sm font-medium text-white mt-0.5">
                  <strong>{playlist.title}</strong> has been unlocked!
                </div>
              </div>
            </div>

            {/* Download Links */}
            {isDownloading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-on-surface-variant">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span>Generating download links...</span>
              </div>
            ) : downloadLinks.length > 0 ? (
              <>
                {/* Expiry Warning */}
                {downloadExpiry && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-950/30 border border-yellow-500/30 px-3 py-2 text-xs text-yellow-200">
                    <Timer size={14} className="text-yellow-400 flex-shrink-0" />
                    <span>Download links expire at {new Date(downloadExpiry).toLocaleTimeString()}</span>
                  </div>
                )}

                {/* Download All Button */}
                <button
                  onClick={handleDownloadAll}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-3.5 font-syne font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-green-500/20 mb-4"
                >
                  <Download size={18} />
                  <span>Download All {downloadLinks.length} Tracks</span>
                </button>

                {/* Individual Track Downloads */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface-container/30 divide-y divide-outline-variant/10">
                  {downloadLinks.map((link, idx) => (
                    <div key={link.trackId} className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-on-surface-variant w-5 text-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-white truncate">{link.title}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadTrack(link)}
                        className="flex items-center gap-1 text-[10px] font-bold text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                      >
                        <Download size={12} />
                        <span>WAV</span>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-on-surface-variant text-center py-4">
                Your playlist has been unlocked. You can stream all tracks without limits.
              </p>
            )}

            {/* Close */}
            <button
              onClick={() => {
                handleClose();
                navigate(`/releases?payment=success&playlist=${playlist.id}`);
              }}
              className="w-full mt-5 flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-container/50 px-6 py-2.5 text-xs font-semibold text-on-surface hover:text-white transition-all"
            >
              Continue to Catalog
            </button>
          </>
        )}
      </div>
    </div>
  );
}
