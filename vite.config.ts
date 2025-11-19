import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/audio-dataset-tool-web/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-mui": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "app-record": ["./src/apps/record/router.tsx"],
          "app-edit": ["./src/apps/edit/router.tsx"],
        },
      },
    },
  },
});
