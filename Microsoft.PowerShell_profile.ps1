# Terminal Config
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows
Import-Module -Name Terminal-Icons

# Shorten my powershell path
function prompt {'~$ ' + $(Get-Location | Split-Path -Leaf) + "> "}

# Aliases
function touch {
  if((Test-Path -Path ($args[0])) -eq $false) {Set-Content -Path ($args[0]) -Value ($null)} else {(Get-Item ($args[0])).LastWriteTime = Get-Date }
}
function Copy-Itwin-Config {
  cp ~\repos\scripts\itwin\templates\.env.local .env.local
}
function Create-Cospace {
  ~\repos\scripts\itwin\create-cospace.ps1
}
function Open-Notes {
  code "C:\Users\John.DiMatteo\OneDrive - Bentley Systems, Inc\notes"
}
function Set-Dev-Env {
  $Env:NODE_TLS_REJECT_UNAUTHORIZED='0'
  $Env:IMJS_URL_PREFIX="dev-"
  $Env:NODE_ENV="development"
}
function Clear-Dev-Env {
  $Env:NODE_TLS_REJECT_UNAUTHORIZED=""
  $Env:IMJS_URL_PREFIX=""
  $Env:NODE_ENV=""
}

# fnm config
fnm env --use-on-cd | Out-String | Invoke-Expression