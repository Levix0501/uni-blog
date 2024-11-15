'use client';

import {
	deleteCategoryAction,
	getCategoryListAction
} from '@/actions/category';
import CategoryMutationForm from '@/components/admin/category-mutation-form';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { CategoryMutationType } from '@/types/category';
import { Category } from '@prisma/client';
import { Table, TablePaginationConfig, TableProps, Tag } from 'antd';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		pageSize: 10,
		current: 1
	});
	const { isLoading, data, mutate } = useSWR(
		['category', pagination.pageSize, pagination.current],
		() =>
			getCategoryListAction({
				page: pagination.current,
				size: pagination.pageSize
			}),
		{
			onSuccess(data, key, config) {
				console.log(data);
				if (data) {
					setPagination({ ...pagination, total: data[1] });
				}
			}
		}
	);

	const [isOpen, setIsOpen] = useState(false);
	const [isAdd, setIsAdd] = useState(false);
	const [formValue, setFormValue] = useState<CategoryMutationType>({
		slug: '',
		name: '',
		order: 1,
		status: 'draft'
	});
	const [isPending, startTransition] = useTransition();

	const onSuccess = () => {
		setIsOpen(false);
		mutate();
	};

	const handleCreate = () => {
		setIsAdd(true);
		setIsOpen(true);
	};

	const handleEdit = (record: Category) => {
		setFormValue({ ...record });
		setIsAdd(false);
		setIsOpen(true);
	};

	const handleDelete = (id: string) => {
		startTransition(() => {
			deleteCategoryAction(id)
				.then(() => {
					toast.success('删除成功！');
					mutate();
				})
				.catch(() => {
					toast.error('Something went wrong');
				});
		});
	};

	const columns: TableProps<Category>['columns'] = [
		{
			dataIndex: 'slug',
			title: 'slug'
		},
		{
			dataIndex: 'label',
			title: '分类名称'
		},
		{
			dataIndex: 'order',
			title: '排序'
		},
		{
			dataIndex: 'status',
			title: '状态',
			render: (value, record) =>
				record.status === 'draft' ? (
					<Tag>草稿</Tag>
				) : (
					<Tag color="success">已发布</Tag>
				)
		},
		{
			title: '操作',
			dataIndex: '',
			key: 'action',
			render: (value, record, index) => (
				<div className="space-x-2">
					<a key="edit" onClick={() => handleEdit(record)}>
						修改
					</a>
					<a key="delete" onClick={() => handleDelete(record.id)}>
						删除
					</a>
				</div>
			)
		}
	];

	return (
		<div className="space-y-4">
			<Button onClick={handleCreate}>新增</Button>

			<Table
				rowKey="id"
				loading={isLoading}
				columns={columns}
				pagination={pagination}
				dataSource={data ? data[0] : []}
				onChange={(e) => setPagination(e)}
			/>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isAdd ? '添加' : '修改'}分类</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>

					<CategoryMutationForm
						defaultValues={formValue}
						onSuccess={onSuccess}
						isAdd={isAdd}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Page;