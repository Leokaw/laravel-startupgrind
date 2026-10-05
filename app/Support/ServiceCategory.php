<?php

namespace App\Support;

class ServiceCategory
{
    /**
     * All available service categories.
     * The array key is what gets stored in the database;
     * the value is what the user sees in the dropdown.
     */
    public const ALL = [
        'consulting' => 'Consulting',
        'strategy' => 'Strategy & Planning',
        'design' => 'Design & UX',
        'development' => 'Software Development',
        'cloud_devops' => 'Cloud & DevOps',
        'security' => 'Security',
        'data_analytics' => 'Data & Analytics',
        'ai_automation' => 'AI & Automation',
        'marketing' => 'Marketing',
        'seo_advertising' => 'SEO & Advertising',
        'content_copywriting' => 'Content & Copywriting',
        'training' => 'Training & Onboarding',
        'maintenance_support' => 'Maintenance & Support',
        'managed_services' => 'Managed Services',
        'implementation_migration' => 'Implementation & Migration',
    ];

    public static function all(): array
    {
        return self::ALL;
    }

    public static function values(): array
    {
        return array_keys(self::ALL);
    }

    public static function label(string $key): ?string
    {
        return self::ALL[$key] ?? null;
    }
}