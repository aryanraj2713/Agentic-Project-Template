import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: process.env.OPENAPI_URL ?? "http://localhost:8000/openapi.json",
  output: "./lib/api/generated",
  plugins: ["@hey-api/client-next", "@hey-api/sdk"],
});
