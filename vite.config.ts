import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },

  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],

    coverage: {
      provider: "v8",

      // Medimos el código de la aplicación.
      include: ["src/**/*.{ts,tsx}"],

      // Excluimos las pruebas, sus preparativos y el punto de entrada.
      exclude: ["src/test/**", "src/main.tsx", "src/**/*.d.ts"],

      reporter: ["text", "html"],
    },
  },
});
