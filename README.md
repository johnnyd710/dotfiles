# dotfiles

Personal configuration and setup scripts for macOS, Debian/Ubuntu, and Windows.

## Bootstrap a new machine

The bootstrap scripts install the prerequisites needed to obtain this repository, clone it to `~/Repos/dotfiles` (or `$HOME\Repos\dotfiles` on Windows), then run the platform setup script. An existing valid checkout is reused without automatically pulling or overwriting changes.

### macOS / Debian / Ubuntu

```bash
curl -fsSL https://raw.githubusercontent.com/johnnyd710/dotfiles/master/bootstrap.sh | bash
```

On macOS, bootstrap installs Homebrew when necessary, then installs Git. On Debian/Ubuntu, it installs Git with `apt`.

### Windows

Run from PowerShell:

```powershell
irm https://raw.githubusercontent.com/johnnyd710/dotfiles/master/bootstrap.ps1 | iex
```

Windows bootstrap requires `winget` and installs Git when necessary.

> `curl | bash` and `irm | iex` execute the current script on the `master` branch. To review it first, download the script, inspect it, then execute the local copy.

## Run setup from an existing checkout

```bash
./setup.sh
```

On macOS, `setup.sh` uses the `Brewfile` to install Git, Fish, Fisher, GitHub CLI, Syncthing, Zig, Ghostty, Obsidian, and Bitwarden. On Debian/Ubuntu, it installs GitHub CLI, Syncthing, and Zig with `apt`, and installs Obsidian and Bitwarden from Flathub using Flatpak.

On Windows, run:

```powershell
.\setup.ps1
```

It requires `winget` and installs Git, GitHub CLI, Syncthing, Obsidian, Bitwarden, Zig, PowerShell Preview, VS Code, and Windows Terminal Preview.

## Tracked configuration

- `bin/`: portable helper scripts.
- `fish/`: macOS Fish configuration and Fisher plugin manifest.
- `gh/`: non-secret GitHub CLI preferences and aliases.
- `ghostty/`: macOS Ghostty configuration.
- `git/`: Git configuration.
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
