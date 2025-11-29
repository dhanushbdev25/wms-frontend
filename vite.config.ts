import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin({
      APP_NAME: "wms",
      API_BASE_URL: "https://wms-backend-u1jd.onrender.com",
    }),
  ],
});