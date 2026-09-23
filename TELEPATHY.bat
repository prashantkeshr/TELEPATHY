@echo off
title Telepathy Dev
cd /d "%~dp0"

echo.
echo  ^>_ Telepathy Dev Environment
echo  ================================
echo  [1] Start dev server  (npm run dev)
echo  [2] Install dependencies (npm install)
echo  [3] Production build  (npm run build)
echo  [4] Run type-check
echo  [5] Open folder in Explorer
echo  [6] Open in VS Code
echo  [Q] Quit
echo.

if not exist "node_modules" (
    echo  Dependencies not installed yet. Running npm install first...
    echo.
    call npm install
    echo.
)

:menu
set /p choice= Choose [1/2/3/4/5/6/Q]:

if /i "%choice%"=="1" goto dev
if /i "%choice%"=="2" goto install
if /i "%choice%"=="3" goto build
if /i "%choice%"=="4" goto typecheck
if /i "%choice%"=="5" goto explorer
if /i "%choice%"=="6" goto vscode
if /i "%choice%"=="q" goto end
echo Invalid choice, try again.
goto menu

:dev
echo.
echo Starting Vite dev server at http://localhost:5178 ...
call npm run dev -- --port 5178
goto end

:install
echo.
call npm install
echo.
pause
goto menu

:build
echo.
call npm run build
echo.
pause
goto menu

:typecheck
echo.
call npx tsc -b --noEmit
echo.
pause
goto menu

:explorer
explorer "%~dp0"
goto menu

:vscode
code "%~dp0"
goto menu

:end
exit
