---
name: vault-wiki
description: Work with an Obsidian vault's agent-managed Wiki by following its local instructions; ingest sources, answer with citations, compound durable knowledge, and lint pages or canvases.
---

# Vault Wiki

First load the `obsidian-cli` skill. With Obsidian running, run `obsidian vaults verbose` to locate known vaults and their paths. Match the user's explicit vault name or path to one listing; if they mean the active vault, confirm it with `obsidian vault info=name` and `obsidian vault info=path`. Use `vault=<name>` for subsequent CLI commands. If Obsidian CLI is unavailable or the target is ambiguous, ask for clarification instead of guessing or silently using the most recently focused vault. After resolving the target, read its root `AGENTS.md` (for example, `obsidian vault="<name>" read path=AGENTS.md`) before Wiki work. Follow that vault's rules for ownership, privacy, source locations, Wiki paths, page format, types, limits, catalogs, and validation. Never impose another vault's conventions. Use `obsidian-markdown` for Obsidian syntax, `json-canvas` for canvases, `defuddle` for web sources, and `knap` when rendering templates.

## Purpose

The Wiki is a compact, agent-maintained abstraction layer over the vault's human notes and source material—not a duplicate archive or a summary of everything. It distills and links durable, reusable context (entities, attributes, relationships, dates, decisions, preferences, constraints, histories, and open questions) so an agent can recall and combine information for future queries without making the user repeat it. Optimize for useful recall and contextual reasoning, not volume.

For a question like "My car maintenance is coming up soon; anything to watch for?", the Wiki should make it possible to connect known vehicle identity and age with service history and other relevant facts, then give a source-grounded answer—for example, flag a possible battery replacement when the evidence supports it, not as a certainty. Retrieve and relate what is already known, recalculate time-sensitive details when possible, cite the sources, distinguish evidence from inference, and flag stale information or consequential unknowns. Ask only for missing details that matter; never invent mileage, service history, or other facts.

## Language and clarity

For authored technical prose in Wiki notes and technical answers, load the local `asd-ste100` skill and use STE-flavored mode. Use Strict mode for procedures and instructions. Keep descriptions to 25 words per sentence. Keep instructions to 20 words per sentence. Name the actor when you know who acted. Use one instruction per sentence. Avoid semicolons. Prefer plain, consistent terms and simple verbs. Keep necessary technical terms and define uncommon terms. Preserve facts, conditions, uncertainty, attribution, and citations. Do not change meaning or remove a qualifier to meet a style rule. Do not rewrite source quotations, code, names, or metadata. Run the linter on authored prose, not on source quotations, code, or frontmatter. Treat findings as review prompts, not proof of compliance. Do not claim ASD-STE100 compliance. The local skill does not include the official controlled dictionary.

## Query

1. Read the Wiki's entry point and follow catalog shards if the vault defines them. Search/read relevant Wiki pages or canvases, then check linked primary sources when needed and permitted by the vault's privacy rules.
2. Build the answer by connecting relevant stored context and source material. Use links in the vault's preferred format; distinguish sourced fact, attributed statement, inference, and open question, and note missing or stale evidence.
3. A useful durable comparison, connection, or analysis may become a separate typed page when appropriate. Don't file a one-off answer merely for volume, and respect requests for read-only answers.

## Ingest (only when requested)

1. Read the source thoroughly and preserve its identity using the source and metadata conventions in the vault. Never claim an external fact has been verified merely because a user or a source said it. Never edit human-owned sources to add metadata.
2. Check the catalog and related Wiki pages. Extract useful facts, decisions, constraints, caveats, examples, relationships, preferences, open questions, and proposals that will improve future recall or answers—not material merely for volume. Keep established or attributed facts distinct from drafts, plans, conjectures, and queries; preserve attribution and disagreement.
3. Create or update focused pages only in the agent-owned location specified by the vault. Follow its page scope, naming, frontmatter, type, heading, size, and linking rules; do not assume a schema or character limit. Use the vault's own type vocabulary, and link related pages only where useful.
4. Update the catalog and activity log if the vault defines them. Keep entries concise and preserve existing history. If the Wiki or its navigation files do not exist, follow the vault's setup instructions rather than inventing a structure.
5. Verify claims only with relevant sources and tools allowed by the vault. Prefer local sources when available. Follow the vault's privacy rules for external tools, minimize remote query data, and never upload source text unless explicitly authorized. Ask if the privacy policy is unclear.

## Canvases

Follow the vault's canvas location and ownership rules. Use the `json-canvas` skill to create or validate JSON Canvas files. Add them to the vault's catalog or log if its instructions require it.

## Lint

Run the checker specified by the vault, if any. This skill's bundled `scripts/check-wiki.mjs` enforces a specific flat OKF v0.2 profile (including its frontmatter, heading, and character-limit rules); use it only when the vault's instructions call for that profile. Also inspect catalog coverage, stale links, orphans, contradictory or superseded claims, missing citations, and pages that conflate facts with proposals. Fix only agent-owned Wiki content when requested; report issues in human-owned sources without editing them.
