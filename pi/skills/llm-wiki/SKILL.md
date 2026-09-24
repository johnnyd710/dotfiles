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
- The user asks *"What is X?"*, *"why did we do X this way?"*, *"what did we decide about Y?"*, or asks to synthesize existing knowledge.
- **Mandatory wiki-first and citation protocol:**
  1. Read root `index.md` first to locate candidate concepts.
  2. Search and read the relevant `concepts/` note before relying on external repository inspection.
  3. If the wiki contains the answer, cite the applicable concept in the response using a standard link (`[Page](/concepts/page.md)`). Do not answer from memory or external code alone when a wiki note exists.
  4. If the concept has provenance, cite the underlying raw source and/or canonical external resource as well.
  5. If no applicable wiki note exists, say so explicitly, identify the external source used, and consider whether the durable result should be compounded back into the wiki.
  6. Distinguish clearly between claims established by the wiki, claims verified in current source code, and proposed or uncertain interpretations.
- **Compound back:** When a query yields a durable comparison, architecture synthesis, or new insight, file it into `concepts/`, update `index.md`, and append to `log.md`.

### 2. Ingest / Capture
- The user asks to capture, record, summarize, or remember something, or drops a source into `raw/`.
- **Protocol:**
  1. **Preserve provenance:** Save the untouched source or a faithful Markdown representation under `raw/` with `type: source` frontmatter. Do not edit its body after ingestion without user approval.
  2. **Extract:** Read the source and identify reusable facts, decisions, constraints, caveats, examples, relationships, assumptions, and open questions. Preserve who said or decided what, and distinguish established behavior from proposals or uncertainty.
  3. **Choose scope:** Create one focused concept per `concepts/<slug>.md`; do not retell the entire source or create one file per isolated sentence. Treat every substantive heading as a scope check: split topics that are independently useful; keep related facets together only when they answer the same retrieval question.
  4. **Draft directly:** Start with the key claim. Omit scene-setting, repeated summaries/conclusions, generic rationale, and filler. Every paragraph or bullet must add distinct information. Use concise headings only when they help retrieve separate facets.
  5. **Keep useful examples and links:** Include code/API examples when they clarify behavior or provide a reusable pattern; examples are encouraged, not presumed verbose. Link to related concept notes, the raw source, and relevant primary documentation where useful. Official documentation entry points include [Studio docs](https://github.com/iTwin/studio/tree/main/docs) and [iTwin.js core docs](https://github.com/iTwin/itwinjs-core/tree/master/docs); prefer a specific relevant page when available.
  6. **Run a separate compression pass:** After drafting, remove repeated claims and source retelling; reconsider headings that may indicate multiple topics; retain examples and detail that help answer likely questions. Compare against the source to ensure no material qualification, attribution, decision, uncertainty, or provenance was lost.
  7. **Format and connect:** Add OKF frontmatter and standard links (`[Title](/concepts/foo.md)`). Flag contradictions with existing knowledge using `> [!warning] Contradiction`.
  8. **Catalog and log:** Add the source to `raw/index.md` and compiled concepts to root `index.md`. Keep logs distinct:
     - `raw/log.md`: Source provenance only (origin, format, destination path, assets).
     - Root `log.md`: Compiled synthesis only (concepts, decisions, workflows created or updated).
     ```markdown
     ## [YYYY-MM-DD] ingest | <Title or Source>
     - Summary of updates.
     ```

### 3. Lint
- Periodically check vault health: verify mandatory `type` frontmatter, orphan notes, broken links, stale claims superseded by newer ADRs, or concept gaps. Record findings in root `log.md`.
- For a concision/structure review of compiled concept notes, use the separate `llm-wiki-lint` skill. It reports recommendations and does not edit notes unless the user asks.
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
