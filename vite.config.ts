import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root base in development, GitHub Pages base in production build
  base: mode === 'development' ? '/' : '/warm-wealth-watch/',
  
  build: {
    // Standardizing to 'dist' is safer for most GitHub Action templates
    outDir: 'dist',
    // Ensures assets are handled correctly in sub-folders
    assetsDir: 'assets',
    // Generates a manifest file which can help with debugging
    manifest: true,
  },

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));