---
name: requirements-engineering
description: Write an implementation PLAN before coding. Use when the user asks for a plan, requirements, design, or proposal before implementation. Elicit missing requirements with an explicit ignoramus pass; express behavior as user-manual scenarios; identify ambiguity and blocking decisions; produce a traceable plan without implementing.
---

# Requirements-Engineering Plan

## Objective

Produce a PLAN that another agent can implement without guessing about user-visible behavior, authorization, data changes, compatibility, or verification.

Do not implement while using this skill.

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

After forming an initial understanding, switch to an independent-review role. Treat domain terms, transitions, and implied rules as unknown. Generate questions whose answers could change behavior, scope, permissions, persisted data, API shape, compatibility, or tests.

Check at least:

- Who performs the action, with what preconditions and inputs?
- What exact result do they receive or observe?
- What happens for empty, invalid, repeated, interrupted, denied, concurrent, or failed actions?
- Who is allowed and denied? What existing caller or data must remain unaffected?
- What is stored, returned, revealed, or irreversible?
- How can a test or user distinguish success from failure?

Classify each result as exactly one of:

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

Use concrete examples only when they remove ambiguity. Include only meaningful boundary cases; do not pad the plan with generic error handling.

### 4. Decide whether to prototype

Create a throwaway prototype only when it answers a named, material requirements question better than prose, normally for UI, interaction sequence, state transitions, or presentation.

If needed, put this in the PLAN **before** creating it:

```markdown
## Prototype
- Question: ...
- Modeled: ...
- Excluded: ...
- Review decision: ...
- Disposition: delete; do not reuse as production code.
```

For backend/data/auth changes, state `No prototype: [reason]` when no user-visible ambiguity exists. Do not introduce a prototype by default.

When a prototype exists, transfer every agreed behavior into manual scenarios. Never treat prototype code or shared memory as the specification.

### 5. Remove ambiguity

For each requirement and scenario, verify that trigger, subject, outcome, boundary, and acceptance are explicit. Replace vague terms such as “support,” “handle,” “appropriate,” “valid,” “fast,” or “if needed” with a condition, example, or open question.

Keep rationale separate:

- Put only requirements and constraints in **Requirements summary** and **User-facing behavior**.
- Omit rationale unless it records a consequential decision, tradeoff, or rejected alternative that prevents a future regression.
- If needed, put rationale in a separate `## Rationale` section.

Example:

- Requirement: `The server must not return another user's private metadata.`
- Rationale (optional): `Client-side filtering would not enforce that rule.`

### 6. Map behavior to minimal changes and checks

For each implementation step, name a path and symbol/region when evidence permits. State the minimal change and the requirement/scenario it satisfies. Do not include speculative refactoring.

For each scenario, name an inspectable verification: deterministic test, exact manual check, or both. For a bounded behavior matrix, enumerate every case; do not claim coverage from a tool that can silently omit cases.

## Required PLAN output

Use these sections in this order. Omit `Rationale` and `Prototype` only when they are not needed.

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

## Prototype
- [Only if required; otherwise `No prototype: ...`.]

## Rationale
- [Only consequential design history/tradeoffs; never restate requirements.]

## Implementation plan
1. `path: symbol` — [minimal change] — satisfies [requirement/workflow].

## Verification
- [scenario] → [specific test file/test name or manual check].

## Out of scope
- ...
```

## Final gate

Before responding, verify:

- Every claim about the repository has evidence.
- Requirements are observable; rationale is not presented as a requirement.
- Material unknowns are explicit and block implementation when unresolved.
- The user-facing behavior covers normal and relevant boundary cases.
- A prototype is explicitly accepted or rejected.
- Each implementation step and check traces to a requirement or constraint.
- The plan does not contain implementation changes, speculative work, or generic filler.

## Operating principles

- **Ignorance:** ask the basic question that exposes the domain expert's tacit assumption.
- **User manual first:** specify what the user does and sees before deciding code structure.
- **Prototype discipline:** prototype to answer a question, document the answer, then discard it.
- **Ambiguity is a defect:** resolve it, constrain it, or mark it open.
- **Complete checks over opaque automation:** for a bounded set, inspect every required case.
