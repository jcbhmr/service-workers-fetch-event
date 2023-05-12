import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import noBundle from "vite-plugin-no-bundle";

export default defineConfig({
  build: {
    ssr: true,
    target: "esnext",
    lib: {
      entry: ["src/index.ts", "src/polyfill.ts"],
      formats: ["es"],
    },
  },
  // TODO: Don't run dts() in --watch mode
  plugins: [dts(), noBundle()],
});
