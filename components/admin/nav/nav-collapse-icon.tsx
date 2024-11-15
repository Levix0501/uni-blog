import { Circle, CircleDot, X } from 'lucide-react';

import { useAdminNav } from '@/hooks/use-admin-nav';

const NavCollapseIcon = () => {
	const {
		isCollapsed,
		isBreakpointReached,
		toggleCollapseNav,
		updateAdminNavState
	} = useAdminNav();

	return isBreakpointReached ? (
		<div
			role="button"
			onClick={() => updateAdminNavState({ isToggled: false })}
		>
			<X size={20} />
		</div>
	) : (
		<div role="button" onClick={() => toggleCollapseNav()}>
			{isCollapsed ? <Circle size={20} /> : <CircleDot size={20} />}
		</div>
	);
};

export default NavCollapseIcon;
