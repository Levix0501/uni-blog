'use client';

import { Binary, ChevronsUpDown, Home, LogOut, Settings } from 'lucide-react';

import { logOutAction } from '@/actions/auth';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar';
import { useSettings } from '@/hooks/use-settings';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

export function NavUser() {
	const { siteSetting } = useSettings();
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg">
								{siteSetting?.logo?.nextImageUrl ? (
									<Image
										src={siteSetting?.logo?.nextImageUrl}
										alt="Logo"
										width={32}
										height={32}
										className="object-contain"
									/>
								) : (
									<Binary />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{siteSetting?.siteName || 'UniBlog'}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<Link href="/" target="_blank">
								<DropdownMenuItem>
									<Home />
									主站
								</DropdownMenuItem>
							</Link>

							<Link href="/" target="_blank">
								<DropdownMenuItem>
									<Settings />
									设置
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<div className="flex items-center gap-2">
							<DropdownMenuItem
								className="flex-1"
								onClick={async () => {
									await logOutAction();
								}}
							>
								<LogOut />
								Log out
							</DropdownMenuItem>

							<ModeToggle />
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
