<?php
/**
 * ZippyTechSystems Pvt. Ltd. — WhatsApp Cloud API Webhook Handler
 * Domain: https://zippysoftwares.in
 */

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

$waConfig = $config['whatsapp'] ?? [];
$verifyToken = trim((string)($waConfig['verify_token'] ?? ''));
$appSecret   = trim((string)($waConfig['app_secret'] ?? ''));

// -----------------------------------------------------------------------------
// Meta Webhook Verification (GET hub.challenge)
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($verifyToken)) {
        http_response_code(403);
        header('Content-Type: text/plain');
        echo 'Webhook verification refused: verify_token is not configured.';
        exit;
    }

    $mode      = (string)($_GET['hub_mode'] ?? '');
    $token     = (string)($_GET['hub_verify_token'] ?? '');
    $challenge = (string)($_GET['hub_challenge'] ?? '');

    if ($mode === 'subscribe' && hash_equals($verifyToken, $token)) {
        http_response_code(200);
        header('Content-Type: text/plain');
        echo $challenge;
        exit;
    }

    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'Forbidden: Invalid verify token or mode.';
    exit;
}

// -----------------------------------------------------------------------------
// Inbound WhatsApp Event (POST)
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Verify app secret is configured
    if (empty($appSecret)) {
        http_response_code(401);
        json_response(['error' => 'Unauthorized: WhatsApp app_secret is not configured.'], 401);
    }

    // 2. Read raw request payload
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false) {
        $rawBody = '';
    }

    // 3. Verify X-Hub-Signature-256
    $hubSig = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    if (empty($hubSig)) {
        http_response_code(401);
        json_response(['error' => 'Unauthorized: Missing X-Hub-Signature-256 header.'], 401);
    }

    $expectedSig = 'sha256=' . hash_hmac('sha256', $rawBody, $appSecret);
    if (!hash_equals($expectedSig, $hubSig)) {
        http_response_code(401);
        json_response(['error' => 'Unauthorized: Invalid signature.'], 401);
    }

    $payload = json_decode($rawBody, true) ?: [];
    $db = get_db();

    // 4. Extract message IDs and perform deduplication
    $messageIds = [];
    if (!empty($payload['entry']) && is_array($payload['entry'])) {
        foreach ($payload['entry'] as $entry) {
            if (!empty($entry['changes']) && is_array($entry['changes'])) {
                foreach ($entry['changes'] as $change) {
                    $val = $change['value'] ?? [];
                    if (!empty($val['messages']) && is_array($val['messages'])) {
                        foreach ($val['messages'] as $msg) {
                            if (!empty($msg['id'])) {
                                $messageIds[] = (string)$msg['id'];
                            }
                        }
                    }
                }
            }
        }
    }

    // Check message deduplication cache
    $cacheDir = sys_get_temp_dir() . '/zippy_limits';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0777, true);
    }

    $isDuplicate = false;
    foreach ($messageIds as $msgId) {
        $msgHash = md5('wa_msg_' . $msgId);
        $dedupFile = "{$cacheDir}/dedup_{$msgHash}.json";
        if (file_exists($dedupFile)) {
            $mtime = filemtime($dedupFile);
            if ($mtime && (time() - $mtime < 86400 * 2)) {
                $isDuplicate = true;
                break;
            }
        }
        @file_put_contents($dedupFile, json_encode(['id' => $msgId, 'received_at' => time()]));
    }

    if ($isDuplicate) {
        // Return 200 OK so Meta does not keep retrying duplicate event
        json_response(['status' => 'duplicate_ignored']);
    }

    // 5. Log payload to database
    if ($db !== null && !empty($payload)) {
        try {
            $stmt = $db->prepare('
                INSERT INTO `whatsapp_logs` (`event_type`, `direction`, `payload`, `created_at`)
                VALUES ("webhook_event", "inbound", :payload, NOW())
            ');
            $stmt->execute([':payload' => json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
        } catch (Exception $e) {
            error_log("WhatsApp log error: " . $e->getMessage());
        }
    }

    // Always respond 200 OK to Meta
    json_response(['status' => 'received']);
}

error_response('Method not allowed.', 405);
