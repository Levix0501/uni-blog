'use client';

import { updateAnalyticsSettingAction } from '@/actions/setting';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { AnalyticsSettingSchema } from '@/schemas/setting';
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
import { AnalyticsSetting as AnalyticsSettingType } from '@prisma/client';

export interface AnalyticsSettingProps {
	defaultValues: AnalyticsSettingType | null;
}

const AnalyticsSetting = ({ defaultValues }: AnalyticsSettingProps) => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');

	const form = useForm<z.infer<typeof AnalyticsSettingSchema>>({
		resolver: zodResolver(AnalyticsSettingSchema),
		defaultValues: {
			gaId: defaultValues?.gaId || '',
			bdtj: defaultValues?.bdtj || ''
		}
	});

	const onSubmit = (values: z.infer<typeof AnalyticsSettingSchema>) => {
		setError('');

		startTransition(() => {
			updateAnalyticsSettingAction(values)
				.then((data) => {
					toast.success('修改成功！');
				})
				.catch(() => setError('Something went wrong'));
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>数据统计</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>

			<CardContent>
				<div className="w-[350px]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="gaId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Google Analytics ID</FormLabel>
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
								name="bdtj"
								render={({ field }) => (
									<FormItem>
										<FormLabel>百度统计 ID</FormLabel>
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

export default AnalyticsSetting;
