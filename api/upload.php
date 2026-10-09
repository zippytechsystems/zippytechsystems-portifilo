<?php
/**
 * ZippyTechSystems Pvt. Ltd. — Secure File Upload API
 * Domain: https://zippysoftwares.in
 */

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_response('Method not allowed. Use POST.', 405);
}

// Admin only (validates session and X-CSRF-Token header)
require_admin();

// Check uploaded file
$file = $_FILES['file'] ?? $_FILES['image'] ?? $_FILES['video'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $errCode = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    $msg = 'No valid file uploaded.';
    if ($errCode === UPLOAD_ERR_INI_SIZE || $errCode === UPLOAD_ERR_FORM_SIZE) {
        $msg = 'Uploaded file exceeds server upload size limit.';
    }
    error_response($msg, 400);
}

$uploadConfig = $config['upload'] ?? [];
$maxStandardSize = (int)($uploadConfig['max_size_bytes'] ?? (10 * 1024 * 1024)); // 10MB
$maxVideoSize    = (int)($uploadConfig['max_video_size_bytes'] ?? (50 * 1024 * 1024)); // 50MB

// Standard allowed types (SVG explicitly removed for security)
$standardTypes = $uploadConfig['allowed_types'] ?? [
    'image/jpeg'        => 'jpg',
    'image/png'         => 'png',
    'image/webp'        => 'webp',
    'application/pdf'   => 'pdf',
];

// Video allowed types for project showcases
$videoTypes = $uploadConfig['allowed_video_types'] ?? [
    'video/mp4'         => 'mp4',
    'video/webm'        => 'webm',
];

// Verify actual MIME type using finfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$extension = null;
$isVideo = false;

if (isset($standardTypes[$mimeType])) {
    $extension = $standardTypes[$mimeType];
    if ($file['size'] > $maxStandardSize) {
        error_response('File size exceeds the image/document limit of ' . round($maxStandardSize / (1024 * 1024)) . 'MB.', 400);
    }
} elseif (isset($videoTypes[$mimeType])) {
    $extension = $videoTypes[$mimeType];
    $isVideo = true;
    if ($file['size'] > $maxVideoSize) {
        error_response('Video size exceeds the limit of ' . round($maxVideoSize / (1024 * 1024)) . 'MB.', 400);
    }
} else {
    // Explicit rejection of SVG or unrecognized types
    if (stripos($mimeType, 'svg') !== false) {
        error_response("SVG uploads are disabled for security. Please upload PNG, JPG, or WebP instead.", 400);
    }
    error_response("File type '{$mimeType}' is not permitted. Only JPG, PNG, WebP, PDF, MP4, and WebM are allowed.", 400);
}

// Resolve upload directory with 0755 permissions
$uploadDir = __DIR__ . '/../uploads';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
    @chmod($uploadDir, 0755);
}

// Ensure secure .htaccess execution prevention in uploads directory
$htaccessFile = $uploadDir . '/.htaccess';
$htaccessContent = <<<HTACCESS
# Block execution of any scripts in uploads directory
Options -ExecCGI -Indexes
RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phar .phps .cgi .pl .py .jsp .asp .sh
RemoveType .php .phtml .php3 .php4 .php5 .php7 .phar .phps .cgi .pl .py .jsp .asp .sh

<IfModule mod_php.c>
    php_flag engine off
</IfModule>
<IfModule mod_php7.c>
    php_flag engine off
</IfModule>
<IfModule mod_php8.c>
    php_flag engine off
</IfModule>

<FilesMatch "\.(php|phtml|php3|php4|php5|php7|phar|phps|cgi|pl|py|jsp|asp|sh|exe)$">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order Allow,Deny
        Deny from all
    </IfModule>
</FilesMatch>

<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
</IfModule>
HTACCESS;

// Always ensure the .htaccess file exists and has correct rules
if (!file_exists($htaccessFile) || @file_get_contents($htaccessFile) !== $htaccessContent) {
    @file_put_contents($htaccessFile, $htaccessContent);
}

// Generate unique, collision-proof filename
try {
    $randomBytes = bin2hex(random_bytes(8));
} catch (Exception $e) {
    $randomBytes = uniqid();
}

$prefix = $isVideo ? 'zippy_vid_' : 'zippy_';
$filename = $prefix . date('Ymd_His') . '_' . $randomBytes . '.' . $extension;
$destination = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    error_response('Failed to save uploaded file.', 500);
}

@chmod($destination, 0644);

$publicUrl = '/uploads/' . $filename;

json_response([
    'success'   => true,
    'url'       => $publicUrl,
    'filename'  => $filename,
    'mime_type' => $mimeType,
    'size'      => $file['size'],
    'is_video'  => $isVideo,
    'message'   => 'File uploaded successfully.',
]);
