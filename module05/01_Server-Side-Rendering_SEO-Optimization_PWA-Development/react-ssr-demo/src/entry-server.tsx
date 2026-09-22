import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

const routeMeta: Record<string, { title: string; description: string }> = {
	"/": {
		title: "Home | Vite React SSR Demo",
		description: "Welcome to the home page of the Vite React SSR demo.",
	},
	"/about": {
		title: "About | Vite React SSR Demo",
		description: "Learn more about this Vite React SSR demo project.",
	},
};

export function render(url: string) {
	const meta = routeMeta[url] ?? {
		title: "Vite React SSR Demo",
		description: "A Vite React SSR demo.",
	};

	const html = renderToString(
		<StrictMode>
			<StaticRouter location={url}>
				<App />
			</StaticRouter>
		</StrictMode>,
	);

	const head = [
		`<title>${meta.title}</title>`,
		`<meta name="description" content="${meta.description}" />`,
		`<meta property="og:title" content="${meta.title}" />`,
		`<meta property="og:description" content="${meta.description}" />`,
	].join("\n");

	return { html, head };
}
