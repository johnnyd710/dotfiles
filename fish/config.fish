if status is-interactive
  # interactive-only config
end

set -gx PNPM_HOME "$HOME/Library/pnpm"

set -l _path_no_pnpm
for p in $PATH
  if test "$p" != "$PNPM_HOME"
    set -a _path_no_pnpm "$p"
  end
end

set -gx PATH "$PNPM_HOME/nodejs/24.12.0/bin" /opt/homebrew/bin /usr/local/bin /usr/bin /bin /usr/sbin /sbin /Applications/iTwinStudioforDevelopers.app/Contents/MacOS $_path_no_pnpm $PNPM_HOME
fish_add_path ~/.dotnet/tools

set -gx npm_node_execpath "$PNPM_HOME/nodejs/24.12.0/bin/node"
set -gx npm_execpath "$PNPM_HOME/nodejs/24.12.0/lib/node_modules/npm/bin/npm-cli.js"

# Function to list my favorite development directories
function lsfav
    ls -ld "$HOME/Library/Caches/iModelJs/imodels/" "$HOME/Library/Application Support/Bentley/iTwin Studio" $argv
end

set -x PATH /Applications/iTwinStudio.app/Contents/MacOS $PATH

# pnpm
set -gx PNPM_HOME "$HOME/Library/pnpm"
if not string match -q -- "$PNPM_HOME/bin" $PATH
  set -gx PATH "$PNPM_HOME/bin" $PATH
end
# pnpm end

set -x PATH "$HOME/.local/bin" $PATH

# Pi
fish_add_path "/opt/homebrew/bin"

# Added by LM Studio CLI tool (lms)
set -gx PATH $PATH "$HOME/.lmstudio/bin"
