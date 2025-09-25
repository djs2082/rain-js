import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("./package.json");

export default [
  // --- Build JS (CJS + ESM) ---
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true
      }
    ],
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@emotion/react",
      "@emotion/styled",
      "axios",
    ], // don’t bundle these
    plugins: [
      resolve({ browser: true, preferBuiltins: false }),
      commonjs(),
      json(),
      postcss({ extract: true }),
      typescript({ tsconfig: "./tsconfig.json" })
    ]
  },

  // --- Build type declarations ---
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    external: [
      /\.css$/,
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@emotion/react",
      "@emotion/styled",
      "clsx",
      "tailwind-merge",
      "axios",
    ],
    plugins: [dts({ respectExternal: true })],
  }
];
