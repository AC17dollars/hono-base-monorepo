import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/env.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
});
