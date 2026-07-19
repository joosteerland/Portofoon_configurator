import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Portofoon_configurator/",
  root: "github-pages-src",
  plugins: [react()],
  publicDir: "../public",
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
  },
});
