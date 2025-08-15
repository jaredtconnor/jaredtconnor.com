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
    ignores: [
      ".next/**/*", 
      "dist/**/*", 
      "node_modules/**/*",
      ".open-next/**/*",
      "tsconfig.tsbuildinfo",
      "tailwind.config.cjs",
      "*.config.cjs"
    ],
  },
  {
    rules: {
      // Allow warnings for now - can be fixed incrementally
      "@next/next/no-img-element": "warn",
      "react-hooks/exhaustive-deps": "warn",
    }
  }
];

export default eslintConfig;
