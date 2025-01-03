'use server';

import { db } from '@/lib/db';
import { DocumentModel } from '@prisma/client';

export type CatelogNodeType = Awaited<
	ReturnType<typeof getAllCatelogNodesAction>
>[0];

// export const getAllCatelogNodesAction = () =>
// 	db.documentModel.findMany({
// 		where: { isArchived: false },
// 		select: {
// 			id: true,
// 			uuid: true,
// 			title: true,
// 			isFolder: true,
// 			parentUuid: true,
// 			prevUuid: true,
// 			siblingUuid: true,
// 			childUuid: true,
// 			level: true
// 		}
// 	});

export const getAllCatelogNodesAction = () =>
	db.documentModel.findMany({
		where: { isArchived: false },
		select: {
			id: true,
			uuid: true,
			title: true,
			isFolder: true,
			parentUuid: true,
			prevUuid: true,
			siblingUuid: true,
			childUuid: true,
			level: true,
			isArchived: true
		}
	});

let latestBatchNodes: CatelogNodeType[] | undefined;
let isPending = false;

export const updateAllCatelogNodesAction = async (nodes: CatelogNodeType[]) => {
	latestBatchNodes = nodes;

	if (isPending) return;

	isPending = true;

	while (latestBatchNodes) {
		const nodes = latestBatchNodes;
		latestBatchNodes = void 0;

		try {
			await db.$transaction(
				nodes.map(({ id, uuid, ...rest }) =>
					db.documentModel.update({
						where: { id },
						data: rest
					})
				)
			);
		} catch (error) {
			console.log(error);
		}
	}

	isPending = false;

	return getAllCatelogNodesAction();
};

export const createDocumentAction = async ({
	title,
	parentUuid,
	isFolder
}: {
	title: string;
	parentUuid: DocumentModel['parentUuid'];
	isFolder?: boolean;
}) => {
	const newDoc = await db.documentModel.create({
		data: {
			title,
			isFolder,
			level: 0
		}
	});

	return appendChildAction({ parentUuid, uuid: newDoc.uuid });
};

const removeDocument = async (uuid: DocumentModel['uuid']) => {
	const doc = await db.documentModel.findUnique({
		where: { uuid }
	});

	if (!doc) {
		throw new Error('Not found');
	}

	if (doc.prevUuid) {
		if (doc.prevUuid === doc.parentUuid) {
			await db.documentModel.update({
				where: { uuid: doc.parentUuid },
				data: { childUuid: doc.siblingUuid }
			});
		} else {
			await db.documentModel.update({
				where: { uuid: doc.prevUuid },
				data: {
					siblingUuid: doc.siblingUuid
				}
			});
		}
	}

	if (doc.siblingUuid) {
		await db.documentModel.update({
			where: { uuid: doc.siblingUuid },
			data: {
				prevUuid: doc.prevUuid
			}
		});
	}

	await db.documentModel.update({
		where: { uuid },
		data: {
			parentUuid: null,
			prevUuid: null,
			siblingUuid: null
		}
	});

	return doc;
};

export const archiveDocumentAction = async (uuid: DocumentModel['uuid']) => {
	const doc = await removeDocument(uuid);

	const archiveDocumentByUuid = (uuid: string) =>
		db.documentModel.update({ where: { uuid }, data: { isArchived: true } });
	await archiveDocumentByUuid(doc.uuid);

	let currentUuid = doc.childUuid;

	const recursiveArchive = async (
		uuid: DocumentModel['childUuid'] | DocumentModel['siblingUuid']
	) => {
		if (!uuid) return;

		const doc = await archiveDocumentByUuid(uuid);
		await recursiveArchive(doc.childUuid);
		await recursiveArchive(doc.siblingUuid);
	};
	await recursiveArchive(currentUuid);

	return getAllCatelogNodesAction();
};

export const updateDocumentTitleAction = async ({
	id,
	title
}: {
	id: DocumentModel['id'];
	title: DocumentModel['title'];
}) => {
	// await new Promise((res, rej) => {
	// 	setTimeout(() => {
	// 		res(0);
	// 	}, 10000);
	// });
	await db.documentModel.update({ where: { id }, data: { title } });

	return getAllCatelogNodesAction();
};

const recursiveUpdateLevel = async (
	uuid: DocumentModel['uuid'] | null,
	parentLevel: DocumentModel['level']
) => {
	if (!uuid) return;

	const doc = await db.documentModel.update({
		where: { uuid },
		data: {
			level: parentLevel + 1
		}
	});

	if (doc.siblingUuid) {
		await recursiveUpdateLevel(doc.siblingUuid, parentLevel);
	}

	if (doc.childUuid) {
		await recursiveUpdateLevel(doc.childUuid, doc.level);
	}
};

export const appendChildAction = async ({
	parentUuid,
	uuid
}: {
	parentUuid: DocumentModel['parentUuid'];
	uuid: DocumentModel['uuid'];
}) => {
	let doc = await removeDocument(uuid);

	const prevDoc = await db.documentModel.findFirst({
		where: {
			parentUuid,
			siblingUuid: null,
			isArchived: false,
			uuid: { not: uuid }
		}
	});

	let parentDoc: DocumentModel | undefined | null;

	if (parentUuid) {
		parentDoc = await db.documentModel.findUnique({
			where: { uuid: parentUuid }
		});
	}

	if (prevDoc) {
		await db.documentModel.update({
			where: {
				id: prevDoc.id
			},
			data: {
				siblingUuid: uuid
			}
		});

		doc = await db.documentModel.update({
			where: { uuid },
			data: {
				prevUuid: prevDoc.uuid,
				parentUuid: prevDoc.parentUuid,
				level: prevDoc.level
			}
		});
	} else if (parentDoc) {
		await db.documentModel.update({
			where: {
				id: parentDoc.id
			},
			data: {
				childUuid: uuid
			}
		});

		doc = await db.documentModel.update({
			where: { uuid },
			data: {
				prevUuid: parentDoc.uuid,
				parentUuid: parentDoc.uuid,
				level: parentDoc.level + 1
			}
		});
	}

	await recursiveUpdateLevel(doc.childUuid, doc.level);

	return getAllCatelogNodesAction();
};

export const prependChildAction = async ({
	parentUuid,
	uuid
}: {
	parentUuid: DocumentModel['parentUuid'];
	uuid: DocumentModel['uuid'];
}) => {
	let doc = await removeDocument(uuid);

	const firstChild = await db.documentModel.findFirst({
		where: {
			parentUuid,
			prevUuid: parentUuid,
			isArchived: false,
			uuid: { not: uuid }
		}
	});

	if (firstChild) {
		await db.documentModel.update({
			where: { id: firstChild.id },
			data: {
				prevUuid: doc.uuid
			}
		});
	}

	let parentDoc: DocumentModel | undefined | null;

	if (parentUuid) {
		parentDoc = await db.documentModel.update({
			where: { uuid: parentUuid },
			data: {
				childUuid: doc.uuid
			}
		});
	}

	const level = parentDoc?.level ? parentDoc.level + 1 : 0;

	doc = await db.documentModel.update({
		where: { uuid },
		data: {
			prevUuid: parentUuid,
			parentUuid,
			siblingUuid: firstChild?.uuid || null,
			level
		}
	});

	await recursiveUpdateLevel(doc.childUuid, doc.level);

	return getAllCatelogNodesAction();
};

export const moveAfterAction = async ({
	uuid,
	targetUuid
}: {
	uuid: DocumentModel['uuid'];
	targetUuid: DocumentModel['uuid'];
}) => {
	let doc = await removeDocument(uuid);
	let targetDoc = await db.documentModel.findUnique({
		where: { uuid: targetUuid }
	});

	if (!doc || !targetDoc) {
		throw new Error('Doc or targetDoc not found');
	}

	if (targetDoc.siblingUuid) {
		await db.documentModel.update({
			where: { uuid: targetDoc.siblingUuid },
			data: {
				prevUuid: doc.uuid
			}
		});
	}

	doc = await db.documentModel.update({
		where: {
			uuid
		},
		data: {
			prevUuid: targetDoc.uuid,
			siblingUuid: targetDoc.siblingUuid,
			parentUuid: targetDoc.parentUuid,
			level: targetDoc.level
		}
	});

	await db.documentModel.update({
		where: { uuid: targetUuid },
		data: {
			siblingUuid: uuid
		}
	});

	await recursiveUpdateLevel(doc.childUuid, doc.level);

	return getAllCatelogNodesAction();
};

// export const getChildDocumentsAction = async (
// 	parentDocumentId: DocumentModel['parentDocumentId']
// ) => {
// 	const result = await db.documentModel.findMany({
// 		where: { parentDocumentId, isArchived: false },
// 		orderBy: {
// 			order: 'asc'
// 		},
// 		select: {
// 			id: true,
// 			title: true,
// 			parentDocumentId: true,
// 			isFolder: true,
// 			childDocuments: { where: { isArchived: false } }
// 		}
// 	});
// 	return result.map(({ childDocuments, ...rest }) => ({
// 		...rest,
// 		childDocumentNum: childDocuments.length
// 	}));
// };

// export const unshiftDocumentAction = async ({
// 	id,
// 	parentDocumentId
// }: {
// 	id: DocumentModel['id'];
// 	parentDocumentId: DocumentModel['parentDocumentId'];
// }) => {
// 	const currentDoc = await db.documentModel.findUnique({ where: { id } });

// 	if (!currentDoc) return;

// 	const firstChild = await db.documentModel.findFirst({
// 		where: { parentDocumentId },
// 		orderBy: { order: 'asc' }
// 	});

// 	return db.documentModel.update({
// 		where: { id },
// 		data: {
// 			parentDocumentId,
// 			order: firstChild ? firstChild.order - 10 : 0
// 		}
// 	});
// };

// export const pushDocumentAction = async ({
// 	id,
// 	parentDocumentId
// }: {
// 	id: DocumentModel['id'];
// 	parentDocumentId: DocumentModel['parentDocumentId'];
// }) => {
// 	const currentDoc = await db.documentModel.findUnique({ where: { id } });

// 	if (!currentDoc) return;

// 	const lastChild = await db.documentModel.findFirst({
// 		where: { parentDocumentId },
// 		orderBy: { order: 'desc' }
// 	});

// 	return db.documentModel.update({
// 		where: { id },
// 		data: {
// 			parentDocumentId,
// 			order: lastChild ? lastChild.order + 10 : 0
// 		}
// 	});
// };

// export const placeDocumentAfterAnotherAction = async ({
// 	id,
// 	previousDocumentId
// }: {
// 	id: DocumentModel['id'];
// 	previousDocumentId: DocumentModel['id'];
// }) => {
// 	const prevDoc = await db.documentModel.findUnique({
// 		where: { id: previousDocumentId }
// 	});

// 	if (prevDoc) {
// 		const parentDocumentId = prevDoc.parentDocumentId;
// 		const twoDocs = await db.documentModel.findMany({
// 			where: { parentDocumentId, order: { gte: prevDoc.order } },
// 			orderBy: { order: 'asc' },
// 			take: 2
// 		});

// 		if (twoDocs.length === 1) {
// 			await db.documentModel.update({
// 				where: { id },
// 				data: {
// 					parentDocumentId,
// 					order: twoDocs[0].order + 10
// 				}
// 			});
// 		} else if (twoDocs.length === 2) {
// 			await db.documentModel.update({
// 				where: { id },
// 				data: {
// 					parentDocumentId,
// 					order: (twoDocs[0].order + twoDocs[1].order) / 2
// 				}
// 			});
// 		}
// 	}
// };
