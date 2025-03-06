import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			strategies: "injectManifest",
			srcDir: "src",
			filename: "service-worker.ts",
			registerType: "autoUpdate",
			injectRegister: "auto",
			manifest: {
				name: "Your App Name",
				short_name: "App",
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#000000",
				icons: [
					// Add your icons here
				],
			},
			injectManifest: {
				injectionPoint: undefined,
				rollupFormat: "iife",
				maximumFileSizeToCacheInBytes: 5000000,
			},
			devOptions: {
				enabled: true,
				type: "module",
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		sourcemap: true,
	},
});
