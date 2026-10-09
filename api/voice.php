<?php
/**
 * ZippyTechSystems Pvt. Ltd. — Text-to-Speech (TTS) Voice Endpoint
 * Domain: https://zippysoftwares.in
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_response('Method not allowed. Use POST.', 405);
}

$ttsConfig = $config['tts'] ?? [];

// 1. Per-IP rate limiting: 60 requests per 10 minutes
if (!rate_limit_check('tts_requests', 60, 600)) {
    error_response('Too many voice requests. Please slow down.', 429);
}

// 2. Daily cap check from config
$dailyCap = (int)($ttsConfig['daily_cap'] ?? 500);
$cacheLimitsDir = sys_get_temp_dir() . '/zippy_limits';
if (!is_dir($cacheLimitsDir)) {
    @mkdir($cacheLimitsDir, 0777, true);
}

$dailyFile = "{$cacheLimitsDir}/tts_daily_" . date('Ymd') . ".json";
$dailyData = ['count' => 0];
if (file_exists($dailyFile)) {
    $c = @file_get_contents($dailyFile);
    if ($c) {
        $parsed = json_decode($c, true);
        if (is_array($parsed) && isset($parsed['count'])) {
            $dailyData = $parsed;
        }
    }
}

if ($dailyData['count'] >= $dailyCap) {
    json_response([
        'fallbackToBrowser' => true,
        'message'           => 'Daily voice synthesis cap reached. Falling back to browser speech synthesis.',
    ]);
}

$input = get_json_input();
$text  = trim((string)($input['text'] ?? ''));
$voice = trim((string)($input['voice'] ?? 'en-IN-NeerjaNeural'));
$rate  = trim((string)($input['rate'] ?? '+0%'));

// 3. Text length validation & capping
if (empty($text)) {
    error_response('Text is required for TTS synthesis.', 400);
}
if (mb_strlen($text, 'UTF-8') > 1000) {
    $text = mb_substr($text, 0, 1000, 'UTF-8');
}

// 4. Voice whitelist
$baseVoices = ['en-IN-NeerjaNeural', 'te-IN-ShrutiNeural', 'hi-IN-SwaraNeural'];
$customVoices = (array)($ttsConfig['allowed_voices'] ?? []);
$whitelist = array_unique(array_merge($baseVoices, $customVoices));

if (!in_array($voice, $whitelist, true)) {
    error_response("Requested voice '{$voice}' is not permitted.", 400);
}

// 5. Speech rate validation
if ($rate === '') {
    $rate = '+0%';
}
if (!preg_match('/^[+-]\d{1,2}%$/', $rate)) {
    error_response("Invalid rate format. Must match ^[+-]\\d{1,2}%$ (default '+0%').", 400);
}

$azureKey  = $ttsConfig['azure_key'] ?? '';
$azureReg  = $ttsConfig['azure_region'] ?? 'centralindia';

// 6. Check file cache
$cacheDir = sys_get_temp_dir() . '/zippy_tts_cache';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0777, true);
}
$cacheKey = md5($text . '_' . $voice . '_' . $rate);
$cacheFile = "{$cacheDir}/tts_{$cacheKey}.mp3";

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400 * 7)) {
    $audioBytes = @file_get_contents($cacheFile);
    if ($audioBytes) {
        json_response([
            'audioBase64' => base64_encode($audioBytes),
            'contentType' => 'audio/mpeg',
            'cached'      => true,
        ]);
    }
}

// 7. Make call to Azure Speech API if key configured
if (!empty($azureKey)) {
    $xmlText = htmlspecialchars($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
    $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>" .
            "<voice name='{$voice}'>" .
            "<prosody rate='{$rate}'>{$xmlText}</prosody>" .
            "</voice></speak>";

    $endpoint = "https://{$azureReg}.tts.speech.microsoft.com/cognitiveservices/v1";

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Ocp-Apim-Subscription-Key: ' . $azureKey,
        'Content-Type: application/ssml+xml',
        'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3',
        'User-Agent: ZippyTechSystemsVoiceAgent/2.0',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $ssml);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);

    $audioResult = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $audioResult) {
        @file_put_contents($cacheFile, $audioResult);

        // Increment daily counter on successful synthesis
        $dailyData['count']++;
        @file_put_contents($dailyFile, json_encode($dailyData));

        json_response([
            'audioBase64' => base64_encode($audioResult),
            'contentType' => 'audio/mpeg',
            'cached'      => false,
        ]);
    }
}

// 8. Fallback: Notify frontend client to use native Browser SpeechSynthesis
json_response([
    'fallbackToBrowser' => true,
    'message'           => 'Azure TTS key not set or unavailable. Using browser speech synthesis.',
]);
