import { getImageUrl } from '@/lib/pic-bed';
import { Category, Image as ImageType, Post } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import PostMetadata from './post-metadata';

export interface FeedProps {
	post: Post & { cover: ImageType | null } & { category: Category };
}

const Feed = ({ post }: FeedProps) => {
	const postUrl = `/${post.category.slug}/${post.slug || post.id}`;
	return (
		<article className="space-y-2">
			{/* <dl>
				<dt className="sr-only">Published on</dt>
				<dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-300">
					<time dateTime={post.createTime.toLocaleTimeString()}>
						{dayjs(post.createTime).format('MMMM D, YYYY')}
					</time>
				</dd>
			</dl> */}

			<div className="space-y-6">
				<h2 className="text-2xl leading-8 font-bold tracking-tight">
					<Link href={postUrl}>{post.title}</Link>
				</h2>

				<div className="lg:flex lg:justify-between lg:gap-3">
					<div className="space-y-5">
						<Link href={postUrl}>
							<div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300">
								<p>{post.abstract}</p>
							</div>
						</Link>

						{/* <div className="text-base leading-6 font-medium">
							<Link href={postUrl} target="_blank" aria-label="read more">
								阅读全文 <ArrowRight className="inline-block" size={16} />
							</Link>
						</div> */}

						<PostMetadata post={post} />
					</div>

					<div className="mt-5 lg:mt-0 lg:w-[180px] shrink-0">
						<div className="relative w-full pb-[56.25%]">
							<div className="absolute inset-0">
								<Link
									href={postUrl}
									className="block w-full h-full overflow-hidden rounded-xl md:rounded-lg focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 focus:dark:ring-offset-slate-800"
								>
									{post.cover && (
										<Image
											src={getImageUrl(post.cover).nextImageUrl}
											alt={post.title}
											fill
											className="object-cover rounded-xl md:rounded-lg"
										/>
									)}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Feed;
