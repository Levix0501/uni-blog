export interface BackdropProps {
	onClick?: () => void;
}

const Backdrop = ({ onClick }: BackdropProps) => {
	return (
		<div
			aria-label="backdrop"
			className="bg-[#2F2B3D]/50 inset-0 fixed z-[1]"
			onClick={onClick}
		></div>
	);
};

export default Backdrop;
