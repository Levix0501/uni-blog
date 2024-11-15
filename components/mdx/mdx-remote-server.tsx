import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from './mdx-components';
import { serializeOptions } from './serialize-options';

const MdxRemoteServer = ({ source }: { source: string }) => {
	return (
		<MDXRemote
			source={source}
			components={mdxComponents}
			options={serializeOptions}
		/>
	);
};

export default MdxRemoteServer;
