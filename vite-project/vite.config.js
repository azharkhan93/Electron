import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {},
  },
  esbuild: {
    // For Electron compatibility, enable CommonJS output
    target: 'es2020', // or 'esnext'
    format: 'cjs',
  },
  optimizeDeps: {
    exclude: ['crypto', 'buffer'],
  },
  resolve: {
    // alias: {
    //   '@': fileURLToPath(new URL('./src', import.meta.url))
    // }
  },
  server: {
    // Allow Electron to access the Vite development server if VITE_ELECTRON is set to true
    strictPort: !process.env.VITE_ELECTRON,
    
  },
})
