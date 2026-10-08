<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UpcomingEventsController extends Controller
{
    private const API_URL = 'https://www.startupgrind.com/api/search/';
    private const CACHE_KEY = 'upcoming_events';
    private const CACHE_SYNCED_KEY = 'upcoming_events_synced_at';
    private const CACHE_TTL_HOURS = 8;
    private const PER_PAGE = 6;

    public function __invoke(Request $request): Response
    {
        $filters = [
            'country' => (string) $request->query('country', ''),
            'type' => (string) $request->query('type', ''),
            'price' => (string) $request->query('price', ''),
            'tag' => (string) $request->query('tag', ''),
            'search' => (string) $request->query('search', ''),
        ];

        $all = Cache::remember(
            self::CACHE_KEY,
            now()->addHours(self::CACHE_TTL_HOURS),
            fn () => $this->fetchEvents(),
        );

        $options = $this->buildOptions($all);
        $filtered = $this->applyFilters($all, $filters);

        $page = max(1, (int) $request->query('page', 1));

        $query = array_filter($filters, fn ($v) => $v !== '');

        $paginator = new LengthAwarePaginator(
            array_slice($filtered, ($page - 1) * self::PER_PAGE, self::PER_PAGE),
            count($filtered),
            self::PER_PAGE,
            $page,
            [
                'path' => '/events',
                'query' => $query,
            ],
        );

        return Inertia::render('events/index', [
            'events' => $paginator,
            'filters' => $filters,
            'filterOptions' => $options,
            'lastSyncedAt' => Cache::get(self::CACHE_SYNCED_KEY),
        ]);
    }

    /**
     * Show a single event, looked up by slug.
     *
     * The upstream API doesn't expose a per-event endpoint, so we reuse the
     * cached list. Slugs are derived from the event's relative_url.
     */
    public function show(string $slug): Response
    {
        $all = Cache::remember(
            self::CACHE_KEY,
            now()->addHours(self::CACHE_TTL_HOURS),
            fn () => $this->fetchEvents(),
        );

        $event = collect($all)->firstWhere('slug', $slug);

        if (! $event) {
            abort(404, 'Event not found or no longer available.');
        }

        return Inertia::render('events/show', [
            'event' => $event,
        ]);
    }

   private function buildOptions(array $events): array
{
    $countries = [];   // code => ['name' => ..., 'count' => ...]
    $tags = [];

    foreach ($events as $event) {
        $code = $event['chapter']['country'] ?? null;
        $name = $event['chapter']['country_name'] ?? $code;

        if ($code) {
            if (! isset($countries[$code])) {
                $countries[$code] = ['name' => $name, 'count' => 0];
            }
            $countries[$code]['count']++;
        }

        foreach ($event['tags'] as $tag) {
            $tags[$tag] = ($tags[$tag] ?? 0) + 1;
        }
    }

    // Sort countries alphabetically by their display name.
    uasort($countries, fn ($a, $b) => strcasecmp($a['name'], $b['name']));

    arsort($tags);

    return [
        'countries' => array_map(
            fn ($code, $data) => [
                'value' => $code,
                'label' => $data['name'],
                'count' => $data['count'],
            ],
            array_keys($countries),
            array_values($countries),
        ),
        'tags' => array_map(
            fn ($name, $count) => ['value' => $name, 'label' => $name, 'count' => $count],
            array_keys($tags),
            array_values($tags),
        ),
        'types' => [
            ['value' => 'in_person', 'label' => 'In-person'],
            ['value' => 'virtual', 'label' => 'Virtual'],
            ['value' => 'community', 'label' => 'Community'],
        ],
        'prices' => [
            ['value' => 'free', 'label' => 'Free'],
            ['value' => 'paid', 'label' => 'Paid'],
        ],
    ];
}

    private function applyFilters(array $events, array $filters): array
    {
        $search = mb_strtolower(trim($filters['search']));

        return array_values(array_filter($events, function (array $event) use ($filters, $search) {
            if ($filters['country'] !== ''
                && ($event['chapter']['country'] ?? '') !== $filters['country']) {
                return false;
            }

            if ($filters['type'] !== '') {
                $matchesType = match ($filters['type']) {
                    'virtual' => $event['is_virtual'],
                    'community' => $event['is_external'],
                    'in_person' => ! $event['is_virtual'] && ! $event['is_external'],
                    default => true,
                };

                if (! $matchesType) {
                    return false;
                }
            }

            if ($filters['price'] === 'free' && ! $event['is_free']) {
                return false;
            }

            if ($filters['price'] === 'paid' && $event['is_free']) {
                return false;
            }

            if ($filters['tag'] !== '' && ! in_array($filters['tag'], $event['tags'], true)) {
                return false;
            }

            if ($search !== '') {
                $haystack = mb_strtolower(
                    $event['title'].' '.$event['description'].' '.($event['chapter']['location'] ?? ''),
                );

                if (! str_contains($haystack, $search)) {
                    return false;
                }
            }

            return true;
        }));
    }

    private function fetchEvents(): array
    {
        try {
            $response = Http::timeout(15)
                ->acceptJson()
                ->get(self::API_URL, [
                    'result_types' => 'upcoming_event',
                    'country_code' => 'Earth',
                ]);

            if (! $response->successful()) {
                Log::warning('Upcoming events API returned non-200', [
                    'status' => $response->status(),
                ]);

                return [];
            }

            $results = $response->json('results', []);

            Cache::put(
                self::CACHE_SYNCED_KEY,
                now()->toIso8601String(),
                now()->addHours(self::CACHE_TTL_HOURS),
            );

            return array_map(fn ($e) => $this->normalize($e), $results);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch upcoming events', [
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function normalize(array $event): array
    {
        $chapter = $event['chapter'] ?? [];
        $picture = $event['picture'] ?? [];

        $image = $picture['thumbnail_url']
            ?? $picture['url']
            ?? ($chapter['logo']['thumbnail_url'] ?? null)
            ?? ($chapter['logo']['url'] ?? null);

        $eventType = $event['event_type_title'] ?? 'Event';

        // Derive a stable slug from the event's relative URL.
        // e.g. /events/details/startup-grind-boston-presents-pitch-practice/
        //   →  startup-grind-boston-presents-pitch-practice
        $relativeUrl = $event['relative_url'] ?? '';
        $slug = $relativeUrl
            ? basename(rtrim(parse_url($relativeUrl, PHP_URL_PATH) ?: $relativeUrl, '/'))
            : (string) ($event['id'] ?? '');

        return [
            'id' => $event['id'] ?? null,
            'slug' => $slug,
            'title' => $event['title'] ?? 'Untitled event',
            'description' => $event['description_short'] ?? '',
            'image' => $image,
            'url' => $event['url'] ?? '#',
            'start_date' => $event['start_date'] ?? null,
            'event_type' => $eventType,
            'is_free' => str_contains($eventType, 'Free'),
            'is_virtual' => str_contains($eventType, 'Virtual'),
            'is_external' => str_contains($eventType, 'External'),
            'allows_cohosting' => (bool) ($event['allows_cohosting'] ?? false),
            'tags' => array_slice($event['tags'] ?? [], 0, 3),
            'chapter' => [
                'name' => $chapter['title'] ?? null,
                'city' => $chapter['city'] ?? null,
                'country' => $chapter['country'] ?? null,
                'country_name' => $chapter['country_name'] ?? null,
                'location' => $chapter['chapter_location'] ?? null,
                'timezone' => $chapter['timezone'] ?? null,
                'logo' => $chapter['logo']['thumbnail_url'] ?? $chapter['logo']['url'] ?? null,
                'website' => $chapter['url'] ?? null,
            ],
        ];
    }
}