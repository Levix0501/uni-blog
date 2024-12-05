import { AppSidebar } from '@/components/admin/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
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
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="w-full flex justify-between items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						{/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
						{/* <Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb> */}
						<ModeToggle />
					</div>
				</header>
				<main className="flex-1 p-4 pt-0">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default Layout;
