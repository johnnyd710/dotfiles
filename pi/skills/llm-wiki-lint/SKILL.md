---
name: llm-wiki-lint
description: Lint and compress compiled LLM-wiki concept notes for repetition, unnecessary structure, scope problems, and lost retrieval value.
---

# LLM Wiki Lint

A direct user request to lint a concept note authorizes **editing the compiled note** to remove repetition, filler, and unnecessary structure while preserving useful meaning. This is not a source-preserving rewrite: never edit raw source bodies.

## Procedure

1. Read the wiki `AGENTS.md` and `index.md`; identify the note's purpose, neighboring concepts, provenance, and current status.
2. Read the complete concept note. Consult linked raw sources or primary documentation when needed to distinguish repetition from a useful qualification.
3. Review each paragraph, bullet, heading, table, code sample, and callout:
   - Keep each distinct fact, decision, constraint, caveat, useful example, and relationship.
   - Remove repeated claims, scene-setting, generic rationale, and conclusions that restate the note.
   - Treat every substantive heading as a scope check. Split independently useful topics; keep inseparable facets together.
   - Keep code/API examples and links when they clarify behavior, document a reusable pattern, or improve discovery. Do not shorten examples solely because of length.
   - Preserve attribution, decision status, uncertainty, scope, time, exceptions, security boundaries, and provenance.
4. Apply clear meaning-preserving compression edits. Do not infer domain decisions, delete unresolved alternatives, or remove facts whose relevance is uncertain. If an edit requires a material scope or product decision, leave that part unchanged and ask/report the specific decision.
5. When a split is clear, create focused concept notes, preserve provenance, update links and `index.md`, and remove duplicated content from the original note. Do not create a new note for a single isolated fact.
6. Record a concise `lint` or `refactor` event in root `log.md`. If the user explicitly asks for a report-only audit, make no content edits and record findings only when the wiki protocol requires it.

## Scope and safety

- Compression edits apply only to compiled notes in `concepts/`.
- Never shorten or rewrite source bodies in `raw/`.
- Treat length as a review signal, not a limit; do not enforce word or line counts.
- Do not commit changes unless the user explicitly asks and repository instructions permit it.

## Report format

Keep the response brief and actionable:

```markdown
## Changes
- `concepts/<file>.md` — [main compression/scope change].

## Preserved / deferred
- [Useful examples, caveats, or unresolved decisions retained; any material question left open.]
```
