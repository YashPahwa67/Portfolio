import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirror the "@/*" alias declared in tsconfig.app.json so editor + build agree.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    // The three.js chunk is legitimately large, but it's lazy-loaded after first
    // paint (never in the critical path), so we lift the warning threshold rather
    // than chase a misleading "fix". Initial JS is ~50 kB gzip.
    chunkSizeWarningLimit: 800,
    // Three.js is large and rarely changes. Splitting it into its own chunk means
    // the (heavy) 3D bundle is cached independently of app code, so content edits
    // don't bust the user's cached WebGL payload. Big win for repeat visits.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
        },
      },
    },
  },
});
