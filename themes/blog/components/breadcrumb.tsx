import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

const DocBreadcrumb = ({ title }: { title: string }) => {
	return (
		<Breadcrumb className="mt-1.5">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">博客</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>{title}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DocBreadcrumb;
