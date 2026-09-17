---
name: studio-log-files
description: Read iTwin Studio log files from the local machine.
---

# Studio Log Files

`~/Library/Logs/iTwinStudio/<profile>/<profile>.YYYY-MM-DD.log`

Profile name matches the app ID (e.g. `itwin-studio-visualizer`). Use the most recent file.

Each line: `YYYY-MM-DD HH:MM:SS.mmm [level] |category| message` followed by optional indented JSON metadata.

Categories: `iTwinStudio.Root`, `iTwinStudio.Backend`, `iTwinStudio.Frontend`, `iTwinStudio.Common`.
