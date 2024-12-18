import MdxRemoteServer from '@/components/mdx/mdx-remote-server';
import { DashboardTableOfContents } from '@/components/mdx/toc';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/db';
import { getTableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import readingTime from 'reading-time';
import PostBreadcrumb from './components/breadcrumb';
import CodeFunWrapper from './components/code-fun-wrapper';
import PostMetadata from './components/post-metadata';

export interface PostPageProps {
	category: string;
	post: string;
}

const PostPage = async ({ category, post: postSlugOrId }: PostPageProps) => {
	let post = await db.post.findUnique({
		where: {
			slug: postSlugOrId,
			category: { slug: category },
			status: 'published'
		},
		include: { cover: true, category: true }
	});
	if (!post && Number.isInteger(Number(postSlugOrId))) {
		post = await db.post.findUnique({
			where: {
				id: Number(postSlugOrId),
				category: { slug: category }
			},
			include: { cover: true, category: true }
		});
	}
	if (!post) {
		return notFound();
	}

	const nextPost = await db.post.findFirst({
		where: {
			category: { slug: category },
			status: 'published',
			id: { lt: post.id }
		},
		orderBy: { id: 'desc' }
	});

	const previousPost = await db.post.findFirst({
		where: {
			category: { slug: category },
			status: 'published',
			id: { gt: post.id }
		},
		orderBy: { id: 'asc' }
	});

	const stats = readingTime(post.content);

	const toc = await getTableOfContents(post.content);
	const tocItems = Boolean(toc.items && toc.items.length);

	let codeFunPreview = '';
	if (category === 'code-fun') {
		const regex = /(?<=```html)([\s\S]*?)(?=```)/g;
		const match = post.content.match(regex);
		if (match && match.length) {
			codeFunPreview = match[0];
		}
	}

	return (
		<>
			<div className={cn(tocItems ? 'lg:col-span-3' : 'lg:col-span-4')}>
				<article className="pt-4">
					<PostBreadcrumb title={post.title} />

					<h1 className="font-heading mt-2 text-4xl font-bold tracking-tight leading-inherit">
						{post.title}
					</h1>

					<PostMetadata post={post} className="mt-4 mb-12" shouldIncViewCount />

					<div>
						{codeFunPreview ? (
							<CodeFunWrapper previewCode={codeFunPreview}>
								<MdxRemoteServer source={post.content} />
							</CodeFunWrapper>
						) : (
							<MdxRemoteServer source={post.content} />
						)}
					</div>
				</article>

				<div className="mb-8 flex items-center border-t pt-8 dark:border-neutral-800 contrast-more:border-neutral-400 dark:contrast-more:border-neutral-400 print:hidden">
					{previousPost && (
						<Link
							href={`/${category}/${previousPost.slug || previousPost.id}`}
							className="flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 md:text-lg pr-4"
						>
							<ChevronLeft />
							{previousPost.title}
						</Link>
					)}

					{nextPost && (
						<Link
							href={`/${category}/${nextPost.slug || nextPost.id}`}
							className="flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 md:text-lg ml-auto pl-4 text-right"
						>
							{nextPost.title}
							<ChevronRight />
						</Link>
					)}
				</div>
			</div>

			{tocItems && (
				<div className="hidden text-sm lg:block px-4">
					<div className="sticky top-16 -mt-10 pt-4">
						<ScrollArea className="pb-10">
							<div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
								<DashboardTableOfContents toc={toc} />
							</div>
						</ScrollArea>
					</div>
				</div>
			)}
		</>
	);
};

export default PostPage;
