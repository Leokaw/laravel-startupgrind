<?php

return [
    'currency' => 'HUF',

    'plans' => [

        'starter' => [
            'name'                 => 'Starter',
            'description'          => 'For individuals who want AI assistance in their daily workflow.',
            'price'                => 0,
            'lookup_key'           => null,          // free, not a Stripe product
            'icon'                 => 'star',
            'badge'                => null,
            'membership_tier'      => 'free',
            'signup_bonus_credits' => 0,
            'features' => [
                'Unlimited projects',
                'AI-powered insights',
                'Seamless integrations',
                'Community support',
            ],
            'tour_perks' => [],
        ],

        'pro' => [
            'name'                 => 'Pro',
            'description'          => 'For fast-moving teams that want to collaborate in real time.',
            'price'                => 5000,
            'lookup_key'           => 'pro_monthly',
            'icon'                 => 'zap',
            'badge'                => 'Most Popular',
            'membership_tier'      => 'pro',
            'signup_bonus_credits' => 500,
            'features' => [
                'Everything in Starter',
                'Real-time collaboration',
                'Advanced reporting',
                'Priority support',
            ],
            'tour_perks' => [
                [
                    'title'             => 'Welcome to Pro',
                    'short_description' => 'Here is what just unlocked',
                    'full_description'  => 'Your subscription is active and the perks below are live right now. You can replay this tour any time from the billing page.',
                    'icon'              => 'sparkles',
                ],
                [
                    'title'             => '+500 extra credits',
                    'short_description' => 'Added the moment you subscribed',
                    'full_description'  => 'We have topped up your account with 500 credits. Use them to unlock emails, send messages, or purchase services from the community.',
                    'icon'              => 'coins',
                ],
                [
                    'title'             => 'View any email from anyone',
                    'short_description' => 'Reach out directly',
                    'full_description'  => 'You can now reveal the email address of any user or company on the platform — perfect for outreach without going through the message system.',
                    'icon'              => 'mail',
                ],
                [
                    'title'             => 'See up to 5 employees per company',
                    'short_description' => 'Explore the teams behind each company',
                    'full_description'  => 'Open any company and browse the profiles of up to 5 employees — their roles, skills, and contact options are all visible to you.',
                    'icon'              => 'users',
                ],
                [
                    'title'             => '5 free messages per user',
                    'short_description' => 'Start conversations risk-free',
                    'full_description'  => 'Send up to 5 messages to any user without spending credits. A great way to introduce yourself or kick off a collaboration.',
                    'icon'              => 'message',
                ],
                [
                    'title'             => 'Verified Pro badge & priority support',
                    'short_description' => 'Stand out, get help faster',
                    'full_description'  => 'Your profile now shows a verified Pro badge, and your support tickets jump to the front of the queue with a 24-hour response guarantee.',
                    'icon'              => 'badge',
                ],
            ],
        ],

        'enterprise' => [
            'name'                 => 'Enterprise',
            'description'          => 'For organizations that need security, control, and support at scale.',
            'price'                => 10000,
            'lookup_key'           => 'enterprise_monthly',
            'icon'                 => 'building',
            'badge'                => null,
            'membership_tier'      => 'enterprise',   // 👈 was 'pro'
            'signup_bonus_credits' => 500,
            'features' => [
                'Everything in Pro',
                'SSO & audit logs',
                'Dedicated success manager',
                'Custom integrations',
            ],
            'tour_perks' => [
                [
                    'title'             => 'Welcome to Enterprise',
                    'short_description' => 'Here is what just unlocked',
                    'full_description'  => 'Your Enterprise subscription is active and every perk below is live right now. You can replay this tour any time from the billing page.',
                    'icon'              => 'sparkles',
                ],
                [
                    'title'             => '+500 extra credits',
                    'short_description' => 'Added the moment you subscribed',
                    'full_description'  => 'We have topped up your account with 500 credits. Use them to unlock emails, send messages, or purchase services from the community.',
                    'icon'              => 'coins',
                ],
                [
                    'title'             => 'View any email from anyone',
                    'short_description' => 'Reach out directly',
                    'full_description'  => 'You can now reveal the email address of any user or company on the platform — perfect for outreach without going through the message system.',
                    'icon'              => 'mail',
                ],
                [
                    'title'             => 'See up to 5 employees per company',
                    'short_description' => 'Explore the teams behind each company',
                    'full_description'  => 'Open any company and browse the profiles of up to 5 employees — their roles, skills, and contact options are all visible to you.',
                    'icon'              => 'users',
                ],
                [
                    'title'             => '5 free messages per user',
                    'short_description' => 'Start conversations risk-free',
                    'full_description'  => 'Send up to 5 messages to any user without spending credits. A great way to introduce yourself or kick off a collaboration.',
                    'icon'              => 'message',
                ],
                [
                    'title'             => 'Verified Enterprise badge & priority support',
                    'short_description' => 'Stand out, get help faster',
                    'full_description'  => 'Your profile now shows a verified Enterprise badge, and your support tickets jump to the front of the queue with a 24-hour response guarantee.',
                    'icon'              => 'badge',
                ],
                [
                    'title'             => 'SSO & audit logs',
                    'short_description' => 'Enterprise-grade security',
                    'full_description'  => 'Connect your identity provider and review every action taken in your workspace with full audit logging.',
                    'icon'              => 'shield',
                ],
                [
                    'title'             => 'Dedicated success manager',
                    'short_description' => 'Your personal point of contact',
                    'full_description'  => 'You will be introduced to a dedicated success manager who will help you get the most out of the platform.',
                    'icon'              => 'headset',
                ],
            ],
        ],

    ],
];