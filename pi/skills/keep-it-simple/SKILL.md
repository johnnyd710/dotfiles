---
name: keep-it-simple
description: Write the simplest code that solves the actual problem. Apply a structured simplification pass before and during implementation, favoring elimination and reduction over cleverness or premature abstraction.
---

# Simple Code

Core rule: the best code is the code you don't write. Before adding a line, a function, a layer, or a dependency, ask whether the problem can be made smaller instead.

## Simplification pass (run on every sub-problem)

1. **Can we not do this at all?** Question the requirement itself — dead code paths, unused configurability, speculative features. If nothing depends on it, delete it (YAGNI).
2. **Can we do it once (precompute/hoist)?** Move invariant work out of loops, request handlers, or repeated calls. Compute once, reuse the result.
3. **Can we do it fewer times?** Reduce call frequency, batch operations, debounce/coalesce, skip redundant recomputation.
4. **Can we approximate with no visible difference?** Exact correctness is sometimes unnecessary — check if a cheaper approximation is indistinguishable to the user/consumer.
5. **Can we use a small lookup table?** Replace branching logic or computation with a static map/table when the domain is small and known.
6. **Can we constrain the problem so a simpler machine suffices?** Narrow the input domain, add a precondition, or restrict scope so the general-purpose solution isn't needed.
7. **Does a different algorithm or data representation fit the actual data better?** Don't assume the current approach is the right shape — check if the real data (volume, distribution, access pattern) suggests something simpler.

## How to apply this

- Run the pass **before** writing code, on the stated problem, not just on a drafted solution.
- Run it again on any sub-problem or helper you're about to introduce — each one deserves its own pass.
- Prefer answering "no, we don't need this" over building it "just in case."
- If a step yields a real simplification, take it, then re-run the remaining steps on what's left.
- If none apply, that's a signal the current approach may already be close to minimal — implement the smallest version of it.

## Signs of insufficient simplification

- A 200-line function/module that could be 50.
- Configuration options with only one caller.
- Abstractions (interfaces, factories, plugin systems) with a single implementation and no stated future need.
- Loops or lookups repeated where the result never changes between iterations.
- General-purpose code solving a problem that is actually narrow and fixed-shape.
- Memoization or caching added without profiling proving a bottleneck — added complexity (state, invalidation) for an unmeasured benefit.

## Guardrails

- Fail-first and fail-fast: surface errors immediately rather than swallowing them, adding fallbacks, or working around them silently.
- Don't apply approximation (#4) or algorithm swaps (#7) without checking correctness requirements — confirm the difference is truly invisible/acceptable, don't assume.
- Simplicity beats performance when there's no measured performance requirement — see `performance-optimization` skill for performance-specific guidance and measurement discipline.
- Surgical changes still apply: simplify the code you're touching, don't refactor unrelated working code in the same pass.
