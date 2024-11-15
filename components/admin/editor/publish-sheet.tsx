import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { ChildrenType } from '@/types/common';

export interface PublishSheetProps extends ChildrenType {
	type: 'create' | 'update';
}

const PublishSheet = ({ type, children }: PublishSheetProps) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>{type === 'create' ? '发布' : '更新'}</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{type === 'create' ? '发布' : '更新'}文章</SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>
				{children}
				<SheetFooter>
					<SheetClose asChild></SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default PublishSheet;
