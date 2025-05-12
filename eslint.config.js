import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-plugin-prettier"
import react from "eslint-plugin-react"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import jsonFiles from "eslint-plugin-json-files"
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(["**/sentry.properties", "**/node_modules"]),
  {
    extends: compat.extends(
      "next",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended",
    ),

    plugins: {
      prettier,
      react,
      "@typescript-eslint": typescriptEslint,
      "json-files": jsonFiles,
    },

    languageOptions: {
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
      "@emotion/jsx-import": "error",
      "@emotion/no-vanilla": "error",
      "@emotion/import-from-emotion": "error",
      "@emotion/styled-import": "error",
    },

    rules: {
      eqeqeq: "warn",
      "no-console": "warn",
      curly: "error",

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],

      "react/no-children-prop": "off",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-document-import-in-page": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/prefer-ts-expect-error": "warn",
      "import/no-anonymous-default-export": "off",
      "no-case-declarations": "warn",
    },
  },
])
