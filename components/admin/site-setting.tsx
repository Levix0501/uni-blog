'use client';

import { updateSiteSettingAction } from '@/actions/setting';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { SiteSettingSchema } from '@/schemas/setting';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
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
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import SiteLogoUploader from './site-logo-uploader';
import { getSiteSettingApi } from '@/apis/setting';

export interface SiteSettingProps {
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
}

const SiteSetting = ({ siteSetting }: SiteSettingProps) => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');

	const form = useForm<z.infer<typeof SiteSettingSchema>>({
		resolver: zodResolver(SiteSettingSchema),
		defaultValues: {
			siteName: siteSetting?.siteName || '',
			logoId: siteSetting?.logo?.id || '',
			description: siteSetting?.description || '',
			keywords: siteSetting?.keywords || '',
			year: siteSetting?.year || '',
			icp: siteSetting?.icp || ''
		}
	});

	const onSubmit = (values: z.infer<typeof SiteSettingSchema>) => {
		setError('');

		startTransition(() => {
			updateSiteSettingAction(values)
				.then((data) => {
					toast.success('修改成功！');
				})
				.catch(() => setError('Something went wrong'));
		});
	};

	const handleLogoChange = (imageId: string) => {
		form.setValue('logoId', imageId);
	};

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="w-[350px]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="siteName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>站点名称</FormLabel>
										<FormControl>
											<Input
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
								name="logoId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>站点 Logo</FormLabel>
										<FormControl>
											<div>
												<SiteLogoUploader
													defaultFileList={
														siteSetting?.logo
															? [
																	{
																		uid: siteSetting?.logo.id,
																		name:
																			siteSetting?.logo.sign +
																			siteSetting?.logo.suffix,
																		status: 'done',
																		url: siteSetting?.logo.imgUrl
																	}
																]
															: []
													}
													onChange={handleLogoChange}
												/>
											</div>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>站点描述</FormLabel>
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
								name="keywords"
								render={({ field }) => (
									<FormItem>
										<FormLabel>关键词</FormLabel>
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
								name="year"
								render={({ field }) => (
									<FormItem>
										<FormLabel>年份</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												className="text-base"
												placeholder="e.g. 2023-2024"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="icp"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ICP 备案</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												className="text-base"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormError message={error} />
							<Button disabled={isPending} type="submit" className="w-full">
								保存
							</Button>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
};

export default SiteSetting;
