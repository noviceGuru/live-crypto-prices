import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            components: path.resolve(__dirname, "src/components"),
            assets: path.resolve(__dirname, "src/assets"),
            features: path.resolve(__dirname, "src/features"),
            utils: path.resolve(__dirname, "src/utils"),
        },
    },
})
