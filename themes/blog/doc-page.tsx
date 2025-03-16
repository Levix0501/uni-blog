import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import readingTime from 'reading-time';

import MdxRemoteServer from '@/components/mdx/mdx-remote-server';
import { DashboardTableOfContents } from '@/components/mdx/toc';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/db';
import { getTableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';

import DocBreadcrumb from './components/breadcrumb';
import CodeFunWrapper from './components/code-fun-wrapper';
import DocMetadata from './components/doc-metadata';

export interface DocPageProps {
	category: string;
	doc: string;
}

const DocPage = async ({
	category: categorySlug,
	doc: docSlug
}: DocPageProps) => {
	const categoryDoc = await db.documentModel.findUnique({
		where: { slug: categorySlug }
	});

	if (!categoryDoc) {
		notFound();
	}

	const doc = await db.documentModel.findUnique({
		where: {
			slug: docSlug,
			parentUuid: categoryDoc.uuid,
			isPublished: true,
			isArchived: false
		},
		include: { cover: true }
	});

	if (!doc) {
		notFound();
	}

	const nextDoc = await db.documentModel.findFirst({
		where: {
			parentUuid: categoryDoc.uuid,
			isPublished: true,
			isArchived: false,
			id: { lt: doc.id }
		},
		orderBy: { id: 'desc' }
	});

	const previousDoc = await db.documentModel.findFirst({
		where: {
			parentUuid: categoryDoc.uuid,
			isPublished: true,
			isArchived: false,
			id: { gt: doc.id }
		},
		orderBy: { id: 'asc' }
	});

	const stats = readingTime(doc.content);

	const toc = await getTableOfContents(doc.content);
	const tocItems = Boolean(toc.items && toc.items.length);

	let codeFunPreview = '';
	if (categorySlug === 'code-fun') {
		const regex = /(?<=```html)([\s\S]*?)(?=```)/g;
		const match = doc.content.match(regex);
		if (match && match.length) {
			codeFunPreview = match[0];
		}
	}

	return (
		<>
			<div className={cn(tocItems ? 'lg:col-span-3' : 'lg:col-span-4')}>
				<article className="pt-4">
					<DocBreadcrumb title={doc.title} />

					<h1 className="font-heading mt-2 text-4xl font-bold tracking-tight leading-inherit">
						{doc.title}
					</h1>

					<DocMetadata
						doc={doc}
						categoryDoc={categoryDoc}
						className="mt-4 mb-12"
						shouldIncViewCount
					/>

					<div>
						{codeFunPreview ? (
							<CodeFunWrapper previewCode={codeFunPreview}>
								<MdxRemoteServer source={doc.content} />
							</CodeFunWrapper>
						) : (
							<MdxRemoteServer source={doc.content} />
						)}
					</div>
				</article>

				<div className="mb-8 flex items-center border-t pt-8 dark:border-neutral-800 contrast-more:border-neutral-400 dark:contrast-more:border-neutral-400 print:hidden">
					{previousDoc && (
						<Link
							href={`/${categorySlug}/${previousDoc.slug}`}
							className="flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 md:text-lg pr-4"
						>
							<ChevronLeft />
							{previousDoc.title}
						</Link>
					)}

					{nextDoc && (
						<Link
							href={`/${categorySlug}/${nextDoc.slug}`}
							className="flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 md:text-lg ml-auto pl-4 text-right"
						>
							{nextDoc.title}
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

export default DocPage;
