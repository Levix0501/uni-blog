'use client';

import { ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCoverImage } from '@/hooks/use-cover-image';

const AddCoverButton = () => {
	const onOpen = useCoverImage((state) => state.onOpen);

	return (
		<Button
			className="text-muted-foreground text-xs"
			variant="outline"
			size="sm"
			onClick={onOpen}
		>
			<ImageIcon className="h-4 w-4 mr-2" />
			添加封面
		</Button>
	);
};

export default AddCoverButton;
