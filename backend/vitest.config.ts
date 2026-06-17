import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals:     true,
    environment: "node",
    setupFiles:  ["./src/tests/setup.ts"],
    testTimeout: 15000,
    sequence:    { concurrent: false },   // tests share the DB — run serially
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include:  ["src/modules/**/*.ts", "src/middleware/**/*.ts"],
      exclude:  ["**/*.dto.ts", "**/*.routes.ts"],
    },
  },
});
