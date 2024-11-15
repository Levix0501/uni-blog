import { CopyButton } from './copy-button';
import { cn } from '@/lib/utils';
import './highlight.css';

export const mdxComponents = {
	h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h1
			className={cn(
				'font-heading mt-2 scroll-m-20 text-4xl font-bold',
				className
			)}
			{...props}
		/>
	),
	h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h2
			className={cn(
				'font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
				className
			)}
			{...props}
		/>
	),
	h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h3
			className={cn(
				'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
				className
			)}
			{...props}
		/>
	),
	h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h4
			className={cn(
				'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
				className
			)}
			{...props}
		/>
	),
	h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h5
			className={cn(
				'mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
				className
			)}
			{...props}
		/>
	),
	h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
		<h6
			className={cn(
				'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
				className
			)}
			{...props}
		/>
	),
	a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
		<a
			className={cn('font-medium underline underline-offset-4', className)}
			{...props}
		/>
	),
	p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
		<p
			className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
			{...props}
		/>
	),
	ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
		<ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
	),
	ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
		<ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
	),
	li: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<li className={cn('mt-2', className)} {...props} />
	),
	blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<blockquote
			className={cn('mt-6 border-l-2 pl-6 italic', className)}
			{...props}
		/>
	),
	img: ({
		className,
		alt,
		...props
	}: React.ImgHTMLAttributes<HTMLImageElement>) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img className={cn('rounded-md', className)} alt={alt} {...props} />
	),
	hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
		<hr className="my-4 md:my-8" {...props} />
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className="my-6 w-full overflow-y-auto rounded-lg">
			<table
				className={cn('w-full overflow-hidden rounded-lg', className)}
				{...props}
			/>
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr className={cn('m-0 border-t p-0', className)} {...props} />
	),
	th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<th
			className={cn(
				'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
				className
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<td
			className={cn(
				'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
				className
			)}
			{...props}
		/>
	),
	pre: ({
		className,
		__raw__,
		...props
	}: React.HTMLAttributes<HTMLPreElement> & { __raw__?: string }) => {
		return (
			<div className="relative">
				<pre
					className={cn(
						'relative mb-4 mt-6 max-h-[500px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900 whitespace-pre-wrap',
						className
					)}
					{...props}
				/>

				<CopyButton
					style={{ right: '16px', top: '16px' }}
					value={__raw__ ?? ''}
					className={cn('absolute right-4 top-4')}
				/>
			</div>
		);
	},
	code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
		<code
			className={cn(
				'relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm',
				className
			)}
			{...props}
		/>
	)
};
