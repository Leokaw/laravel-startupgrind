import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { FlashErrorDialog } from '@/components/ui/flash-error-dialog';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {children}
            <FlashErrorDialog />
        </AuthLayoutTemplate>
    );
}
