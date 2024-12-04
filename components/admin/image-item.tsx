'use client';

import { deleteImageAction } from '@/actions/image';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Image as ImageType } from '@prisma/client';
import { Image } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export interface ImageItemProps {
	id: string;
	image: ImageType & { imgUrl: string; nextImageUrl: string };
}

const ImageItem = ({ id, image }: ImageItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const [copiedValue, copyFn] = useCopyToClipboard();

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="w-full pb-[56.25%] relative">
					<div className="absolute w-full h-full">
						<Image
							height="100%"
							className="mx-auto"
							src={image.imgUrl}
							alt=""
						/>
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem
					onClick={() => {
						copyFn(id);
					}}
				>
					复制 id
				</ContextMenuItem>
				<ContextMenuItem
					onClick={async () => {
						const result = await deleteImageAction(id);
						if (result.success) {
							toast.success(result.success);
							router.refresh();
						} else if (result.error) {
							toast.error(result.error);
						}
					}}
				>
					删除
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default ImageItem;
