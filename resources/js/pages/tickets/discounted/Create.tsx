import { Head, Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Type as Text, Percent, Calendar, Hash } from 'lucide-react';
import { useState } from 'react';

export default function CreateDiscountedTicket() {
    const [success, setSuccess] = useState(false);

    return (
        <>
            <Head title="Create Discounted Ticket" />

            {success && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Discounted ticket created successfully!
                </div>
            )}

            <Form
                method="post"
                action="/tickets/discounted"
                onSuccess={() => setSuccess(true)}
                resetOnSuccess
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
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
                                        placeholder="e.g. SUMMER25"
                                    />
                                </div>
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Title</Label>
                                <div className="flex items-center gap-2">
                                    <Text className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        tabIndex={2}
                                        autoComplete="off"
                                        placeholder="Enter ticket title"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discount_percentage">
                                    Discount Percentage
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Percent className="h-4 w-4 text-muted-foreground" />
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
                                    />
                                </div>
                                <InputError message={errors.discount_percentage} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="valid_from">Valid From</Label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="valid_from"
                                        type="date"
                                        name="valid_from"
                                        required
                                        tabIndex={4}
                                    />
                                </div>
                                <InputError message={errors.valid_from} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="valid_until">Valid Until</Label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        name="valid_until"
                                        required
                                        tabIndex={5}
                                    />
                                </div>
                                <InputError message={errors.valid_until} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={6}
                                disabled={processing}
                            >
                                {processing && <Spinner className="h-4 w-4" />}
                                Create Discounted Ticket
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}