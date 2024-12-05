'use client';

import { Boxes, ImageIcon, Megaphone, Pen, Settings } from 'lucide-react';
import * as React from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail
} from '@/components/ui/sidebar';
import { NavCollapsible } from './nav-collapsible';
import { NavUser } from './nav-user';

const data = {
	navMain: [
		{
			title: '文章',
			url: '/admin/post',
			icon: Pen
		},
		{
			title: '分类',
			url: '/admin/category',
			icon: Boxes
		},
		{
			title: '图片',
			url: '/admin/image',
			icon: ImageIcon
		}
	],
	navSettings: [
		{
			title: '公告设置',
			url: '/admin/side-notice',
			icon: Megaphone
		},
		{
			title: '系统设置',
			url: '/admin/settings',
			icon: Settings
		}
	]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavUser />
			</SidebarHeader>
			<SidebarContent>
				<NavCollapsible label="内容" items={data.navMain} />
				<NavCollapsible label="设置" items={data.navSettings} />
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}