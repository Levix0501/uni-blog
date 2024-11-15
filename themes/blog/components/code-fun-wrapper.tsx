'use client';
import { Card, CardContent } from '@/components/ui/card';
import { ChildrenType } from '@/types/common';

import { Tab, Tabs } from '@nextui-org/react';

export interface CodeFunWrapperProps extends ChildrenType {
	previewCode: string;
}

const CodeFunWrapper = ({ children, previewCode }: CodeFunWrapperProps) => {
	return (
		<Tabs aria-label="Options" defaultSelectedKey="code">
			<Tab key="code" title="源码">
				{children}
			</Tab>
			<Tab key="preview" title="预览">
				<Card className="mt-8">
					<CardContent className="p-0">
						<div className="w-full pb-[calc(100vh-15rem)] relative rounded-md overflow-hidden">
							<iframe
								srcDoc={previewCode}
								className="absolute w-full h-full"
							></iframe>
						</div>
					</CardContent>
				</Card>
			</Tab>
		</Tabs>
	);
};

export default CodeFunWrapper;
