export type User = {
    id: string;
    name: string;
    email: string;
    user_type: 'company' | 'user' | 'freelancer' | 'employee';
    approved_at: string | null;
    email_verified_at: string | null;
    has_custom_profile_photo: boolean;
    profile_photo_url: string;
    description: string | null;
    area_of_work: string | null;
    membership: {
        tier: string;
        status: string;
        credits_balance: number;
    } | null;
};

/** Guest-friendly shape — what the middleware actually sends. */
export type Auth = {
    user: User | null;
};

/** For pages behind `auth` middleware, where a user is guaranteed. */
export type AuthenticatedAuth = {
    user: User;
};