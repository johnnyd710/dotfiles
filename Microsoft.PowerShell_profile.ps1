# Terminal Config
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows

# Aliases
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