import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const BASE_REFS = [
	{ name: "main", ref: "refs/heads/main" },
	{ name: "origin/main", ref: "refs/remotes/origin/main" },
	{ name: "master", ref: "refs/heads/master" },
	{ name: "origin/master", ref: "refs/remotes/origin/master" },
];

type ReviewKind = {
	command: string;
	description: string;
	instructions: string;
	approval: string;
};

const REVIEW_KINDS: ReviewKind[] = [
	{
		command: "correctness",
		description: "Review the current branch against main or master",
		instructions: `
			Evaluate the changes primarily for correctness.
			Run focused tests or checks when useful.
			Do not be nitpicky; report only meaningful, actionable issues or improvements, with correctness risks taking precedence.
		`,
		approval: "explicitly approving the changes",
	},
	{
		command: "aesthetics",
		description: "Review the current branch for code beauty and design quality",
		instructions: `
		Evaluate the changes primarily for aesthetics.
		Focus on the beauty and design quality of the code rather than its correctness. Evaluate:
			- clarity and ease of local reasoning
			- cohesion, naming, vocabulary, and API elegance
			- consistency and symmetry with surrounding code and parallel features
			- composition, abstraction level, duplication, and unnecessary machinery
			- whether the code expresses its intent directly and leaves the codebase more harmonious
		Prefer small, concrete improvements over broad rewrites or subjective style preferences.
		Do not repeat ordinary correctness findings unless they reveal a deeper design problem.
		Report only meaningful, actionable improvements.
		`,
		approval: "explicitly approving the code's design and aesthetics",
	},
	{
		command: "tigerstyle",
		description: "Review the current branch against TigerStyle principles",
		instructions: `
		Evaluate the changes strictly through the lens of TigerStyle principles:
			- safety and bounded resources: explicit bounds on loops, queues, memory, and call depth; no unbounded growth or leaks
			- assertion density and contracts: preconditions, postconditions, and invariants verified with assertions; crash early on programmer errors
			- explicit error handling: explicit handling of all failure modes; untrusted input handled separately from internal invariant bugs
			- mechanical sympathy and data layout: simple, flat data structures; contiguous memory and predictable access patterns over deep object graphs or indirection
			- radical simplicity and anti-abstraction: minimum code, YAGNI, no speculative abstractions, no premature generalizations, and no unnecessary indirection
			- determinism and predictability: avoid hidden state, unexpected side effects, or uncontrolled non-determinism
		Report only meaningful, actionable findings and concrete improvements aligned with TigerStyle.
		`,
		approval: "explicitly approving the changes according to TigerStyle",
	},
];

export default function (pi: ExtensionAPI) {
	for (const kind of REVIEW_KINDS) {
		pi.registerCommand(kind.command, {
			description: kind.description,
			handler: async (_args, ctx) => {
				await ctx.waitForIdle();

				const git = (args: string[]) => pi.exec("git", args, { cwd: ctx.cwd });
				const repo = await git(["rev-parse", "--is-inside-work-tree"]);
				if (repo.code !== 0 || repo.stdout.trim() !== "true") {
					ctx.ui.notify("Cannot review: the current directory is not in a Git repository.", "error");
					return;
				}

				const branchResult = await git(["symbolic-ref", "--quiet", "--short", "HEAD"]);
				const branch = branchResult.stdout.trim();
				if (branchResult.code !== 0 || !branch) {
					ctx.ui.notify("Cannot review: HEAD is detached; check out a branch first.", "error");
					return;
				}

				let base: (typeof BASE_REFS)[number] | undefined;
				for (const candidate of BASE_REFS) {
					const result = await git(["rev-parse", "--verify", "--quiet", `${candidate.ref}^{commit}`]);
					if (result.code === 0) {
						base = candidate;
						break;
					}
				}

				if (!base) {
					ctx.ui.notify("Cannot review: no main or master branch was found locally or on origin.", "error");
					return;
				}

				const mergeBase = await git(["merge-base", base.ref, "HEAD"]);
				if (mergeBase.code !== 0 || !mergeBase.stdout.trim()) {
					ctx.ui.notify(`Cannot review: ${branch} has no merge base with ${base.name}.`, "error");
					return;
				}

				pi.sendUserMessage(`Review the current local Git branch \`${branch}\` against \`${base.name}\` (\`${base.ref}\`).

First determine the goal and purpose of the changes to the best of your ability from the commit history, diff, tests, documentation, and surrounding code. Review all changes from the merge base through HEAD, plus staged and unstaged working-tree changes and relevant untracked files. Use only read-only Git operations. Use any relevant SKILLs available in this Pi session.

${kind.instructions}

Your entire final response must be only the review report: a numbered list ranked from highest to lowest priority. State the priority and explain what needs to be fixed, changed, or improved, including concise recommendations and file/line references where possible. Include no preamble, summary, or other commentary. If there are no meaningful issues, return a one-item numbered report ${kind.approval}.`);
			},
		});
	}
}
