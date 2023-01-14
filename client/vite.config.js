import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      contexts: path.resolve(__dirname, "./src/contexts"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      pages: path.resolve(__dirname, "./src/pages"),
    },
  },
  plugins: [react()],
});
