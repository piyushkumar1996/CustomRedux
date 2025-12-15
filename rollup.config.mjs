// rollup.config.mjs
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "CustomRedux",
    sourcemap: true,
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: [
        ["@babel/preset-env", {
          targets: {
            browsers: ["> 1%", "last 2 versions", "not ie <= 11"]
          }
        }],
        ["@babel/preset-react", { 
          runtime: "classic",
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment"
        }]
      ],
    }),
    commonjs(),
    terser(),
  ],
  external: ["react", "react-dom"], // ✅ don't bundle these
};

