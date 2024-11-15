'use client';

import { cn } from '@/lib/utils';
import { useAdminNav } from '@/hooks/use-admin-nav';
import NavHeader from './nav-header';
import NavFooter from './nav-footer';
import Backdrop from './backdrop';
import { ScrollArea } from '@/components/ui/scroll-area';
import Menu from '../menu';
import { BasicInfoType } from '@/types/site-config';

export interface VerticalNavProps {
	basicInfo: BasicInfoType;
}

const VerticalNav = ({ basicInfo }: VerticalNavProps) => {
	const {
		isCollapsed,
		isHovered,
		collapsing,
		expanding,
		isBreakpointReached,
		isToggled,
		updateAdminNavState
	} = useAdminNav();

	const handleNavHover = () => {
		if (isCollapsed && !isHovered) {
			updateAdminNavState({ isHovered: true });
		}
	};

	const handleNavHoverOut = () => {
		if (isCollapsed && isHovered) {
			updateAdminNavState({ isHovered: false });
		}
	};

	const handleBackdropClick = () => {
		updateAdminNavState({ isToggled: false });
	};

	return (
		<aside
			className={cn(
				'h-screen z-40 transition-all sticky top-0',
				isCollapsed ? 'w-[71px]' : 'w-64',
				(collapsing || expanding) && 'pointer-events-none',
				isBreakpointReached && 'fixed top-0 -left-64 z-50 m-0',
				isBreakpointReached && isCollapsed && '-left-20',
				isBreakpointReached && isToggled && 'left-0'
			)}
		>
			<div
				className={cn(
					'z-[3] relative w-full h-full transition-all shadow-md bg-white',
					(isHovered || expanding) && 'w-64'
				)}
				onMouseEnter={isCollapsed ? handleNavHover : void 0}
				onMouseLeave={isCollapsed ? handleNavHoverOut : void 0}
			>
				<div className="h-full flex flex-col">
					<NavHeader basicInfo={basicInfo} />

					<div className="flex-1 overflow-hidden">
						<ScrollArea className="h-full w-full px-3">
							<Menu />
						</ScrollArea>
					</div>

					<NavFooter />
				</div>
			</div>

			{isToggled && isBreakpointReached && (
				<Backdrop onClick={handleBackdropClick} />
			)}
		</aside>
	);
};

export default VerticalNav;
