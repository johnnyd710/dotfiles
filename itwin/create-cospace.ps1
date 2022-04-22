# create a ps script to init a cospaces
# gh repo clone branch of itwinjscore,
# the viewer, the vcr components,
# copy the .env.local file into the viewer,
# create all the code-workspace and pnpm workspace files
#
# author: john dimatteo
# created on: 2022-04-22

# REQUIRES GITHUB CLI TO BE INSTALLED AND AUTHORIZED UNDER A GITHUB ACCOUNT
# https://github.com/cli/cli

param ($dir, $viewerbranch='next', $corebranch='master', $vcr=$null)
if ($dir -eq $null) {
  $dir = read-host -Prompt "Please enter a name for the new cospace directory." 
}
if ($viewerbranch -eq $null) {
  $viewerbranch = read-host -Prompt "Please enter a branch name to clone (iTwin Viewer)" 
}
if ($corebranch -eq $null) {
  $corebranch = read-host -Prompt "Please enter a branch name to clone (iTwin Core)" 
}
if ($vcr -eq $null) {
  write-host "Not including the VCR repository..." 
}

mkdir $dir
cd $dir
npx cospace init
cp "$PSScriptRoot\templates\.pnpmfile.cjs" ".pnpmfile.cjs"
cp "$PSScriptRoot\templates\cospace.code-workspace" "cospace.code-workspace"
cp "$PSScriptRoot\templates\pnpm-workspace.yaml" "pnpm-workspace.yaml"
cd repos
gh repo clone "iTwin/viewer" viewer -- --single-branch --depth 1 -b "$viewerbranch"
gh repo clone "iTwin/itwinjs-core" itwinjs-core -- --single-branch --depth 1 -b "$corebranch"
cd ..
write-host "Ready to go!"