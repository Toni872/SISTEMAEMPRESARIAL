import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Reglas básicas - Next.js manejará las reglas específicas automáticamente
    },
  },
]);

export default eslintConfig;
