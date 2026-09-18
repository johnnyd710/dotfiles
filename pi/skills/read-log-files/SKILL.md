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
