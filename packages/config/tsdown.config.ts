import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/backend-api.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
});
