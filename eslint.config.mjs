import { globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";

const config = [
  globalIgnores([
    "**/.next/**",
    "**/node_modules/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
    "**/*.log",
  ]),
  ...nextConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default config;
