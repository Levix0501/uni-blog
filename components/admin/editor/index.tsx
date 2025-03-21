'use client';

import { Input, InputProps } from '@/components/ui/input';
import { Editor, EditorProps } from '@bytemd/react';
import { DocumentModel, Post } from '@prisma/client';
import { use, useEffect, useState, useTransition } from 'react';
import { useDebounce, useLocalStorage } from 'react-use';
import removeMd from 'remove-markdown';

import { zh_hans } from './locales';

import { getAllPublishedCategoriesAction } from '@/actions/category';
import { uploadImageAction } from '@/actions/image';
import { upsertPostAction } from '@/actions/post';
import { getImageSizeQueryStr } from '@/lib/utils';
import { UpsertPostSchema } from '@/schemas/post';
import { ExtendedImageType } from '@/types/image';
import { UpsertPostType } from '@/types/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spin, UploadFile } from 'antd';
import 'bytemd/dist/index.css';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';
import PublishFormSheet from './publish-form-sheet';
import './styles/github-markdown.css';
import './styles/index.scss';

const plugins = [
	// Add more plugins here
];

export interface MDEditorProps {
	document: DocumentModel & { cover: ExtendedImageType | null };
}

const MDEditor = ({ document }: MDEditorProps) => {
	const router = useRouter();
	const [value, setValue] = useState(document.content);
	const [, cancel] = useDebounce(
		() => {
			// if (!post) {
			// 	setLocalValue(value);
			// }
			// form.setValue('content', value);
			// if (!post?.abstract) {
			// 	form.setValue(
			// 		'abstract',
			// 		removeMd(value).replace(/\n+/g, ' ').substring(0, 100)
			// 	);
			// }
		},
		1000,
		[value]
	);
	const [isPending, startTransition] = useTransition();

	const { isLoading: isLoadingCategories, data: categoryData } = useSWR(
		'all-category',
		getAllPublishedCategoriesAction
	);

	useEffect(() => {
		setValue(document.content);
	}, [document]);

	// const form = useForm<z.infer<typeof UpsertPostSchema>>({
	// 	resolver: zodResolver(UpsertPostSchema),
	// 	defaultValues: {
	// 		id: post?.id || void 0,
	// 		categoryId: post?.categoryId || '',
	// 		title: post?.title || '',
	// 		abstract: post?.abstract || '',
	// 		content: post?.content || '',
	// 		imageId: post?.imageId || '',
	// 		slug: post?.slug || '',
	// 		keywords: post?.keywords || '',
	// 		status: post?.status || 'published'
	// 	}
	// });
	// const [fileList, setFileList] = useState<UploadFile[]>(
	// 	post?.cover
	// 		? [
	// 				{
	// 					uid: post.cover.id,
	// 					name: `${post.cover.sign}.${post.cover.suffix}`,
	// 					status: 'done',
	// 					url: post.cover.imgUrl
	// 				}
	// 			]
	// 		: []
	// );

	// const handleTitleChange: InputProps['onChange'] = (e) => {
	// 	form.setValue('title', e.currentTarget.value);
	// };

	// const onSubmit = (values: UpsertPostType) => {
	// 	startTransition(() => {
	// 		upsertPostAction(values)
	// 			.then(() => {
	// 				router.replace('/admin/post');
	// 				toast.success(post ? '更新成功！' : '发布成功！');
	// 				setLocalValue('');
	// 			})
	// 			.catch(() => toast.error('Something went wrong!'));
	// 	});
	// };

	const uploadImages: EditorProps['uploadImages'] = async (files: File[]) => {
		const result = await Promise.all(
			files.map(async (e) => {
				const formData = new FormData();
				formData.append('image', files[0]);
				const result = await uploadImageAction(formData);
				if (result.success) {
					return {
						url: result.success.imgUrl + getImageSizeQueryStr(result.success)
					};
				} else {
					return null;
				}
			})
		);
		return result.filter((e) => !!e);
	};

	return (
		<Editor
			value={value}
			plugins={[]}
			locale={zh_hans}
			onChange={(v) => {
				setValue(v);
			}}
			uploadImages={uploadImages}
		/>
	);
};

export default MDEditor;
