import { Head, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Building2,
    Tag,
    ChevronDown,
    Briefcase,
    Package,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const inputLikeClasses =
    'flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40';

type Props = {
    serviceCategories: Record<string, string>;
};

export default function CreateCompanyService({ serviceCategories }: Props) {
    const [success, setSuccess] = useState(false);
    const [nameLength, setNameLength] = useState(0);
    const [descLength, setDescLength] = useState(0);
    const [category, setCategory] = useState('');

    return (
        <>
            <Head title="Create Company Service" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* Hero band */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                                <Briefcase className="size-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Package className="size-3.5" />
                                    New service
                                </div>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Offer a service
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    List a service the community can purchase
                                    from you.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {success && (
                            <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                                Company service created successfully!
                            </div>
                        )}

                        <Form
                            method="post"
                            action="/services/company"
                            onSuccess={() => {
                                setSuccess(true);
                                setNameLength(0);
                                setDescLength(0);
                                setCategory('');
                            }}
                            resetOnSuccess
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        {/* Service Name */}
                                        <Field data-invalid={!!errors.name}>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="name">
                                                    Service Name{' '}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <span className="text-xs text-muted-foreground">
                                                    {nameLength}/50
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="off"
                                                    maxLength={50}
                                                    placeholder="Enter service name"
                                                    className="pr-9"
                                                    aria-invalid={!!errors.name}
                                                    onChange={(e) =>
                                                        setNameLength(
                                                            e.target.value.length,
                                                        )
                                                    }
                                                />
                                                <Building2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            </div>
                                            {errors.name && (
                                                <FieldError>
                                                    {errors.name}
                                                </FieldError>
                                            )}
                                        </Field>

                                        {/* Description */}
                                        <Field data-invalid={!!errors.description}>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="description">
                                                    Description (Optional)
                                                </FieldLabel>
                                                <span className="text-xs text-muted-foreground">
                                                    {descLength}/200
                                                </span>
                                            </div>
                                            <textarea
                                                id="description"
                                                name="description"
                                                tabIndex={2}
                                                maxLength={200}
                                                rows={4}
                                                placeholder="Describe the service (optional)"
                                                aria-invalid={
                                                    !!errors.description
                                                }
                                                className={cn(
                                                    inputLikeClasses,
                                                    'min-h-[80px] resize-y py-2',
                                                )}
                                                onChange={(e) =>
                                                    setDescLength(
                                                        e.target.value.length,
                                                    )
                                                }
                                            />
                                            {errors.description && (
                                                <FieldError>
                                                    {errors.description}
                                                </FieldError>
                                            )}
                                        </Field>

                                        {/* Category */}
                                        <Field data-invalid={!!errors.category}>
                                            <FieldLabel htmlFor="category">
                                                Category{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>

                                            <input
                                                type="hidden"
                                                name="category"
                                                value={category}
                                            />

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        type="button"
                                                        id="category"
                                                        tabIndex={3}
                                                        aria-invalid={
                                                            !!errors.category
                                                        }
                                                        className={cn(
                                                            'relative flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none',
                                                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                                            'disabled:cursor-not-allowed disabled:opacity-50',
                                                            'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                                                            'dark:bg-input/30',
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                'truncate text-left',
                                                                !category &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {category
                                                                ? serviceCategories[
                                                                      category
                                                                  ]
                                                                : 'Select a category'}
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
                                                        value={category}
                                                        onValueChange={
                                                            setCategory
                                                        }
                                                    >
                                                        {Object.entries(
                                                            serviceCategories,
                                                        ).map(
                                                            ([key, label]) => (
                                                                <DropdownMenuRadioItem
                                                                    key={key}
                                                                    value={key}
                                                                >
                                                                    {label}
                                                                </DropdownMenuRadioItem>
                                                            ),
                                                        )}
                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {errors.category && (
                                                <FieldError>
                                                    {errors.category}
                                                </FieldError>
                                            )}
                                        </Field>

                                        <Button
                                            type="submit"
                                            className="mt-4 w-full"
                                            tabIndex={4}
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Spinner className="h-4 w-4" />
                                            )}
                                            Create Company Service
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

CreateCompanyService.layout = {
    breadcrumbs: [
        {
            title: 'Create Company Service',
            href: '/services/company/create',
        },
    ],
};