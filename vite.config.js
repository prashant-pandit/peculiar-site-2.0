import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'
import { createOrder, verifyPaymentSignature, createQRCode, checkQRPaymentStatus, fetchPaymentDetails } from './server/razorpayService.js'
import { generatePlaylistDownloadUrls } from './server/r2Service.js'

// Server-side playlist data for the generate-download dev middleware
const PLAYLISTS_SERVER = {
  "neon-pulse-ep": {
    priceInPaise: 39900, isFree: false,
    tracks: [
      { id: "neon-pulse", title: "Neon Pulse", masterKey: "masters/neon-pulse-master.wav" },
      { id: "neon-pulse-vip", title: "Neon Pulse (VIP Mix)", masterKey: "masters/neon-pulse-vip-master.wav" },
    ],
  },
  "delhi-nights-pack": {
    priceInPaise: 39900, isFree: false,
    tracks: [
      { id: "delhi-after-dark", title: "Delhi After Dark", masterKey: "masters/delhi-after-dark-master.wav" },
      { id: "delhi-sunrise", title: "Delhi Sunrise", masterKey: "masters/delhi-sunrise-master.wav" },
    ],
  },
  "cyber-odyssey-ep": {
    priceInPaise: 44900, isFree: false,
    tracks: [
      { id: "cyber-odyssey", title: "Cyber Odyssey", masterKey: "masters/cyber-odyssey-master.wav" },
      { id: "cyber-odyssey-dub", title: "Cyber Odyssey (Dub Mix)", masterKey: "masters/cyber-odyssey-dub-master.wav" },
    ],
  },
  "bass-weapons-vol1": {
    priceInPaise: 39900, isFree: false,
    tracks: [
      { id: "sub-zero-bass", title: "Sub Zero Bass", masterKey: "masters/sub-zero-bass-master.wav" },
      { id: "warehouse-riddim", title: "Warehouse Riddim", masterKey: "masters/warehouse-riddim-master.wav" },
    ],
  },
  "bollywood-fusion-pack": {
    priceInPaise: 29900, isFree: false,
    tracks: [
      { id: "bollywood-frequencies", title: "Bollywood Frequencies", masterKey: "masters/bollywood-frequencies-master.wav" },
      { id: "desi-drop", title: "Desi Drop", masterKey: "masters/desi-drop-master.wav" },
    ],
  },
  "free-sampler-pack": {
    priceInPaise: 0, isFree: true,
    tracks: [
      { id: "aurora-drift", title: "Aurora Drift", masterKey: "masters/aurora-drift-master.wav" },
      { id: "midnight-glow", title: "Midnight Glow", masterKey: "masters/midnight-glow-master.wav" },
    ],
  },
};

function razorpayApiPlugin() {
  return {
    name: 'razorpay-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Strip query params for route matching
        const url = req.url ? req.url.split('?')[0] : ''

        if (req.method === 'POST' && url === '/api/create-order') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = await createOrder(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = err.statusCode || 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        if (req.method === 'POST' && url === '/api/verify-payment') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = verifyPaymentSignature(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = err.statusCode || 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        // QR Code creation endpoint
        if (req.method === 'POST' && url === '/api/create-qr') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = await createQRCode(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = err.statusCode || 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        // QR Payment status check endpoint
        if (req.method === 'POST' && url === '/api/check-qr-status') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              if (!data.qr_id) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'qr_id is required.' }))
                return
              }
              const result = await checkQRPaymentStatus(data.qr_id)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = err.statusCode || 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        // Generate expiring download URLs endpoint
        if (req.method === 'POST' && url === '/api/generate-download') {
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const { playlistId, payment_id } = data

              if (!playlistId) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'playlistId is required.' }))
                return
              }

              const playlist = PLAYLISTS_SERVER[playlistId]
              if (!playlist) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 404
                res.end(JSON.stringify({ error: 'Playlist not found.' }))
                return
              }

              // Free playlists skip payment validation
              if (playlist.isFree) {
                const downloads = await generatePlaylistDownloadUrls(playlist.tracks, 3600)
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ downloads }))
                return
              }

              // Paid playlists require payment validation
              if (!payment_id) {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'payment_id is required for paid playlists.' }))
                return
              }

              const payment = await fetchPaymentDetails(payment_id)
              if (payment.status !== 'captured') {
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 402
                res.end(JSON.stringify({ error: 'Payment not captured. Status: ' + payment.status }))
                return
              }

              const downloads = await generatePlaylistDownloadUrls(playlist.tracks, 3600)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ downloads }))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = err.statusCode || 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [react(), razorpayApiPlugin()],
    base: '/',

    build: {
      minify: 'esbuild',
      esbuild: {
        drop: ['console', 'debugger'],
      },
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            slider: ['react-slick'],
            icons: ['lucide-react'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['react-slick', 'lucide-react'],
    },
  }
})
