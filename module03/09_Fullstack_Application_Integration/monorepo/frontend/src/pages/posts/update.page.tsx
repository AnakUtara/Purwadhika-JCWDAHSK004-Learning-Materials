import useLoading from "@/hooks/use-loading";
import LoadingPage from "../loading";

const UpdatePostPage = () => {
	const isLoading = useLoading();

	if (isLoading) {
		return <LoadingPage />;
	}
	return <div>UpdatePostPage</div>;
};

export default UpdatePostPage;
