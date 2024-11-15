import LoginForm from '@/components/admin/login-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

const Page = () => {
	return (
		<main className="h-screen flex justify-center items-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>登录</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense>
						<LoginForm />
					</Suspense>
				</CardContent>
			</Card>
		</main>
	);
};

export default Page;
