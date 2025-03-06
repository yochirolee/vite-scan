import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", async () => {
		try {
			const registration = await navigator.serviceWorker.register("/service-worker.js", {
				type: "module",
			});
			console.log("SW registered:", registration);
		} catch (error) {
			console.error("SW registration failed:", error);
		}
	});
}
