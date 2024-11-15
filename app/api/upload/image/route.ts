import { saveImage } from '@/lib/pic-bed';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const result = await saveImage(formData.get('file') as File);
	return NextResponse.json({ success: true, data: result });
}
