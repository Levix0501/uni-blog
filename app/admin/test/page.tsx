// 'use client';

import Catelog from '@/components/admin/catelog';

// import { cn } from '@/lib/utils';
// import {
// 	DragDropContext,
// 	Draggable,
// 	DraggableProvided,
// 	DraggableRubric,
// 	DraggableStateSnapshot,
// 	DragStart,
// 	DragUpdate,
// 	Droppable,
// 	DroppableProvided,
// 	DroppableStateSnapshot,
// 	DropResult
// } from '@hello-pangea/dnd';
// import React, { useState } from 'react';
// import { FixedSizeList } from 'react-window';

// interface Quote {
// 	id: string;
// 	content: string;
// 	level: number;
// }

// function reorder<TItem>(
// 	list: TItem[],
// 	startIndex: number,
// 	endIndex: number
// ): TItem[] {
// 	const result = [...list];
// 	const [removed] = result.splice(startIndex, 1);
// 	result.splice(endIndex, 0, removed);

// 	return result;
// }

// interface QuoteListProps {
// 	quotes: Quote[];
// }
// function InnerQuoteList({ quotes }: QuoteListProps) {
// 	return (
// 		<>
// 			{quotes.map((e, i) => (
// 				<Draggable key={e.id} draggableId={e.id} index={i}>
// 					{(
// 						dragProvided: DraggableProvided,
// 						dragSnapshot: DraggableStateSnapshot
// 					) => (
// 						<div
// 							className="h-8 px-2 relative"
// 							ref={dragProvided.innerRef}
// 							{...dragProvided.draggableProps}
// 							{...dragProvided.dragHandleProps}
// 							style={{
// 								...dragProvided.draggableProps.style,
// 								cursor: 'pointer'
// 							}}
// 						>
// 							<div
// 								className={cn(
// 									'h-full p-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',
// 									Boolean(dragSnapshot.combineTargetFor) && 'border-border'
// 								)}
// 							>
// 								{e.content}
// 							</div>
// 							<div className="absolute w-full bottom-[-5px]">
// 								<div className="w-[200px] rounded-[2px] border-t-3 border-r-3 border-b-3 border-transparent border-l-4 border-l-border">
// 									<div className="h-[1.5px] bg-border"></div>
// 								</div>
// 							</div>
// 						</div>
// 					)}
// 				</Draggable>
// 			))}
// 		</>
// 	);
// }

// const InnerQuoteListMemo = React.memo<QuoteListProps>(InnerQuoteList);

// const Page = () => {
// 	const [destinationIndex, setDestinationIndex] = useState(-1);
// 	const [quotes, setQuotes] = useState<Quote[]>([
// 		{ id: '1', content: '1', level: 0 },
// 		{ id: '2', content: '2', level: 1 },
// 		{ id: '3', content: '3', level: 2 },
// 		{ id: '4', content: '4', level: 0 },
// 		{ id: '5', content: '5', level: 1 }
// 	]);

// 	const onBeforeDragStart = (start: DragStart) => {
// 		const sourceIndex = start.source.index;
// 		let endIndex = sourceIndex + 1;
// 		for (let i = sourceIndex + 1; i < quotes.length; i++) {
// 			if (quotes[i].level > quotes[sourceIndex].level) {
// 				endIndex = i + 1;
// 			} else {
// 				endIndex = i;
// 				break;
// 			}
// 		}
// 		const newQuotes = [...quotes];
// 		newQuotes.splice(sourceIndex + 1, endIndex - sourceIndex - 1);
// 		setQuotes(newQuotes);
// 	};

// 	const onDragStart = (start: DragStart) => {
// 		// console.log(start);
// 		setDestinationIndex(start.source.index - 1);
// 		// Add a little vibration if the browser supports it.
// 		// Add's a nice little physical feedback
// 		if (window.navigator.vibrate) {
// 			window.navigator.vibrate(100);
// 		}
// 	};

// 	const onDragUpdate = (update: DragUpdate) => {
// 		// console.log(update);
// 		if (update.combine) {
// 			setDestinationIndex(-1);
// 		} else if (update.destination) {
// 			const destination = update.destination.index;
// 			const source = update.source.index;
// 			setDestinationIndex(destination > source ? destination : destination - 1);
// 		}
// 	};

// 	const onDragEnd = (result: DropResult) => {
// 		setDestinationIndex(-1);
// 		// console.log(result);
// 		// combining item
// 		if (result.combine) {
// 			const newQuotes: Quote[] = [...quotes];
// 			const [source] = newQuotes.splice(result.source.index, 1);

// 			const targetIndex = newQuotes.findIndex(
// 				(e) => e.id === result.combine?.draggableId
// 			);
// 			if (targetIndex > -1) {
// 				source.level = newQuotes[targetIndex].level + 1;
// 				newQuotes.splice(targetIndex + 1, 0, source);
// 				setQuotes(newQuotes);
// 			}
// 			// super simple: just removing the dragging item

// 			return;
// 		}

// 		// dropped outside the list
// 		if (!result.destination) {
// 			return;
// 		}

// 		if (result.destination.index === result.source.index) {
// 			return;
// 		}

// 		const newQuotes = reorder(
// 			quotes,
// 			result.source.index,
// 			result.destination.index
// 		);

// 		setQuotes(newQuotes);
// 	};

// 	return (
// 		<div className="w-64">
// 			<DragDropContext
// 				// onBeforeDragStart={onBeforeDragStart}
// 				onDragStart={onDragStart}
// 				onDragEnd={onDragEnd}
// 				onDragUpdate={onDragUpdate}
// 			>
// 				<Droppable
// 					mode="virtual"
// 					droppableId="demo"
// 					isCombineEnabled
// 					renderClone={(
// 						dragProvided: DraggableProvided,
// 						dragSnapshot: DraggableStateSnapshot,
// 						rubric: DraggableRubric
// 					) => (
// 						<div
// 							className={'h-9 px-2 relative'}
// 							ref={dragProvided.innerRef}
// 							{...dragProvided.draggableProps}
// 							{...dragProvided.dragHandleProps}
// 							style={{
// 								...dragProvided.draggableProps.style,
// 								cursor: 'pointer'
// 							}}
// 						>
// 							<div
// 								className={cn(
// 									'h-full px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',
// 									Boolean(dragSnapshot.combineTargetFor) && 'border-border',
// 									dragSnapshot.isDragging &&
// 										'shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)] opacity-70'
// 								)}
// 							>
// 								{quotes[rubric.source.index].content}
// 							</div>
// 						</div>
// 					)}
// 				>
// 					{(
// 						dropProvided: DroppableProvided,
// 						dropSnapshot: DroppableStateSnapshot
// 					) => (
// 						<FixedSizeList
// 							height={3600}
// 							itemCount={quotes.length}
// 							itemSize={36}
// 							width={300}
// 							// you will want to use List.outerRef rather than List.innerRef as it has the correct height when the list is unpopulated
// 							outerRef={dropProvided.innerRef}
// 							itemData={quotes}
// 						>
// 							{({ data: quotes, index, style }) => (
// 								<Draggable
// 									draggableId={quotes[index].id}
// 									index={index}
// 									key={quotes[index].id}
// 								>
// 									{(
// 										dragProvided: DraggableProvided,
// 										dragSnapshot: DraggableStateSnapshot
// 									) => (
// 										<div
// 											className={'h-9 px-2 relative'}
// 											ref={dragProvided.innerRef}
// 											{...dragProvided.draggableProps}
// 											{...dragProvided.dragHandleProps}
// 											style={{
// 												...dragProvided.draggableProps.style,
// 												cursor: 'pointer'
// 											}}
// 										>
// 											<div
// 												className={cn(
// 													'h-full px-2 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',
// 													Boolean(dragSnapshot.combineTargetFor) &&
// 														'border-border',
// 													dragSnapshot.isDragging &&
// 														'shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)] opacity-70'
// 												)}
// 												style={{ paddingLeft: 24 * quotes[index].level + 'px' }}
// 											>
// 												{quotes[index].content}
// 											</div>
// 											{destinationIndex === index && (
// 												<div className="absolute w-full bottom-[-5px]">
// 													<div className="rounded-[2px] border-t-3 border-r-3 border-b-3 border-transparent border-l-4 border-l-border">
// 														<div className="h-[1.5px] bg-border"></div>
// 													</div>
// 												</div>
// 											)}
// 										</div>
// 									)}
// 								</Draggable>
// 							)}
// 						</FixedSizeList>
// 					)}
// 				</Droppable>
// 			</DragDropContext>
// 		</div>
// 	);
// };

// export default Page;

const Page = () => {
	return (
		<div className="p-4">
			<Catelog />
		</div>
	);
};

export default Page;
