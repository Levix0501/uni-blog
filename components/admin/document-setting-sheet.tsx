'use client';

import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
	removeDocumentCoverAction,
	updateDocumentCoverAction,
	updateDocumentSettingsAction
} from '@/actions/document';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible';
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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageCropper, { ImageCropperMethods } from './image-cropper';
import { useDocumentSetting } from '@/hooks/use-document-setting';
import { useEditingDocument } from '@/hooks/use-edting-document';

export const DocumentSettingSheetTrigger = () => {
	const onSheetOpenChange = useDocumentSetting(
		(state) => state.onSheetOpenChange
	);

	return (
		<Button
			variant="ghost"
			size="icon"
			className={'h-8 w-8'}
			onClick={() => onSheetOpenChange(true)}
		>
			<SlidersHorizontal size={20} />
		</Button>
	);
};

const formSchema = z.object({
	slug: z
		.string()
		.regex(
			/^[a-z0-9._-]{2,190}$/,
			'访问路径为 2～190 个字符，只能输入小写字母、数字、横线、下划线和点'
		),
	abstract: z.string(),
	keywords: z.string()
});

const DocumentSettingSheet = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const imageCropperRef = useRef<ImageCropperMethods>(null);
	const [isCropping, setIsCropping] = useState(false);

	const { isSheetOpen, onSheetOpenChange } = useDocumentSetting();
	const editingDocument = useEditingDocument();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			slug: '',
			abstract: '',
			keywords: ''
		},
		mode: 'onChange'
	});

	useEffect(() => {
		const subscription = form.watch((value, { name, type }) => {
			if (type === 'change') {
				setIsEditing(true);
			}
		});
		return () => subscription.unsubscribe();
	}, [form.watch]);

	useEffect(() => {
		const value = editingDocument?.data;
		if (value) {
			form.setValue('slug', value.slug);
			form.setValue('abstract', value.abstract);
			form.setValue('keywords', value.keywords);
		}

		setIsEditing(false);
	}, [editingDocument?.data?.id]);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		startTransition(async () => {
			try {
				if (!editingDocument.data) return;

				if (isCropping) {
					const croppedImage = await imageCropperRef.current?.getCroppedImage();
					let result;
					if (croppedImage) {
						const formData = new FormData();
						formData.append('image', croppedImage);
						result = await updateDocumentCoverAction({
							id: editingDocument.data.id,
							formData
						});
					} else {
						result = await removeDocumentCoverAction({
							id: editingDocument.data.id
						});
					}
					if (result.error) {
						toast.error(result.error);
						return;
					}
				}
				setIsCropping(false);

				const result = await updateDocumentSettingsAction({
					...values,
					id: editingDocument.data.id
				});
				if (result?.error) {
					form.setError('slug', { message: '该路径已存在！' });
				} else {
					setIsEditing(false);
					toast.success('保存成功！');
				}
			} catch (error) {
				console.log(error);
				toast.error('保存失败！');
			}
		});
	};

	return (
		<Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
			<SheetContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="px-0 h-dvh"
			>
				<SheetHeader className="px-6">
					<SheetTitle>文档设置</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<ScrollArea className="h-[calc(100dvh-60px)] px-3">
							<div className="space-y-5 px-3 pb-3">
								<FormField
									control={form.control}
									name="abstract"
									render={({ field }) => (
										<FormItem>
											<FormLabel>封面</FormLabel>
											<FormControl>
												<ImageCropper
													ref={imageCropperRef}
													setIsCropping={setIsCropping}
													isPending={isPending}
												/>
											</FormControl>
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
												<Textarea {...field} disabled={isPending} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Collapsible open={isOpen} onOpenChange={setIsOpen}>
									<CollapsibleTrigger className="text-sm flex items-center">
										<ChevronRight
											size={16}
											className={cn(
												'transition-transform',
												isOpen && 'rotate-90'
											)}
										/>
										高级选项
									</CollapsibleTrigger>

									<CollapsibleContent className="space-y-5 mt-5">
										<FormField
											control={form.control}
											name="slug"
											render={({ field }) => (
												<FormItem>
													<FormLabel>文章路径</FormLabel>
													<FormControl>
														<Input {...field} disabled={isPending} />
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
													<FormLabel>关键词(keywords)</FormLabel>
													<FormControl>
														<Input {...field} disabled={isPending} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CollapsibleContent>
								</Collapsible>

								<Button
									type="submit"
									size="sm"
									disabled={(!isEditing && !isCropping) || isPending}
								>
									确定
								</Button>
							</div>
						</ScrollArea>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
};

export default DocumentSettingSheet;
