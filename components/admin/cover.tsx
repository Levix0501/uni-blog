'use client';

import { DocumentModel } from '@prisma/client';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { mutate } from 'swr';

import { removeDocumentCoverAction } from '@/actions/document';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCoverImage } from '@/hooks/use-cover-image';
import { cn } from '@/lib/utils';
import { ExtendedImageType } from '@/types/image';

interface CoverImageProps {
	image?: ExtendedImageType | null;
}

export const Cover = ({ image }: CoverImageProps) => {
	const url = image?.nextImageUrl;

	const { uuid } = useParams<{ uuid: DocumentModel['uuid'] }>();
	const onOpen = useCoverImage((state) => state.onOpen);

	const onRemove = async () => {
		mutate(
			['getDocumentAction', uuid],
			removeDocumentCoverAction({
				uuid,
				coverImageId: image?.id || null
			}),
			{
				optimisticData: (data) => ({ ...data, cover: null }),
				revalidate: false
			}
		);
	};

	return (
		<div
			className={cn(
				'relative w-full h-[35vh] group',
				!url && 'h-[12vh]',
				url && 'bg-muted'
			)}
		>
			{!!url && <Image src={url} fill alt="Cover" className="object-cover" />}
			{url && (
				<div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
					<Button
						onClick={onOpen}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<ImageIcon className="h-4 w-4 mr-2" />
						修改封面
					</Button>
					<Button
						onClick={onRemove}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<X className="h-4 w-4 mr-2" />
						删除
					</Button>
				</div>
			)}
		</div>
	);
};

Cover.Skeleton = function CoverSkeleton() {
	return <Skeleton className="w-full h-[12vh]" />;
};
