import { DocumentModel } from '@prisma/client';
import { DraggableNodeType } from './context';

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
	cache: Map<DocumentModel['uuid'], DraggableNodeType>
) => {
	if (!uuid) return;

	const node = cache.get(uuid);

	if (!node) return;

	node.level = parentLevel + 1;

	if (node.siblingUuid) {
		recursiveUpdateLevel(node.siblingUuid, parentLevel, cache);
	}

	if (node.childUuid) {
		recursiveUpdateLevel(node.childUuid, node.level, cache);
	}
};
