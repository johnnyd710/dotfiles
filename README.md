# dotfiles

Personal configuration and setup scripts for macOS, Debian/Ubuntu, and Windows.

## Setup

Clone this repository to `~/Repos/dotfiles` (or the equivalent Windows path) and run the platform setup script from the repository root.

### macOS

Homebrew is required. Install it from <https://brew.sh>, then run:

```bash
./setup.sh
```

`setup.sh` uses the `Brewfile` to install Fish, Fisher, GitHub CLI, Syncthing, Ghostty, Obsidian, and Bitwarden.

### Debian/Ubuntu

```bash
./setup.sh
```

The script installs GitHub CLI and Syncthing with `apt`. It installs Obsidian and Bitwarden from Flathub using Flatpak.

### Windows

Run from PowerShell:

```powershell
.\setup.ps1
```

The script requires `winget` and installs Git, GitHub CLI, Syncthing, Obsidian, Bitwarden, PowerShell Preview, VS Code, and Windows Terminal Preview.

## Tracked configuration

- `bin/`: portable helper scripts.
- `fish/`: macOS Fish configuration and Fisher plugin manifest.
- `gh/`: non-secret GitHub CLI preferences and aliases.
- `ghostty/`: macOS Ghostty configuration.
- `git/`: Git configuration.
- `itwin/templates/`: templates used by `bin/create-cospace.ps1`.
- `pi/`: Pi configuration, extensions, and personal skills.
- `powershell/`: PowerShell profile.
- `vscode/`: VS Code user settings.
- `windows-terminal/`: Windows Terminal user settings.

On Unix, `setup.sh` creates symbolic links from standard configuration locations into this repository. On Windows, `setup.ps1` uses hard links for files and a junction for Pi extensions, so it does not require Administrator privileges or Developer Mode.

## Machine-local data

The following is intentionally not tracked or deployed:

- Pi authentication, sessions, caches, logs, and downloaded packages.
- GitHub CLI authentication (`hosts.yml`). Setup runs `gh auth login` only when the machine is not authenticated.
- Syncthing device identity, certificates, folders, databases, and peers.
- Obsidian vaults and `.obsidian` vault state. Syncthing is expected to synchronize vaults independently.
- Bitwarden vaults, authentication, and local application state.

## Notes

Pi discovers skills from `pi/skills/` and `~/Repos/llm-wiki/skills/`, as configured in `pi/settings.json`. Clone this repository to `~/Repos/dotfiles` and clone `llm-wiki` at that path for both skill sources to be available.
