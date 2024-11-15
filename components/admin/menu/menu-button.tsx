import { ChevronRight, Circle, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

import { useAdminNav } from '@/hooks/use-admin-nav';
import { cn } from '@/lib/utils';
import { ChildrenType } from '@/types/common';
import { usePathname } from 'next/navigation';

export type MenuButtonProps = ChildrenType & {
	href?: string;
	icon?: ReactElement;
	target?: '_blank';
	type?: 'sub';
	isSubMenuOpen?: boolean;
	onClick?: () => void;
};

const MenuButton = ({
	children,
	icon,
	href,
	target,
	type,
	isSubMenuOpen,
	onClick
}: MenuButtonProps) => {
	const pathname = usePathname();
	const { isCollapsed, isHovered } = useAdminNav();

	const collapsedNotHovered = isCollapsed && !isHovered;
	const isActive = pathname === href;

	const renderMenuButtonChildren = () => (
		<>
			<span
				className={cn('mr-2 transition-all', collapsedNotHovered && 'mr-0')}
			>
				{icon || <Circle size={12} className="mx-[5px]" />}
			</span>

			<span
				className={cn(
					'flex-grow overflow-hidden text-ellipsis transition-opacity whitespace-nowrap',
					{ 'opacity-0': collapsedNotHovered }
				)}
			>
				{children}
			</span>

			{target === '_blank' && (
				<span className={cn(collapsedNotHovered && 'hidden')}>
					<SquareArrowOutUpRight size={20} />
				</span>
			)}

			{type === 'sub' && (
				<span className={cn(collapsedNotHovered && 'hidden')}>
					<ChevronRight
						size={20}
						className={cn('transition-transform', isSubMenuOpen && 'rotate-90')}
					/>
				</span>
			)}
		</>
	);

	if (href) {
		return (
			<Link
				href={href}
				target={target}
				className={cn(
					'py-2 px-3 flex items-center rounded-md',
					isActive
						? 'bg-gradient-to-br from-[#5DA5B1] to-[#5DA5B1]/70 text-white'
						: 'hover:bg-[rgba(47,43,61,0.06)] text-[#2F2B3D]/90'
				)}
			>
				{renderMenuButtonChildren()}
			</Link>
		);
	}

	return (
		<div
			role="button"
			className={cn(
				'py-2 px-3 flex items-center rounded-md text-[#2F2B3D]/90',
				isSubMenuOpen
					? 'bg-[rgba(47,43,61,0.08)]'
					: 'hover:bg-[rgba(47,43,61,0.06)]'
			)}
			onClick={onClick}
		>
			{renderMenuButtonChildren()}
		</div>
	);
};

export default MenuButton;
