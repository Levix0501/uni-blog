import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UpsertPostType } from '@/types/post';
import { Category, Image as ImageType, Post } from '@prisma/client';
import { Upload, UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { SubmitErrorHandler, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export interface PostFormProps {
	post?: Post & { cover?: ImageType };
	form: UseFormReturn<UpsertPostType>;
	categoryData?: Category[];
	isLoadingCategories: boolean;
	fileList: UploadFile[];
	setFileList: (val: UploadFile[]) => void;
	onSubmit: (values: UpsertPostType) => void;
}

const PostForm = ({
	post,
	form,
	categoryData,
	isLoadingCategories,
	fileList,
	setFileList,
	onSubmit
}: PostFormProps) => {
	const onInvalid: SubmitErrorHandler<UpsertPostType> = (e) => {
		for (const value of Object.values(e)) {
			toast.error(value.message);
			break;
		}
	};

	const handleUploadChange: UploadProps['onChange'] = (e) => {
		setFileList(e.fileList);

		if (e.file.status === 'done' && e.file.response.success) {
			form.setValue('imageId', e.file.response.data.id);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, onInvalid)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="categoryId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>分类</FormLabel>
							<Select
								disabled={isLoadingCategories}
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="选择分类" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{categoryData?.map((e) => (
											<SelectItem value={e.id} key={e.id}>
												{e.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="abstract"
					render={({ field }) => (
						<FormItem>
							<FormLabel>摘要</FormLabel>
							<FormControl>
								<Textarea {...field} />
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
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>语义化网址(SEO)</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="keywords"
					render={({ field }) => (
						<FormItem>
							<FormLabel>关键词(SEO)</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">{post ? '更新' : '发布'}</Button>
			</form>
		</Form>
	);
};

export default PostForm;
