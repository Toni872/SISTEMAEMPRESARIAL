import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"],
  },
]);

export default eslintConfig;
