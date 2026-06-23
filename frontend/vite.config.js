import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/chat": "http://127.0.0.1:8000",
      "/login": "http://127.0.0.1:8000",
      "/register": "http://127.0.0.1:8000",
      "/documents": "http://127.0.0.1:8000",
      "/upload-document": "http://127.0.0.1:8000",
      "/analytics": "http://127.0.0.1:8000"
    }
  }
});
