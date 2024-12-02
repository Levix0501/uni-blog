import { cn } from '@/lib/utils';
import { Category, Image as ImageType, Post } from '@prisma/client';
import dayjs from 'dayjs';
import { Eye, LayoutGrid } from 'lucide-react';
import PostViewCount from './post-view-count';
import Link from 'next/link';

export interface PostMetadataProps {
	post: Post & { cover: ImageType | null } & { category: Category };
	className?: string;
	shouldIncViewCount?: boolean;
}

const PostMetadata = ({
	post,
	className,
	shouldIncViewCount
}: PostMetadataProps) => {
	return (
		<div className={cn('flex items-center justify-between', className)}>
			<dl>
				<dt className="sr-only">Published on</dt>
				<dd className="flex flex-wrap items-center gap-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
					<time dateTime={post.createTime.toLocaleTimeString()}>
						{dayjs(post.createTime).format('YYYY-MM-DD')}
					</time>

					<span className="text-gray-300 dark:text-gray-700">/</span>

					<div className="flex items-center gap-1">
						<Eye size={14} />
						<PostViewCount postId={post.id} shouldInc={shouldIncViewCount} />
					</div>

					<span className="text-gray-300 dark:text-gray-700">/</span>

					<Link href={`/category/${post.category.slug}`}>
						{post.category.name}
					</Link>
				</dd>
			</dl>
		</div>
	);
};

export default PostMetadata;
