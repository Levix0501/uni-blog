'use client';

import { Boxes, ImageIcon, Megaphone, Pen, Plus, Settings } from 'lucide-react';
import * as React from 'react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarRail
} from '@/components/ui/sidebar';
import { NavCollapsible } from './nav-collapsible';
import { NavUser } from './nav-user';
import AddDocDropdownMenu from '../catelog/create-dropdown';
import { Button } from '@/components/ui/button';
import DocumentList, { getDocumentListKey } from '../document-list';
import useSWR from 'swr';
import { getChildDocumentsAction } from '@/actions/documents';
import Catelog from '../catelog';

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
		<Sidebar collapsible="icon" {...props} className="bg-background">
			<SidebarHeader>
				<NavUser />
			</SidebarHeader>
			<SidebarContent>
				<Catelog />
			</SidebarContent>
			<SidebarFooter></SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
