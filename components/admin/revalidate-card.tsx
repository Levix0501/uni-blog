'use client';

import { revalidateAllAction } from '@/actions/revalidate';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { useTransition } from 'react';
import { toast } from 'sonner';

const RevalidateCard = () => {
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		startTransition(() => {
			revalidateAllAction()
				.then(() => {
					toast.success('刷新成功！');
				})
				.catch(() => {
					toast.error('发生了未知错误！');
				});
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>缓存管理</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>

			<CardContent>
				<Button onClick={handleClick} disabled={isPending}>
					刷新全局缓存
				</Button>
			</CardContent>
		</Card>
	);
};

export default RevalidateCard;
