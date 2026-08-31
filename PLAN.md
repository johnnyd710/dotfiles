# dotfiles PLAN

## Goal
Zero-to-productive. A single execution on a new machine (via Git or Syncthing) provisions the OS, installs software, and configures the environment.

## Core Principles
- **Idempotency:** The installation script can be run multiple times without breaking the system.
- **Simplicity:** Minimal dependencies for the installation itself.
- **Modularity:** Software installation and configuration are separated into discrete modules.
- **Source of Truth:** All configuration files live in this repo; only symlinks exist in `$HOME`.

## Repository Structure

### 1. `bin/` (The Entry Points)
Contains minimal entry points that are added to the user's `PATH`.
- **Simple Scripts:** Direct symlinks to single-file scripts.
- **TypeScript Tools:** Small "shims" that launch the compiled code located in `tools/`.
- **Zig/Native Tools:** Symlinks to the compiled binaries located in `tools/`.

### 2. `tools/` (The Implementations)
Dedicated directory for custom tools that require their own environment (dependencies, build steps).
- Each sub-directory is a standalone project (e.g., `tools/pnpm-linker/`).
- Contains its own `package.json`, `tsconfig.json`, or `build.zig`.
- The build output (e.g., `dist/` or `zig-out/`) is ignored by Git.

### 3. `configs/` (The Settings)
The source of truth for all application settings.
- Sub-directories for each tool (e.g., `configs/fish/`, `configs/vscode/`, `configs/tmux/`).
- During installation, these are symlinked to the appropriate location in `$HOME`.

### 4. `modules/` (The Brain)
Modular scripts that handle the heavy lifting of installation.
- `pkg_manager.sh`: Detects and uses brew, apt, or winget.
- `software.sh`: Installs core toolchains (Node, Zig, etc.).
- `setup_tools.sh`: Builds tools in `tools/` and links them to `bin/`.
- `setup_configs.sh`: Symlinks items from `configs/` to `$HOME`.

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
