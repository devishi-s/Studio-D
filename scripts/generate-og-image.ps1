Add-Type -AssemblyName System.Drawing
$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = "AntiAlias"
$g.Clear([System.Drawing.Color]::FromArgb(253, 245, 240))
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(107, 58, 42))
$accent = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(212, 133, 106))
$font = New-Object System.Drawing.Font "Georgia", 72
$sub = New-Object System.Drawing.Font "Segoe UI", 22
$g.FillRectangle($accent, 80, 200, 64, 6)
$g.DrawString("Studio D", $font, $brush, 80, 230)
$g.DrawString("Handmade crochet, paintings & thoughtful gifts", $sub, $brush, 80, 340)
$path = Join-Path $PSScriptRoot "..\public\og-image.jpg"
$path = [System.IO.Path]::GetFullPath($path)
$bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$bmp.Dispose()
Write-Output "Wrote $path"
