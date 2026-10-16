@echo off
title चित्रसृष्टी (ChitraSrushti) - Marathi Text & Speech to Image AI
echo =======================================================
echo   चित्रसृष्टी (ChitraSrushti) - Marathi Text & Speech to Image
echo =======================================================
echo.
echo सर्व्हर सुरू होत आहे (Starting Server)...
echo.

set "NODE_CMD=node"
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
        set "NODE_CMD=%LOCALAPPDATA%\Programs\nodejs\node.exe"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    ) else (
        echo [त्रुटी / ERROR] Node.js सापडले नाही! (Node.js was not found.)
        pause
        exit /b 1
    )
)

start "" http://localhost:3000
"%NODE_CMD%" server.js

pause
