// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }], // ✅ transforms JSX
      ],
    }),
    commonjs(),
    terser(),
  ],
  external: ["react", "react-dom"], // ✅ don't bundle these
};
