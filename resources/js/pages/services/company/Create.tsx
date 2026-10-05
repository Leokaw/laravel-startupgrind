import { Head, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Building2, Tag } from 'lucide-react';
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

    return (
        <>
            <Head title="Create Company Service" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-2xl rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
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
                                                <span className="text-destructive">*</span>
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
                                                    setNameLength(e.target.value.length)
                                                }
                                            />
                                            <Building2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        {errors.name && (
                                            <FieldError>{errors.name}</FieldError>
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
                                            aria-invalid={!!errors.description}
                                            className={cn(
                                                inputLikeClasses,
                                                'min-h-[80px] resize-y py-2',
                                            )}
                                            onChange={(e) =>
                                                setDescLength(e.target.value.length)
                                            }
                                        />
                                        {errors.description && (
                                            <FieldError>{errors.description}</FieldError>
                                        )}
                                    </Field>

                                    {/* Category */}
                                    <Field data-invalid={!!errors.category}>
                                        <FieldLabel htmlFor="category">
                                            Category{' '}
                                            <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Select name="category">
                                            <SelectTrigger
                                                id="category"
                                                tabIndex={3}
                                                aria-invalid={!!errors.category}
                                                className="relative w-full"
                                            >
                                                <SelectValue placeholder="Select a category" />
                                                <Tag className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(serviceCategories).map(
                                                    ([key, label]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <FieldError>{errors.category}</FieldError>
                                        )}
                                    </Field>

                                    <Button
                                        type="submit"
                                        className="mt-4 w-full"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing && <Spinner className="h-4 w-4" />}
                                        Create Company Service
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

CreateCompanyService.layout = {
    breadcrumbs: [
        {
            title: 'Create Company Service',
            href: '/services/company/create',
        },
    ],
};