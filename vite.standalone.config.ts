import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      outDir: "standalone",
      emptyOutDir: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: "main.js",
          chunkFileNames: "chunks/[name].js",
          assetFileNames: "assets/[name][extname]",
          manualChunks: undefined
        }
      }
    }
  })
);
