import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const pageEntry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Relative assets work both on the GitHub project URL and on configurator.firecom.nl.
  base: "./",
  root: "github-pages-src",
  plugins: [react()],
  publicDir: "../public",
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: pageEntry("./github-pages-src/index.html"),
        communicatie: pageEntry("./github-pages-src/communicatie/index.html"),
        alarmering: pageEntry("./github-pages-src/alarmering/index.html"),
      },
    },
  },
});
