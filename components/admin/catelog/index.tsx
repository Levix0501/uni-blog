'use client';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
	DragDropContext,
	Draggable,
	DraggableProvided,
	DraggableRubric,
	DraggableStateSnapshot,
	DragStart,
	DragUpdate,
	Droppable,
	DroppableProvided,
	DropResult
} from '@hello-pangea/dnd';
import { Spinner } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
import { useResizeObserver } from 'usehooks-ts';
import { useCatelogStore } from '@/hooks/use-catelog-store';
import CloneCatelogItem from './clone-item';
import CreateDropdown from './create-dropdown';
import CatelogItem from './item';
import { useCatelogDataFetcher } from '@/hooks/use-catelog-data-fetcher';
import { CatelogNodeType } from '@/actions/document';
import { useDebouncedCallback } from 'use-debounce';

const Row = ({ data: items, index, style }: any) => {
	const item = items[index];
	return (
		<Draggable draggableId={item.uuid} index={index} key={item.id}>
			{(
				dragProvided: DraggableProvided,
				dragSnapshot: DraggableStateSnapshot
			) => (
				<CatelogItem
					dragProvided={dragProvided}
					dragSnapshot={dragSnapshot}
					item={item}
					style={style}
				/>
			)}
		</Draggable>
	);
};

const LoadingMask = () => {
	const { isCreating } = useCatelogStore();

	if (isCreating) {
		return (
			<div className="absolute top-0 left-0 w-full h-full bg-white/70 flex justify-center items-center z-[999]">
				<Spinner size="sm" />
			</div>
		);
	}

	return null;
};

const Catelog = () => {
	const { open, isMobile } = useSidebar();
	const ref = useRef<any>(undefined);
	const { height = 0 } = useResizeObserver({ ref });

	const {
		draggableList,
		isDraggingExpandedGroup,
		beforeDragStart,
		dragStart,
		dragUpdate,
		dragEnd,
		cache,
		updateDraggableList,
		updateCache,
		updateCatelogData
	} = useCatelogStore();

	const { data, updateCatelogData } = useCatelogDataFetcher();

	useEffect(() => {
		if (data) {
			updateCache(data);
			updateDraggableList();
		}
	}, [data]);

	const debouncedUpdateCatelogData = useDebouncedCallback(() => {
		const nodes: CatelogNodeType[] = Array.from(cache.values()).map(
			({
				id,
				childUuid,
				isArchived,
				isFolder,
				level,
				parentUuid,
				prevUuid,
				siblingUuid,
				title,
				uuid,
				slug
			}) => ({
				id,
				childUuid,
				isArchived,
				isFolder,
				level,
				parentUuid,
				prevUuid,
				siblingUuid,
				title,
				uuid,
				slug
			})
		);
		updateCatelogData(nodes);
	}, 3000);

	useEffect(() => {
		const unsubscribe = useCatelogStore.subscribe((state) => {
			state.updateCatelogData();
		});

		return () => unsubscribe();
	}, [debouncedUpdateCatelogData]);

	const onBeforeDragStart = (start: DragStart) => {
		beforeDragStart({
			dragUuid: start.draggableId
		});
	};

	const onDragStart = (start: DragStart) => {
		if (start.source.index > 0) {
			dragStart({
				dropUuid: draggableList[start.source.index - 1].uuid,
				dragUuid: start.draggableId,
				uuidAfterDragUuid:
					start.source.index < draggableList.length - 1
						? draggableList[start.source.index + 1].uuid
						: void 0
			});
		}
	};

	const onDragUpdate = (update: DragUpdate) => {
		if (
			isDraggingExpandedGroup &&
			update.destination &&
			update.destination.index !== update.source.index
		) {
			return;
		}

		if (update.combine) {
			dragUpdate({ isCombine: true, dragUuid: update.draggableId });
		} else if (update.destination && update.destination.index > 0) {
			dragUpdate({
				dropUuid:
					draggableList[
						update.destination.index <= update.source.index
							? update.destination.index - 1
							: update.destination.index
					].uuid,
				dragUuid: update.draggableId,
				uuidAfterDragUuid:
					update.destination.index < draggableList.length - 1
						? draggableList[
								update.destination.index <= update.source.index
									? update.destination.index
									: update.destination.index + 1
							].uuid
						: void 0
			});
		}
	};

	const onDragEnd = (result: DropResult) => {
		if (result.combine) {
			dragEnd({
				isCombine: true,
				dragUuid: result.draggableId,
				dropUuid: result.combine.draggableId
			});
		} else if (result.destination) {
			if (result.destination.index === 0) {
				dragEnd({
					dragUuid: result.draggableId
				});
			} else {
				dragEnd({
					dragUuid: result.draggableId,
					dropUuid:
						draggableList[
							result.destination.index <= result.source.index
								? result.destination.index - 1
								: result.destination.index
						].uuid,
					uuidAfterDragUuid:
						result.destination.index < draggableList.length - 1
							? draggableList[
									result.destination.index <= result.source.index
										? result.destination.index
										: result.destination.index + 1
								].uuid
							: void 0
				});
			}
		}
	};

	return (
		<div className="w-full h-full relative">
			<LoadingMask />

			<div className="h-full flex flex-col">
				<div className="p-2">
					<CreateDropdown
						trigger={
							<Button variant="outline" size="icon" className="size-8">
								<Plus size={16} />
							</Button>
						}
						parentUuid={null}
					/>
				</div>

				<div className={cn('flex-1', !isMobile && !open && 'hidden')}>
					<div className="w-full h-full" ref={ref}>
						<DragDropContext
							onBeforeDragStart={onBeforeDragStart}
							onDragStart={onDragStart}
							onDragUpdate={onDragUpdate}
							onDragEnd={onDragEnd}
						>
							<Droppable
								mode="virtual"
								droppableId="catelog"
								isCombineEnabled
								renderClone={(
									dragProvided: DraggableProvided,
									dragSnapshot: DraggableStateSnapshot,
									rubric: DraggableRubric
								) => (
									<CloneCatelogItem
										dragProvided={dragProvided}
										dragSnapshot={dragSnapshot}
										item={draggableList[rubric.source.index]}
									/>
								)}
							>
								{(dropProvided: DroppableProvided) => (
									<FixedSizeList
										height={height}
										itemCount={draggableList.length}
										itemSize={36}
										width={256}
										outerRef={dropProvided.innerRef}
										itemData={draggableList}
									>
										{Row}
									</FixedSizeList>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Catelog;
