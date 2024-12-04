'use client';
import { Spinner } from '@nextui-org/react';
import { Upload, UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export interface SiteLogoUploaderProps {
	defaultFileList: UploadFile[];
	onChange: (url: string) => void;
}

const SiteLogoUploader = ({
	defaultFileList,
	onChange
}: SiteLogoUploaderProps) => {
	const [loading, setLoading] = useState(false);

	const handleChange: UploadProps['onChange'] = (e) => {
		console.log(e);
		if (e.file.status === 'uploading') {
			setLoading(true);
			return;
		}

		if (e.file.status === 'done') {
			setLoading(false);
			onChange(e.file.response.data.id);
		}
	};

	const uploadButton = (
		<button style={{ border: 0, background: 'none' }} type="button">
			{loading ? <Spinner /> : <Plus />}
		</button>
	);

	return (
		<Upload
			name="file"
			action="/api/upload/image"
			listType="picture-card"
			className="avatar-uploader"
			maxCount={1}
			defaultFileList={defaultFileList}
			onChange={handleChange}
		>
			{uploadButton}
		</Upload>
	);
};

export default SiteLogoUploader;
