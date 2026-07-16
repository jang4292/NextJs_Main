import { globalIgnores } from "eslint/config";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const nextConfigDir = path.dirname(
  require.resolve("eslint-config-next/package.json"),
);
const nextRequire = createRequire(path.join(nextConfigDir, "index.js"));

const nextParser = nextRequire("./parser.js");
const nextPlugin = nextRequire("@next/eslint-plugin-next");
const importPlugin = nextRequire("eslint-plugin-import");
const jsxA11yPlugin = nextRequire("eslint-plugin-jsx-a11y");
const reactPlugin = nextRequire("eslint-plugin-react");
const reactHooksPlugin = nextRequire("eslint-plugin-react-hooks");
const tsPlugin = nextRequire("@typescript-eslint/eslint-plugin");
const tsParser = nextRequire("@typescript-eslint/parser");

const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: nextParser,
      parserOptions: {
        requireConfigFile: false,
        allowImportExportEverywhere: true,
        babelOptions: {
          presets: ["next/babel"],
          caller: {
            supportsTopLevelAwait: true,
          },
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        [nextRequire.resolve("@typescript-eslint/parser")]: [
          ".ts",
          ".mts",
          ".cts",
          ".tsx",
          ".d.ts",
        ],
      },
      "import/resolver": {
        [nextRequire.resolve("eslint-import-resolver-node")]: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        [nextRequire.resolve("eslint-import-resolver-typescript")]: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
];

export default eslintConfig;
