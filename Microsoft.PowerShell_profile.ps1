function Show-Itwin-Config {
  cat ~\repos\me.config\viewer.env.local
}
function Create-Cospace {
  ~\repos\scripts\itwin\create-cospace.ps1
}
function Show-Aliases {
  cat $profile
}
