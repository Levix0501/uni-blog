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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UpsertPostType } from '@/types/post';
import { Category } from '@prisma/client';
import { Upload, UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { SubmitErrorHandler, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

export interface PublishFormSheetProps {
	form: UseFormReturn<UpsertPostType>;
	categoryData?: Category[];
	isLoadingCategories: boolean;
	fileList: UploadFile[];
	setFileList: (val: UploadFile[]) => void;
	onSubmit: (values: UpsertPostType) => void;
	isUpdate?: boolean;
}

const PublishFormSheet = ({
	isUpdate,
	form,
	categoryData,
	isLoadingCategories,
	fileList,
	setFileList,
	onSubmit
}: PublishFormSheetProps) => {
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
		<Sheet>
			<SheetTrigger asChild>
				<Button>{isUpdate ? '更新' : '发布'}</Button>
			</SheetTrigger>

			<SheetContent className="px-0 h-dvh">
				<SheetHeader className="px-6">
					<SheetTitle>{isUpdate ? '更新' : '发布'}文章</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
						<ScrollArea className="h-[calc(100dvh-156px)] px-3">
							<div className="space-y-8 px-3 pb-3">
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>状态</FormLabel>
											<FormControl>
												<div className="flex items-center space-x-2 text-xs">
													<span>草稿</span>
													<Switch
														checked={field.value === 'published'}
														onCheckedChange={(e) =>
															field.onChange(e ? 'published' : 'draft')
														}
													/>
													<span>已发布</span>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

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
													<div
														role="button"
														className="flex flex-col items-center"
													>
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
							</div>
						</ScrollArea>

						<SheetFooter className="mt-8 px-6">
							<Button type="submit">{isUpdate ? '更新' : '发布'}</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};

export default PublishFormSheet;
