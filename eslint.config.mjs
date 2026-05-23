import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    rules: {
      // Mencegah variabel yang tidak terpakai (menghindari clutter)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // Membatasi penggunaan 'any' (memaksa strong typing untuk sistem ERP/SaaS)
      "@typescript-eslint/no-explicit-any": "off",

      // Memaksa konsistensi hook React
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Mencegah penggunaan default export berlebihan jika Anda lebih suka named export
      "import/no-anonymous-default-export": "warn",

      // Memastikan import terorganisir dengan rapi
      "import/order": "off",
    },
  },
];

export default eslintConfig;
