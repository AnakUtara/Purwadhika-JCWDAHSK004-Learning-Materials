type Props = {
	className?: string;
	children: React.ReactNode;
};
const ViewportCenteredContainer = ({
	children,
	className,
	...props // Setiap properti default HTML div ataupun tambahan lainnya akan ditampung oleh props ini dan diteruskan ke elemen div di bawah ini
}: Props) => {
	return (
		<div
			{...props}
			className={`flex min-h-svh w-full items-center justify-center p-6 md:p-10 ${className || ""}`}
		>
			{children}
		</div>
	);
};
export default ViewportCenteredContainer;
