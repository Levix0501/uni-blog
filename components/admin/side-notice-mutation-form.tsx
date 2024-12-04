import {
	createSideNoticeAction,
	editSideNoticeAction
} from '@/actions/side-notice';
import { SideNoticeMutationSchema } from '@/schemas/side-notice';
import { ExtendedImageType } from '@/types/image';
import { SideNoticeMutationType } from '@/types/side-notice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageType, SideNotice } from '@prisma/client';
import {
	Input,
	InputNumber,
	Radio,
	Upload,
	UploadFile,
	UploadProps
} from 'antd';
import { Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormError } from '../form-error';
import { Button } from '../ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form';
import { Textarea } from '../ui/textarea';

export interface SideNoticeMutationFormProps {
	sideNotice?: SideNotice & { image: ExtendedImageType | null };
	onSuccess?: () => void;
	isAdd: boolean;
}

const SideNoticeMutationForm = ({
	sideNotice,
	onSuccess,
	isAdd
}: SideNoticeMutationFormProps) => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>(
		sideNotice?.image
			? [
					{
						uid: sideNotice.image.id,
						name: `${sideNotice.image.sign}.${sideNotice.image.suffix}`,
						status: 'done',
						url: sideNotice.image.imgUrl
					}
				]
			: []
	);

	const form = useForm<SideNoticeMutationType>({
		resolver: zodResolver(SideNoticeMutationSchema),
		defaultValues: {
			id: sideNotice?.id || void 0,
			name: sideNotice?.name || '',
			desc: sideNotice?.desc || '',
			imageId: sideNotice?.imageId || '',
			order: sideNotice?.order || void 0,
			status: sideNotice?.status || 'published',
			orientation: sideNotice?.orientation || 'vertical'
		}
	});

	const onSubmit = (values: SideNoticeMutationType) => {
		setError('');

		startTransition(() => {
			if (isAdd) {
				createSideNoticeAction(values)
					.then((data) => {
						if (data?.error) {
							setError(data?.error);
							return;
						}
						toast.success(data.success);
						onSuccess && onSuccess();
					})
					.catch(() => setError('Something went wrong'));
			} else {
				editSideNoticeAction(values, values.id!)
					.then((data) => {
						if (data?.error) {
							setError(data?.error);
							return;
						}
						toast.success(data.success);
						onSuccess && onSuccess();
					})
					.catch(() => setError('Something went wrong'));
			}
		});
	};

	const handleUploadChange: UploadProps['onChange'] = (e) => {
		setFileList(e.fileList);

		if (e.file.status === 'done' && e.file.response.success) {
			form.setValue('imageId', e.file.response.data.id);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{sideNotice?.id && (
					<FormField
						control={form.control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ID</FormLabel>
								<FormControl>
									<Input {...field} disabled className="text-base" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>公告名称</FormLabel>
							<FormControl>
								<Input {...field} disabled={isPending} className="text-base" />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="desc"
					render={({ field }) => (
						<FormItem>
							<FormLabel>公告描述</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={isPending}
									className="text-base"
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="imageId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>封面</FormLabel>
							<FormControl>
								<Upload
									action="/api/upload/image"
									listType="picture-card"
									maxCount={1}
									onChange={handleUploadChange}
									fileList={fileList}
								>
									<div role="button" className="flex flex-col items-center">
										<Plus />
										<div>上传封面</div>
									</div>
								</Upload>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="orientation"
					render={({ field }) => (
						<FormItem>
							<FormLabel>方向</FormLabel>
							<FormControl>
								<div>
									<Radio.Group {...field}>
										<Radio value="vertical">垂直</Radio>
										<Radio value="horizontal">水平</Radio>
									</Radio.Group>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="order"
					render={({ field }) => (
						<FormItem>
							<FormLabel>排序</FormLabel>
							<FormControl>
								<div>
									<InputNumber
										{...field}
										disabled={isPending}
										className="text-base"
									/>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>状态</FormLabel>
							<FormControl>
								<div>
									<Radio.Group {...field}>
										<Radio value="draft">草稿</Radio>
										<Radio value="published">发布</Radio>
									</Radio.Group>
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormError message={error} />
				<Button disabled={isPending} type="submit">
					确定
				</Button>
			</form>
		</Form>
	);
};

export default SideNoticeMutationForm;
