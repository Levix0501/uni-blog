'use client';

import {
	CatelogNodeType,
	createDocumentAction,
	getAllCatelogNodesAction,
	updateAllCatelogNodesAction
} from '@/actions/documents';
import { DocumentModel } from '@prisma/client';
import {
	createContext,
	MutableRefObject,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { recursiveUpdateLevel, removeNode } from './utils';

export interface DraggableNodeType extends CatelogNodeType {
	isOpen: boolean;
	reachLevel: number;
	minReachLevel: number;
	maxReachLevel: number;
	isOpenOnBeforeDragStart?: boolean;
	dynamicMinReachLevel: number;
	dynamicMaxReachLevel: number;
}

export type CatelogContextProps = {
	isCreating: boolean;
	draggableList: DraggableNodeType[];
	isDraggingExpandedGroup: MutableRefObject<boolean>;
	createDocument: (params: {
		parentUuid: DocumentModel['parentUuid'];
		isFolder?: boolean;
	}) => void;
	archiveDocument: (uuid: DocumentModel['uuid']) => void;
	updateDocumentTitle: (params: {
		uuid: DocumentModel['uuid'];
		title: DocumentModel['title'];
	}) => void;
	toggleCollapsibleState: (uuid: DocumentModel['uuid']) => void;
	appendChild: (params: {
		parentUuid: DocumentModel['parentUuid'];
		uuid: DocumentModel['uuid'];
	}) => void;
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
};

type CateglogProviderProps = {
	children: ReactNode;
};

export const CatelogContext = createContext<CatelogContextProps | null>(null);

export const CatelogProvider = ({ children }: CateglogProviderProps) => {
	const cache = useRef(new Map<DocumentModel['uuid'], DraggableNodeType>());
	const { data, mutate } = useSWR('getAllDocumentsAction', () =>
		getAllCatelogNodesAction()
	);
	const [draggableList, setDraggableList] = useState<DraggableNodeType[]>([]);
	const currentDropNode = useRef<DraggableNodeType>();
	const [isCreating, setIsCreating] = useState(false);
	const isDraggingExpandedGroup = useRef(false);

	const updateCache = useCallback((data: CatelogNodeType[]) => {
		const set = new Set<DocumentModel['uuid']>();

		for (const item of data.sort((a, b) => a.level - b.level)) {
			set.add(item.uuid);

			const node = cache.current.get(item.uuid);

			const minReachLevel = item.parentUuid
				? cache.current.get(item.parentUuid)!.minReachLevel
				: item.level;
			const maxReachLevel = item.childUuid ? item.level + 1 : item.level;

			if (node) {
				cache.current.set(item.uuid, {
					...node,
					minReachLevel,
					maxReachLevel
				});
			} else {
				cache.current.set(item.uuid, {
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

		cache.current.forEach((node, key) => {
			if (!set.has(key)) {
				cache.current.delete(key);
			}
		});
	}, []);

	const findStartNode = useCallback(() => {
		let startNode: DraggableNodeType | undefined;

		cache.current.forEach((node, key) => {
			if (!node.parentUuid && !node.prevUuid && !node.isArchived) {
				startNode = node;
				return;
			}
		});

		return startNode;
	}, []);

	const updateDraggableList = useCallback(() => {
		let currentNode = findStartNode();
		const newDraggableList: DraggableNodeType[] = [];

		const recursiveTraverse = (node: DraggableNodeType | undefined) => {
			if (!node) return;

			newDraggableList.push(node);

			if (node.isOpen && node.childUuid) {
				recursiveTraverse(cache.current.get(node.childUuid));
			}

			if (node.siblingUuid) {
				recursiveTraverse(cache.current.get(node.siblingUuid));
			}
		};

		recursiveTraverse(currentNode);
		setDraggableList(newDraggableList);
	}, [findStartNode]);

	useEffect(() => {
		if (!data) return;

		updateCache(data);
		updateDraggableList();
	}, [data, updateCache, updateDraggableList]);

	const updateAllCatelogNodes = useDebouncedCallback(() => {
		console.log('hahaha');
		const trigger = async () => {
			const result = await updateAllCatelogNodesAction(
				Array.from(
					cache.current
						.values()
						.map(
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
								uuid
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
								uuid
							})
						)
				)
			);

			return result || Array.from(cache.current.values());
		};

		mutate(trigger(), {
			revalidate: false
		});
	}, 3000);

	const createDocument: CatelogContextProps['createDocument'] = useCallback(
		({ parentUuid, isFolder }) => {
			const promise = mutate(
				(async () => {
					setIsCreating(true);
					const result = await createDocumentAction({
						title: '未命名' + (isFolder ? '分组' : '文档'),
						parentUuid,
						isFolder
					});
					setIsCreating(false);

					return result;
				})(),
				{
					revalidate: false,
					optimisticData(currentData, displayedData) {
						if (parentUuid) {
							const node = cache.current.get(parentUuid);

							if (node) {
								node.isOpen = true;
							}
						}

						return currentData || [];
					}
				}
			);

			toast.promise(promise, {
				loading: '创建中...',
				success: '创建成功！',
				error: '创建失败！'
			});
		},
		[mutate]
	);

	const archiveDocument: CatelogContextProps['archiveDocument'] = useCallback(
		(uuid) => {
			const currentNode = removeNode({ uuid, cache: cache.current });

			if (!currentNode) return;

			currentNode.isArchived = true;
			let currentUuid = currentNode.childUuid;

			const recursiveArchive = (
				uuid: DocumentModel['uuid'] | null | undefined
			) => {
				if (!uuid) return;

				const node = cache.current.get(uuid);

				if (node) {
					node.isArchived = true;
				}

				recursiveArchive(node?.childUuid);
				recursiveArchive(node?.siblingUuid);
			};
			recursiveArchive(currentUuid);

			updateDraggableList();
			updateAllCatelogNodes();
			// mutate(archiveDocumentAction(uuid), {
			// 	optimisticData: (currentData) => {
			// 		const currentNode = removeNode({ uuid, cache: cache.current });

			// 		if (!currentNode) {
			// 			return currentData || [];
			// 		}

			// 		cache.current.delete(currentNode.uuid);

			// 		let currentUuid = currentNode.childUuid;

			// 		const recursiveArchive = (
			// 			uuid: DocumentModel['uuid'] | null | undefined
			// 		) => {
			// 			if (!uuid) return;

			// 			const node = cache.current.get(uuid);
			// 			cache.current.delete(uuid);
			// 			recursiveArchive(node?.childUuid);
			// 			recursiveArchive(node?.siblingUuid);
			// 		};
			// 		recursiveArchive(currentUuid);

			// 		return Array.from(cache.current.values()) as CatelogNodeType[];
			// 	}
			// });
		},
		[updateAllCatelogNodes, updateDraggableList]
	);

	const updateDocumentTitle: CatelogContextProps['updateDocumentTitle'] =
		useCallback(
			({ title, uuid }) => {
				const currentNode = cache.current.get(uuid);

				if (currentNode) {
					currentNode.title = title;
				}

				updateAllCatelogNodes();
			},
			[updateAllCatelogNodes]
		);

	const toggleCollapsibleState: CatelogContextProps['toggleCollapsibleState'] =
		useCallback(
			(uuid) => {
				const node = cache.current.get(uuid);

				if (node) {
					node.isOpen = !node.isOpen;
				}

				updateDraggableList();
			},
			[updateDraggableList]
		);

	const appendChild: CatelogContextProps['appendChild'] = useCallback(
		({ uuid, parentUuid }) => {
			const node = removeNode({ uuid, cache: cache.current });

			if (!node) return;

			let prevNode: DraggableNodeType | undefined;

			cache.current.values().forEach((e) => {
				if (e.parentUuid === parentUuid && !e.siblingUuid && e.uuid !== uuid) {
					prevNode = e;
				}
			});

			let parentNode: DraggableNodeType | undefined;

			if (parentUuid) {
				parentNode = cache.current.get(parentUuid);

				if (parentNode) {
					parentNode.isOpen = true;
				}
			}

			if (prevNode) {
				prevNode.siblingUuid = uuid;
				node.prevUuid = prevNode.uuid;
				node.parentUuid = prevNode.parentUuid;
				node.level = prevNode.level;
			} else if (parentNode) {
				parentNode.childUuid = uuid;
				parentNode.isOpen = true;
				node.prevUuid = parentNode.uuid;
				node.parentUuid = parentNode.uuid;
				node.level = parentNode.level + 1;
			}

			recursiveUpdateLevel(node.childUuid, node.level, cache.current);

			updateAllCatelogNodes();
		},
		[updateAllCatelogNodes]
	);

	const prependChild = useCallback(
		({
			parentUuid,
			uuid
		}: {
			parentUuid: DocumentModel['parentUuid'];
			uuid: DocumentModel['uuid'];
		}) => {
			const node = cache.current.get(uuid);

			if (!node) return;

			removeNode({ uuid, cache: cache.current });

			let firstChildNode: DraggableNodeType | undefined;

			cache.current.values().forEach((e) => {
				if (
					e.parentUuid === parentUuid &&
					e.prevUuid === parentUuid &&
					e.uuid !== uuid
				) {
					firstChildNode = e;
				}
			});

			if (firstChildNode) {
				firstChildNode.prevUuid = node.uuid;
			}

			let parentNode: DraggableNodeType | undefined;

			if (parentUuid) {
				parentNode = cache.current.get(parentUuid);

				if (parentNode) {
					parentNode.childUuid = node.uuid;
				}
			}

			const level = parentNode ? parentNode.level + 1 : 0;

			node.prevUuid = parentUuid;
			node.parentUuid = parentUuid;
			node.siblingUuid = firstChildNode?.uuid || null;
			node.level = level;

			recursiveUpdateLevel(node.childUuid, node.level, cache.current);
			updateDraggableList();
			updateAllCatelogNodes();
		},
		[updateAllCatelogNodes, updateDraggableList]
	);

	const moveAfter = useCallback(
		({
			uuid,
			prevUuid
		}: {
			prevUuid: DocumentModel['uuid'];
			uuid: DocumentModel['uuid'];
		}) => {
			const node = cache.current.get(uuid);
			const prevNode = cache.current.get(prevUuid);

			if (!node || !prevNode || prevNode.siblingUuid === uuid) return;

			removeNode({ uuid, cache: cache.current });

			const siblingNode = prevNode.siblingUuid
				? cache.current.get(prevNode.siblingUuid)
				: void 0;

			if (siblingNode) {
				siblingNode.prevUuid = uuid;
			}

			node.siblingUuid = prevNode.siblingUuid;
			prevNode.siblingUuid = uuid;
			node.prevUuid = prevUuid;
			node.parentUuid = prevNode.parentUuid;
			node.level = prevNode.level;

			recursiveUpdateLevel(node.childUuid, node.level, cache.current);
			updateDraggableList();
			updateAllCatelogNodes();
		},
		[updateAllCatelogNodes, updateDraggableList]
	);

	const beforeDragStart: CatelogContextProps['beforeDragStart'] = useCallback(
		({ dragUuid }) => {
			const dragNode = cache.current.get(dragUuid);
			isDraggingExpandedGroup.current = Boolean(
				dragNode?.childUuid && dragNode?.isOpen
			);

			if (dragNode) {
				dragNode.isOpenOnBeforeDragStart = dragNode.isOpen;
				dragNode.isOpen = false;
				updateDraggableList();
			}
		},
		[updateDraggableList]
	);

	const dragStart: CatelogContextProps['dragStart'] = useCallback(
		({ dropUuid, dragUuid, uuidAfterDragUuid }) => {
			const dragNode = cache.current.get(dragUuid);

			if (!dragNode || !dropUuid) return;

			const dropNode = cache.current.get(dropUuid);
			currentDropNode.current = dropNode;

			if (!dropNode) return;

			dropNode.reachLevel = dragNode.level;
			dropNode.dynamicMinReachLevel = dropNode.minReachLevel;
			dropNode.dynamicMaxReachLevel =
				!dropNode.childUuid || dropNode.isOpen
					? dropNode.maxReachLevel
					: dropNode.maxReachLevel - 1;

			if (uuidAfterDragUuid) {
				const nodeAfterDragNode = cache.current.get(uuidAfterDragUuid);

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

				updateDraggableList();
			}
		},
		[updateDraggableList]
	);

	const dragUpdate: CatelogContextProps['dragUpdate'] = useCallback(
		(params) => {
			cache.current.values().forEach((e) => {
				e.reachLevel = -1;
			});

			if (params.isCombine) {
				updateDraggableList();
			} else {
				dragStart(params);
			}
		},
		[dragStart, updateDraggableList]
	);

	const dragEnd: CatelogContextProps['dragEnd'] = useCallback(
		({ dragUuid, dropUuid, isCombine, uuidAfterDragUuid }) => {
			const node = cache.current.get(dragUuid);

			if (node) {
				node.isOpen = node.isOpenOnBeforeDragStart || false;
			}

			if (isCombine) {
				if (dropUuid) {
					appendChild({
						uuid: dragUuid,
						parentUuid: dropUuid
					});
				}
			} else {
				if (dropUuid) {
					const dropNode = cache.current.get(dropUuid);

					if (dropNode) {
						if (dropNode.reachLevel === dropNode.level) {
							moveAfter({ prevUuid: dropNode.uuid, uuid: dragUuid });
						} else if (dropNode.reachLevel > dropNode.level) {
							prependChild({ uuid: dragUuid, parentUuid: dropUuid });
						} else {
							let targetNode: DraggableNodeType | undefined = dropNode;

							while (
								targetNode?.parentUuid &&
								dropNode.reachLevel < targetNode.level
							) {
								const parentUuid = targetNode.parentUuid;
								const parentNode = cache.current.get(parentUuid);
								targetNode = parentNode;
							}

							if (targetNode && targetNode.level === dropNode.reachLevel) {
								moveAfter({ uuid: dragUuid, prevUuid: targetNode.uuid });
							}
						}

						dropNode.reachLevel = -1;
					}
				} else {
					prependChild({
						uuid: dragUuid,
						parentUuid: null
					});
				}
			}

			if (node?.parentUuid) {
				const parentNode = cache.current.get(node.parentUuid);

				if (parentNode) {
					parentNode.maxReachLevel = parentNode.childUuid
						? parentNode.level + 1
						: parentNode.level;
				}
			}

			updateDraggableList();
		},
		[appendChild, moveAfter, prependChild, updateDraggableList]
	);

	const updateDropNodeReachLevel: CatelogContextProps['updateDropNodeReachLevel'] =
		useCallback(
			({ x, initialLevel }) => {
				if (currentDropNode.current) {
					let reachLevel = Math.ceil(x / 12) + initialLevel;
					reachLevel = Math.max(
						reachLevel,
						currentDropNode.current.dynamicMinReachLevel
					);
					reachLevel = Math.min(
						reachLevel,
						currentDropNode.current.dynamicMaxReachLevel
					);

					if (
						currentDropNode.current.reachLevel !== -1 &&
						currentDropNode.current.reachLevel !== reachLevel
					) {
						currentDropNode.current.reachLevel = reachLevel;

						updateDraggableList();
					}
				}
			},
			[updateDraggableList]
		);

	return (
		<CatelogContext.Provider
			value={{
				isCreating,
				draggableList,
				isDraggingExpandedGroup,
				createDocument,
				archiveDocument,
				updateDocumentTitle,
				toggleCollapsibleState,
				appendChild,
				beforeDragStart,
				dragStart,
				dragUpdate,
				dragEnd,
				updateDropNodeReachLevel
			}}
		>
			{children}
		</CatelogContext.Provider>
	);
};

export const useCatelog = () => {
	const context = useContext(CatelogContext);

	if (!context) {
		throw new Error('useCatelogContext must be used within a CateglogProvider');
	}

	return context;
};
