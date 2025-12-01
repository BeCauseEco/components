import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-plugin-prettier"
import jsonFiles from "eslint-plugin-json-files"
import globals from "globals"
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import nextConfig from "eslint-config-next"

// Extract the @typescript-eslint plugin from eslint-config-next to avoid version conflicts
// eslint-config-next bundles its own version, and we must use the same instance
const typescriptEslint = nextConfig[1].plugins["@typescript-eslint"]

export default defineConfig([
  globalIgnores(["**/sentry.properties", "**/node_modules"]),
  js.configs.recommended,
  ...nextConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      prettier,
      "json-files": jsonFiles,
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      // Include TypeScript recommended rules
      ...typescriptEslint.configs.recommended.rules,

      // ESLint core rules - disabled because TypeScript handles these
      "no-undef": "off",
      "no-unused-vars": "off",

      // ESLint core rules
      eqeqeq: "warn",
      "no-console": "off",
      curly: "error",
      "no-case-declarations": "warn",

      // Prettier
      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // React overrides
      "react/no-children-prop": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/prop-types": "off",

      // Next.js overrides
      "@next/next/no-document-import-in-page": "off",

      // TypeScript overrides
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
])
