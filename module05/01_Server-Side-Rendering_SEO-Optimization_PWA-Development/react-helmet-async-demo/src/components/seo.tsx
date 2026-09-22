import { Helmet } from "react-helmet-async";

type Props = {
	title: string;
	description: string;
	keywords?: string;
	type: string;
	name: string;
	imageUrl?: string;
};
const SEO = ({
	title,
	description,
	keywords = "React, Vite, React Helmet Async Demo",
	type,
	name,
	imageUrl,
}: Props) => {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			{/* End standard metadata tags */}
			{/* Facebook tags */}
			<meta property="og:type" content={type} />
			<meta
				property="og:image"
				content={
					imageUrl || "https://react-helmet-async-demo.vercel.app/og-image.png"
				}
			/>
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			{/* End Facebook tags */}
			{/* Twitter tags */}
			<meta name="twitter:creator" content={name} />
			<meta name="twitter:card" content={type} />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{/* End Twitter tags */}
		</Helmet>
	);
};
export default SEO;
