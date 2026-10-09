import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, Tag } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    serviceCategories: Record<string, string>;
};

const triggerClasses =
    'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30';

const textareaClasses =
    'flex min-h-[120px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40';

export default function Profile({
    mustVerifyEmail,
    status,
    serviceCategories,
}: Props) {
    const { auth } = usePage<PageProps>().props;

    // Controlled state for the dropdown. Mirrors `defaultValue` behavior
    // for the plain inputs, but the dropdown needs it to display the
    // selected label and to keep the hidden input in sync.
    const [areaOfWork, setAreaOfWork] = useState<string>(
        auth.user.area_of_work ?? '',
    );

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name, email and how you appear to others"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            {/* ========== Area of work ========== */}
                            <div className="grid gap-2">
                                <Label htmlFor="area_of_work">
                                    Area of work
                                </Label>

                                {/* Hidden input carries the value with the
                                    form submission — the dropdown itself
                                    is not a form control. */}
                                <input
                                    type="hidden"
                                    name="area_of_work"
                                    value={areaOfWork}
                                />

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            id="area_of_work"
                                            aria-invalid={
                                                !!errors.area_of_work
                                            }
                                            className={cn(
                                                triggerClasses,
                                                'cursor-pointer',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'truncate text-left',
                                                    !areaOfWork &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {areaOfWork
                                                    ? serviceCategories[
                                                          areaOfWork
                                                      ]
                                                    : 'Pick what you work on (optional)'}
                                            </span>

                                            <Tag className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 opacity-50" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[var(--radix-dropdown-menu-trigger-width)]"
                                    >
                                        <DropdownMenuRadioGroup
                                            value={areaOfWork}
                                            onValueChange={setAreaOfWork}
                                        >
                                            {Object.entries(
                                                serviceCategories,
                                            ).map(([key, label]) => (
                                                <DropdownMenuRadioItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {label}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <InputError
                                    className="mt-2"
                                    message={errors.area_of_work}
                                />
                            </div>

                            {/* ========== Description ========== */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">About you</Label>

                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    maxLength={1000}
                                    defaultValue={auth.user.description ?? ''}
                                    placeholder="A short bio about yourself, what you build, who you help, what you're looking for. (Optional)"
                                    className={textareaClasses}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.description}
                                />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Your email address is unverified.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                Click here to re-send the
                                                verification email.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                A new verification link has
                                                been sent to your email
                                                address.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: '/settings/profile',
        },
    ],
};