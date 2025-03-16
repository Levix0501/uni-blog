import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import { ArrowUpFromLine, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
	MouseEventHandler,
	Ref,
	useEffect,
	useImperativeHandle,
	useRef,
	useState
} from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useDocumentSetting } from '@/hooks/use-document-setting';
import { Spinner } from '@nextui-org/react';
import { cn } from '@/lib/utils';

export interface ImageCropperMethods {
	getCroppedImage: () => Promise<File> | null;
}

interface ImageCropperProps {
	isPending: boolean;
	setIsCropping: (value: boolean) => void;
	ref: Ref<ImageCropperMethods>;
}

const ImageCropper = ({ setIsCropping, ref, isPending }: ImageCropperProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const [imgSrc, setImgSrc] = useState('');
	const cropper = useRef<Cropper>(null);
	const base64Cover = useDocumentSetting((state) => state.base64Cover);

	useEffect(() => {
		setIsCropping(false);

		if (base64Cover) {
			setImgSrc(base64Cover);
		}
	}, [base64Cover]);

	useEffect(() => {
		if (imgRef.current && imgSrc) {
			cropper.current?.destroy();
			cropper.current = new Cropper(imgRef.current, {
				aspectRatio: 16 / 10,
				viewMode: 1,
				dragMode: 'move',
				guides: false,
				autoCropArea: 1.0,
				checkCrossOrigin: false,
				cropend: async () => {
					setIsCropping(true);
				}
			});
		}
	}, [imgSrc, setIsCropping]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				toast.warning('图片大小不能超过2MB');
				e.target.value = '';
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setImgSrc(result);
				setIsCropping(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const onChooseImage: MouseEventHandler = (e) => {
		inputRef.current?.click();
	};

	const handleRemoveCover: MouseEventHandler = (e) => {
		cropper.current?.destroy();
		cropper.current = null;
		setImgSrc('');
		setIsCropping(true);
	};

	const getCroppedImage = () => {
		if (!cropper.current) return null;

		// 获取裁剪后的 Canvas 数据
		const canvas = cropper.current.getCroppedCanvas({
			width: 400,
			height: 250
		});

		return new Promise<File>((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						const file = new File([blob], 'cropped-image.png', {
							type: 'image/png'
						});
						resolve(file);
					}
				},
				'image/png',
				1.0
			);
		});
	};

	useImperativeHandle(ref, () => ({
		getCroppedImage
	}));

	return (
		<div className={cn(isPending && 'pointer-events-none relative opacity-70')}>
			<input
				type="file"
				accept="image/*"
				className="hidden"
				ref={inputRef}
				onChange={handleFileChange}
			/>

			{imgSrc ? (
				<div className="space-y-3.5">
					<div className="w-full aspect-video rounded-md overflow-hidden">
						<img src={imgSrc} ref={imgRef}></img>
					</div>

					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="flex-1"
							onClick={onChooseImage}
							type="button"
						>
							<ArrowUpFromLine size={14} /> 重新上传
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={handleRemoveCover}
							type="button"
						>
							<Trash2 size={14} /> 清除
						</Button>
					</div>
				</div>
			) : (
				<div className="space-y-3.5 flex flex-col items-center">
					<div
						className="w-full aspect-video rounded-md overflow-hidden bg-[#f4f5f5] cursor-pointer hover:border-dashed hover:border-border hover:border flex flex-col items-center justify-center gap-4"
						onClick={onChooseImage}
					>
						<Image alt="" src="/picture.png" width={72} height={72} />

						<p className="text-xs">添加封面有助于吸引读者</p>
					</div>

					<Button
						size="sm"
						variant="outline"
						onClick={onChooseImage}
						type="button"
					>
						<ArrowUpFromLine size={14} /> 上传图片
					</Button>
				</div>
			)}

			{isPending && (
				<Spinner
					className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
					size="sm"
				/>
			)}
		</div>
	);
};

export default ImageCropper;
