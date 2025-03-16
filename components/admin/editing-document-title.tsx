'use client';
import { useState } from 'react';

import { useEditingDocument } from '@/hooks/use-edting-document';
import { EditTitleForm } from './catelog/edit-title-form';

const EditingDocumentTitle = () => {
	const editingDocument = useEditingDocument();
	const [isEditingTitle, setIsEditingTitle] = useState(false);

	if (!editingDocument.data) return null;

	return isEditingTitle ? (
		<EditTitleForm
			initialTitle={editingDocument.data.title}
			uuid={editingDocument.data.uuid}
			onBlur={() => setIsEditingTitle(false)}
		/>
	) : (
		<div
			className="flex-1 text-ellipsis line-clamp-1 cursor-pointer hover:text-blue-500"
			onClick={() => setIsEditingTitle(true)}
		>
			{editingDocument.data.title}
		</div>
	);
};

export default EditingDocumentTitle;
