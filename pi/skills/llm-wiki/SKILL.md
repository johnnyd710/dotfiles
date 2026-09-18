---
name: llm-wiki
description: Maintain and consult the personal knowledge base in ~/Repos/llm-wiki. Ingest private raw source records and compile knowledge notes with OKF YAML frontmatter; maintain per-domain indexes and logs.
---

# LLM Wiki (`~/Repos/llm-wiki`)

Personal knowledge base across all pi agent sessions, structured as an Obsidian vault and conforming to the **Open Knowledge Format (OKF) v0.2** specification based on Andrej Karpathy's LLM Wiki architecture. It sits between raw sources and the user as a persistent, compounding artifact.

Obsidian is the IDE; the LLM is the maintainer; the wiki is the codebase.

The wiki lives at: `~/Repos/llm-wiki`

> **Git Exception:** You are permitted to run git operations (`git add`, `git commit`) strictly inside `~/Repos/llm-wiki` when approved by the user.

---

## The Three Layers

1. **Layer 1: Raw Sources (`raw/`)** *(Private, provenance-preserving OKF source bundle)*
   - `raw/`: Flat collection of source records, including transcripts, clipped articles, PDFs, human notes, source specifications, and faithful Markdown representations of source documents.
   - `raw/assets/`: Downloaded images and binary attachments; the sole raw subdirectory.
   - `raw/index.md`: Catalog of raw source records.
   - `raw/log.md`: Append-only chronological record of raw-source ingestion and conversion.
   - **Source rule:** Each raw Markdown source record must have OKF YAML frontmatter with `type: source`. Agents may create the frontmatter, source-preserving Markdown conversion, extracted assets, and the raw catalog/log during ingestion. After ingestion, do not alter the source body except at the user's request.
   - **Privacy rule:** `raw/` is Git-ignored; never add its files to Git.

2. **Layer 2: The Wiki Vault (OKF Bundle)** *(Compiled, Compounding Knowledge)*
   - `index.md`: Root content catalog with progressive disclosure. Consult first on queries.
   - `log.md`: Chronological audit log of operations (`ingest`, `query`, `lint`, `refactor`).
   - `concepts/`: Flat pool of all compiled OKF concept documents (`type: topic | decision | workflow | entity | gotcha | Attested Computation`).
   - `canvas/`: Visual maps using JSON Canvas (`.canvas`).

3. **Layer 3: The Schema & Protocol** (`AGENTS.md` and this skill)

---

## OKF Frontmatter Standard

OKF v0.2 requires a `type` field; types are producer-defined. In addition, OKF v0.2 introduces standard families for provenance (`sources`), trust (`generated`, `verified`), and lifecycle (`status`, `stale_after`).

This vault's local profile requires every Markdown knowledge or source record in `concepts/` and `raw/` to include a YAML frontmatter block:

```yaml
---
type: topic              # Required by OKF v0.2; this vault uses topic | decision | workflow | entity | gotcha | source | Attested Computation
title: Note Title        # Required by this vault's profile
description: 1-sentence  # Required by this vault's profile
generated: { by: "<actor>", at: "YYYY-MM-DDTHH:MM:SSZ" } # OKF v0.2 standard (supersedes legacy timestamp)
# timestamp: YYYY-MM-DDTHH:MM:SSZ                       # Legacy OKF v0.1 fallback supported
tags: [tag1, tag2]       # Category tags
resource: https://...    # Canonical URI or local path
# status: stable         # Optional lifecycle: draft | stable | deprecated (default: stable)
# stale_after: YYYY-MM-DDTHH:MM:SSZ # Optional instant when content is stale
# sources:               # Optional provenance family:
#   - id: source-id
#     resource: /raw/...
# verified:              # Optional trust family: { by: "<actor>", at: "..." }
---
```

---

## Core Operations

### 1. Consult / Query
- The user asks *"why did we do X this way?"*, *"what did we decide about Y?"*, or asks to synthesize existing knowledge.
- **Protocol:**
  1. Read root `index.md` to locate candidate concepts, then drill down into relevant files in `concepts/` or use `ffgrep`.
  2. Synthesize answers citing wiki pages (`[Page](/concepts/page.md)`) and raw sources.
  3. **Compound back:** When a query yields a durable comparison, architecture synthesis, or new insight, file it into `concepts/`, update `index.md`, and append to `log.md`.

### 2. Ingest / Capture
- The user asks to capture, record, summarize, or remember something, or drops a source into `raw/`.
- **Protocol:**
  1. **Provenance:** Save the untouched source or a faithful Markdown representation to `raw/` or `raw/`, with `type: source` frontmatter. Do not alter its body after ingestion without user approval.
  2. **Compile:** Update or create focused concept pages in `concepts/<slug>.md` using OKF YAML frontmatter (`type: ...`) and standard markdown links (`[Title](/concepts/foo.md)`). Keep notes atomic: one concept per file (if the title needs "and", split into separate linked notes).
  3. **Contradictions:** Flag any conflicts with previous notes using callouts (`> [!warning] Contradiction`).
  4. **Catalog:** Add the source and summary to `raw/index.md`; add compiled notes to root `index.md`.
  5. **Log:** Maintain distinct logging responsibilities without duplication:
     - `raw/log.md`: Record source provenance only (origin, file format, destination path, extracted assets).
     - Root `log.md`: Record compiled wiki synthesis only (new concepts, entities, ADRs, or workflows created/updated).
     Format:
     ```markdown
     ## [YYYY-MM-DD] ingest | <Title or Source>
     - Summary of updates.
     ```

### 3. Lint
- Periodically check vault health: verify mandatory `type` frontmatter, orphan notes, broken links, stale claims superseded by newer ADRs, or concept gaps. Record findings in root `log.md`.
- Scan for monolithic or compound notes: Flag files with 'and' in their slug/title or notes exceeding ~300 lines that cover multiple distinct architectural concepts. Propose refactoring/splitting them into atomic notes.
- **Linter Scope:** Check only OKF knowledge and source domains: `concepts/` and `raw/`. Exclude `skills/` (which use agent skill frontmatter) and `canvas/` (JSON Canvas) to avoid false positives.

---

## File Formats & Conventions

Filename convention: lowercase kebab-case in `concepts/` and `raw/`. Prefix date (`YYYY-MM-DD-`) for ADR decisions and raw transcript records.

### Concept (`concepts/<slug>.md`)
```markdown
---
type: topic              # topic | decision | workflow | entity | gotcha | Attested Computation
title: [Concept Name]
description: Brief one-line summary
generated: { by: "<actor>", at: "YYYY-MM-DDTHH:MM:SSZ" }
tags: [tag1, tag2]
resource: https://github.com/...
---

# [Concept Name]

- **Relevant Repos / Systems:** [repos]
- **Source / Provenance:** [Source Transcript](/raw/YYYY-MM-DD-<slug>.md)

## Summary
Brief explanation.

## Related Concepts
- [Related Concept](/concepts/<other-slug>.md)
```

### Decision / ADR (`decisions/YYYY-MM-DD-<slug>.md`)
```markdown
---
type: decision
title: [Decision Title]
description: Brief one-line rationale summary
timestamp: YYYY-MM-DDTHH:MM:SSZ
tags: [tag1, tag2]
resource: https://github.com/...
---

# [Decision Title]

- **Project / Repo:** [e.g. itwinjs-core, studio]
- **Status:** Accepted | Proposed | Superseded by [link](/concepts/...)

## Context
What problem were we solving? What were the constraints?

## Decision
What approach was chosen?

## Alternatives Considered & Rationale
- **Alternative 1:** Why rejected.
- **Why this way:** The core rationale.
```

### Workflow / Runbook (`workflows/<workflow-slug>.md`)
```markdown
---
type: workflow
title: [Workflow Title]
description: Brief summary of the procedure
timestamp: YYYY-MM-DDTHH:MM:SSZ
tags: [workflow, runbook]
resource: https://github.com/...
---

# [Workflow Title]

## Prerequisites
- Required tools or permissions.

## Procedure
1. Step 1...
2. Step 2...
```

### Gotcha (`gotchas/<gotcha-slug>.md`)
```markdown
---
type: gotcha
title: [Gotcha Title]
description: Brief summary of the pitfall
timestamp: YYYY-MM-DDTHH:MM:SSZ
tags: [gotcha, trap]
resource: https://github.com/...
---

# [Gotcha Title]

## The Trap
Description of unexpected behavior or error.

## The Rule / Workaround
Actionable guideline to prevent or resolve the issue.
```

---

## Workflow for Recording

1. Write or update files under `~/Repos/llm-wiki/...`.
2. Update domain and root `index.md` and append to `log.md`.
3. Inform user and await approval before staging/committing in `~/Repos/llm-wiki`.
