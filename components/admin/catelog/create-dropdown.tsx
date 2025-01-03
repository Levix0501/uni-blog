'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DocumentModel } from '@prisma/client';
import { File, Folder } from 'lucide-react';
import React, { ReactNode } from 'react';
import { useCatelog } from './context';

export interface CreateDropdownProps {
	trigger: ReactNode;
	parentUuid: DocumentModel['parentUuid'];
	isOpen?: boolean;
	setIsOpen?: (val: boolean) => void;
}

const CreateDropdown = ({
	trigger,
	parentUuid = null,
	isOpen,
	setIsOpen
}: CreateDropdownProps) => {
	const { createDocument } = useCatelog();

	const onCreateFile = (event: React.MouseEvent) => {
		event.stopPropagation();
		createDocument({ parentUuid });
	};

	const onCreateFolder = (event: React.MouseEvent) => {
		event.stopPropagation();
		createDocument({ parentUuid, isFolder: true });
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem role="button" onClick={onCreateFile}>
						<File />
						<span>文档</span>
					</DropdownMenuItem>
					<DropdownMenuItem role="button" onClick={onCreateFolder}>
						<Folder />
						<span>分组</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default CreateDropdown;
