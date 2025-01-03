import { cn } from '@/lib/utils';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { ChevronRight } from 'lucide-react';
import { CSSProperties, useEffect } from 'react';
import { DraggableNodeType, useCatelog } from './context';

export interface CatelogItemProps {
	dragProvided: DraggableProvided;
	dragSnapshot: DraggableStateSnapshot;
	item: DraggableNodeType;
	style?: CSSProperties;
}

const CloneCatelogItem = ({
	dragProvided,
	dragSnapshot,
	item,
	style
}: CatelogItemProps) => {
	const { updateDropNodeReachLevel } = useCatelog();

	useEffect(() => {
		if (dragProvided.draggableProps.style?.transform) {
			const pattern = /translate\(([^)]+)px,/;
			const match = dragProvided.draggableProps.style?.transform.match(pattern);

			if (match && match[1]) {
				const x = Number(match[1]);

				if (!Number.isNaN(x)) {
					updateDropNodeReachLevel({ x, initialLevel: item.level });
				}
			}
		}
	}, [dragProvided.draggableProps.style?.transform]);

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
			className="px-2"
		>
			<div
				className={cn(
					'h-full rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center border-1.5 border-transparent',

					dragSnapshot.isDragging &&
						'shadow-[0_1px_4px_-2px_rgba(0,0,0,.13),0_2px_8px_0_rgba(0,0,0,.08),0_8px_16px_4px_rgba(0,0,0,.04)] opacity-70'
				)}
				style={{ paddingLeft: 24 * item.level + 'px' }}
			>
				<div className="size-6 mr-1">
					{item.childUuid !== null && (
						<div className="rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center h-full w-full">
							<ChevronRight
								className={'transition-transform duration-200'}
								size={16}
							/>
						</div>
					)}
				</div>
				{item.title}
			</div>
		</div>
	);
};

export default CloneCatelogItem;
