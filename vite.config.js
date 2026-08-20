import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'
import { createOrder, verifyPaymentSignature } from './server/razorpayService.js'

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
