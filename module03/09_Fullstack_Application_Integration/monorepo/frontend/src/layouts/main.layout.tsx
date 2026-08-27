import XAxisCenteredContainer from "@/components/containers/x-axis-centered.container";
import NavigationBar from "@/components/navigation/navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
	return (
		<>
			<NavigationBar />
			<XAxisCenteredContainer>
				<Outlet />
			</XAxisCenteredContainer>
		</>
	);
};
export default MainLayout;
