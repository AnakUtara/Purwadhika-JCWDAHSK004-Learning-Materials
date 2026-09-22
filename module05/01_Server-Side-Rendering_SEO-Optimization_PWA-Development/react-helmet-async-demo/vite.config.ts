import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: { enabled: true },
			manifest: {
				id: "/react-pwa-demo/",
				name: "Vite React Helmet Async PWA Demo",
				short_name: "SSR Demo",
				description: "A Vite React demo with PWA support",
				theme_color: "#646cff",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				scope: "/",
				icons: [
					{
						src: "/favicon.svg",
						sizes: "any",
						type: "image/svg+xml",
					},
				],
			},
			workbox: {
				cacheId: "react-pwa-demo",
				cleanupOutdatedCaches: true,
			},
		}),
	],
});
