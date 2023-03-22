import { resolve } from "path";
import { defineConfig } from "vite";

// For more options check: https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/use-form-lite.ts"),
      name: "UseFormLite",
    },

    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "react",
        },
      },
    },
  },
});
