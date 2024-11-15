import highlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { MDXRemoteProps } from 'next-mdx-remote/rsc';

export const serializeOptions: MDXRemoteProps['options'] = {
	parseFrontmatter: true,
	mdxOptions: {
		rehypePlugins: [
			rehypeSlug,
			() => (tree: any) => {
				visit(tree, (node) => {
					if (node?.type === 'element' && node?.tagName === 'pre') {
						const [codeEl] = node.children;
						if (codeEl.tagName !== 'code') {
							return;
						}
						node.properties['__raw__'] = codeEl.children?.[0]?.value;
					}
				});
			},
			highlight,
			[
				rehypeAutolinkHeadings,
				{
					properties: {
						className: ['subheading-anchor'],
						ariaLabel: 'Link to section'
					}
				}
			]
		]
	}
};
