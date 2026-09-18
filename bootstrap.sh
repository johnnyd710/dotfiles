#!/usr/bin/env bash
set -euo pipefail

REPOSITORY="https://github.com/johnnyd710/dotfiles.git"
DOTFILES_DIR="${HOME}/Repos/dotfiles"
OS="$(uname)"

if [ "${OS}" = "Darwin" ]; then
    if ! command -v brew >/dev/null; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        if [ -x /opt/homebrew/bin/brew ]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        elif [ -x /usr/local/bin/brew ]; then
            eval "$(/usr/local/bin/brew shellenv)"
        else
            echo "Homebrew installation completed but brew is not on PATH." >&2
            exit 1
        fi
    fi

    brew install git
elif [ "${OS}" = "Linux" ]; then
    if ! command -v apt-get >/dev/null; then
        echo "Bootstrap is supported on Debian/Ubuntu systems with apt." >&2
        exit 1
    fi

    sudo apt-get update
    sudo apt-get install -y git
else
    echo "Bootstrap is supported on macOS and Debian/Ubuntu Linux." >&2
    exit 1
fi

mkdir -p "$(dirname "${DOTFILES_DIR}")"
if [ -e "${DOTFILES_DIR}" ]; then
    if ! git -C "${DOTFILES_DIR}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        echo "${DOTFILES_DIR} exists but is not a Git checkout." >&2
        exit 1
    fi
else
    git clone "${REPOSITORY}" "${DOTFILES_DIR}"
fi

exec "${DOTFILES_DIR}/setup.sh"
