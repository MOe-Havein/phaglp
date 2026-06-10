import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";

export default [
  {
    plugins: {
      "@next/next": nextPlugin,
      "import": importPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      
      // Enforce the same guardrails locally as defined in FORBIDDEN_PATHS
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/**/*",
              from: "./prisma/schema.prisma",
              message: "Modifying or directly binding dependencies on protected schema configurations via app code is prohibited.",
            },
            {
              target: "./src/**/*",
              from: "./middleware.ts",
              message: "The application middleware is managed exclusively by core architecture permissions.",
            },
            {
              target: "./src/**/*",
              from: "./.github/workflows/**/*",
              message: "CI/CD execution paths cannot be linked or evaluated by frontend source layers.",
            }
          ],
        },
      ],
    },
  },
  {
    // Ignore environment variables and critical files completely from standard lint generation
    ignores: [
      ".env", 
      ".env.local", 
      "pnpm-lock.yaml",
      "coverage/**/*"
    ],
  },
];
