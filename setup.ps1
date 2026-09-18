$ErrorActionPreference = "Stop"

$dotfilesDir = $PSScriptRoot
$backupDir = Join-Path $env:USERPROFILE ".dotfiles-backup\$(Get-Date -Format 'yyyyMMdd-HHmmss')"

function Move-Existing([string]$destination) {
    if (Test-Path -LiteralPath $destination) {
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        $backupPath = Join-Path $backupDir ([System.IO.Path]::GetFileName($destination))
        Move-Item -LiteralPath $destination -Destination $backupPath
        Write-Host "Backed up $destination to $backupPath"
    }
}

function Install-HardLink([string]$source, [string]$destination) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Move-Existing $destination
    New-Item -ItemType HardLink -Path $destination -Target $source | Out-Null
}

function Install-Junction([string]$source, [string]$destination) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
    Move-Existing $destination
    cmd.exe /c "mklink /J `"$destination`" `"$source`"" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Failed to create junction: $destination" }
}

Write-Host "==> Setting up dotfiles from $dotfilesDir"

winget install --id Git.Git
winget install --id GitHub.cli
winget install --id Syncthing.Syncthing
winget install --id Obsidian.Obsidian
winget install --id Bitwarden.Bitwarden
winget install --id zig.zig
winget install --id Microsoft.PowerShell.Preview
winget install -e --id Microsoft.VisualStudioCode
winget install --id Microsoft.WindowsTerminal.Preview

Install-HardLink (Join-Path $dotfilesDir "git\.gitconfig") (Join-Path $env:USERPROFILE ".gitconfig")
Install-HardLink (Join-Path $dotfilesDir "gh\config.yml") (Join-Path $env:APPDATA "GitHub CLI\config.yml")
$powerShellProfile = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "PowerShell\Microsoft.PowerShell_profile.ps1"
Install-HardLink (Join-Path $dotfilesDir "powershell\Microsoft.PowerShell_profile.ps1") $powerShellProfile
Install-HardLink (Join-Path $dotfilesDir "vscode\settings.json") (Join-Path $env:APPDATA "Code\User\settings.json")
Install-HardLink (Join-Path $dotfilesDir "windows-terminal\settings.json") (Join-Path $env:LOCALAPPDATA "Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json")

$piAgentDir = Join-Path $env:USERPROFILE ".pi\agent"
Install-HardLink (Join-Path $dotfilesDir "pi\settings.json") (Join-Path $piAgentDir "settings.json")
Install-HardLink (Join-Path $dotfilesDir "pi\models.json") (Join-Path $piAgentDir "models.json")
Install-HardLink (Join-Path $dotfilesDir "pi\AGENTS.md") (Join-Path $piAgentDir "AGENTS.md")
Install-Junction (Join-Path $dotfilesDir "pi\extensions") (Join-Path $piAgentDir "extensions")
New-Item -ItemType Directory -Force -Path (Join-Path $piAgentDir "skills") | Out-Null

$extensions = @(
    "wayou.vscode-todo-highlight",
    "streetsidesoftware.code-spell-checker",
    "mike-co.import-sorter",
    "mechatroner.rainbow-csv",
    "GitHub.copilot",
    "euskadi31.json-pretty-printer",
    "christian-kohler.path-intellisense"
)
foreach ($extension in $extensions) {
    code --install-extension $extension
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Authenticating GitHub CLI..."
    gh auth login --git-protocol https
}

Write-Host "==> Dotfiles setup completed successfully!"
