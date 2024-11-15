'use client';

import { MDXRemote } from 'next-mdx-remote';
import { mdxComponents } from './mdx-components';

const MdxRemoteClient = ({ compiledSource }: { compiledSource: string }) => {
	return (
		<MDXRemote
			compiledSource={compiledSource}
			components={mdxComponents}
			scope={undefined}
			frontmatter={undefined}
		/>
	);
};

export default MdxRemoteClient;
