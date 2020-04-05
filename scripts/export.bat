@echo off

set BATCHDIR=%~dp0

for /f "skip=1 delims=" %%x in ('wmic os get localdatetime') do if not defined X set X=%%x
set Ttag=%X:~0,12%

set /p EIS_KEY_PROMPT=Press Enter then Scan PASSKEY...
color 91
set /p EIS_KEY=
cls
color 08
echo Processing...

set name=%COMPUTERNAME%_%Ttag%
.\id_sentry_decrypt.exe . --node 001-001-00 --at_import_xlsx "%BATCHDIR%\%name%.xlsx" --csv "%BATCHDIR%\%name%.csv"

if %ERRORLEVEL% EQU 0 (
  mkdir "%BATCHDIR%\exported\%COMPUTERNAME%"
  move "%APPDATA%\ElectronIDSentry\id-sentry-data_*.*" "%BATCHDIR%\exported\%COMPUTERNAME%"
)
