import { CatelogNodeType } from '@/actions/document';
import {
	recursiveUpdateLevel,
	removeNode
} from '@/components/admin/catelog/utils';
import { DocumentModel } from '@prisma/client';
import { create } from 'zustand';
import { debounce } from 'radash';

export interface DraggableNodeType extends CatelogNodeType {
	isOpen: boolean;
	reachLevel: number;
	minReachLevel: number;
	maxReachLevel: number;
	isOpenOnBeforeDragStart?: boolean;
	dynamicMinReachLevel: number;
	dynamicMaxReachLevel: number;
}

interface CatelogStore {
	// 状态
	isCreating: boolean;
	draggableList: DraggableNodeType[];
	isDraggingExpandedGroup: boolean;
	cache: Map<string, DraggableNodeType>;
	currentDropNode?: DraggableNodeType;

	setIsCreating: (isCreating: boolean) => void;
	setDraggableList: (list: DraggableNodeType[]) => void;
	setIsDraggingExpandedGroup: (isDragging: boolean) => void;
	updateCache: (data: CatelogNodeType[]) => void;
	setCurrentDropNode: (node?: DraggableNodeType) => void;

	updateCatelogData: () => void;
	setUpdateCatelogData: (updateCatelogData: () => void) => void;

	toggleCollapsibleState: (uuid: DocumentModel['uuid']) => void;
	beforeDragStart: (params: { dragUuid: DocumentModel['uuid'] }) => void;
	dragStart: (params: {
		dropUuid?: DocumentModel['uuid'];
		dragUuid: DocumentModel['uuid'];
		uuidAfterDragUuid?: DocumentModel['uuid'];
	}) => void;
	dragUpdate: (params: {
		dropUuid?: DocumentModel['uuid'];
		dragUuid: DocumentModel['uuid'];
		uuidAfterDragUuid?: DocumentModel['uuid'];
		isCombine?: boolean;
	}) => void;
	dragEnd: (params: {
		dropUuid?: DocumentModel['uuid'];
		dragUuid: DocumentModel['uuid'];
		uuidAfterDragUuid?: DocumentModel['uuid'];
		isCombine?: boolean;
	}) => void;
	updateDropNodeReachLevel: (params: {
		x: number;
		initialLevel: number;
	}) => void;
	moveAfter: (params: {
		prevUuid: DocumentModel['uuid'];
		uuid: DocumentModel['uuid'];
	}) => void;
	appendChild: (params: {
		parentUuid: DocumentModel['parentUuid'];
		uuid: DocumentModel['uuid'];
	}) => void;

	findStartNode: () => DraggableNodeType | undefined;
	updateDraggableList: () => void;
}

export const useCatelogStore = create<CatelogStore>((set, get) => ({
	isCreating: false,
	draggableList: [],
	isDraggingExpandedGroup: false,
	cache: new Map(),
	currentDropNode: undefined,

	setIsCreating: (isCreating) => set({ isCreating }),
	setDraggableList: (list) => set({ draggableList: list }),
	setIsDraggingExpandedGroup: (isDragging) =>
		set({ isDraggingExpandedGroup: isDragging }),
	setCurrentDropNode: (node) => set({ currentDropNode: node }),
	setUpdateCatelogData: (updateCatelogData) => set({ updateCatelogData }),

	updateCatelogData: () => {},
	updateCache: (data) => {
		const cache = get().cache;
		const uuidSet = new Set<string>();

		for (const item of data.sort((a, b) => a.level - b.level)) {
			uuidSet.add(item.uuid);
			const node = cache.get(item.uuid);

			const minReachLevel = item.parentUuid
				? cache.get(item.parentUuid)!.minReachLevel
				: item.level;
			const maxReachLevel = item.childUuid ? item.level + 1 : item.level;

			if (node) {
				cache.set(item.uuid, {
					...node,
					...item,
					minReachLevel,
					maxReachLevel
				});
			} else {
				cache.set(item.uuid, {
					...item,
					isOpen: false,
					reachLevel: -1,
					dynamicMinReachLevel: -1,
					dynamicMaxReachLevel: -1,
					minReachLevel,
					maxReachLevel
				});
			}
		}

		cache.forEach((_, key) => {
			if (!uuidSet.has(key)) {
				cache.delete(key);
			}
		});

		set({ cache: new Map(cache) });
	},

	toggleCollapsibleState: (uuid) => {
		const { cache, updateDraggableList } = get();
		const node = cache.get(uuid);
		if (node) {
			node.isOpen = !node.isOpen;
			set({ cache: new Map(cache) });
			updateDraggableList();
		}
	},

	beforeDragStart: ({ dragUuid }) => {
		const { cache } = get();
		const dragNode = cache.get(dragUuid);
		set({
			isDraggingExpandedGroup: Boolean(dragNode?.childUuid && dragNode?.isOpen)
		});

		if (dragNode) {
			dragNode.isOpenOnBeforeDragStart = dragNode.isOpen;
			dragNode.isOpen = false;
			set({ cache: new Map(cache) });
		}
	},

	dragStart: ({ dropUuid, dragUuid, uuidAfterDragUuid }) => {
		const { cache } = get();
		const dragNode = cache.get(dragUuid);
		if (!dragNode || !dropUuid) return;

		const dropNode = cache.get(dropUuid);
		if (!dropNode) return;

		set({ currentDropNode: dropNode });
		dropNode.reachLevel = dragNode.level;
		dropNode.dynamicMinReachLevel = dropNode.minReachLevel;
		dropNode.dynamicMaxReachLevel =
			!dropNode.childUuid || dropNode.isOpen
				? dropNode.maxReachLevel
				: dropNode.maxReachLevel - 1;

		if (uuidAfterDragUuid) {
			const nodeAfterDragNode = cache.get(uuidAfterDragUuid);
			if (nodeAfterDragNode) {
				dropNode.dynamicMinReachLevel = Math.max(
					dropNode.dynamicMinReachLevel,
					nodeAfterDragNode.level
				);
				dropNode.reachLevel = Math.min(
					dropNode.reachLevel,
					dropNode.dynamicMaxReachLevel
				);
				dropNode.reachLevel = Math.max(
					dropNode.reachLevel,
					dropNode.dynamicMinReachLevel
				);
			}
		}

		set({ cache: new Map(cache) });
	},

	dragUpdate: (params) => {
		const { cache } = get();
		cache.forEach((e) => {
			e.reachLevel = -1;
		});
		set({ cache: new Map(cache) });

		if (params.isCombine) {
			return;
		}
		get().dragStart(params);
	},

	moveAfter: ({ prevUuid, uuid }) => {
		const { cache } = get();
		const node = cache.get(uuid);
		const prevNode = cache.get(prevUuid);

		if (!node || !prevNode || prevNode.siblingUuid === uuid) return;

		removeNode({ uuid, cache });

		const siblingNode = prevNode.siblingUuid
			? cache.get(prevNode.siblingUuid)
			: undefined;

		if (siblingNode) {
			siblingNode.prevUuid = uuid;
		}

		node.siblingUuid = prevNode.siblingUuid;
		prevNode.siblingUuid = uuid;
		node.prevUuid = prevUuid;
		node.parentUuid = prevNode.parentUuid;
		node.level = prevNode.level;
		node.minReachLevel = prevNode.minReachLevel;
		node.maxReachLevel = node.childUuid ? node.level + 1 : node.level;

		recursiveUpdateLevel(node.childUuid, node.level, node.minReachLevel, cache);

		set({ cache: new Map(cache) });
	},

	dragEnd: ({ dragUuid, dropUuid, isCombine, uuidAfterDragUuid }) => {
		const { cache } = get();
		const node = cache.get(dragUuid);
		if (node) {
			node.isOpen = node.isOpenOnBeforeDragStart || false;
		}

		if (isCombine) {
			if (dropUuid) {
				get().appendChild({
					uuid: dragUuid,
					parentUuid: dropUuid
				});
			}
		} else {
			if (dropUuid) {
				const dropNode = cache.get(dropUuid);
				if (dropNode) {
					if (dropNode.reachLevel === dropNode.level) {
						get().moveAfter({ prevUuid: dropNode.uuid, uuid: dragUuid });
					} else if (dropNode.reachLevel > dropNode.level) {
						get().appendChild({
							uuid: dragUuid,
							parentUuid: dropUuid
						});
					} else {
						let targetNode: DraggableNodeType | undefined = dropNode;
						while (
							targetNode?.parentUuid &&
							dropNode.reachLevel < targetNode.level
						) {
							const parentUuid = targetNode.parentUuid;
							const parentNode = cache.get(parentUuid);
							targetNode = parentNode;
						}

						if (targetNode && targetNode.level === dropNode.reachLevel) {
							// moveAfter
							get().moveAfter({ prevUuid: targetNode.uuid, uuid: dragUuid });
						}
					}
					dropNode.reachLevel = -1;
				}
			} else {
				get().appendChild({
					uuid: dragUuid,
					parentUuid: null
				});
			}
		}

		if (node?.parentUuid) {
			const parentNode = cache.get(node.parentUuid);
			if (parentNode) {
				parentNode.maxReachLevel = parentNode.childUuid
					? parentNode.level + 1
					: parentNode.level;
			}
		}

		set({ cache: new Map(cache), currentDropNode: undefined });
	},

	updateDropNodeReachLevel: ({ x, initialLevel }) => {
		const { currentDropNode, cache } = get();
		if (currentDropNode && x !== 0) {
			let reachLevel = Math.ceil(x / 12) + initialLevel;
			reachLevel = Math.max(reachLevel, currentDropNode.dynamicMinReachLevel);
			reachLevel = Math.min(reachLevel, currentDropNode.dynamicMaxReachLevel);

			if (
				currentDropNode.reachLevel !== -1 &&
				currentDropNode.reachLevel !== reachLevel
			) {
				currentDropNode.reachLevel = reachLevel;
				set({ cache: new Map(cache) });
			}
		}
	},

	appendChild: ({ parentUuid, uuid }) => {
		const { cache } = get();
		const node = removeNode({ uuid, cache });
		if (!node) return;

		let prevNode: DraggableNodeType | undefined;
		cache.forEach((e) => {
			if (e.parentUuid === parentUuid && !e.siblingUuid && e.uuid !== uuid) {
				prevNode = e;
			}
		});

		let parentNode: DraggableNodeType | undefined;
		if (parentUuid) {
			parentNode = cache.get(parentUuid);
			if (parentNode) {
				parentNode.isOpen = true;
			}
		}

		if (prevNode) {
			prevNode.siblingUuid = uuid;
			node.prevUuid = prevNode.uuid;
			node.parentUuid = prevNode.parentUuid;
			node.level = prevNode.level;
			node.minReachLevel = prevNode.minReachLevel;
		} else if (parentNode) {
			parentNode.childUuid = uuid;
			parentNode.isOpen = true;
			node.prevUuid = parentNode.uuid;
			node.parentUuid = parentNode.uuid;
			node.level = parentNode.level + 1;
			node.minReachLevel = parentNode.minReachLevel;
		}

		node.maxReachLevel = node.childUuid ? node.level + 1 : node.level;
		recursiveUpdateLevel(node.childUuid, node.level, node.minReachLevel, cache);

		set({ cache: new Map(cache) });
	},

	findStartNode: () => {
		const { cache } = get();
		let startNode: DraggableNodeType | undefined;
		cache.forEach((node) => {
			if (!node.parentUuid && !node.prevUuid && !node.isArchived) {
				startNode = node;
				return;
			}
		});
		return startNode;
	},

	updateDraggableList: () => {
		const { cache, findStartNode, setDraggableList } = get();
		const currentNode = findStartNode();
		const newDraggableList: DraggableNodeType[] = [];

		const recursiveTraverse = (node: DraggableNodeType | undefined) => {
			if (!node) return;
			newDraggableList.push(node);
			if (node.isOpen && node.childUuid) {
				recursiveTraverse(cache.get(node.childUuid));
			}
			if (node.siblingUuid) {
				recursiveTraverse(cache.get(node.siblingUuid));
			}
		};

		recursiveTraverse(currentNode);
		setDraggableList(newDraggableList);
	}
}));
