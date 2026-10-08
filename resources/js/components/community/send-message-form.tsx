import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    /**
     * The user receiving the message.
     */
    user: {
        id: string;
        name: string;
    };
    /**
     * Cost in credits to send the message. Matches MessageController::MESSAGE_COST.
     */
    messageCost?: number;
    /**
     * Fires after a successful POST. Use it to close the parent modal,
     * reset parent state, or navigate.
     */
    onSuccess?: () => void;
    /**
     * Optional className for the outer wrapper.
     */
    className?: string;
};

export function SendMessageForm({
    user,
    messageCost = 50,
    onSuccess,
    className,
}: Props) {
    const form = useForm({
        topic: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Local validation — saves a network round trip on obvious mistakes.
        if (!form.data.topic.trim()) {
            form.setError('topic', 'Please enter a topic.');
            return;
        }

        if (!form.data.message.trim()) {
            form.setError('message', 'Please write a message.');
            return;
        }

        form.post(`/users/${user.id}/messages`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Message sent', {
                    description: `To ${user.name} · −${messageCost} credits`,
                });
                form.reset();
                onSuccess?.();
            },
            onError: (serverErrors) => {
                const first =
                    Object.values(serverErrors)[0] ??
                    'Could not send the message. Please try again.';
                toast.error('Message not sent', {
                    description: String(first),
                });
            },
        });
    };

    const clearError = (key: 'topic' | 'message') => {
        if (form.errors[key]) {
            form.clearErrors(key);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                        id="topic"
                        value={form.data.topic}
                        onChange={(e) => {
                            form.setData('topic', e.target.value);
                            clearError('topic');
                        }}
                        placeholder="What's this about?"
                        aria-invalid={!!form.errors.topic}
                        disabled={form.processing}
                    />
                    {form.errors.topic && (
                        <p className="text-sm text-destructive">
                            {form.errors.topic}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        value={form.data.message}
                        onChange={(e) => {
                            form.setData('message', e.target.value);
                            clearError('message');
                        }}
                        placeholder="Write your message..."
                        rows={6}
                        aria-invalid={!!form.errors.message}
                        disabled={form.processing}
                    />
                    {form.errors.message && (
                        <p className="text-sm text-destructive">
                            {form.errors.message}
                        </p>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    Sending this message costs{' '}
                    <span className="font-medium text-foreground">
                        {messageCost} credits
                    </span>
                    .
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSuccess?.()}
                    disabled={form.processing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending
                        </>
                    ) : (
                        <>
                            <Send className=" h-4 w-4" />
                            Send
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}