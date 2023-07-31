# Terminal Config
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows

# Shorten my powershell path
# function prompt {'~$ ' + $(Get-Location | Split-Path -Leaf) + "> "}

# Aliases
function touch {
  if((Test-Path -Path ($args[0])) -eq $false) {Set-Content -Path ($args[0]) -Value ($null)} else {(Get-Item ($args[0])).LastWriteTime = Get-Date }
}
function rmf { rm -r -fo $args[0] }
function Start-Studio {
  Start-Process pnpm -ArgumentList "--filter `"@studio/app`" start-frontend"
  Start-Process pnpm -ArgumentList "--filter `"@studio/app`" start-apps-devserver"
}
function Write-BranchName () {
    try {
        $branch = git rev-parse --abbrev-ref HEAD

        if ($branch -eq "HEAD") {
            # we're probably in detached HEAD state, so print the SHA
            $branch = git rev-parse --short HEAD
            Write-Host " ($branch)" -ForegroundColor "red"
        }
        else {
            # we're on an actual branch, so print it
            Write-Host " ($branch)" -ForegroundColor "blue"
        }
    } catch {
        # we'll end up here if we're in a newly initiated git repo
        Write-Host " (no branches yet)" -ForegroundColor "yellow"
    }
}

function prompt {
    $base = "PS "
    $path = "$($executionContext.SessionState.Path.CurrentLocation)"
    $userPrompt = "$('>' * ($nestedPromptLevel + 1)) "

    Write-Host "`n$base" -NoNewline

    if (Test-Path .git) {
        Write-Host $path -NoNewline -ForegroundColor "green"
        Write-BranchName
    }
    else {
        # we're not in a repo so don't bother displaying branch name/sha
        Write-Host $path -ForegroundColor "green"
    }

    return $userPrompt
}