@echo off
REM Name: Pan Heyang | SID: 24002120316 | Date: 2026-11-20 | Model: GLM-5.3-Flash
REM Function: one-click start for the backend server (Express, port 8316, serves frontend/)
cd /d "%~dp0backend"
if not exist node_modules (
    echo Installing dependencies for the first time...
    call npm i
)
echo Starting backend server: http://localhost:8316
REM Auto-open the homepage in browser after server starts
start "" cmd /c "timeout /t 3 >nul & start http://localhost:8316"
call npm start
pause
