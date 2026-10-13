<?php
return [
    'currency' => 'HUF',

    'plans' => [

        'starter' => [
            'name'                 => 'Starter',
            'description'          => 'For individuals getting started with the community.',
            'price'                => 0,
            'lookup_key'           => null,
            'icon'                 => 'star',
            'badge'                => null,
            'membership_tier'      => 'free',
            'signup_bonus_credits' => 0,
            'seat_limit'           => 1,
            'free_messages_limit'  => 0,
            'company_employee_view_limit' => 0,
            'features' => [
                'Unlimited projects',
                'Saved searches & alerts',
                'Seamless integrations',
                'Community support',
            ],
            'tour_perks' => [],
        ],

        'pro' => [
            'name'                 => 'Pro',
            'description'          => 'For founders, operators, and investors who want more credits, more reach, and priority support.',
            'price'                => 9900,
            'lookup_key'           => 'pro_monthly',
            'icon'                 => 'zap',
            'badge'                => 'Most Popular',
            'membership_tier'      => 'pro',
            'signup_bonus_credits' => 500,
            'seat_limit'           => 1,
            'free_messages_limit'  => 5,
            'company_employee_view_limit' => 5,
            'features' => [
                'Everything in Starter',
                '+500 signup credits & monthly refresh',
                '5 free messages per month',
                'See up to 5 employees per company',
                'Verified Pro badge',
                'Priority support (24h response)',
            ],
            'tour_perks' => [
                [
                    'title'             => 'Welcome to Pro',
                    'short_description' => 'Here is what just unlocked',
                    'full_description'  => 'Your subscription is active and the perks below are live right now. You can replay this tour any time from the billing page.',
                    'icon'              => 'sparkles',
                ],
                [
                    'title'             => '+500 credits',
                    'short_description' => 'Added the moment you subscribed',
                    'full_description'  => 'We topped up your account with 500 credits. Spend them on premium services, event upgrades, or community purchases.',
                    'icon'              => 'coins',
                ],
                [
                    'title'             => '5 free messages per month',
                    'short_description' => 'Start conversations without spending credits',
                    'full_description'  => 'Message any user up to 5 times per month for free. Counter resets with your monthly credit refresh.',
                    'icon'              => 'message',
                ],
                [
                    'title'             => 'See up to 5 employees per company',
                    'short_description' => 'Explore the teams behind each company',
                    'full_description'  => 'Open any company and browse the profiles of up to 5 employees — roles, skills, and contact options are visible to you.',
                    'icon'              => 'users',
                ],
                [
                    'title'             => 'Verified Pro badge',
                    'short_description' => 'Stand out in the community',
                    'full_description'  => 'Your profile now shows a verified Pro badge everywhere your name appears.',
                    'icon'              => 'badge',
                ],
                [
                    'title'             => 'Priority support',
                    'short_description' => '24-hour response guarantee',
                    'full_description'  => 'Your support tickets jump to the front of the queue with a 24-hour response guarantee.',
                    'icon'              => 'headset',
                ],
            ],
        ],

        'enterprise' => [
            'name'                 => 'Company',
            'description'          => 'Pro for your whole team — up to 5 seats, one bill, priority support for everyone.',
            'price'                => 49900,
            'lookup_key'           => 'enterprise_monthly',
            'icon'                 => 'building',
            'badge'                => 'Best for teams',
            'membership_tier'      => 'enterprise',
            'signup_bonus_credits' => 2000,
            'seat_limit'           => 5,
            'free_messages_limit'  => 5,
            'company_employee_view_limit' => 5,
            'features' => [
                'Everything in Pro, for 5 seats',
                '+2,000 signup credits',
                'One bill, one workspace',
                'Dedicated success manager',
            ],
            'tour_perks' => [
                [
                    'title'             => 'Welcome to Company',
                    'short_description' => 'Your team plan is live',
                    'full_description'  => 'Invite up to 5 seats, assign roles, and manage your team from one place.',
                    'icon'              => 'building',
                ],
                [
                    'title'             => '+2,000 credits',
                    'short_description' => 'Pooled on your account',
                    'full_description'  => 'We added 2,000 credits to your account. Allocate them to your team however you like.',
                    'icon'              => 'coins',
                ],
                [
                    'title'             => '5 seats included',
                    'short_description' => 'Invite your team',
                    'full_description'  => 'Invite up to 5 people to your plan by email. Each seat gets full Pro benefits.',
                    'icon'              => 'users',
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
