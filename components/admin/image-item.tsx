'use client';

import { deleteImageAction } from '@/actions/image';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from '@/components/ui/context-menu';
import { Image } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export interface ImageItemProps {
	id: string;
	url: string;
}

const ImageItem = ({ id, url }: ImageItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const [copiedValue, copyFn] = useCopyToClipboard();

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="w-full pb-[56.25%] relative">
					<div className="absolute w-full h-full">
						<Image height="100%" className="mx-auto" src={url} alt="" />
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
					onClick={() => {
						copyFn(`![](${url})`);
					}}
				>
					复制 markdown 链接
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
