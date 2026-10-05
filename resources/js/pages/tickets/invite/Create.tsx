import { Head, Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Hash, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

export default function CreateInviteTicket() {
    const [success, setSuccess] = useState(false);

    return (
        <>
            <Head title="Create Invite Ticket" />

            {success && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Invite ticket created successfully!
                </div>
            )}

            <Form
                method="post"
                action="/tickets/invite"
                onSuccess={() => setSuccess(true)}
                resetOnSuccess
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Invite Code</Label>
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="code"
                                        type="text"
                                        name="code"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="off"
                                        placeholder="e.g. INVITE-ABC123"
                                    />
                                </div>
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="expires_at">Expires At</Label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="expires_at"
                                        type="date"
                                        name="expires_at"
                                        tabIndex={2}
                                    />
                                </div>
                                <InputError message={errors.expires_at} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="max_uses">Max Uses</Label>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="max_uses"
                                        type="number"
                                        name="max_uses"
                                        min="1"
                                        step="1"
                                        defaultValue="1"
                                        tabIndex={3}
                                    />
                                </div>
                                <InputError message={errors.max_uses} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner className="h-4 w-4" />}
                                Create Invite Ticket
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}