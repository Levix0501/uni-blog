'use client';

import { deletePostAction, fetchPostsAction } from '@/actions/post';
import { Button } from '@/components/ui/button';
import { Post } from '@prisma/client';
import {
	Button as AntdButton,
	Popconfirm,
	Space,
	Table,
	TablePaginationConfig,
	TableProps,
	Tag
} from 'antd';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

const Page = () => {
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		pageSize: 10,
		current: 1
	});
	const { isLoading, data, mutate } = useSWR(
		['post', pagination.pageSize, pagination.current],
		() =>
			fetchPostsAction({ page: pagination.current, size: pagination.pageSize }),
		{
			onSuccess(data, key, config) {
				console.log(data);
				if (data) {
					setPagination({ ...pagination, total: data[1] });
				}
			}
		}
	);

	const [isPending, startTransition] = useTransition();

	const handleDelete = (id: number) => {
		startTransition(() => {
			deletePostAction(id)
				.then(() => {
					toast.success('删除成功！');
					mutate();
				})
				.catch(() => {
					toast.error('Something went wrong');
				});
		});
	};

	const columns: TableProps<Post>['columns'] = [
		{
			dataIndex: 'id',
			title: 'ID'
		},
		{
			dataIndex: 'title',
			title: '标题'
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
			key: 'action',
			render: (_, record) => (
				<Space size="middle">
					<Link key="edit" href={`/admin/editor/${record.id}`} target="_blank">
						编辑
					</Link>

					<Popconfirm
						title="删除内容"
						description="确定删除吗?"
						okText="确定"
						cancelText="取消"
						onConfirm={() => handleDelete(record.id)}
					>
						<AntdButton danger type="link">
							删除
						</AntdButton>
					</Popconfirm>
				</Space>
			)
		}
	];

	return (
		<div className="space-y-4">
			<Link href="/admin/editor/new" target="_blank" rel="noopener noreferrer">
				<Button>写文章</Button>
			</Link>

			<Table
				rowKey="id"
				loading={isLoading}
				columns={columns}
				pagination={pagination}
				dataSource={data ? data[0] : []}
				onChange={(e) => setPagination(e)}
			/>
		</div>
	);
};

export default Page;
