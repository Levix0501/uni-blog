'use client';

import { Input } from '@/components/ui/input';
import { DocumentModel } from '@prisma/client';
import { FormEvent, useState } from 'react';
import { useCatelog } from './context';

interface EditTitleFormProps {
	initialTitle: string;
	id: DocumentModel['id'];
	uuid: DocumentModel['uuid'];
	onBlur: () => void;
}

export function EditTitleForm({
	initialTitle,
	id,
	uuid,
	onBlur
}: EditTitleFormProps) {
	const [title, setTitle] = useState(initialTitle);
	const { updateDocumentTitle } = useCatelog();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (title === initialTitle) {
			onBlur();
			return;
		}

		try {
			onBlur();
			updateDocumentTitle({ uuid, title });
		} catch (error) {
			console.error('更新文档名称失败:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex-1 h-full py-0.5">
			<Input
				autoFocus
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onBlur={handleSubmit}
				className="h-full w-full !ring-offset-0 !ring-0 px-1"
			/>
		</form>
	);
}
