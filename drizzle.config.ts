import { defineConfig } from "drizzle-kit"
import "dotenv/config"

const isProduction = process.env.NODE_ENV === "production"

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true, // logs
  strict: !isProduction, // strict in development mode only
  breakpoints: true,
})
