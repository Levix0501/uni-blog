import { AppSidebar } from '@/components/admin/app-sidebar';
import { CoverImageModal } from '@/components/admin/cover-image-modal';
import DocumentSettingSheet, {
	DocumentSettingSheetTrigger
} from '@/components/admin/document-setting-sheet';
import EditingDocumentTitle from '@/components/admin/editing-document-title';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from '@/components/ui/sidebar';
import { ChildrenType } from '@/types/common';

const Layout = async ({ children }: ChildrenType) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-50">
					<div className="w-full flex justify-between items-center px-4">
						<div className="flex items-center gap-2">
							<SidebarTrigger className="-ml-1" />

							<EditingDocumentTitle />
						</div>

						<DocumentSettingSheetTrigger />
					</div>
				</header>

				{children}

				<CoverImageModal />
				<DocumentSettingSheet />
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Layout;
