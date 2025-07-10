@echo off
setlocal enabledelayedexpansion

REM Check if Java process is running
tasklist /FI "IMAGENAME eq java.exe" | find /I "java.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo Java process is already running. Skipping Firebase Emulator startup.
    set "SKIP_FIREBASE=1"
)

REM Check if Node process is running
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    echo Node process is already running. Skipping npm run dev.
    set "SKIP_NPM=1"
)

REM Look for first folder starting with "firebase-export"
set "EXPORT_FOLDER="

for /d %%f in (firebase-export*) do (
    set "EXPORT_FOLDER=%%f"
    goto found
)

REM No folder found, create "firebase-export"
set "EXPORT_FOLDER=firebase-export"
mkdir "%EXPORT_FOLDER%"
echo No export folder found. Created: %EXPORT_FOLDER%

:found
echo Using export/import folder: %EXPORT_FOLDER%

REM Start Firebase Emulator if not skipped
if not defined SKIP_FIREBASE (
    echo Starting Firebase Emulator...
    start "Firebase Emulator" cmd /k "set FIREBASE_EMULATOR_WARNINGS_SUPPRESSED=true && firebase emulators:start --import=%EXPORT_FOLDER% --export-on-exit=%EXPORT_FOLDER%"
)

REM Start npm run dev if not skipped
if not defined SKIP_NPM (
    echo Starting npm run dev...
    npm run dev
)

endlocal
