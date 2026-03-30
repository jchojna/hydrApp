import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/utils/**/*.ts", "app/**/utils/**/*.{ts,tsx}"],
      exclude: ["**/__tests__/**"],
    },
  },
})
