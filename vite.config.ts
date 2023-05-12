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
  plugins: [/* dts(), */ noBundle()],
});
