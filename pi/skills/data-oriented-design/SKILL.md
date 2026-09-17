---
name: data-oriented-design
description: Apply data-oriented design (Mike Acton style) to TypeScript problems. Start from real data, design the simplest transform, avoid speculative abstraction, prefer batch/flat/indexed data.
---

# Data-Oriented Design (TypeScript)

Core rule: understand the real data first, then write the simplest transform from input to output. Never start from the machinery you'd like to build.

## Three defaults to reject

1. **Don't design around a world model.** Objects and metaphors hide data and cost. Design around the actual data — what comes in, what goes out.
2. **Don't add abstractions speculatively.** Every abstraction must have a concrete data need and a stated cost. If you can't describe what data it organizes and what transform it serves, don't add it.
3. **Don't start from the solution.** Start from the actual inputs and required outputs. The solution exists only to perform that transform.

## Before writing code (non-trivial changes)

Answer these:
1. What does the input actually look like — shape, volume, source?
2. What are the most common real values? What's the distribution?
3. What are valid ranges, and what happens on out-of-range input? (clamp / reject / throw — pick one explicitly)
4. What's stable vs. volatile?
5. What does this code read? What does it write? What does it touch unnecessarily?

## Design rules

- **Batch by default.** Write transforms over arrays/batches, named plural (`updateNodes`, not `updateNode`). A single-item call is a batch of one — don't maintain separate singular logic.
- **Indices over references.** Index into contiguous arrays rather than holding object references in hot paths. Pointer/reference-heavy hot paths need a written justification.
- **Organize by access pattern, not ownership.** Split hot and cold fields. Don't co-locate data that isn't read together.
- **Flat data over nested objects.** Prefer POJOs and plain arrays over class hierarchies and nested references.
- **Partition, don't branch per element.** When data varies by case, bucket it first, then handle each bucket straight-line — don't re-decide the case on every element.
- **Common case on the straight-line path.** Identify the most common case explicitly. Rare/error handling lives outside the hot path.
- **Exploit every constraint.** Known ranges, known volumes, known invariants — use them to remove work. Don't discard constraints to appear "general."

## TypeScript specifics

- Prefer `interface` + plain arrays over class hierarchies.
- Avoid premature `useMemo`/`useCallback` — re-running a pure function on simple props is usually cheaper than closure allocation + dependency-array checks.
- Typed arrays (`Float32Array`, `Int32Array`, etc.) for large numeric datasets — eliminates GC pressure.
- Struct-of-Arrays over Array-of-Structs for data processed in bulk (iterate one field across many items, not many fields on one item).
- Link related data by numeric index into a shared array, not by nested object reference.
