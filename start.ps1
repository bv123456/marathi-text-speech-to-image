# चित्रसृष्टी (ChitraSrushti) - PowerShell Launcher
$Host.UI.RawUI.WindowTitle = "चित्रसृष्टी (ChitraSrushti) - Marathi Text & Speech to Image AI"

Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host "  चित्रसृष्टी (ChitraSrushti) - Marathi Text & Speech to Image" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "सर्व्हर सुरू होत आहे (Starting Server)..." -ForegroundColor Cyan

$nodePath = "node"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $localNode = "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
    $programFilesNode = "C:\Program Files\nodejs\node.exe"
    if (Test-Path $localNode) {
        $nodePath = $localNode
    } elseif (Test-Path $programFilesNode) {
        $nodePath = $programFilesNode
    } else {
        Write-Error "Node.js सापडले नाही! कृपया Node.js इन्स्टॉल करा."
        exit 1
    }
}

Start-Process "http://localhost:3000"
& $nodePath server.js
