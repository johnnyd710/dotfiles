@echo off

winget install --id Git.Git
winget install --id GitHub.cli
mklink /H "%USERPROFILE%\.gitconfig" ".\.gitconfig"

winget install Microsoft.PowerShell.Preview
mklink /H "%ONEDRIVE%\Documents\Powershell\Microsoft.PowerShell_profile.ps1" ".\Microsoft.PowerShell_profile.ps1"

winget install -e --id Microsoft.VisualStudioCode
mklink /H "%APPDATA%\Code\User\settings.json" ".\settings.json"
call code --install-extension wayou.vscode-todo-highlight
call code --install-extension streetsidesoftware.code-spell-checker
call code --install-extension mike-co.import-sorter
call code --install-extension mechatroner.rainbow-csv
call code --install-extension GitHub.copilot
call code --install-extension euskadi31.json-pretty-printer
call code --install-extension christian-kohler.path-intellisense

winget install --id=Microsoft.WindowsTerminal.Preview
mklink /H "%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json" ".\terminal.json"