import { createCategoryAction, editCategoryAction } from '@/actions/category';
import { CategoryMutationSchema } from '@/schemas/category';
import { CategoryMutationType } from '@/types/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, InputNumber, Radio } from 'antd';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
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

export interface CategoryMutationFormProps {
	defaultValues: CategoryMutationType;
	onSuccess?: () => void;
	isAdd: boolean;
}

const CategoryMutationForm = ({
	defaultValues,
	onSuccess,
	isAdd
}: CategoryMutationFormProps) => {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState('');

	const form = useForm<CategoryMutationType>({
		resolver: zodResolver(CategoryMutationSchema),
		defaultValues
	});

	const onSubmit = (values: CategoryMutationType) => {
		setError('');

		startTransition(() => {
			if (isAdd) {
				createCategoryAction(values)
					.then((data) => {
						if (data?.error) {
							setError(data?.error);
							return;
						}
						onSuccess && onSuccess();
					})
					.catch(() => setError('Something went wrong'));
			} else {
				editCategoryAction(values, values.id!)
					.then((data) => {
						if (data?.error) {
							setError(data?.error);
							return;
						}
						onSuccess && onSuccess();
					})
					.catch(() => setError('Something went wrong'));
			}
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{defaultValues.id && (
					<FormField
						control={form.control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ID</FormLabel>
								<FormControl>
									<div className="inline-block ml-1">
										<Input {...field} disabled className="text-base" />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>分类slug</FormLabel>
							<FormControl>
								<div className="inline-block ml-1">
									<Input
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
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>名称</FormLabel>
							<FormControl>
								<div className="inline-block ml-1">
									<Input
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
					name="order"
					render={({ field }) => (
						<FormItem>
							<FormLabel>排序</FormLabel>
							<FormControl>
								<div className="inline-block ml-1">
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
								<div className="inline-block ml-1">
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

export default CategoryMutationForm;
