'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialItems = [
	{ id: '1', content: 'Item 1' },
	{ id: '2', content: 'Item 2' },
	{ id: '3', content: 'Item 3' }
];

export default function DragAndDrop() {
	const [items, setItems] = useState(initialItems);

	const onDragEnd = (result: any) => {
		const { source, destination } = result;
		if (!destination) return;

		const reorderedItems = Array.from(items);
		const [removed] = reorderedItems.splice(source.index, 1);
		reorderedItems.splice(destination.index, 0, removed);
		setItems(reorderedItems);
	};

	return (
		<DragDropContext
			onDragEnd={onDragEnd}
			// enableDefaultSensors={true} // 确保触摸事件有效
		>
			<Droppable droppableId="droppable">
				{(provided) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						style={{ padding: 16, background: '#f0f0f0' }}
					>
						{items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										style={{
											padding: 16,
											margin: '0 0 8px 0',
											background: snapshot.isDragging ? '#e0e0e0' : '#fff',
											...provided.draggableProps.style
										}}
									>
										{item.content}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
