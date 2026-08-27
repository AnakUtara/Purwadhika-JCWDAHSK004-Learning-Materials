import { useNavigation } from "react-router";

const useLoading = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	return isLoading;
};

export default useLoading;
