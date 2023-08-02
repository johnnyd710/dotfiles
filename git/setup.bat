@echo off

@REM winget install --id Git.Git
@REM winget install --id GitHub.cli
mklink /H "%USERPROFILE%\.gitconfig" ".\.gitconfig"