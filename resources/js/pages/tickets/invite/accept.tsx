import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

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

            <Form
                method="post"
                action={`/invite/${invite.code}`}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={invite.invited_email}
                                    disabled
                                    readOnly
                                    className="cursor-not-allowed opacity-70"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This is the email your invitation was sent to.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Temporary Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="current-password"
                                    placeholder="Enter the password from your email"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={2}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Accept & Log in
                            </Button>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                            Having trouble? Contact the person who invited you.
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

AcceptInvite.layout = {
    title: `Welcome, ${''}` /* will be overridden below */,
    description: 'Enter the temporary password from your invitation email',
};