'use client';

import { DocumentModel } from '@prisma/client';
import { use, useEffect } from 'react';

import { Cover } from '@/components/admin/cover';
import MDEditor from '@/components/admin/editor';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditingDocument } from '@/hooks/use-edting-document';
import { useDocumentSetting } from '@/hooks/use-document-setting';
import { fetchRemoteImageBase64StrAction } from '@/actions/image';

interface PageProps {
	params: Promise<{
		slug: DocumentModel['slug'];
	}>;
}

const Page = ({ params }: PageProps) => {
	const slug = use(params).slug;
	const setBase64Cover = useDocumentSetting((state) => state.setBase64Cover);
	const setDocumentSlug = useDocumentSetting((state) => state.setDocumentSlug);
	const editingDocument = useEditingDocument();

	useEffect(() => {
		setDocumentSlug(slug);
	}, [slug]);

	useEffect(() => {
		if (editingDocument?.data?.cover?.imgUrl) {
			fetchRemoteImageBase64StrAction(editingDocument.data.cover.imgUrl).then(
				(result) => {
					if (result) {
						setBase64Cover(result);
					}
				}
			);
		} else {
			setBase64Cover(void 0);
		}
	}, [editingDocument?.data?.cover?.imgUrl]);

	if (editingDocument?.data === undefined) {
		return (
			<div>
				<Cover.Skeleton />
				<div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
					<div className="space-y-4 pl-8 pt-4">
						<Skeleton className="h-14 w-[50%]" />
						<Skeleton className="h-4 w-[80%]" />
						<Skeleton className="h-4 w-[40%]" />
						<Skeleton className="h-4 w-[60%]" />
					</div>
				</div>
			</div>
		);
	}

	if (editingDocument.data === null) {
		return <div>Not found</div>;
	}

	return <MDEditor document={editingDocument.data} />;
};

export default Page;
