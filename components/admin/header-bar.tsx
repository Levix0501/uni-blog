'use client';

import { useAdminNav } from '@/hooks/use-admin-nav';
import { AlignLeft } from 'lucide-react';

const HeaderBar = () => {
	const { isBreakpointReached, updateAdminNavState } = useAdminNav();

	const handleToggleBtnClick = () => {
		updateAdminNavState({ isToggled: true });
	};

	return (
		<header className="sticky top-0 z-30 h-16 shadow-[inset_0_-1px_0_0] shadow-[#eaeaea] bg-[hsla(0,0%,100%,.8)] backdrop-saturate-[180%] backdrop-blur-[5px]">
			<div className="h-full flex items-center px-4">
				{isBreakpointReached && (
					<AlignLeft role="button" onClick={handleToggleBtnClick} />
				)}
			</div>
		</header>
	);
};

export default HeaderBar;
