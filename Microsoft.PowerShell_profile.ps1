# Terminal Config
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows

# Aliases
function touch {
  if((Test-Path -Path ($args[0])) -eq $false) {Set-Content -Path ($args[0]) -Value ($null)} else {(Get-Item ($args[0])).LastWriteTime = Get-Date }
}
function Show-Itwin-Config {
  cat ~\repos\me.config\viewer.env.local
}
function Create-Cospace {
  ~\repos\scripts\itwin\create-cospace.ps1
}
function Show-Aliases {
  cat $profile
}

# fnm config
fnm env --use-on-cd | Out-String | Invoke-Expression