---
name: llm-wiki-lint
description: Audit compiled LLM-wiki concept notes for repetition, unnecessary structure, scope problems, and lost retrieval value. Report proposed edits without changing concept or raw note content.
---

# LLM Wiki Lint

Audit existing compiled concept notes for information density and scope. This skill is diagnostic: report findings and proposed edits without changing concept or raw note content. Follow the wiki's audit-log rule by recording a concise lint event in root `log.md` for a requested lint, unless the user explicitly asks for a report only. Never apply proposed note edits without a separate user request.

## Procedure

1. Read the wiki `AGENTS.md` and `index.md`; identify the note's purpose, neighboring concepts, and current status.
2. Read the complete concept note. Consult linked raw sources or primary documentation when needed to judge whether a detail is redundant or carries a meaningful qualification.
3. Check each paragraph, bullet, heading, table, code sample, and callout:
   - Does it add a distinct fact, decision, constraint, caveat, useful example, or relationship?
   - Is the claim already stated elsewhere in the note or a better-linked concept?
   - Does a heading reveal a separate concept that should be split, or is it a necessary facet of one retrieval topic?
   - Does an example or code sample make behavior, an API, or a reusable pattern clearer? Keep it when it does; do not call it verbose based only on length.
   - Would a link to a related concept, raw source, or relevant official document make the note more useful? Suggest links only when they improve discovery or evidence.
4. Preserve information that affects meaning: attribution, decision status, uncertainty, scope, time, exceptions, security boundaries, and source provenance. Do not recommend removing it merely to shorten the note.
5. Treat length as a review signal, not a verdict. Do not enforce word or line limits; code examples and tables can make useful notes long.

## Scope and safety

- Apply compression review to compiled notes in `concepts/`.
- Never shorten or rewrite source bodies in `raw/`; raw records preserve provenance.
- Do not edit, reformat, split, merge, or delete concept or raw files during lint. The only default write is the concise audit event in root `log.md` required by the wiki protocol; omit it if the user explicitly asks for a report only.
- Distinguish factual corrections from style/scope suggestions. Do not infer that content is unnecessary without checking its context and provenance.
- A note needs a proposed split only when it contains independently useful topics, not merely because it has several headings.

## Report format

Keep the report brief and actionable:

```markdown
## Summary
[Overall assessment; say if no changes are warranted.]

## Findings
- `concepts/<file>.md`, “<section>” — [issue]. **Action:** [keep | cut | merge | split | clarify]. Preserve [material facts/caveats/source details].

## Content changes
- None. Concept and raw notes were not changed; the audit event was recorded in root `log.md` per wiki protocol.
```

Report only findings with a concrete retrieval, accuracy, duplication, or scope benefit. Do not produce a rewrite of the note unless separately asked to edit it.
