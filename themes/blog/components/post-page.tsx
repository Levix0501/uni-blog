import MdxRemoteServer from '@/components/mdx/mdx-remote-server';
import { DashboardTableOfContents } from '@/components/mdx/toc';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/db';
import { getTableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';
import readingTime from 'reading-time';
import PostBreadcrumb from './breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import CodeFunWrapper from './code-fun-wrapper';

export interface PostPageProps {
	category: string;
	postSlugOrId: string;
}

const PostPage = async ({ category, postSlugOrId }: PostPageProps) => {
	let post = await db.post.findUnique({
		where: { slug: postSlugOrId, category: { slug: category } },
		include: { cover: true }
	});
	if (!post && Number.isInteger(Number(postSlugOrId))) {
		post = await db.post.findUnique({
			where: {
				id: Number(postSlugOrId),
				category: { slug: category }
			},
			include: { cover: true }
		});
	}
	if (!post) {
		return notFound();
	}

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

					<div className="mt-4 mb-12 text-gray-500 text-sm">
						<dl>
							<dt className="sr-only">Published on</dt>
							<dd className="">
								<time dateTime={post.createTime.toLocaleTimeString()}>
									{dayjs(post.createTime).format('MMMM D, YYYY')}
								</time>
							</dd>
						</dl>
					</div>

					<div className="prose dark:prose-invert max-w-none">
						{codeFunPreview ? (
							<CodeFunWrapper previewCode={codeFunPreview}>
								<MdxRemoteServer source={post.content} />
							</CodeFunWrapper>
						) : (
							<MdxRemoteServer source={post.content} />
						)}
					</div>
				</article>
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
