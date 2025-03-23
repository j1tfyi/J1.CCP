import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@solana/wallet-adapter-react': resolve(__dirname, 'node_modules/@solana/wallet-adapter-react/lib/esm/index.js'),
      '@solana/wallet-adapter-react-ui': resolve(__dirname, 'node_modules/@solana/wallet-adapter-react-ui/lib/esm/index.js'),
      '@solana/wallet-adapter-base': resolve(__dirname, 'node_modules/@solana/wallet-adapter-base/lib/esm/index.js'),
      '@solana/web3.js': resolve(__dirname, 'node_modules/@solana/web3.js/lib/index.browser.esm.js')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    }
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  base: '/',
});
