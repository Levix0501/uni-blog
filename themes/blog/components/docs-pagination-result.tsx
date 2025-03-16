import { notFound } from 'next/navigation';
import { DocumentModel } from '@prisma/client';

import { db } from '@/lib/db';

import Feed from './feed';
import Pagination from './home-pagination';

export interface DocsPaginationResultProps {
	page: number;
	categoryDoc?: DocumentModel;
	generateHref: (page: number) => string;
}

const DocsPaginationResult = async ({
	page,
	categoryDoc,
	generateHref
}: DocsPaginationResultProps) => {
	const size = 10;

	const conditions = {
		isPublished: true,
		isArchived: false,
		level: 1,
		parentUuid: categoryDoc?.uuid
	};
	const [docs, total] = await Promise.all([
		db.documentModel.findMany({
			where: conditions,
			skip: (page - 1) * 10,
			take: size,
			orderBy: { createTime: 'desc' },
			include: { cover: true }
		}),
		db.documentModel.count({ where: conditions })
	]);

	if (docs.length === 0) {
		notFound();
	}

	return (
		<>
			<ul className="divide-y divide-gray-200 dark:divide-slate-200/5">
				{docs.map((doc) => (
					<li key={doc.id} className="py-12">
						<Feed doc={doc} />
					</li>
				))}
			</ul>

			<Pagination
				currentPage={page}
				totalPages={Math.ceil(total / size)}
				generateHref={generateHref}
			/>
		</>
	);
};

export default DocsPaginationResult;
