$ErrorActionPreference = "Stop"

$repository = "https://github.com/johnnyd710/dotfiles.git"
$dotfilesDir = Join-Path $HOME "Repos\dotfiles"

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "winget is required. Install App Installer from the Microsoft Store and retry."
}

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    winget install --id Git.Git --exact --accept-source-agreements --accept-package-agreements
    $gitPath = Join-Path $env:ProgramFiles "Git\cmd\git.exe"
    if (-not (Test-Path -LiteralPath $gitPath)) {
        throw "Git was installed but could not be found at $gitPath. Open a new PowerShell session and retry."
    }
} else {
    $gitPath = $git.Source
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dotfilesDir) | Out-Null
if (Test-Path -LiteralPath $dotfilesDir) {
    if (-not (Test-Path -LiteralPath (Join-Path $dotfilesDir ".git"))) {
        throw "$dotfilesDir exists but is not a Git checkout."
    }
} else {
    & $gitPath clone $repository $dotfilesDir
    if ($LASTEXITCODE -ne 0) { throw "Failed to clone $repository." }
}

& powershell.exe -ExecutionPolicy Bypass -File (Join-Path $dotfilesDir "setup.ps1")
if ($LASTEXITCODE -ne 0) { throw "Dotfiles setup failed." }
