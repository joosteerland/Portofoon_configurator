import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative assets work both on the GitHub project URL and on configurator.firecom.nl.
  base: "./",
  root: "github-pages-src",
  plugins: [react()],
  publicDir: "../public",
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
  },
});
