---
name: work-wiki
description: Ingest sources into the Work Obsidian vault's flat OKF v0.2 Wiki, answer questions with citations, compound durable syntheses, and lint Wiki pages or canvases.
---

# Work Wiki

Read the Work vault's `AGENTS.md` first. For Obsidian links/properties use the `obsidian-markdown` skill; for `.canvas` files use the `json-canvas` skill; the `obsidian-cli` skill is used for command-line operations on the Obsidian vault. For ingesting websites or links use the `defuddle` skill. The `knap` skill is used for rendering Markdown templates with structured data. The Wiki is an agent-owned compilation layer; `Attachments/`, `Journal/`, and `Notes/` are human-owned inputs.

## Query

1. Read `Wiki/index.md`, follow any catalog shards, then search/read relevant Wiki pages or canvases. Check linked primary sources when a claim needs validation. Don't answer from memory when there is an applicable page.
2. Answer with `[[Wiki/slug|Page]]` citations and source links (`[[Notes/Title]]`, `[[Journal/2026-W40]]`, `[[Attachments/name.pdf]]`, or URLs). Distinguish sourced fact, someone's statement, inference, and open question; mention missing or stale evidence.
3. A useful new comparison/connection/analysis can become a *separate* typed page in `Wiki/`, with provenance, cross-links, index entry, and log event. Don't file a one-off answer merely for volume. Respect a request for a read-only answer.

## Ingest (only when requested)

1. Read the source thoroughly; preserve source identity with `sources` (a Work-vault path or primary external URL/PR, title and date where known). Never claim an external fact has been verified merely because a user or a source said it. Never edit a human-owned source to add metadata.
2. Check the index and related Wiki pages. Extract useful facts, decisions, constraints, caveats, examples, relationships, preferences, open queries, and proposals. Separate established or attributed facts from drafts, plans, conjectures, and queries into different linked pages; preserve attribution and disagreement.
3. Create or update *focused* `Wiki/<lowercase-kebab-slug>.md` pages. Date-prefix time-bound meetings/decisions if useful. Each page has one scope, **no Markdown headings**, and at most **4,000 Unicode characters including frontmatter**. Put the answer/claim first; compress without losing necessary context. Use `[[Wiki/other-slug]]` generously but only for useful relationships; use Obsidian wikilinks for vault content and Markdown links for external resources.
4. Use OKF v0.2 properties, for example (replace placeholders with real values):

   ```yaml
   ---
   type: fact
   title: Specific Claim
   description: One-sentence retrieval summary.
   generated: { by: "pi", at: "2026-09-30T18:00:00Z" }
   tags: [project]
   resource: "Wiki/specific-claim.md"
   sources:
     - id: notes-design-review
       resource: "Notes/Design Review.md"
   ---
   ```

   `type` is producer-defined; use `topic`, `fact`, `decision`, `workflow`, `entity`, `gotcha`, `query`, `plan`, `draft`, `conjecture`, `conversation`, `preference`, `person`, `place`, `link`, `meeting`, `analysis`, or `example` as appropriate. Use `example` for a standalone, reusable code/configuration/query/input-output example; keep snippets inline when they only illustrate another page's subject. `resource` is the canonical source URI if one exists; otherwise the Wiki page's local path. Use `status: draft` for provisional work, `verified: { by: ..., at: ... }` only after checking, and `stale_after` where there is a meaningful expiration. The body must link to the source too so it can be opened in Obsidian. Navigation pages (`index*`, `log*`) use `okf_version: "0.2"` instead of a knowledge-page type.
5. Catalog new/changed pages and canvases in `Wiki/index.md` (link, one-line summary, optionally type/date). For ordinary ongoing Wiki work, add a dated `- YYYY-MM-DD | ingest | [[Wiki/page]] — changed X` entry to `Wiki/log.md`; use `query`, `lint`, or `refactor` as appropriate. Omit one-time migration/import events unless requested. One line per logged event (two only if necessary); link affected pages and omit recaps already in the index or pages.
6. Verify facts and claims when possible by searching Github and ADO using the command line tools read-only `gh` and `az` respectively. Many repos have already been cloned locally; always check the local copies in ~/Repos before querying remote sources, but fall back to remote queries if necessary.
7. Run `node ~/Repos/dotfiles/pi/skills/work-wiki/scripts/check-wiki.mjs Wiki`; repair flatness, Markdown frontmatter, heading, and character-limit violations before finishing.

## Canvases

A `Wiki/<slug>.canvas` is a flat, agent-owned JSON Canvas file with **no character limit** or Markdown frontmatter/heading rules. Use the `json-canvas` skill to create and validate it. Link it from the index with `[[Wiki/<slug>.canvas]]` and record its creation or update in the log. Other durable non-Markdown assets outside `Wiki/` require explicit permission.

## Catalog and ledger growth

`index.md` is the entry point, not an exhaustive mega-note once it reaches the limit. Move groups of entries into flat `index-<topic>.md` shards, with a one-line link/summary for each shard in `index.md`; split shards again when needed. Each page and canvas should be findable through the index. `log.md` is the recent chronological ledger. Before it exceeds the limit, move **whole older entries** into flat `log-YYYY-MM-<part>.md` files, link archives in `log.md`, keep recent entries in date order, and never lose or silently rewrite events. Markdown shards have no headings and the same 4,000-character cap. The index catalogs content; the log records activity.

## Lint

Run the checker, then inspect index coverage, stale links, orphans, contradictory or superseded claims, missing source citations, and documents that conflate fact with proposal. Fix Wiki pages and canvases on request; report issues without editing sources. Journal, Notes, and Attachments are out of lint's edit scope.
