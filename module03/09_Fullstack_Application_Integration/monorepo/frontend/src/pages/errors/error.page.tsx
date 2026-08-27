// pages/errors/error.page.tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

export default function ErrorPage() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<DefaultErrorPage
				error={{
					status: error.status,
					statusText: error.statusText,
					data: error.data as string,
				}}
			/>
		);
	}

	return <DefaultErrorPage />;
}

type DefaultErrorPageProps = {
	error?: {
		status?: number;
		statusText?: string;
		data?: string;
	};
};

const DefaultErrorPage = ({ error }: DefaultErrorPageProps = {}) => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1>{error?.status || 500}</h1>
			<p>
				{error?.statusText ||
					error?.data ||
					"Oops! Something went wrong. Please try again later."}
			</p>
		</div>
	);
};
