@echo off

winget install --id=Microsoft.WindowsTerminal.Preview
mklink /H "%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json" ".\settings.json"