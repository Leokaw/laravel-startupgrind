import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

type StepErrors = Partial<Record<'name' | 'email' | 'account_type', string>>;

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [stepErrors, setStepErrors] = useState<StepErrors>({});

    const form = useForm({
        name: '',
        email: '',
        account_type: '' as '' | 'company' | 'community',
        role: '' as '' | 'user' | 'freelancer',
        password: '',
        password_confirmation: '',
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const errs: StepErrors = {};
        if (!form.data.name.trim()) errs.name = 'Your name is required.';
        if (!form.data.email.trim()) {
            errs.email = 'Your email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
            errs.email = 'Enter a valid email address.';
        }
        if (!form.data.account_type) {
            errs.account_type = 'Please pick one option to continue.';
        }

        setStepErrors(errs);
        if (Object.keys(errs).length !== 0) return;

        // Auto-select a default role for community members so the
        // radio on step 2 is pre-checked.
        if (form.data.account_type === 'community' && !form.data.role) {
            form.setData('role', 'user');
        }

        setStep(2);
    };

    const handleBack = () => {
        setStepErrors({});
        setStep(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Only these five fields go over the wire. account_type and role
        // are UI-only — user_type is derived from them here.
        form.transform((data) => ({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            user_type:
                data.account_type === 'company'
                    ? 'company'
                    : (data.role || 'user'),
        }));

        form.post(store.url());
    };

    // Collect backend errors into a single alert message. The email
    // "already taken" case is the most common one, but this also
    // surfaces any other server-side validation failure.
    const backendErrorMessages = Object.values(form.errors).filter(
        (msg): msg is string => typeof msg === 'string' && msg.length > 0,
    );

    const showBackendAlert = backendErrorMessages.length > 0;

    return (
        <>
            <Head title="Register" />

            <form
                onSubmit={step === 1 ? handleNext : handleSubmit}
                className="flex flex-col gap-6"
                noValidate
            >
                {showBackendAlert && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>
                            We couldn&apos;t create your account
                        </AlertTitle>
                        <AlertDescription>
                            <ul className="list-inside list-disc space-y-1">
                                {backendErrorMessages.map((msg, i) => (
                                    <li key={i}>{msg}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6">
                    {/* ---------- STEP 1 ---------- */}
                    {step === 1 && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Full name"
                                    aria-invalid={!!stepErrors.name}
                                />
                                <InputError message={stepErrors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                    placeholder="email@example.com"
                                    aria-invalid={!!stepErrors.email}
                                />
                                <InputError message={stepErrors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label>How are you registering?</Label>
                                <RadioGroup
                                    value={form.data.account_type}
                                    onValueChange={(v) => {
                                        const next = v as
                                            | 'company'
                                            | 'community';
                                        form.setData('account_type', next);

                                        // Reset role when switching to company
                                        // so a stale value never lingers.
                                        if (next === 'company') {
                                            form.setData('role', '');
                                        }

                                        setStepErrors((prev) => ({
                                            ...prev,
                                            account_type: undefined,
                                        }));
                                    }}
                                    className="flex flex-row flex-wrap gap-3"
                                >
                                    <FieldLabel
                                        htmlFor="account-company"
                                        className="flex-1 min-w-[180px] cursor-pointer"
                                    >
                                        <Field orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>
                                                    A company
                                                </FieldTitle>
                                                <FieldDescription>
                                                    Register your business on
                                                    the platform.
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                                value="company"
                                                id="account-company"
                                            />
                                        </Field>
                                    </FieldLabel>

                                    <FieldLabel
                                        htmlFor="account-community"
                                        className="flex-1 min-w-[180px] cursor-pointer"
                                    >
                                        <Field orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>
                                                    A community member
                                                </FieldTitle>
                                                <FieldDescription>
                                                    Register as an individual
                                                </FieldDescription>
                                            </FieldContent>
                                            <RadioGroupItem
                                                value="community"
                                                id="account-community"
                                            />
                                        </Field>
                                    </FieldLabel>
                                </RadioGroup>
                                <InputError message={stepErrors.account_type} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={3}
                            >
                                Next
                            </Button>
                        </>
                    )}

                    {/* ---------- STEP 2 ---------- */}
                    {step === 2 && (
                        <>
                            {/* Role radio — only for community members */}
                            {form.data.account_type === 'community' && (
                                <div className="grid gap-2">
                                    <Label>What best describes you?</Label>
                                    <RadioGroup
                                        value={form.data.role}
                                        onValueChange={(v) =>
                                            form.setData(
                                                'role',
                                                v as 'user' | 'freelancer',
                                            )
                                        }
                                        className="flex flex-row flex-wrap gap-4"
                                    >
                                        <FieldLabel
                                            htmlFor="role-user"
                                            className="flex-1 min-w-[180px] cursor-pointer"
                                        >
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>
                                                        Normal user
                                                    </FieldTitle>
                                                    <FieldDescription>
                                                        Just here to use the
                                                        platform.
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                    value="user"
                                                    id="role-user"
                                                />
                                            </Field>
                                        </FieldLabel>

                                        <FieldLabel
                                            htmlFor="role-freelancer"
                                            className="flex-1 min-w-[180px] cursor-pointer"
                                        >
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>
                                                        Freelancer
                                                    </FieldTitle>
                                                    <FieldDescription>
                                                        Available for hire.
                                                    </FieldDescription>
                                                </FieldContent>
                                                <RadioGroupItem
                                                    value="freelancer"
                                                    id="role-freelancer"
                                                />
                                            </Field>
                                        </FieldLabel>
                                    </RadioGroup>
                                    <InputError message={form.errors.role} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    value={form.data.password_confirmation}
                                    onChange={(e) =>
                                        form.setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={form.errors.password_confirmation}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    tabIndex={7}
                                    onClick={handleBack}
                                    disabled={form.processing}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    tabIndex={6}
                                    disabled={form.processing}
                                    data-test="register-user-button"
                                >
                                    {form.processing && <Spinner />}
                                    Create account
                                </Button>
                            </div>

                            {/* Friendly reminder of what they chose */}
                            <p className="text-center text-xs text-muted-foreground">
                                Registering as:{' '}
                                <span className="font-medium text-foreground">
                                    {form.data.account_type === 'company'
                                        ? 'Company'
                                        : form.data.role === 'freelancer'
                                          ? 'Freelancer'
                                          : 'Community member'}
                                </span>
                            </p>
                        </>
                    )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={login()} tabIndex={8}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Tell us who you are, then set your password.',
};