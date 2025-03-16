// import { archiveDocumentAction } from '@/actions/documents';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import {
	ChevronRight,
	File,
	Folder,
	MoreVertical,
	Plus,
	TextCursorInput,
	Trash
} from 'lucide-react';
import { CSSProperties, useState } from 'react';
import { DraggableNodeType, useCatelog } from './context';
import { EditTitleForm } from './edit-title-form';
import CreateDropdown from './create-dropdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { EditTitleForm } from './edit-title-form';

export interface CatelogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: DraggableNodeType;
	style?: CSSProperties;
}

const CatelogItem = ({
	dragProvided,
	dragSnapshot,
	item,
	style
}: CatelogItemProps) => {
	const [isShowMore, setIsShowMore] = useState(false);
	const [isShowCreate, setIsShowCreate] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const router = useRouter();
	const { archiveDocument, toggleCollapsibleState } = useCatelog();

	return (
		<div
			{...dragProvided.draggableProps}
			{...dragProvided.dragHandleProps}
			ref={dragProvided.innerRef}
			style={{
				...style,
				...dragProvided.draggableProps.style,
				cursor: 'pointer'
			}}
			className="px-2 group/item"
		>
			<div
				className={cn(
					'h-full rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent pr-1.5',
					Boolean(dragSnapshot.combineTargetFor) && 'border-blue-600',
					(isShowMore || isShowCreate) &&
						'bg-sidebar-accent text-sidebar-accent-foreground'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
				onClick={() => router.push(`/admin/document/${item.slug}`)}
			>
				<div className="size-6">
					{item.childUuid !== null && (
						<div
							className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center h-full w-full"
							role="button"
							onClick={(e) => {
								e.stopPropagation();
								toggleCollapsibleState(item.uuid);
							}}
						>
							<ChevronRight
								className={cn(
									'transition-transform duration-200',
									item.isOpen && 'rotate-90'
								)}
								size={16}
							/>
						</div>
					)}
				</div>

				<div className="h-6 w-5 mr-1 flex items-center">
					{item.isFolder ? <Folder size={16} /> : <File size={16} />}
				</div>

				{isEditingTitle ? (
					<EditTitleForm
						initialTitle={item.title}
						uuid={item.uuid}
						onBlur={() => setIsEditingTitle(false)}
					/>
				) : (
					<div className="flex-1 text-ellipsis line-clamp-1">{item.title}</div>
				)}

				{!isEditingTitle && (
					<div
						className={cn(
							'w-14 hidden group-hover/item:block',
							isShowMore && 'block'
						)}
					></div>
				)}

				{!isEditingTitle && (
					<div
						className={cn(
							'absolute right-3.5 opacity-0 group-hover/item:opacity-100',
							(isShowMore || isShowCreate) && 'opacity-100'
						)}
					>
						<div className="flex items-center gap-x-2">
							<DropdownMenu open={isShowMore} onOpenChange={setIsShowMore}>
								<DropdownMenuTrigger asChild>
									<div
										role="button"
										className="size-6 rounded-md flex justify-center items-center hover:bg-neutral-300 dark:hover:bg-neutral-600"
									>
										<MoreVertical size={16} />
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem
										onClick={() => {
											setIsEditingTitle(true);
											setIsShowMore(false);
										}}
									>
										<TextCursorInput className="h-4 w-4 mr-2" />
										重命名
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => archiveDocument(item.uuid)}>
										<Trash className="h-4 w-4 mr-2" />
										删除
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<CreateDropdown
								trigger={
									<div
										role="button"
										className="size-6 rounded-md flex justify-center items-center hover:bg-neutral-300 dark:hover:bg-neutral-600"
									>
										<Plus size={16} />
									</div>
								}
								parentUuid={item.uuid}
								isOpen={isShowCreate}
								setIsOpen={setIsShowCreate}
							/>
						</div>
					</div>
				)}
			</div>

			{item.reachLevel >= 0 && (
				<div
					className="absolute bottom-[-5px]"
					style={{
						width: `calc(100% - ${24 * item.reachLevel + 24 + 9.5}px)`,
						left: `${24 * item.reachLevel + 24 + 9.5}px`
					}}
				>
					{Array.from({
						length: item.reachLevel - item.dynamicMinReachLevel
					}).map((_, i) => (
						<div
							key={i}
							className="absolute top-[3px] w-[22px] h-[1.5px] bg-blue-200 before:absolute before:top-[-1.5px] before:w-[2px] before:h-1 before:bg-blue-200"
							style={{ left: `-${24 * (i + 1)}px` }}
						></div>
					))}

					<div className="z-50 rounded-[2px] border-t-3 border-r-3 border-b-3 border-transparent border-l-4 border-l-blue-600">
						<div className="h-[1.5px] bg-blue-600 rounded-full"></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CatelogItem;
