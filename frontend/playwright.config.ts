import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  use: {
    baseURL: "https://localhost:5173",
    trace: "on-first-retry",
    ignoreHTTPSErrors: true,
  },

  webServer: {
    command: "npm run dev",
    url: "https://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    ignoreHTTPSErrors: true,
  },
});