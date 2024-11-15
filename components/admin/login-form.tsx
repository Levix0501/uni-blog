'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginAction } from '@/actions/auth';
import { FormError } from '@/components/form-error';
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
import { useSession } from '@/hooks/use-session';
import { LoginSchema } from '@/schemas/login';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | undefined>('');
	const { updateSession } = useSession();

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			password: ''
		}
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError('');

		startTransition(() => {
			loginAction(values, callbackUrl)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data?.error);
						return;
					}
					updateSession();
					toast.success('登录成功！');
				})
				.catch(() => setError('Something went wrong'));
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
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
	);
};

export default LoginForm;
