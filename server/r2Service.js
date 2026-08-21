/**
 * Cloudflare R2 Pre-signed URL Generator
 * Generates time-limited download URLs for purchased master audio files.
 * Uses AWS SDK v3 (S3-compatible) with Cloudflare R2 endpoint.
 */

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Default download link expiry: 1 hour (3600 seconds)
const DEFAULT_EXPIRY_SECONDS = 3600;

/**
 * Lazily initializes and returns the S3-compatible client for R2.
 * Requires R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY env vars.
 */
function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables are required."
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Generates a pre-signed download URL for a single R2 object.
 * @param {string} objectKey - The R2 object key (e.g., "masters/neon-pulse-master.wav")
 * @param {number} [expiresInSeconds=3600] - URL validity duration in seconds (max 7 days / 604800s)
 * @returns {Promise<{ downloadUrl: string, expiresAt: string }>}
 */
export async function generateDownloadUrl(objectKey, expiresInSeconds = DEFAULT_EXPIRY_SECONDS) {
  if (!objectKey) {
    const error = new Error("Object key is required.");
    error.statusCode = 400;
    throw error;
  }

  const bucketName = process.env.R2_BUCKET_NAME || "peculiar-beats-audio";
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    const downloadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return { downloadUrl, expiresAt };
  } catch (err) {
    console.error("R2 pre-signed URL generation error:", err);
    const error = new Error(err.message || "Failed to generate download URL.");
    error.statusCode = 500;
    throw error;
  }
}

/**
 * Generates pre-signed download URLs for multiple R2 objects (batch).
 * @param {Array<{ trackId: string, title: string, masterKey: string }>} tracks
 * @param {number} [expiresInSeconds=3600]
 * @returns {Promise<Array<{ trackId: string, title: string, downloadUrl: string, expiresAt: string }>>}
 */
export async function generatePlaylistDownloadUrls(tracks, expiresInSeconds = DEFAULT_EXPIRY_SECONDS) {
  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    const error = new Error("Tracks array is required and must not be empty.");
    error.statusCode = 400;
    throw error;
  }

  const results = await Promise.all(
    tracks.map(async (track) => {
      const { downloadUrl, expiresAt } = await generateDownloadUrl(track.masterKey, expiresInSeconds);
      return {
        trackId: track.trackId || track.id,
        title: track.title,
        downloadUrl,
        expiresAt,
      };
    })
  );

  return results;
}
