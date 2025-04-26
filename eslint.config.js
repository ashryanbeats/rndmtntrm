import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Global ignores
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**", "**/*.min.js"],
  },

  // Base configuration for all files
  {
    files: ["src/**/*.{js,jsx,ts,tsx,astro}"],
    rules: {
      // Enforce double quotes
      quotes: ["error", "double"],

      // Call out console method usage
      "no-console": "warn",

      // Keep file line count below a recommended threshold
      "max-lines": [
        "warn",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],
    },
  },

  // JavaScript and TypeScript base rules
  {
    files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Add any general rules here
    },
  },

  // React specific rules
  {
    files: ["src/**/*.jsx", "src/**/*.tsx"],
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Astro specific rules
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["src/**/*.astro"],
    rules: {
      // Add any Astro-specific rule overrides here
    },
  },
];
