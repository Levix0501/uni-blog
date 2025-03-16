import { DocumentModel, Image as ImageType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import { db } from '@/lib/db';
import { getImageUrl } from '@/lib/pic-bed';

import DocMetadata from './doc-metadata';

export interface FeedProps {
	doc: DocumentModel & { cover: ImageType | null };
}

const Feed = async ({ doc }: FeedProps) => {
	let categoryDoc: DocumentModel | null = null;

	if (doc.parentUuid) {
		categoryDoc = await db.documentModel.findUnique({
			where: { uuid: doc.parentUuid }
		});
	}

	const docUrl = (categoryDoc ? `/${categoryDoc.slug}/` : '/') + doc.slug;

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
					<Link href={docUrl}>{doc.title}</Link>
				</h2>

				<div className="lg:flex lg:justify-between lg:gap-3">
					<div className="space-y-5">
						<Link href={docUrl}>
							<div className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300">
								<p>{doc.abstract}</p>
							</div>
						</Link>

						{/* <div className="text-base leading-6 font-medium">
							<Link href={postUrl} target="_blank" aria-label="read more">
								阅读全文 <ArrowRight className="inline-block" size={16} />
							</Link>
						</div> */}

						<DocMetadata doc={doc} categoryDoc={categoryDoc} />
					</div>

					{doc.cover && (
						<div className="mt-5 lg:mt-0 lg:w-[180px] shrink-0">
							<div className="relative w-full pb-[56.25%]">
								<div className="absolute inset-0">
									<Link
										href={docUrl}
										className="block w-full h-full overflow-hidden rounded-xl md:rounded-lg focus:outline-none focus:ring focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 focus:dark:ring-offset-slate-800"
									>
										(
										<Image
											src={getImageUrl(doc.cover).nextImageUrl}
											alt={doc.title}
											fill
											className="object-cover rounded-xl md:rounded-lg"
										/>
										)
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</article>
	);
};

export default Feed;
