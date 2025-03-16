import {
	archiveDocumentAction,
	getChildDocumentsAction
} from '@/actions/document';
import { cn } from '@/lib/utils';
import { DocumentModel } from '@prisma/client';
import {
	ChevronRight,
	File,
	Folder,
	MoreHorizontal,
	Plus,
	Trash
} from 'lucide-react';
import { useBoolean } from 'react-use';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import AddDocDropdownMenu from './catelog/create-dropdown';
import DocumentList, { getDocumentListKey } from './document-list';

interface ItemProps {
	id: DocumentModel['id'];
	parentDocumentId: DocumentModel['parentDocumentId'];
	grandparentDocumentId: DocumentModel['parentDocumentId'];
	label: string;
	isFolder?: boolean;
	childDocumentNum: number;
}

const Item = ({
	id,
	label,
	parentDocumentId,
	grandparentDocumentId,
	isFolder,
	childDocumentNum
}: ItemProps) => {
	const [isOpen, setIsOpen] = useBoolean(false);
	const { mutate } = useSWRConfig();

	const onArchive = (event: React.MouseEvent) => {
		event.stopPropagation();
		const promise = archiveDocumentAction(id).then(() => {
			mutate(
				getDocumentListKey(parentDocumentId),
				getChildDocumentsAction(parentDocumentId),
				{
					optimisticData: (
						documents?: Awaited<ReturnType<typeof getChildDocumentsAction>>
					) => {
						if (!documents) return [];

						const index = documents.findIndex((e) => e.id === id);
						if (index >= 0) {
							documents.splice(index, 1);
						}

						return [...documents];
					}
				}
			);
			parentDocumentId &&
				mutate(
					getDocumentListKey(grandparentDocumentId),
					getChildDocumentsAction(grandparentDocumentId),
					{
						optimisticData: (
							documents?: Awaited<ReturnType<typeof getChildDocumentsAction>>
						) => {
							if (!documents) return [];

							const index = documents.findIndex(
								(e) => e.id === parentDocumentId
							);
							if (index >= 0) {
								documents[index] = {
									...documents[index],
									childDocumentNum: documents[index].childDocumentNum - 1
								};
							}

							return [...documents];
						}
					}
				);
		});
		toast.promise(promise, {
			loading: '删除中...',
			success: '删除成功！',
			error: '删除失败！'
		});
	};

	const handleExpand = (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsOpen(!isOpen);
	};

	return (
		<SidebarMenuItem
			onClick={isFolder && childDocumentNum > 0 ? handleExpand : void 0}
		>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<SidebarMenuButton className="group/item">
					{childDocumentNum > 0 && (
						<div
							className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
							onClick={handleExpand}
						>
							<ChevronRight
								className={cn(
									'transition-transform duration-200',
									isOpen && 'rotate-90'
								)}
								size={16}
							/>
						</div>
					)}
					{isFolder ? <Folder /> : <File />}
					<div className="overflow-hidden text-ellipsis flex-1 text-nowrap">
						{label}
					</div>

					<div className="ml-auto flex items-center gap-x-1">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div
									role="button"
									className="md:opacity-0 group-hover/item:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
								>
									<MoreHorizontal size={16} />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent onClick={onArchive}>
								<DropdownMenuItem>
									<Trash className="h-4 w-4 mr-2" />
									删除
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<AddDocDropdownMenu
							trigger={
								<div
									role="button"
									className="md:opacity-0 group-hover/item:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
								>
									<Plus size={16} />
								</div>
							}
							id={id}
							parentDocumentId={parentDocumentId}
							afterCreate={() => setIsOpen(true)}
						/>
					</div>
				</SidebarMenuButton>

				<CollapsibleContent>
					<DocumentList
						parentDocumentId={id}
						grandparentDocumentId={parentDocumentId}
					/>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
};

export default Item;
