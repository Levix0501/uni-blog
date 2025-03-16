'use client';

import { generateDataAction } from '@/actions/document';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const Page = () => {
	const onClick = () => {
		generateDataAction();
	};

	return (
		<div>
			<Button onClick={onClick}>开始迁移数据</Button>
		</div>
	);
};

export default Page;
