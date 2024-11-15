'use client';

import { TableOfContents } from '@/lib/toc';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export interface TocProps {
	toc: TableOfContents;
}
const Toc = ({ toc }: TocProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const renderTocItems = (items: TableOfContents['items']) => {
		return (
			<ul className="pl-4 dark:border-slate-800">
				{items &&
					items.map((item) => (
						<li key={item.url}>
							<a
								href={item.url}
								className="mb-1 flex items-center gap-x-2 rounded-lg px-2 focus:outline-none hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
							>
								<div className="w-full break-words py-2 text-base focus:outline-none text-slate-700  dark:text-slate-200">
									{item.title}
								</div>
							</a>

							{renderTocItems(item.items)}
						</li>
					))}
			</ul>
		);
	};

	return (
		toc.items && (
			<div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 mx-auto mb-10 max-w-[812px]">
				{!isExpanded && (
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_#ffffff00_65.93%,_#ffffff_86%)] dark:bg-[linear-gradient(180deg,_#10182b00_65.93%,_#10182B_86%)]"></div>
				)}

				<div
					className={cn('pr-4', {
						'max-h-[400px] overflow-hidden': !isExpanded
					})}
				>
					<h2 className="px-6 py-5 pb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
						<span>目录</span>
					</h2>

					{renderTocItems(toc.items)}
				</div>

				<div className="relative flex items-center justify-center pb-4">
					<button
						className="flex items-center justify-center gap-1.5 rounded-[28px] px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
						onClick={() => setIsExpanded((pre) => !pre)}
					>
						<span className="text-slate-600 dark:text-slate-300">
							{isExpanded ? '收起' : '展开'}
						</span>
						{isExpanded ? (
							<ChevronUp className="h-4 w-4 stroke-current text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 stroke-current text-slate-500" />
						)}
					</button>
				</div>
			</div>
		)
	);
};

export default Toc;
