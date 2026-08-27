import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	zIndex?: number;
};

const XAxisCenteredContainer = ({ children, className, zIndex }: Props) => {
	return (
		<div
			className={`relative z-${zIndex ?? 30} container mx-auto ${className ?? ""}`}
		>
			{children}
		</div>
	);
};
export default XAxisCenteredContainer;
