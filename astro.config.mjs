// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://ashryanbeats.github.io",
  outDir: "./dist",
  build: {
    // Generate static files
    format: "file",
  },
});
