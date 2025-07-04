import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // allow use of any
      "@typescript-eslint/no-unused-vars": "warn", // show warning instead of error
      "@typescript-eslint/no-require-imports": "off", // allow require()
      "react/jsx-key": "warn", // prevent hard fail on missing keys
      "react-hooks/exhaustive-deps": "warn", // warn on missing deps
    },
  },
];

export default eslintConfig;
