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
import {
    Percent,
    Calendar as CalendarIcon,
    Type as Text,
    TicketPercent,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const inputLikeClasses =
    'flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40';

export default function CreateDiscountedTicket() {
    const [success, setSuccess] = useState(false);
    const [nameLength, setNameLength] = useState(0);
    const [descLength, setDescLength] = useState(0);
    const [validFrom, setValidFrom] = useState<Date | undefined>();
    const [validUntil, setValidUntil] = useState<Date | undefined>();

    return (
        <>
            <Head title="Create Discounted Ticket" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    {/* Hero band */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/20 bg-primary/5 px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                                <TicketPercent className="size-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <Tag className="size-3.5" />
                                    New discount
                                </div>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Create a discount
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Set up a percentage-off ticket your
                                    customers can redeem.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {success && (
                            <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                                Discounted ticket created successfully!
                            </div>
                        )}

                        <Form
                            method="post"
                            action="/tickets/discounted"
                            onSuccess={() => {
                                setSuccess(true);
                                setNameLength(0);
                                setDescLength(0);
                                setValidFrom(undefined);
                                setValidUntil(undefined);
                            }}
                            resetOnSuccess
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6">
                                        {/* Title */}
                                        <Field data-invalid={!!errors.name}>
                                            <div className="flex items-center justify-between">
                                                <FieldLabel htmlFor="name">
                                                    Title{' '}
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
                                                    placeholder="Enter ticket title"
                                                    className="pr-9"
                                                    aria-invalid={!!errors.name}
                                                    onChange={(e) =>
                                                        setNameLength(
                                                            e.target.value.length,
                                                        )
                                                    }
                                                />
                                                <Text className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                                placeholder="Describe the discount (optional)"
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

                                        {/* Discount Percentage */}
                                        <Field
                                            data-invalid={
                                                !!errors.discount_percentage
                                            }
                                        >
                                            <FieldLabel htmlFor="discount_percentage">
                                                Discount Percentage{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    id="discount_percentage"
                                                    type="number"
                                                    name="discount_percentage"
                                                    required
                                                    tabIndex={3}
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    placeholder="Enter discount percentage"
                                                    className="pr-9"
                                                    aria-invalid={
                                                        !!errors.discount_percentage
                                                    }
                                                />
                                                <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            </div>
                                            {errors.discount_percentage && (
                                                <FieldError>
                                                    {errors.discount_percentage}
                                                </FieldError>
                                            )}
                                        </Field>

                                        {/* Valid From */}
                                        <Field data-invalid={!!errors.valid_from}>
                                            <FieldLabel htmlFor="valid_from">
                                                Valid From{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        id="valid_from"
                                                        tabIndex={4}
                                                        aria-invalid={
                                                            !!errors.valid_from
                                                        }
                                                        className={cn(
                                                            inputLikeClasses,
                                                            'relative h-9 cursor-pointer items-center text-left',
                                                            !validFrom &&
                                                                'text-muted-foreground',
                                                        )}
                                                    >
                                                        {validFrom
                                                            ? format(
                                                                  validFrom,
                                                                  'PPP',
                                                              )
                                                            : 'Pick a date'}
                                                        <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="end"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={validFrom}
                                                        onSelect={setValidFrom}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <input
                                                type="hidden"
                                                name="valid_from"
                                                value={
                                                    validFrom
                                                        ? format(
                                                              validFrom,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : ''
                                                }
                                            />
                                            {errors.valid_from && (
                                                <FieldError>
                                                    {errors.valid_from}
                                                </FieldError>
                                            )}
                                        </Field>

                                        {/* Valid Until */}
                                        <Field data-invalid={!!errors.valid_until}>
                                            <FieldLabel htmlFor="valid_until">
                                                Valid Until{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        id="valid_until"
                                                        tabIndex={5}
                                                        aria-invalid={
                                                            !!errors.valid_until
                                                        }
                                                        className={cn(
                                                            inputLikeClasses,
                                                            'relative h-9 cursor-pointer items-center text-left',
                                                            !validUntil &&
                                                                'text-muted-foreground',
                                                        )}
                                                    >
                                                        {validUntil
                                                            ? format(
                                                                  validUntil,
                                                                  'PPP',
                                                              )
                                                            : 'Pick a date'}
                                                        <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="end"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={validUntil}
                                                        onSelect={setValidUntil}
                                                        disabled={{
                                                            before:
                                                                validFrom ??
                                                                new Date(),
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <input
                                                type="hidden"
                                                name="valid_until"
                                                value={
                                                    validUntil
                                                        ? format(
                                                              validUntil,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : ''
                                                }
                                            />
                                            {errors.valid_until && (
                                                <FieldError>
                                                    {errors.valid_until}
                                                </FieldError>
                                            )}
                                        </Field>

                                        <Button
                                            type="submit"
                                            className="mt-4 w-full"
                                            tabIndex={6}
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Spinner className="h-4 w-4" />
                                            )}
                                            Create Discounted Ticket
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

CreateDiscountedTicket.layout = {
    breadcrumbs: [
        {
            title: 'Create Discounted Ticket',
            href: '/tickets/discounted/create',
        },
    ],
};