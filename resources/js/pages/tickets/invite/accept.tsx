import { Head, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Lock, Mail } from 'lucide-react';

type Props = {
    invite: {
        code: string;
        invited_name: string;
        invited_email: string;
    };
};

export default function AcceptInvite({ invite }: Props) {
    return (
        <>
            <Head title="Accept Invitation" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-md rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <div className="mb-6 space-y-1 text-center">
                        <h1 className="text-xl font-semibold">
                            Welcome, {invite.invited_name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter the temporary password from your invitation
                            email to activate your account.
                        </p>
                    </div>

                    <Form
                        method="post"
                        action={`/invite/${invite.code}`}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    {/* Email (read-only) */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                value={invite.invited_email}
                                                disabled
                                                readOnly
                                                className="cursor-not-allowed pr-9 opacity-70"
                                            />
                                            <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            This is the email your invitation
                                            was sent to.
                                        </p>
                                    </div>

                                    {/* Temporary password */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">
                                            Temporary Password{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="current-password"
                                                placeholder="Enter the password from your email"
                                                className="pr-9"
                                                aria-invalid={!!errors.password}
                                            />
                                            <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        tabIndex={2}
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Spinner className="h-4 w-4" />
                                        )}
                                        Accept & Log in
                                    </Button>
                                </div>

                                <p className="text-center text-xs text-muted-foreground">
                                    Having trouble? Contact the person who
                                    invited you.
                                </p>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}