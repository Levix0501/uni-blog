'use client';

import { getChildDocumentsAction } from '@/actions/documents';
import { DocumentModel } from '@prisma/client';
import useSWR from 'swr';
import { SidebarMenu, SidebarMenuSub } from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import Item from './item';

interface DocumentListProps {
	parentDocumentId?: DocumentModel['parentDocumentId'];
	grandparentDocumentId?: DocumentModel['parentDocumentId'];
}

export const getDocumentListKey = (
	parentDocumentId: DocumentModel['parentDocumentId']
) => ['childDocuments', parentDocumentId];

const DocumentList = ({
	parentDocumentId = null,
	grandparentDocumentId = null
}: DocumentListProps) => {
	const { data: documents } = useSWR(getDocumentListKey(parentDocumentId), () =>
		getChildDocumentsAction(parentDocumentId)
	);

	if (!documents) {
		return <Skeleton className="h-8 rounded-md my-0.5" />;
	}

	const renderChildren = () => (
		<>
			{documents.map((document) => (
				<Item
					key={document.id}
					id={document.id}
					label={document.title}
					parentDocumentId={parentDocumentId}
					grandparentDocumentId={grandparentDocumentId}
					isFolder={document.isFolder}
					childDocumentNum={document.childDocumentNum}
				/>
			))}
		</>
	);

	return parentDocumentId ? (
		<SidebarMenuSub className="mr-[1px] pr-0">
			{renderChildren()}
		</SidebarMenuSub>
	) : (
		<SidebarMenu className="group-data-[collapsible=icon]:hidden">
			{renderChildren()}
		</SidebarMenu>
	);
};

export default DocumentList;
