import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ChildrenType } from '@/types/common';

type AntdProviderProps = ChildrenType;

const AntdProvider = ({ children }: AntdProviderProps) => {
	return <AntdRegistry>{children}</AntdRegistry>;
};

export default AntdProvider;
