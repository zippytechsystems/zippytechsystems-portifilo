<?php
/**
 * ZippyTechSystems Pvt. Ltd. — Dynamic Combined Sitemap
 * Domain: https://zippysoftwares.in
 * 
 * Combines static build-time sitemap entries with dynamic MySQL entries
 * for services and projects, including accurate lastmod timestamps.
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/xml; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$baseUrl = 'https://zippysoftwares.in';
$today = date('Y-m-d');

// 1. Load static routes from public/sitemap.xml or static fallback
$staticEntries = [];
$candidateStaticFiles = [
    __DIR__ . '/../public/sitemap.xml',
    __DIR__ . '/../dist/sitemap.xml',
    __DIR__ . '/../sitemap.xml',
];

$loadedStaticXml = false;
foreach ($candidateStaticFiles as $staticFile) {
    if (file_exists($staticFile) && is_readable($staticFile)) {
        $content = @file_get_contents($staticFile);
        if ($content) {
            // Parse url nodes from static XML
            if (preg_match_all('/<url>(.*?)<\/url>/s', $content, $matches)) {
                foreach ($matches[1] as $urlBlock) {
                    if (preg_match('/<loc>(.*?)<\/loc>/', $urlBlock, $locMatch)) {
                        $loc = trim($locMatch[1]);
                        $lastmod = preg_match('/<lastmod>(.*?)<\/lastmod>/', $urlBlock, $lm) ? trim($lm[1]) : $today;
                        $changefreq = preg_match('/<changefreq>(.*?)<\/changefreq>/', $urlBlock, $cf) ? trim($cf[1]) : 'monthly';
                        $priority = preg_match('/<priority>(.*?)<\/priority>/', $urlBlock, $pr) ? trim($pr[1]) : '0.8';

                        $staticEntries[$loc] = [
                            'loc'        => $loc,
                            'lastmod'    => $lastmod,
                            'changefreq' => $changefreq,
                            'priority'   => $priority,
                        ];
                    }
                }
                $loadedStaticXml = true;
                break;
            }
        }
    }
}

// Fallback static list if no file exists
if (!$loadedStaticXml || empty($staticEntries)) {
    $fallbackStaticRoutes = [
        ['path' => '',         'priority' => '1.0',  'changefreq' => 'weekly'],
        ['path' => 'about',    'priority' => '0.8',  'changefreq' => 'monthly'],
        ['path' => 'services', 'priority' => '0.9',  'changefreq' => 'weekly'],
        ['path' => 'projects', 'priority' => '0.85', 'changefreq' => 'weekly'],
        ['path' => 'contact',  'priority' => '0.8',  'changefreq' => 'monthly'],
        ['path' => 'privacy',  'priority' => '0.3',  'changefreq' => 'yearly'],
        ['path' => 'terms',    'priority' => '0.3',  'changefreq' => 'yearly'],
    ];
    foreach ($fallbackStaticRoutes as $r) {
        $loc = $r['path'] ? "{$baseUrl}/{$r['path']}" : "{$baseUrl}/";
        $staticEntries[$loc] = [
            'loc'        => $loc,
            'lastmod'    => $today,
            'changefreq' => $r['changefreq'],
            'priority'   => $r['priority'],
        ];
    }
}

// 2. Fetch dynamic entries from MySQL database
$dynamicEntries = [];
$db = get_db();

if ($db !== null) {
    try {
        // A. Service detail pages from domains and services
        $slugMap = [
            'web' => 'web-development',
            'app' => 'app-development',
            'ai'  => 'ai-automation',
        ];

        $domainStmt = $db->query(
            "SELECT d.id, d.key, d.updated_at, MAX(s.updated_at) AS srv_updated_at
             FROM `domains` d
             LEFT JOIN `services` s ON s.domain_id = d.id AND s.is_active = 1
             WHERE d.is_active = 1
             GROUP BY d.id, d.key, d.updated_at
             ORDER BY d.sort_order ASC"
        );

        while ($row = $domainStmt->fetch()) {
            $key = $row['id'] ?? $row['key'] ?? '';
            $slug = $slugMap[$key] ?? ($key . '-services');
            $loc = "{$baseUrl}/services/{$slug}";

            $latestMod = $row['srv_updated_at'] ?: $row['updated_at'] ?: $today;
            $modDate = date('Y-m-d', strtotime((string)$latestMod) ?: time());

            $dynamicEntries[$loc] = [
                'loc'        => $loc,
                'lastmod'    => $modDate,
                'changefreq' => 'weekly',
                'priority'   => '0.9',
            ];
        }

        // B. Projects showcase entries
        $projectStmt = $db->query(
            "SELECT id, updated_at, created_at 
             FROM `projects` 
             WHERE is_active = 1 
             ORDER BY sort_order ASC"
        );

        while ($proj = $projectStmt->fetch()) {
            $projId = htmlspecialchars($proj['id'], ENT_QUOTES, 'UTF-8');
            $loc = "{$baseUrl}/projects/{$projId}";
            $latestMod = $proj['updated_at'] ?: $proj['created_at'] ?: $today;
            $modDate = date('Y-m-d', strtotime((string)$latestMod) ?: time());

            $dynamicEntries[$loc] = [
                'loc'        => $loc,
                'lastmod'    => $modDate,
                'changefreq' => 'monthly',
                'priority'   => '0.8',
            ];
        }
    } catch (\Throwable $e) {
        // On DB error, continue gracefully with static sitemap
        error_log('Sitemap DB query error: ' . $e->getMessage());
    }
}

// 3. Combine entries (static + dynamic)
$combined = array_merge($staticEntries, $dynamicEntries);

// 4. Output standard XML
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

foreach ($combined as $item) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($item['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
    echo "    <lastmod>{$item['lastmod']}</lastmod>\n";
    echo "    <changefreq>{$item['changefreq']}</changefreq>\n";
    echo "    <priority>{$item['priority']}</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>' . "\n";
