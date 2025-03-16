import { DraggableNodeType } from '@/hooks/use-catelog-store';
import { DocumentModel } from '@prisma/client';

export const removeNode = ({
	uuid,
	cache
}: {
	uuid: DocumentModel['uuid'];
	cache: Map<DocumentModel['uuid'], DraggableNodeType>;
}) => {
	const currentNode = cache.get(uuid);

	if (!currentNode) return;

	if (currentNode.prevUuid) {
		if (currentNode.prevUuid === currentNode.parentUuid) {
			const parentNode = cache.get(currentNode.parentUuid);

			if (parentNode) {
				parentNode.childUuid = currentNode.siblingUuid;
				parentNode.maxReachLevel = parentNode.childUuid
					? parentNode.level + 1
					: parentNode.level;
			}
		} else {
			const prevNode = cache.get(currentNode.prevUuid);

			if (prevNode) {
				prevNode.siblingUuid = currentNode.siblingUuid;
			}
		}
	}

	if (currentNode.siblingUuid) {
		const siblingNode = cache.get(currentNode.siblingUuid);

		if (siblingNode) {
			siblingNode.prevUuid = currentNode.prevUuid;
		}
	}

	currentNode.parentUuid = null;
	currentNode.prevUuid = null;
	currentNode.siblingUuid = null;

	return currentNode;
};

export const recursiveUpdateLevel = (
	uuid: DocumentModel['uuid'] | null,
	parentLevel: DocumentModel['level'],
	parentMinReachLevel: number,
	cache: Map<DocumentModel['uuid'], DraggableNodeType>
) => {
	if (!uuid) return;

	const node = cache.get(uuid);

	if (!node) return;

	node.level = parentLevel + 1;
	node.minReachLevel = parentMinReachLevel;
	node.maxReachLevel = node.childUuid ? node.level + 1 : node.level;

	if (node.siblingUuid) {
		recursiveUpdateLevel(
			node.siblingUuid,
			parentLevel,
			parentMinReachLevel,
			cache
		);
	}

	if (node.childUuid) {
		recursiveUpdateLevel(node.childUuid, node.level, node.minReachLevel, cache);
	}
};
