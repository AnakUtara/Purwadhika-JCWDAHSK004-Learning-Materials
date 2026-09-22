import { useEffect } from "react";
import { Link } from "react-router-dom";

function About() {
	useEffect(() => {
		document.title = "About | Vite React SSR Demo";
	}, []);
	return (
		<section id="center">
			<div>
				<h1>About This Demo</h1>
				<p>
					This is the About page. It has its own metadata injected in the{" "}
					<code>&lt;head&gt;</code> by the SSR server.
				</p>
				<p>
					Check "View Page Source" — you will see a different{" "}
					<code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> tags compared
					to the home page.
				</p>
				<Link to="/">← Back to Home</Link>
			</div>
		</section>
	);
}

export default About;
