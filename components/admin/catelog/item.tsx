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
	MoreVertical,
	Plus,
	TextCursorInput,
	Trash
} from 'lucide-react';
import { CSSProperties, useState } from 'react';
import { DraggableNodeType, useCatelog } from './context';
import { EditTitleForm } from './edit-title-form';
import CreateDropdown from './create-dropdown';
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
	const [isEditTitle, setIsEditTitle] = useState(false);

	const { archiveDocument, toggleCollapsibleState } = useCatelog();
	// useSWR(
	// 	item.isOpen ? getDocumentListKey(item.docId) : null,
	// 	() => getChildDocumentsAction(item.docId),
	// 	{
	// 		onSuccess(data, key, config) {
	// 			const node = findTreeNode(item.docId);

	// 			if (node) {
	// 				const newCatelogTreeNodeList = getNewCatelogTreeNodeList(data);

	// 				if (node._children.length) {
	// 					node._children = newCatelogTreeNodeList;
	// 				} else {
	// 					node.children = newCatelogTreeNodeList;
	// 				}
	// 			}

	// 			refreshCatelogTree();
	// 		}
	// 	}
	// );

	// const onClick = () => {
	// 	const node = findTreeNode(item.docId);

	// 	if (node) {
	// 		node.isOpen = !node.isOpen;

	// 		if (node.isOpen) {
	// 			node.children = node._children;
	// 		} else {
	// 			node._children = node.children;
	// 			node.children = [];
	// 		}
	// 	}

	// 	refreshCatelogTree();
	// };

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
			className="px-2 group"
		>
			<div
				className={cn(
					'h-full rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent pr-1.5',
					Boolean(dragSnapshot.combineTargetFor) && 'border-blue-600',
					(isShowMore || isShowCreate) &&
						'bg-sidebar-accent text-sidebar-accent-foreground'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				<div className="size-6 mr-1">
					{item.childUuid !== null && (
						<div
							className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center h-full w-full"
							role="button"
							onClick={() => toggleCollapsibleState(item.uuid)}
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
				{isEditTitle ? (
					<EditTitleForm
						initialTitle={item.title}
						id={item.id}
						uuid={item.uuid}
						onBlur={() => setIsEditTitle(false)}
					/>
				) : (
					<div className="flex-1 text-ellipsis line-clamp-1">{item.title}</div>
				)}

				{!isEditTitle && (
					<div
						className={cn(
							'w-14 hidden group-hover:block',
							isShowMore && 'block'
						)}
					></div>
				)}

				{!isEditTitle && (
					<div
						className={cn(
							'absolute right-3.5 opacity-0 group-hover:opacity-100',
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
											setIsEditTitle(true);
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
		// <div
		// 	{...dragProvided.draggableProps}
		// 	{...dragProvided.dragHandleProps}
		// 	ref={dragProvided.innerRef}
		// 	style={{
		// 		...style,
		// 		...dragProvided.draggableProps.style,
		// 		cursor: 'pointer'
		// 	}}
		// >
		// 	<div
		// 		className={cn(
		// 			'h-full px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',
		// 			Boolean(dragSnapshot.combineTargetFor) && 'border-border',
		// 			dragSnapshot.isDragging &&
		// 				'shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)] opacity-70'
		// 		)}
		// 		style={{ paddingLeft: 24 * item.level + 'px' }}
		// 	>
		// 		{item.title}
		// 	</div>
		// 	{true && (
		// 		<div className="absolute w-full bottom-[-5px]">
		// 			<div className="rounded-[2px] border-t-3 border-r-3 border-b-3 border-transparent border-l-4 border-l-border">
		// 				<div className="h-[1.5px] bg-border"></div>
		// 			</div>
		// 		</div>
		// 	)}
		// </div>
	);
};

export default CatelogItem;
