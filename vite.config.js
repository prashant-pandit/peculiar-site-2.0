import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  
  build: {
    // 1. Keeps the super-fast esbuild minifier
    minify: 'esbuild',
    
    // 2. Safely removes console logs and debuggers in production using esbuild
    esbuild: {
      drop: ['console', 'debugger'],
    },
    
    // 3. Increases the limit slightly to accommodate the separated sliders/icons chunks
    chunkSizeWarningLimit: 1000,
    
    // 4. Custom chunk splitting strategy to optimize browser caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'slider': ['react-slick'],
          'icons': ['lucide-react'],
        }
      }
    }
  },
  
  // 5. Pre-bundles heavy dependencies for a faster initial local server load
  optimizeDeps: {
    include: ['react-slick', 'lucide-react'],
  }
})
