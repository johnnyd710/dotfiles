# dotfiles PLAN

## Goal
Zero-to-productive. A single execution on a new machine (via Git or Syncthing) provisions the OS, installs software, and configures the environment.

## Core Principles
- **Idempotency:** The installation script can be run multiple times without breaking the system.
- **Simplicity:** Minimal dependencies for the installation itself.
- **Modularity:** Software installation and configuration are separated into discrete modules.
- **Source of Truth:** All configuration files live in this repo; only symlinks exist in `$HOME`.

## Repository Structure

- `bin/`: portable helper scripts.
- `git/`: Git configuration.
- `pi/`: Pi configuration, extensions, and personal skills.
- `powershell/`: PowerShell profile.
- `vscode/`: VS Code user settings.
- `windows-terminal/`: Windows Terminal user settings.
- `itwin/templates/`: workspace templates used by `bin/create-cospace.ps1`.
- `setup.sh`: macOS and Linux setup.
- `setup.ps1`: native Windows setup.

The repository is the source of truth. Unix setup uses symbolic links; Windows setup uses hard links for files and a directory junction for Pi extensions, so no administrator privileges or Developer Mode are required.

## Installation Workflow

1.  **Detection Phase:** Determine OS (macOS, Linux, Windows) and Package Manager.
2.  **Provisioning Phase:** 
    - Install core software (Node, pnpm, Zig, etc.) via the detected package manager.
    - Build custom tools in `tools/` and link them to `bin/`.
3.  **Configuration Phase:** 
    - Symlink everything in `configs/` to its required location in `$HOME`.

## Development Environment (Assumed Versions)
- **Runtime/Languages:** Node, pnpm, Zig.
- **AI/Dev Tools:** pi.dev, LMStudio.
- **Shell/Term:** Fish, tmux, zoxide, Ghostty/Windows Terminal.
- **Core Apps:** VS Code, Git, gh, Syncthing.
