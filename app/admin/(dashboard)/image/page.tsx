import ImageItem from '@/components/admin/image-item';
import ImageUploader from '@/components/admin/image-uploader';
import Pagination from '@/components/admin/pagination';
import { db } from '@/lib/db';
import { getImageUrl } from '@/lib/pic-bed';
import { z } from 'zod';

const ImageGalleryPage = async ({
	searchParams
}: {
	searchParams: { page?: string; size?: string };
}) => {
	const parsedSearchParams = z
		.object({
			page: z.preprocess(
				(val) => (isNaN(Number(val)) ? 1 : Number(val)),
				z.number().min(1)
			),
			size: z.preprocess(
				(val) => (isNaN(Number(val)) ? 20 : Number(val)),
				z.number().min(1)
			)
		})
		.safeParse(searchParams);

	const { page, size } = parsedSearchParams.error
		? { page: 1, size: 20 }
		: parsedSearchParams.data;

	const list = (
		await db.image.findMany({
			skip: (page - 1) * size,
			take: size,
			orderBy: { createTime: 'desc' }
		})
	).map(getImageUrl);
	const total = await db.image.count();

	return (
		<div className="space-y-4">
			<ImageUploader />

			<div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{list.map((e) => (
					<ImageItem key={e.id} id={e.id} image={e} />
				))}
			</div>

			<Pagination page={page} size={size} total={total} />
		</div>
	);
};

export default ImageGalleryPage;
