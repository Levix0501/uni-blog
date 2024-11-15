'use client';
import { Button, Upload } from 'antd';
import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Key, useState } from 'react';

const ImageUploader = () => {
	const [key, setKey] = useState<Key>(Math.random());
	const router = useRouter();

	const onStatusChange = (status?: string) => {
		if (status === 'done') {
			setKey(Math.random());
			router.refresh();
		}
	};

	return (
		<Upload
			key={key}
			action="/api/upload/image"
			listType="picture"
			onChange={(e) => onStatusChange(e.file.status)}
		>
			<Button type="primary" icon={<UploadCloud />}>
				Upload
			</Button>
		</Upload>
	);
};

export default ImageUploader;
