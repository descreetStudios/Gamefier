@echo off
setlocal enabledelayedexpansion

REM Cerca la prima cartella che inizia con "firebase-export"
set "EXPORT_FOLDER="

for /d %%f in (firebase-export*) do (
    set "EXPORT_FOLDER=%%f"
    goto found
)

REM Nessuna cartella trovata, crea "firebase-export"
set "EXPORT_FOLDER=firebase-export"
mkdir "%EXPORT_FOLDER%"
echo Nessuna cartella trovata. Creata: %EXPORT_FOLDER%

:found
echo Usando cartella di export/import: %EXPORT_FOLDER%
firebase emulators:start --import=%EXPORT_FOLDER% --export-on-exit=%EXPORT_FOLDER%