$ErrorActionPreference = "Stop"

$dotfilesDir = $PSScriptRoot
$backupDir = Join-Path $env:USERPROFILE ".dotfiles-backup\$(Get-Date -Format 'yyyyMMdd-HHmmss-fffffff')"

function Move-Existing([string]$destination) {
    if (Test-Path -LiteralPath $destination) {
        $backupPath = Join-Path $backupDir ($destination -replace ':', '')
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $backupPath) | Out-Null
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
winget install --id ajeetdsouza.zoxide --exact
winget install --id Microsoft.PowerShell.Preview
winget install -e --id Microsoft.VisualStudioCode
winget install --id Microsoft.WindowsTerminal.Preview

# Install Pi
if (-not (Get-Command pi -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Pi..."
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -Command {
        $ErrorActionPreference = "Stop"
        Invoke-RestMethod https://pi.dev/install.ps1 | Invoke-Expression
    }
    if ($LASTEXITCODE -ne 0) { throw "Pi installation failed." }
}

Install-HardLink (Join-Path $dotfilesDir "git\.gitconfig") (Join-Path $env:USERPROFILE ".gitconfig")
$gitConfigHome = if ($env:XDG_CONFIG_HOME) { $env:XDG_CONFIG_HOME } else { Join-Path $env:USERPROFILE ".config" }
Install-HardLink (Join-Path $dotfilesDir "git\ignore") (Join-Path $gitConfigHome "git\ignore")
Install-HardLink (Join-Path $dotfilesDir "gh\config.yml") (Join-Path $env:APPDATA "GitHub CLI\config.yml")
$rexConfigFile = if ($env:REX_CONFIG) { $env:REX_CONFIG } else { Join-Path $env:APPDATA "rex\init.lua" }
Install-HardLink (Join-Path $dotfilesDir "rex\init.lua") $rexConfigFile
$powerShellProfile = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "PowerShell\Microsoft.PowerShell_profile.ps1"
Install-HardLink (Join-Path $dotfilesDir "powershell\Microsoft.PowerShell_profile.ps1") $powerShellProfile
Install-HardLink (Join-Path $dotfilesDir "vscode\settings.json") (Join-Path $env:APPDATA "Code\User\settings.json")
Install-HardLink (Join-Path $dotfilesDir "windows-terminal\settings.json") (Join-Path $env:LOCALAPPDATA "Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json")

$piAgentDir = Join-Path $env:USERPROFILE ".pi\agent"
Install-HardLink (Join-Path $dotfilesDir "pi\settings.json") (Join-Path $piAgentDir "settings.json")
Install-HardLink (Join-Path $dotfilesDir "pi\models.json") (Join-Path $piAgentDir "models.json")
Install-HardLink (Join-Path $dotfilesDir "pi\mcp.json") (Join-Path $piAgentDir "mcp.json")
Install-HardLink (Join-Path $dotfilesDir "pi\AGENTS.md") (Join-Path $piAgentDir "AGENTS.md")
Install-Junction (Join-Path $dotfilesDir "pi\extensions") (Join-Path $piAgentDir "extensions")
New-Item -ItemType Directory -Force -Path (Join-Path $piAgentDir "skills") | Out-Null

$extensions = Get-Content (Join-Path $dotfilesDir "vscode\extensions.txt") | Where-Object { $_ }
foreach ($extension in $extensions) {
    code --install-extension $extension
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Authenticating GitHub CLI..."
    gh auth login --git-protocol https
}

Write-Host "==> Dotfiles setup completed successfully!"
