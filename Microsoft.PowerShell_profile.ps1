# Terminal Config
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineOption -EditMode Windows
Set-PSReadLineOption -MaximumHistoryCount 10000

# Aliases
function prompt {
    $path = "$($executionContext.SessionState.Path.CurrentLocation)"
    $userPrompt = "$('>' * ($nestedPromptLevel + 1)) "

    Write-Host "`n" -NoNewline

    if (Test-Path .git) {
        Write-Host $path -NoNewline -ForegroundColor "green"
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
    else {
        # we're not in a repo so don't bother displaying branch name/sha
        Write-Host $path -ForegroundColor "green"
    }

    return $userPrompt
}

function Git-Clean {
    git fetch --prune && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
}

function rmf {
    Remove-Item -Recurse -Force $args
}
