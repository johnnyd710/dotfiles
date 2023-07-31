@echo off

winget install Microsoft.PowerShell.Preview
mklink /H "%ONEDRIVE%\Documents\Powershell\Microsoft.PowerShell_profile.ps1" ".\Microsoft.PowerShell_profile.ps1"
