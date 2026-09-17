---
name: performance-optimization
description: Discipline for making or evaluating performance claims and optimization work. Never assert unmeasured results — measure, label unverified hypotheses honestly, or skip optimization when there's no requirement.
---

# Performance Claims

Core rule: a performance claim without a measurement is a guess. Don't state guesses as facts.

## Rules

- **Never assert an unmeasured result.** Don't say "this should be faster" or "this is more efficient" as if it were established. Either it's measured, or it's a labeled hypothesis.
- **If you can measure, measure.** Include concrete before/after numbers (timing, allocation counts, profiler output, bundle size, etc.) in the same change where the claim is made.
- **If you can't measure, label it unverified.** State the expected effect explicitly as a hypothesis (e.g., "unverified: expected to reduce allocations because X"), and name what would verify it (a specific benchmark, profiler run, or metric).
- **If there's no performance requirement, don't optimize.** Build the simplest correct thing. Optimization without a stated requirement is speculative work — see `keep-it-simple` skill's simplification pass, step 1 ("can we not do this at all?").
- **Do not memoize or cache unless profiling proves a bottleneck.** Memoization/caching adds state, invalidation logic, and memory cost. Without a measured bottleneck, that cost is pure downside — an unmeasured "this avoids recomputation" claim is still a guess.

## How to apply this

- Before writing "faster," "slower," "more efficient," "reduces overhead," etc., check: do I have a number for this?
- If asked to optimize, first ask whether there's a measured baseline and a target. Without both, there's nothing to verify against.
- When reviewing code or claims (yours or others'), flag unmeasured performance assertions the same way you'd flag an untested correctness claim.
- Prefer reporting "no measured difference" over silently dropping a claim that turned out unverifiable.

## Related

- `keep-it-simple` skill: if there's no performance requirement, apply the simplification pass instead of optimizing.
- `data-oriented-design` skill: for TypeScript-specific performance/data-shape guidance when a real requirement exists.
