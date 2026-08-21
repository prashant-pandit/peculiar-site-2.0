import { generatePlaylistDownloadUrls } from "../../server/r2Service.js";
import { fetchPaymentDetails } from "../../server/razorpayService.js";

// Playlists data (server-side copy for validation)
// In production, this would ideally come from a database.
// For now, we import the catalog to validate playlist IDs and track masterKeys.
const PLAYLISTS = {
  "neon-pulse-ep": {
    priceInPaise: 39900,
    isFree: false,
    tracks: [
      { id: "neon-pulse", title: "Neon Pulse", masterKey: "masters/neon-pulse-master.wav" },
      { id: "neon-pulse-vip", title: "Neon Pulse (VIP Mix)", masterKey: "masters/neon-pulse-vip-master.wav" },
    ],
  },
  "delhi-nights-pack": {
    priceInPaise: 39900,
    isFree: false,
    tracks: [
      { id: "delhi-after-dark", title: "Delhi After Dark", masterKey: "masters/delhi-after-dark-master.wav" },
      { id: "delhi-sunrise", title: "Delhi Sunrise", masterKey: "masters/delhi-sunrise-master.wav" },
    ],
  },
  "cyber-odyssey-ep": {
    priceInPaise: 44900,
    isFree: false,
    tracks: [
      { id: "cyber-odyssey", title: "Cyber Odyssey", masterKey: "masters/cyber-odyssey-master.wav" },
      { id: "cyber-odyssey-dub", title: "Cyber Odyssey (Dub Mix)", masterKey: "masters/cyber-odyssey-dub-master.wav" },
    ],
  },
  "bass-weapons-vol1": {
    priceInPaise: 39900,
    isFree: false,
    tracks: [
      { id: "sub-zero-bass", title: "Sub Zero Bass", masterKey: "masters/sub-zero-bass-master.wav" },
      { id: "warehouse-riddim", title: "Warehouse Riddim", masterKey: "masters/warehouse-riddim-master.wav" },
    ],
  },
  "bollywood-fusion-pack": {
    priceInPaise: 29900,
    isFree: false,
    tracks: [
      { id: "bollywood-frequencies", title: "Bollywood Frequencies", masterKey: "masters/bollywood-frequencies-master.wav" },
      { id: "desi-drop", title: "Desi Drop", masterKey: "masters/desi-drop-master.wav" },
    ],
  },
  "free-sampler-pack": {
    priceInPaise: 0,
    isFree: true,
    tracks: [
      { id: "aurora-drift", title: "Aurora Drift", masterKey: "masters/aurora-drift-master.wav" },
      { id: "midnight-glow", title: "Midnight Glow", masterKey: "masters/midnight-glow-master.wav" },
    ],
  },
};

// Download link expiry: 1 hour
const DOWNLOAD_EXPIRY_SECONDS = 3600;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { playlistId, payment_id } = data;

    if (!playlistId) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "playlistId is required." }),
      };
    }

    const playlist = PLAYLISTS[playlistId];
    if (!playlist) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Playlist not found." }),
      };
    }

    // Free playlists: generate download links without payment validation
    if (playlist.isFree) {
      const downloadLinks = await generatePlaylistDownloadUrls(
        playlist.tracks,
        DOWNLOAD_EXPIRY_SECONDS
      );
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloads: downloadLinks }),
      };
    }

    // Paid playlists: validate payment before generating download links
    if (!payment_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "payment_id is required for paid playlists." }),
      };
    }

    // Verify payment with Razorpay
    const payment = await fetchPaymentDetails(payment_id);

    if (payment.status !== "captured") {
      return {
        statusCode: 402,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Payment has not been captured. Status: " + payment.status }),
      };
    }

    // Validate amount matches the playlist price
    if (payment.amount < playlist.priceInPaise) {
      return {
        statusCode: 402,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Payment amount does not match playlist price." }),
      };
    }

    // Generate expiring download URLs for all tracks
    const downloadLinks = await generatePlaylistDownloadUrls(
      playlist.tracks,
      DOWNLOAD_EXPIRY_SECONDS
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloads: downloadLinks }),
    };
  } catch (error) {
    console.error("Generate download error:", error);
    const status = error.statusCode || 500;
    return {
      statusCode: status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
