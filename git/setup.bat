@echo off

winget install --id Git.Git
winget install --id GitHub.cli
mklink /H "%USERPROFILE%\.gitconfig" ".\.gitconfig"