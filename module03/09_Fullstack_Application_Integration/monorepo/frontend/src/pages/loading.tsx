import ViewportCenteredContainer from "@/components/containers/viewport-centered.container";
import XAxisCenteredContainer from "@/components/containers/x-axis-centered.container";
import { Spinner } from "@/components/shadcn-ui/spinner";

const LoadingPage = () => {
	return (
		<XAxisCenteredContainer>
			<ViewportCenteredContainer className="flex-col">
				<Spinner className="size-16" />
				<p className="text-lg text-gray-600 mt-4">Loading...</p>
			</ViewportCenteredContainer>
		</XAxisCenteredContainer>
	);
};
export default LoadingPage;
