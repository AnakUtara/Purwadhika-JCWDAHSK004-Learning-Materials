import { useState, useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import About from "./pages/About";
import "./App.css";

function Home() {
	const [count, setCount] = useState(0);
	// useEffect(() => {
	// 	document.title = "Home | Vite React SSR Demo";
	// }, []);

	return (
		<>
			<nav style={{ padding: "1rem" }}>
				<Link to="/">Home</Link> | <Link to="/about">About</Link>
			</nav>
			<section id="center">
				<div className="hero">
					<img src={heroImg} className="base" width="170" height="179" alt="" />
					<img src={reactLogo} className="framework" alt="React logo" />
					<img src={viteLogo} className="vite" alt="Vite logo" />
				</div>
				<div>
					<h1>Get started</h1>
					<p>
						Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
					</p>
				</div>
				<button
					className="counter"
					onClick={() => setCount((count) => count + 1)}
				>
					Count is {count}
				</button>
			</section>
		</>
	);
}

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/about" element={<About />} />
		</Routes>
	);
}

export default App;
