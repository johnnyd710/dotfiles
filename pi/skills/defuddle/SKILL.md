---
name: defuddle
description: Extract clean Markdown from HTML pages with Defuddle CLI.
---

# Defuddle

Use Defuddle CLI to extract clean readable content from web pages. Prefer over WebFetch for standard web pages — it removes navigation, ads, and clutter, reducing token usage.

## Usage

Always use `--md` for markdown output:

```bash
npx defuddle parse <url> --md
```

Save to file:

```bash
npx defuddle parse <url> --md -o content.md
```

Extract specific metadata:

```bash
npx defuddle parse <url> -p title
npx defuddle parse <url> -p description
npx defuddle parse <url> -p domain
```

## Output formats

| Flag | Format |
|------|--------|
| `--md` | Markdown (default choice) |
| `--json` | JSON with both HTML and markdown |
| (none) | HTML |
| `-p <name>` | Specific metadata property |
