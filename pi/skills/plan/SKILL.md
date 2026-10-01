---
name: plan
description: Create a requirements-first implementation plan for a software change. Use when the user asks to plan a feature, bug fix, or other code change before implementation. Elicit missing requirements with an explicit ignoramus pass; express behavior as user-manual scenarios; identify ambiguity and blocking decisions; produce a traceable plan without implementing.
---

# Plan

## Objective

Produce a PLAN that another agent can implement without guessing about user-visible behavior, authorization, data changes, compatibility, or verification.

For the planning request, produce the PLAN only; do not implement changes. A later explicit request to implement is outside this skill's scope.

## Procedure

### 1. Collect evidence

Read the request and the smallest relevant set of code, tests, API docs, configuration, and existing plans.

Record only:

- current behavior;
- requested changed behavior;
- affected users/callers;
- compatibility constraints and explicit non-goals;
- file/symbol evidence for claims that depend on the repository.

Do not infer a product decision from a convenient implementation.

### 2. Run an ignoramus pass

After forming an initial understanding, delegate this pass to the `ignoramus` agent with the `subagent` tool when both are available. Give it the original request, relevant repository evidence, and applicable prompts below, but not your tentative answers or preferred design. Ask it to identify material questions and whether each can be answered from repository evidence or requires requester/domain expertise; do not ask it to resolve user-specific questions or plan implementation. If the tool or agent is unavailable, or delegation fails, perform the pass yourself.

Review the returned questions rather than accepting them mechanically: verify repository-answerable questions against evidence, discard irrelevant or duplicate questions, and carry material unresolved questions into the classification below. Treat domain terms, transitions, and implied rules as unknown. Consider only questions whose answers could change behavior, scope, permissions, persisted data, API shape, compatibility, or tests.

Apply these prompts selectively in the delegated review, or use them yourself when falling back; do not fill them mechanically. Consider only cases relevant to the workflow; omit irrelevant ones rather than recording `N/A`.

- Who performs the action, with what preconditions and inputs?
- What exact result do they receive or observe?
- What happens for empty, invalid, repeated, interrupted, denied, concurrent, or failed actions?
- Who is allowed and denied? What existing caller or data must remain unaffected?
- What is stored, returned, revealed, or irreversible?
- How can a test or user distinguish success from failure?

Classify each material finding as exactly one of:

- **Requirement** — observable behavior or acceptance condition.
- **Constraint** — mandated implementation or operational boundary.
- **Assumption** — provisional interpretation.
- **Open question** — material unknown requiring a decision.
- **Out of scope** — deliberately excluded work.

If an open question is material, do not silently resolve it. Ask the user when interaction is appropriate; otherwise mark the PLAN as blocked and identify the decision owner and impact.

### 3. Write manual scenarios

For every changed workflow, write the behavior before writing code steps:

```markdown
### [workflow]
- Actor/preconditions: ...
- Action/input: ...
- Result: ...
- Boundary/failure behavior: ...
- Acceptance: ...
```

Treat the scenario template as a guide: omit the boundary/failure behavior field when no meaningful case exists. Use concrete examples only when they remove ambiguity; do not pad the plan with generic error handling.

### 4. Remove ambiguity

For each requirement and scenario, verify that trigger, subject, outcome, boundary, and acceptance are explicit. Replace vague terms such as “support,” “handle,” “appropriate,” “valid,” “fast,” or “if needed” with a condition, example, or open question.

Keep rationale separate:

- Put only requirements and constraints in **Requirements summary** and **User-facing behavior**.
- Omit rationale unless it records a consequential decision, tradeoff, or rejected alternative that prevents a future regression.
- If needed, put rationale in a separate `## Rationale` section.

Example:

- Requirement: `The server must not return another user's private metadata.`
- Rationale (optional): `Client-side filtering would not enforce that rule.`

### 5. Map dependencies to slices, changes, and checks

First map relevant dependencies among affected components and workflows using repository evidence and explicit requirements. Represent edges as `prerequisite → dependent` (for example, schema/migration → API contract/endpoint → client → UI); include validation or seed data only when applicable. Distinguish confirmed dependencies from assumptions or open questions.

Order work bottom-up with respect to genuine dependencies. For features spanning multiple layers, group implementation steps into vertical slices: each slice delivers one complete, independently testable workflow through all the layers it needs. Do not build every technical layer for the whole feature before delivering behavior. Shared foundation work may come first only when it is a genuine prerequisite; identify the slice(s) it enables. When vertical slices do not fit the feature, organize steps around independently verifiable outcomes.

For each implementation step, name a path and symbol/region when evidence permits. State the minimal change and the requirement/scenario it satisfies. Do not include speculative refactoring.

For each scenario, name an inspectable verification: deterministic test, exact manual check, or both. For a bounded behavior matrix, enumerate every case; do not claim coverage from a tool that can silently omit cases.

## 6. Required PLAN output

Use these sections in this order. Include **Dependencies** when they affect implementation order, **Open questions and assumptions** only when there are any, **Rationale** only when consequential rationale is needed, and **Out of scope** only when something material is excluded. Omit empty optional sections instead of adding placeholder bullets or `None`.

```markdown
# PLAN: [feature]

## Status
- Ready for implementation | Blocked by [open-question IDs]

## Requirements summary
- [Observable requirement or constraint only.]

## Open questions and assumptions
- **Q1 / assumption:** ...
  - Impact: ...
  - Decision owner: ...

## User-facing behavior
### [workflow]
- Actor/preconditions: ...
- Action/input: ...
- Result: ...
- Boundary/failure behavior: ...
- Acceptance: ...

## Dependencies
- [prerequisite] → [dependent]

## Rationale
- [Only consequential design history/tradeoffs; never restate requirements.]

## Implementation plan
1. `path: symbol` — [minimal change] — satisfies [requirement/workflow].

## Verification
- [scenario] → [specific test file/test name or manual check].

## Out of scope
- ...
```
