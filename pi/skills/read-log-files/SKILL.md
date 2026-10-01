---
name: read-log-files
description: Inspect and follow application or system log files across platforms without reading entire large files.
---

# Read Log Files

Use this skill when investigating issues, errors, or application runtime behavior via log files.

## Common Log Locations

- **macOS:**
  - `~/Library/Logs/<AppName>/`
  - `/Library/Logs/`
  - `/var/log/`
- **Linux:**
  - `/var/log/`
  - `~/.local/state/<AppName>/` or `~/.cache/<AppName>/`
  - `journalctl -u <service> -n 100 --no-pager`
- **Windows:**
  - `%LOCALAPPDATA%\<AppName>\Logs`
  - `%APPDATA%\<AppName>\Logs`

## Guidelines

1. **Find the newest log:**
   ```bash
   # macOS / Linux
   ls -lt ~/Library/Logs/<AppName>/*.log | head -n 5
   ```
2. **Never read a giant log file whole:**
   - Use `tail -n 100` or `tail -n 200` to inspect recent entries.
   - Use `grep -i "error\|fatal\|exception"` with context (`-C 3`) to find failures.
   - When searching for specific timestamps, filter by time window before reading.
3. **Handle log rotation:**
   - Identify active vs rotated files (e.g. `.log.1`, `.log.gz`).
   - Focus on the newest file unless the incident occurred earlier.

## ITwin Studio

`iTwin Studio` application log verbosity is controlled by a JSON file (`logs.config.json`). Logs are typically found in the following locations:

- **macOS:**
  - `~/Library/Logs/iTwin Studio/{appId}`
  - `~/Library/Application Support/Bentley/iTwin Studio/logs.config.json`
- **Linux:**
  - `~/.local/state/iTwin Studio/` or `~/.cache/iTwin Studio/`
  - `~/.local/state/Bentley/iTwin Studio/logs.config.json`
- **Windows:**
  - `%LOCALAPPDATA%\iTwin Studio\Logs\{appId}`
  - `%APPDATA%\iTwin Studio\Logs`
  - `%LOCALAPPDATA%\Bentley\iTwin Studio\logs.config.json`

### Other iTwinStudio paths:

Run `iTwinStudio paths` to get the current paths for various iTwin Studio directories and files on your OS.
