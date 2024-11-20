'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { FormError } from '../form-error';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetAdminPasswordSchema } from '@/schemas/setting';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { updateAdminPasswordAction } from '@/actions/setting';
import { toast } from 'sonner';
import { logOutAction } from '@/actions/auth';

const ResetAdminPassword = () => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');

	const form = useForm<z.infer<typeof ResetAdminPasswordSchema>>({
		resolver: zodResolver(ResetAdminPasswordSchema),
		defaultValues: {
			oldPassword: '',
			newPassword: ''
		}
	});

	const onSubmit = (values: z.infer<typeof ResetAdminPasswordSchema>) => {
		setError('');

		startTransition(() => {
			updateAdminPasswordAction(values)
				.then((data) => {
					if (data?.error) {
						setError(data?.error);
						return;
					}

					toast.success('重置成功，请重新登录！');
					logOutAction();
				})
				.catch(() => setError('Something went wrong'));
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>重置密码</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>

			<CardContent>
				<div className="w-[350px]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="oldPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>原密码</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="******"
												type="password"
												className="text-base"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>新密码</FormLabel>
										<FormControl>
											<Input
												{...field}
												disabled={isPending}
												placeholder="******"
												type="password"
												className="text-base"
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormError message={error} />
							<Button disabled={isPending} type="submit" className="w-full">
								登录
							</Button>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
};

export default ResetAdminPassword;
