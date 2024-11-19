'use client';

import { Input, InputProps } from '@/components/ui/input';
import { Editor } from '@bytemd/react';
import { Post } from '@prisma/client';
import { useState, useTransition } from 'react';
import { useDebounce, useLocalStorage } from 'react-use';

import { zh_hans } from './locales';

import { getAllPublishedCategoriesAction } from '@/actions/category';
import { upsertPostAction } from '@/actions/post';
import { getImageUrl } from '@/lib/utils';
import { UpsertPostSchema } from '@/schemas/post';
import { UpsertPostType } from '@/types/post';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageType } from '@prisma/client';
import { Spin, UploadFile } from 'antd';
import 'bytemd/dist/index.css';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';
import './styles/github-markdown.css';
import './styles/index.scss';
import PublishFormSheet from './publish-form-sheet';

const plugins = [
	// Add more plugins here
];

export interface MDEditorProps {
	post?: Post & { cover: ImageType | null };
}

const MDEditor = ({ post }: MDEditorProps) => {
	const router = useRouter();
	const [localValue, setLocalValue] = useLocalStorage(
		post ? `post-${post.id}` : 'post-draft',
		post ? post.content : ''
	);
	const [value, setValue] = useState(localValue || '');
	const [, cancel] = useDebounce(
		() => {
			setLocalValue(value);
			form.setValue('content', value);
		},
		1000,
		[value]
	);
	const [isPending, startTransition] = useTransition();

	const { isLoading: isLoadingCategories, data: categoryData } = useSWR(
		'all-category',
		getAllPublishedCategoriesAction
	);

	const form = useForm<z.infer<typeof UpsertPostSchema>>({
		resolver: zodResolver(UpsertPostSchema),
		defaultValues: {
			id: post?.id || void 0,
			categoryId: post?.categoryId || '',
			title: post?.title || '',
			abstract: post?.abstract || '',
			content: post?.content || '',
			imageId: post?.imageId || '',
			slug: post?.slug || '',
			keywords: post?.keywords || '',
			status: post?.status || 'published'
		}
	});
	const [fileList, setFileList] = useState<UploadFile[]>(
		post?.cover
			? [
					{
						uid: post.cover.id,
						name: `${post.cover.sign}.${post.cover.suffix}`,
						status: 'done',
						url: getImageUrl(post.cover)
					}
				]
			: []
	);

	const handleTitleChange: InputProps['onChange'] = (e) => {
		form.setValue('title', e.currentTarget.value);
	};

	const onSubmit = (values: UpsertPostType) => {
		startTransition(() => {
			upsertPostAction(values)
				.then(() => {
					router.replace('/admin/post');
					toast.success(post ? '更新成功！' : '发布成功！');
				})
				.catch(() => toast.error('Something went wrong!'));
		});
	};

	return (
		<Spin spinning={isPending}>
			<header className="px-7 h-16 flex items-center">
				<Input
					placeholder="输入文章标题..."
					className="!border-none !outline-none !ring-0 font-medium text-2xl h-full flex-1"
					defaultValue={post?.title}
					onChange={handleTitleChange}
				/>
				<PublishFormSheet
					form={form}
					categoryData={categoryData}
					isLoadingCategories={isLoadingCategories}
					fileList={fileList}
					setFileList={setFileList}
					onSubmit={onSubmit}
					isUpdate={!!post}
				/>
			</header>
			<div className="flex flex-col">
				<Editor
					value={value}
					plugins={[]}
					locale={zh_hans}
					onChange={(v) => {
						setValue(v);
					}}
				/>
			</div>
		</Spin>
	);
};

export default MDEditor;
