import dayjs from 'dayjs';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { DocumentModel, Image as ImageType } from '@prisma/client';

import { cn } from '@/lib/utils';

import DocViewCount from './doc-view-count';

export interface DocMetadataProps {
	doc: DocumentModel & { cover: ImageType | null };
	categoryDoc: DocumentModel | null;
	className?: string;
	shouldIncViewCount?: boolean;
}

const DocMetadata = ({
	doc,
	categoryDoc,
	className,
	shouldIncViewCount
}: DocMetadataProps) => {
	return (
		<div className={cn('flex items-center justify-between', className)}>
			<dl>
				<dt className="sr-only">Published on</dt>
				<dd className="flex flex-wrap items-center gap-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
					<time dateTime={doc.createTime.toLocaleTimeString()}>
						{dayjs(doc.createTime).format('YYYY-MM-DD')}
					</time>

					<span className="text-gray-300 dark:text-gray-700">/</span>

					<div className="flex items-center gap-1">
						<Eye size={14} />
						<DocViewCount docId={doc.id} shouldInc={shouldIncViewCount} />
					</div>

					<span className="text-gray-300 dark:text-gray-700">/</span>

					{categoryDoc && (
						<Link href={`/category/${categoryDoc.slug}`}>
							{categoryDoc.title}
						</Link>
					)}
				</dd>
			</dl>
		</div>
	);
};

export default DocMetadata;
