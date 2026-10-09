export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    // 👇 new — declared explicitly so they don't fall through to `unknown`
    description: string | null;
    area_of_work: string | null;

    [key: string]: unknown;
};

export type Auth = {
    user: User;
};