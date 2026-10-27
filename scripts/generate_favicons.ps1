Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\madya\.gemini\antigravity-ide\scratch\zippytechsystems-portifilo-website\images\company-logo-2026.png"
$publicDir = "C:\Users\madya\.gemini\antigravity-ide\scratch\zippytechsystems-portifilo-website\public"
$rootDir = "C:\Users\madya\.gemini\antigravity-ide\scratch\zippytechsystems-portifilo-website"

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Resize-Image($bmp, $w, $h, $destPath) {
    $destBmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($bmp, 0, 0, $w, $h)
    $g.Dispose()
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Output "Generated $destPath ($w x $h)"
}

$sizes = @(
    @{ w = 48; h = 48; name = "favicon-48x48.png" },
    @{ w = 96; h = 96; name = "favicon-96x96.png" },
    @{ w = 180; h = 180; name = "apple-touch-icon.png" },
    @{ w = 192; h = 192; name = "favicon-192x192.png" },
    @{ w = 512; h = 512; name = "favicon-512x512.png" },
    @{ w = 16; h = 16; name = "favicon-16x16.png" },
    @{ w = 32; h = 32; name = "favicon-32x32.png" }
)

foreach ($s in $sizes) {
    Resize-Image $srcBmp $s.w $s.h (Join-Path $publicDir $s.name)
    Resize-Image $srcBmp $s.w $s.h (Join-Path $rootDir $s.name)
}

# Create standard 48x48 ICO file (Google requires at least 48x48 or multi-size)
# A simple PNG-in-ICO header for standard ICO format
function Save-IcoFromPng($pngPath, $icoPath) {
    $pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)
    
    # ICONDIR
    $bw.Write([uint16]0) # Reserved
    $bw.Write([uint16]1) # Type (1 = ICO)
    $bw.Write([uint16]1) # Image count = 1
    
    # ICONDIRENTRY (48x48)
    $bw.Write([byte]48)  # Width
    $bw.Write([byte]48)  # Height
    $bw.Write([byte]0)   # Color count (0 = >= 8bpp)
    $bw.Write([byte]0)   # Reserved
    $bw.Write([uint16]1) # Color planes
    $bw.Write([uint16]32)# Bits per pixel
    $bw.Write([uint32]$pngBytes.Length) # Image size
    $bw.Write([uint32]22) # Offset of image data (6 + 16 = 22)
    
    # PNG data
    $bw.Write($pngBytes)
    $bw.Flush()
    
    [System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
    $bw.Close()
    $ms.Close()
    Write-Output "Generated $icoPath (Standard 48x48 ICO)"
}

$png48Public = Join-Path $publicDir "favicon-48x48.png"
Save-IcoFromPng $png48Public (Join-Path $publicDir "favicon.ico")
Save-IcoFromPng $png48Public (Join-Path $rootDir "favicon.ico")

$srcBmp.Dispose()
Write-Output "All icons generated successfully!"
