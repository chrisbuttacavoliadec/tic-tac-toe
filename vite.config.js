import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
    base: command === "build" ? "/tic-tac-toe/" : "/",
    plugins: [react()],
    server: { port: 5173 },
}));
