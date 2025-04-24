// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://YOURUSERNAME.github.io",
  build: {
    // Generate static files
    format: "file",
  },
});
