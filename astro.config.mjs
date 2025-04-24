// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://YOURUSERNAME.github.io",
  base: "/rndmtntrm",
  build: {
    // Generate static files
    format: "file",
  },
});
