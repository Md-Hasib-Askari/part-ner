import { AuthLayout } from '@/components/templates/auth-layout';

export default function AuthGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthLayout>{children}</AuthLayout>;
}
