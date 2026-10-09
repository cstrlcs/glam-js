import config from "@cstrlcs/configs/oxlint/base.js";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...config,
  overrides: [
    ...(config.overrides ?? []),
    {
      files: ["src/**"],
      rules: {
        "cstrlcs/no-comments": "off",
        "cstrlcs/no-explicit-return-type": "off",
        "eslint/max-lines": "off",
        "eslint/max-params": "off",
        "eslint/no-restricted-imports": "off",
        "import/no-cycle": ["error", { ignoreTypes: true }],
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "typescript/explicit-member-accessibility": "off",
        "typescript/parameter-properties": "off",
        "typescript/restrict-template-expressions": ["error", { allowBoolean: true }],
        "typescript/switch-exhaustiveness-check": [
          "error",
          { allowDefaultCaseForExhaustiveSwitch: true },
        ],
      },
    },
    {
      files: ["src/Affine*.ts", "src/Mat*.ts", "src/Quat.ts"],
      rules: {
        "eslint/complexity": "off",
        "eslint/max-lines-per-function": "off",
        "eslint/max-statements": "off",
      },
    },
    {
      files: ["src/Vec*.ts"],
      rules: {
        "import/no-cycle": "off",
      },
    },
    {
      files: ["src/EulerRot.ts"],
      rules: {
        "eslint/no-redeclare": "off",
      },
    },
    {
      files: [
        "src/index.ts",
        "src/camera/index.ts",
        "src/camera/*/index.ts",
        "src/camera/*/proj/index.ts",
      ],
      rules: {
        "oxc/no-barrel-file": "off",
      },
    },
    {
      files: ["src/camera/**"],
      rules: {
        "import/no-relative-parent-imports": "off",
      },
    },
    {
      files: ["test/**"],
      rules: {
        "eslint/max-lines": "off",
        "eslint/max-lines-per-function": "off",
        "eslint/max-statements": "off",
        "vitest/max-expects": "off",
        "vitest/prefer-expect-assertions": "off",
        "vitest/valid-title": ["error", { allowArguments: true }],
      },
    },
    {
      files: ["codegen/**"],
      rules: {
        "eslint/no-await-in-loop": "off",
        "eslint/no-restricted-imports": "off",
        "typescript/consistent-type-assertions": "off",
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/strict-boolean-expressions": "off",
      },
    },
  ],
});
