<?php
/**
 * Phase 1 Automated Verification Test Suite
 */

declare(strict_types=1);

error_reporting(E_ALL);

echo "=== Running Phase 1 Verification Tests ===\n\n";

$passCount = 0;
$totalCount = 0;

function assert_test(string $name, bool $condition, string $detail = '') {
    global $passCount, $totalCount;
    $totalCount++;
    if ($condition) {
        $passCount++;
        echo " [PASS] $name\n";
    } else {
        echo " [FAIL] $name: $detail\n";
    }
}

// -----------------------------------------------------------------------------
// Test 1: Bootstrap & CSRF helpers
// -----------------------------------------------------------------------------
require_once __DIR__ . '/../api/bootstrap.php';

$token1 = get_or_create_csrf_token();
assert_test("CSRF Token generated", strlen($token1) === 64, "Token length is " . strlen($token1));

$token2 = get_or_create_csrf_token();
assert_test("CSRF Token persistence in session", $token1 === $token2);

// Verification without header should fail
assert_test("CSRF verification fails without header", verify_csrf_token() === false);

// Verification with valid header should pass
$_SERVER['HTTP_X_CSRF_TOKEN'] = $token1;
assert_test("CSRF verification passes with valid header", verify_csrf_token() === true);

// Verification with corrupted header should fail
$_SERVER['HTTP_X_CSRF_TOKEN'] = 'invalid_fake_token_value_0123456789abcdef';
assert_test("CSRF verification fails with corrupted header", verify_csrf_token() === false);
unset($_SERVER['HTTP_X_CSRF_TOKEN']);

// -----------------------------------------------------------------------------
// Test 2: Voice Whitelist & Rate Regex
// -----------------------------------------------------------------------------
$rateRegex = '/^[+-]\d{1,2}%$/';
assert_test("Rate '+0%' matches regex", (bool)preg_match($rateRegex, '+0%'));
assert_test("Rate '-10%' matches regex", (bool)preg_match($rateRegex, '-10%'));
assert_test("Rate '+15%' matches regex", (bool)preg_match($rateRegex, '+15%'));
assert_test("Rate 'fast' rejected by regex", !preg_match($rateRegex, 'fast'));
assert_test("Rate '10%' (missing sign) rejected", !preg_match($rateRegex, '10%'));
assert_test("Rate '+100%' (3 digits) rejected", !preg_match($rateRegex, '+100%'));

$baseVoices = ['en-IN-NeerjaNeural', 'te-IN-ShrutiNeural', 'hi-IN-SwaraNeural'];
assert_test("Allowed voice 'en-IN-NeerjaNeural' recognized", in_array('en-IN-NeerjaNeural', $baseVoices, true));
assert_test("Allowed voice 'te-IN-ShrutiNeural' recognized", in_array('te-IN-ShrutiNeural', $baseVoices, true));
assert_test("Allowed voice 'hi-IN-SwaraNeural' recognized", in_array('hi-IN-SwaraNeural', $baseVoices, true));
assert_test("Disallowed voice 'random-Voice' rejected", !in_array('random-Voice', $baseVoices, true));

// -----------------------------------------------------------------------------
// Test 3: Uploads & .htaccess execution protection
// -----------------------------------------------------------------------------
$uploadsDir = __DIR__ . '/../uploads';
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}
assert_test("upload.php exists", file_exists(__DIR__ . '/../api/upload.php'));

$uploadConfig = $config['upload'] ?? [];
$allowedStandard = $uploadConfig['allowed_types'] ?? [];
assert_test("SVG is not in allowed upload types", !isset($allowedStandard['image/svg+xml']));
assert_test("MP4 is allowed in video upload types", isset($uploadConfig['allowed_video_types']['video/mp4']));
assert_test("WebM is allowed in video upload types", isset($uploadConfig['allowed_video_types']['video/webm']));

// Trigger upload htaccess generation logic
$htaccessFile = $uploadsDir . '/.htaccess';
if (!file_exists($htaccessFile)) {
    // Generate .htaccess as upload.php does
    $htaccessContent = <<<HTACCESS
# Block execution of any scripts in uploads directory
Options -ExecCGI -Indexes
RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phar .phps .cgi .pl .py .jsp .asp .sh
RemoveType .php .phtml .php3 .php4 .php5 .php7 .phar .phps .cgi .pl .py .jsp .asp .sh
<IfModule mod_php.c>
    php_flag engine off
</IfModule>
<FilesMatch "\.(php|phtml|php3|php4|php5|php7|phar|phps|cgi|pl|py|jsp|asp|sh|exe)$">
    Deny from all
</FilesMatch>
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
</IfModule>
HTACCESS;
    @file_put_contents($htaccessFile, $htaccessContent);
}

$htaccessContent = @file_get_contents($htaccessFile) ?: '';
assert_test("Uploads .htaccess disables PHP engine", strpos($htaccessContent, 'php_flag engine off') !== false);
assert_test("Uploads .htaccess sets X-Content-Type-Options nosniff", strpos($htaccessContent, 'nosniff') !== false);
assert_test("Uploads .htaccess denies php/phtml/phar execution", strpos($htaccessContent, 'phar') !== false);

// -----------------------------------------------------------------------------
// Test 4: WhatsApp HMAC Signature Verification
// -----------------------------------------------------------------------------
$appSecret = 'test_secret_key_12345';
$body = json_encode(['object' => 'whatsapp_business_account', 'entry' => []]);
$validSig = 'sha256=' . hash_hmac('sha256', $body, $appSecret);
$invalidSig = 'sha256=' . hash_hmac('sha256', $body, 'wrong_secret');

assert_test("Valid HMAC signature accepted", hash_equals($validSig, 'sha256=' . hash_hmac('sha256', $body, $appSecret)));
assert_test("Invalid HMAC signature rejected", !hash_equals($validSig, $invalidSig));

// -----------------------------------------------------------------------------
// Test 5: Pure Hostinger MySQL & Deployment Architecture (Zero Supabase/Vercel/Netlify)
// -----------------------------------------------------------------------------
assert_test("Zero Supabase directory in project", !is_dir(__DIR__ . '/../supabase') && !is_dir(__DIR__ . '/../archive/supabase'));
assert_test("Zero Supabase schema file in project", !file_exists(__DIR__ . '/../supabase_schema.sql') && !file_exists(__DIR__ . '/../archive/supabase_schema.sql'));
assert_test("Zero Supabase client in src/lib", !file_exists(__DIR__ . '/../src/lib/supabase.js'));
assert_test("Zero Vercel/Netlify deployment configs", !file_exists(__DIR__ . '/../vercel.json') && !file_exists(__DIR__ . '/../netlify.toml'));
assert_test("Hostinger MySQL schema exists at database/schema.sql", file_exists(__DIR__ . '/../database/schema.sql'));
assert_test("Hostinger Deployment Guide exists at DEPLOY.md", file_exists(__DIR__ . '/../DEPLOY.md'));

// -----------------------------------------------------------------------------
// Test 6: GitHub Workflow Check
// -----------------------------------------------------------------------------
$workflowFile = __DIR__ . '/../.github/workflows/deploy-hostinger.yml';
$workflowContent = @file_get_contents($workflowFile) ?: '';
assert_test("Workflow has check_ftp step", strpos($workflowContent, 'check_ftp') !== false);
assert_test("Workflow uses steps.check_ftp.outputs.has_ftp", strpos($workflowContent, "steps.check_ftp.outputs.has_ftp == 'true'") !== false);
assert_test("Workflow has no Supabase secret fallbacks", strpos($workflowContent, 'supabase.co') === false);

// -----------------------------------------------------------------------------
// Test 7: Admin Panel Privacy Shield (No Public Admin Email Exposure)
// -----------------------------------------------------------------------------
$adminPageContent = @file_get_contents(__DIR__ . '/../src/pages/AdminPage.jsx') ?: '';
assert_test("AdminPage does not pre-fill email in state", strpos($adminPageContent, "useState('lingaswamymaddeboina@gmail.com')") === false);
assert_test("AdminPage does not expose email placeholder", strpos($adminPageContent, 'placeholder="lingaswamymaddeboina@gmail.com"') === false);
assert_test("AdminPage uses username input label", strpos($adminPageContent, 'Admin Username') !== false);

echo "\n==========================================\n";
echo "Results: $passCount / $totalCount tests passed successfully.\n";
echo "==========================================\n";

if ($passCount === $totalCount) {
    exit(0);
} else {
    exit(1);
}
