---
name: itwinjs-core-reference
description: Use ~/Repos/itwinjs-core as the first local reference for iTwinJS work in other repos. Prefer its docs and code over online search or node_modules.
---

# iTwinJS Core Reference

Use this skill whenever you need a local reference for iTwinJS while working in another repo.

## Reference repo

`~/Repos/itwinjs-core`

## Search order

1. Docs first: `README.md`, `docs/**`, package READMEs, `common/api/**`, `example-code/**`
2. Paths second: use `fffind` to locate the right package/file
3. Content third: use `ffgrep` for symbols, types, methods, or error text
4. Read the best match right away
5. Prefer this repo over web search or `node_modules`

## Quick examples

```bash
fffind "presentation" path:"~/Repos/itwinjs-core/**"
ffgrep "Presentation" path:"~/Repos/itwinjs-core/**"
```

## Use it for

- API shape and usage
- package conventions
- implementation details
- examples and snippets
- checking canonical iTwinJS behavior
