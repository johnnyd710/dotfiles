#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root directory regardless of working directory
DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Setting up dotfiles from ${DOTFILES_DIR}..."

# Setup Git config
if [ -f "${DOTFILES_DIR}/git/.gitconfig" ]; then
    echo "Linking ~/.gitconfig"
    ln -sf "${DOTFILES_DIR}/git/.gitconfig" "${HOME}/.gitconfig"
fi

# Setup Pi configuration
PI_AGENT_DIR="${HOME}/.pi/agent"
mkdir -p "${PI_AGENT_DIR}"

echo "Linking Pi agent configuration files..."
ln -sf "${DOTFILES_DIR}/pi/settings.json" "${PI_AGENT_DIR}/settings.json"
ln -sf "${DOTFILES_DIR}/pi/models.json" "${PI_AGENT_DIR}/models.json"
ln -sf "${DOTFILES_DIR}/pi/AGENTS.md" "${PI_AGENT_DIR}/AGENTS.md"

# Link extensions directory (remove existing if directory or symlink)
if [ -d "${PI_AGENT_DIR}/extensions" ] || [ -L "${PI_AGENT_DIR}/extensions" ]; then
    rm -rf "${PI_AGENT_DIR}/extensions"
fi
ln -sfn "${DOTFILES_DIR}/pi/extensions" "${PI_AGENT_DIR}/extensions"

# Ensure skills directory exists if Pi looks there
mkdir -p "${PI_AGENT_DIR}/skills"

# Setup VS Code settings if VS Code config directory exists
VSCODE_USER_DIR=""
if [ "$(uname)" = "Darwin" ]; then
    VSCODE_USER_DIR="${HOME}/Library/Application Support/Code/User"
elif [ "$(uname)" = "Linux" ]; then
    VSCODE_USER_DIR="${HOME}/.config/Code/User"
fi

if [ -n "${VSCODE_USER_DIR}" ] && [ -f "${DOTFILES_DIR}/vscode/settings.json" ]; then
    mkdir -p "${VSCODE_USER_DIR}"
    echo "Linking VS Code settings.json..."
    ln -sf "${DOTFILES_DIR}/vscode/settings.json" "${VSCODE_USER_DIR}/settings.json"
fi

if [ "$(uname)" = "Darwin" ]; then
    FISH_CONFIG_DIR="${HOME}/.config/fish"
    GHOSTTY_CONFIG_DIR="${HOME}/Library/Application Support/com.mitchellh.ghostty"

    mkdir -p "${FISH_CONFIG_DIR}" "${GHOSTTY_CONFIG_DIR}"
    echo "Linking Fish and Ghostty configuration..."
    ln -sf "${DOTFILES_DIR}/fish/config.fish" "${FISH_CONFIG_DIR}/config.fish"
    ln -sf "${DOTFILES_DIR}/fish/fish_plugins" "${FISH_CONFIG_DIR}/fish_plugins"
    ln -sf "${DOTFILES_DIR}/ghostty/config" "${GHOSTTY_CONFIG_DIR}/config"
fi

echo "==> Dotfiles setup completed successfully!"
