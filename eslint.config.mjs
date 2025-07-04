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
      "prefer-const": "off", // turn off build-blocking prefer-const rule
      "@typescript-eslint/no-unused-vars": "warn", // warning only
      "react-hooks/exhaustive-deps": "warn", //  warning only
      "react/jsx-key": "warn", // warning only
      "react/no-unescaped-entities": "warn", //  warning only
      "@typescript-eslint/no-unsafe-function-type": "warn", // warning only
    },
  },
];

export default eslintConfig;
