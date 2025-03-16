'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { useCoverImage } from '@/hooks/use-cover-image';

import { SingleImageDropzone } from './single-age-dropzone';
import { uploadImageAction } from '@/actions/image';
import { updateDocumentCoverAction } from '@/actions/document';
import { mutate } from 'swr';

export const CoverImageModal = () => {
	const { uuid } = useParams<{ uuid: string }>();

	const coverImage = useCoverImage();

	const [file, setFile] = useState<File>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onClose = () => {
		setFile(undefined);
		setIsSubmitting(false);
		coverImage.onClose();
	};

	const onChange = async (file?: File) => {
		if (file) {
			setIsSubmitting(true);
			setFile(file);

			const formData = new FormData();
			formData.append('image', file);
			const result = await uploadImageAction(formData);

			if (result.success) {
				mutate(
					['getDocumentAction', uuid],
					updateDocumentCoverAction({
						uuid,
						coverImageId: result.success.id
					}),
					{
						optimisticData: (data) => ({ ...data, cover: result.success }),
						revalidate: false
					}
				);
			}
			onClose();
		}
	};

	return (
		<Dialog open={coverImage.isOpen} onOpenChange={coverImage.onOpenChange}>
			<DialogContent>
				<DialogTitle className="text-center text-lg font-semibold">
					上传封面图
				</DialogTitle>
				<DialogDescription></DialogDescription>

				<SingleImageDropzone
					className="w-full outline-none"
					disabled={isSubmitting}
					value={file}
					onChange={onChange}
					dropzoneOptions={{ maxSize: 2 * 1024 * 1024 }}
				/>
			</DialogContent>
		</Dialog>
	);
};
