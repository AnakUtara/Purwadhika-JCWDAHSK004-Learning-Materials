import type { ReactNode } from "react";

type Props = {
	sm?: number;
	md?: number;
	lg?: number;
	children: ReactNode;
};

const GridContainer = ({ sm = 2, md = 3, lg = 4, children }: Props) => {
	return (
		<div
			className={`grid grid-cols-1 sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} gap-4`}
		>
			{children}
		</div>
	);
};
export default GridContainer;
