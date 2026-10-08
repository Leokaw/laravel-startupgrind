import { Head, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Mail, User, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { isBlockedEmailDomain } from '@/lib/blocked-email-domains';

const inputLikeClasses =
    'flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40';

const BLOCKED_MESSAGE =
    'Please use a business email. Personal email providers (Gmail, Hotmail, Yahoo, etc.) are not accepted.';

export default function CreateInviteTicket() {
    const [success, setSuccess] = useState(false);
    const [nameLength, setNameLength] = useState(0);
    const [expiresAt, setExpiresAt] = useState<Date | undefined>();
    const [emailError, setEmailError] = useState<string | null>(null);

    return (
        <>
            <Head title="Create Invite Ticket" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-2xl rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    {success && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                            Invitation sent successfully!
                        </div>
                    )}

                    <Form
                        method="post"
                        action="/tickets/invite"
                        onSuccess={() => {
                            setSuccess(true);
                            setNameLength(0);
                            setExpiresAt(undefined);
                            setEmailError(null);
                        }}
                        resetOnSuccess
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    {/* Invited Name */}
                                    <Field data-invalid={!!errors.invited_name}>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel htmlFor="invited_name">
                                                Invited Name{' '}
                                                <span className="text-destructive">*</span>
                                            </FieldLabel>
                                            <span className="text-xs text-muted-foreground">
                                                {nameLength}/50
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="invited_name"
                                                type="text"
                                                name="invited_name"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                maxLength={50}
                                                placeholder="Full name of the invitee"
                                                className="pr-9"
                                                aria-invalid={!!errors.invited_name}
                                                onChange={(e) =>
                                                    setNameLength(e.target.value.length)
                                                }
                                            />
                                            <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        {errors.invited_name && (
                                            <FieldError>{errors.invited_name}</FieldError>
                                        )}
                                    </Field>

                                    {/* Invited Email */}
                                    <Field data-invalid={!!(errors.invited_email || emailError)}>
                                        <FieldLabel htmlFor="invited_email">
                                            Invited Email{' '}
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="invited_email"
                                                type="email"
                                                name="invited_email"
                                                required
                                                tabIndex={2}
                                                placeholder="name@company.com"
                                                className="pr-9"
                                                aria-invalid={
                                                    !!(errors.invited_email || emailError)
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value.trim();
                                                    setEmailError(
                                                        value && isBlockedEmailDomain(value)
                                                            ? BLOCKED_MESSAGE
                                                            : null,
                                                    );
                                                }}
                                            />
                                            <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        {(errors.invited_email || emailError) && (
                                            <FieldError>
                                                {errors.invited_email ?? emailError}
                                            </FieldError>
                                        )}
                                    </Field>

                                    {/* Expires At */}
                                    <Field data-invalid={!!errors.expires_at}>
                                        <FieldLabel htmlFor="expires_at">
                                            Expires At
                                        </FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    id="expires_at"
                                                    tabIndex={3}
                                                    aria-invalid={!!errors.expires_at}
                                                    className={cn(
                                                        inputLikeClasses,
                                                        'relative h-9 cursor-pointer items-center text-left',
                                                        !expiresAt && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {expiresAt
                                                        ? format(expiresAt, 'PPP')
                                                        : 'Never (leave empty for no expiry)'}
                                                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="end">
                                                <Calendar
                                                    mode="single"
                                                    selected={expiresAt}
                                                    onSelect={setExpiresAt}
                                                    disabled={{ before: new Date() }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input
                                            type="hidden"
                                            name="expires_at"
                                            value={expiresAt ? format(expiresAt, 'yyyy-MM-dd') : ''}
                                        />
                                        {errors.expires_at && (
                                            <FieldError>{errors.expires_at}</FieldError>
                                        )}
                                    </Field>

                                    {/* Max Uses */}
                                    <Field data-invalid={!!errors.max_uses}>
                                        <FieldLabel htmlFor="max_uses">Max Uses</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="max_uses"
                                                type="number"
                                                name="max_uses"
                                                min="1"
                                                step="1"
                                                defaultValue="1"
                                                tabIndex={4}
                                                placeholder="1"
                                                className="pr-9"
                                                aria-invalid={!!errors.max_uses}
                                            />
                                            <Users className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        {errors.max_uses && (
                                            <FieldError>{errors.max_uses}</FieldError>
                                        )}
                                    </Field>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={5}
                                        disabled={processing || !!emailError}
                                    >
                                        {processing && <Spinner className="h-4 w-4" />}
                                        Send Invitation
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

CreateInviteTicket.layout = {
    breadcrumbs: [
        {
            title: 'Create Invite Ticket',
            href: '/tickets/invite/create',
        },
    ],
};