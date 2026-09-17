import type { ExtensionAPI, ExtensionCommandContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

type ExecResult = {
	stdout: string;
	stderr: string;
	code: number;
};

type RepoContext = {
	repoDir?: string;
	ownerRepo?: string;
	notes: string[];
};

type GhPrView = {
	number: number;
	title?: string;
	state?: string;
	isDraft?: boolean;
	url?: string;
	author?: { login?: string; name?: string };
	baseRefName?: string;
	headRefName?: string;
	createdAt?: string;
	updatedAt?: string;
	closedAt?: string | null;
	mergedAt?: string | null;
	mergeStateStatus?: string;
	additions?: number;
	deletions?: number;
	changedFiles?: number;
	body?: string;
	commits?: Array<{
		oid?: string;
		messageHeadline?: string;
		authors?: Array<{ login?: string; name?: string }>;
	}>;
};

type GhDiffHunk = {
	header: string;
	lines: string[];
};

type GhDiffFile = {
	path: string;
	previousPath?: string;
	status: "added" | "modified" | "deleted" | "renamed" | "copied" | "binary";
	additions: number;
	deletions: number;
	hunks: GhDiffHunk[];
	patch: string;
};

const GH_FIELDS = [
	"number",
	"title",
	"state",
	"isDraft",
	"url",
	"author",
	"baseRefName",
	"headRefName",
	"createdAt",
	"updatedAt",
	"closedAt",
	"mergedAt",
	"mergeStateStatus",
	"additions",
	"deletions",
	"changedFiles",
	"body",
	"commits",
];

function truncate(text: string | undefined, maxLength: number) {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}\n... [truncated]`;
}

function truncateLines(lines: string[], maxLines: number) {
	if (lines.length <= maxLines) return lines;
	return [...lines.slice(0, maxLines), "... [truncated]"];
}

function parseGitHubRemote(remoteUrl: string | undefined) {
	if (!remoteUrl) return undefined;
	const cleaned = remoteUrl.trim().replace(/\.git$/i, "");
	const match = cleaned.match(/github\.com[:/]([^/]+\/[^/]+)$/i);
	return match?.[1];
}

function isForbiddenGhWrite(command: string) {
	if (!/\bgh\b/i.test(command)) return false;
	if (/\bgh\s+pr\s+(create|edit|comment|close|reopen|merge|review|ready)\b/i.test(command)) return true;
	if (/\bgh\s+api\b/i.test(command) && /(?:\s-X\s*(POST|PUT|PATCH|DELETE)\b|--method\s+(POST|PUT|PATCH|DELETE)\b|\s(-f|-F)\b|--field\b|--raw-field\b|--input\b)/i.test(command)) return true;
	return false;
}

function parseDiffGitPaths(line: string) {
	const match = line.match(/^diff --git a\/(.+) b\/(.+)$/);
	if (!match) return undefined;
	return { oldPath: match[1], newPath: match[2] };
}

function createDiffFile(path: string): GhDiffFile {
	return {
		path,
		status: "modified",
		additions: 0,
		deletions: 0,
		hunks: [],
		patch: "",
	};
}

function parseGhDiff(diffText: string) {
	const files: GhDiffFile[] = [];
	const lines = diffText.split(/\r?\n/);
	let currentFile: GhDiffFile | undefined;
	let currentPatchLines: string[] = [];
	let currentHunk: GhDiffHunk | undefined;

	const finalizeHunk = () => {
		if (!currentFile || !currentHunk) return;
		currentFile.hunks.push(currentHunk);
		currentHunk = undefined;
	};

	const finalizeFile = () => {
		if (!currentFile) return;
		finalizeHunk();
		currentFile.patch = currentPatchLines.join("\n").trim();
		files.push(currentFile);
		currentFile = undefined;
		currentPatchLines = [];
	};

	for (const line of lines) {
		const paths = parseDiffGitPaths(line);
		if (paths) {
			finalizeFile();
			currentFile = createDiffFile(paths.newPath);
			if (paths.oldPath === "/dev/null") currentFile.status = "added";
			currentPatchLines.push(line);
			continue;
		}

		if (!currentFile) continue;

		currentPatchLines.push(line);

		if (line.startsWith("new file mode ")) {
			currentFile.status = "added";
			continue;
		}

		if (line.startsWith("deleted file mode ")) {
			currentFile.status = "deleted";
			continue;
		}

		if (line.startsWith("rename from ")) {
			currentFile.status = "renamed";
			currentFile.previousPath = line.slice("rename from ".length);
			continue;
		}

		if (line.startsWith("rename to ")) {
			currentFile.path = line.slice("rename to ".length);
			continue;
		}

		if (line.startsWith("copy from ")) {
			currentFile.status = "copied";
			currentFile.previousPath = line.slice("copy from ".length);
			continue;
		}

		if (line.startsWith("copy to ")) {
			currentFile.path = line.slice("copy to ".length);
			continue;
		}

		if (line.startsWith("Binary files ")) {
			currentFile.status = "binary";
			continue;
		}

		if (line.startsWith("+++ ")) {
			if (line === "+++ /dev/null") currentFile.status = "deleted";
			continue;
		}

		if (line.startsWith("--- ")) {
			if (line === "--- /dev/null") currentFile.status = "added";
			continue;
		}

		if (line.startsWith("@@ ")) {
			finalizeHunk();
			currentHunk = { header: line, lines: [] };
			continue;
		}

		if (currentHunk) currentHunk.lines.push(line);

		if (line.startsWith("+") && !line.startsWith("+++")) {
			currentFile.additions += 1;
			continue;
		}

		if (line.startsWith("-") && !line.startsWith("---")) {
			currentFile.deletions += 1;
		}
	}

	finalizeFile();
	return files;
}

async function run(pi: ExtensionAPI, command: string, args: string[], cwd?: string, signal?: AbortSignal) {
	return (await pi.exec(command, args, {
		cwd,
		signal,
		timeout: 30_000,
	})) as ExecResult;
}

async function commandExists(pi: ExtensionAPI, command: string, signal?: AbortSignal) {
	const result = await run(pi, "bash", ["-lc", `command -v ${command}`], undefined, signal);
	return result.code === 0 && result.stdout.trim().length > 0;
}

async function resolveRepoContext(
	pi: ExtensionAPI,
	cwd: string,
	repoInput: string | undefined,
	signal?: AbortSignal,
): Promise<RepoContext> {
	const notes: string[] = [];
	let repoDir: string | undefined;
	let ownerRepo: string | undefined;

	if (repoInput?.trim()) {
		const trimmed = repoInput.trim();
		const resolvedPath = resolve(cwd, trimmed);
		if (existsSync(resolvedPath)) {
			repoDir = resolvedPath;
			notes.push(`Using local repo path: ${repoDir}`);
		} else if (/^[^/]+\/[^/]+$/.test(trimmed)) {
			ownerRepo = trimmed;
			notes.push(`Using explicit GitHub repo: ${ownerRepo}`);
		}
	}

	if (!repoDir) {
		const top = await run(pi, "git", ["rev-parse", "--show-toplevel"], cwd, signal);
		if (top.code === 0) {
			repoDir = top.stdout.trim() || undefined;
			if (repoDir) notes.push(`Detected local git repo from cwd: ${repoDir}`);
		}
	}

	if (!ownerRepo && repoDir) {
		const remote = await run(pi, "git", ["remote", "get-url", "origin"], repoDir, signal);
		if (remote.code === 0) {
			ownerRepo = parseGitHubRemote(remote.stdout);
			if (ownerRepo) notes.push(`Derived GitHub repo from origin: ${ownerRepo}`);
		}
	}

	return { repoDir, ownerRepo, notes };
}

async function inspectWithGh(
	pi: ExtensionAPI,
	repo: RepoContext,
	prNumber: number,
	signal?: AbortSignal,
) {
	const viewArgs = ["pr", "view", String(prNumber), "--json", GH_FIELDS.join(",")];
	if (repo.ownerRepo) viewArgs.push("--repo", repo.ownerRepo);
	const view = await run(pi, "gh", viewArgs, repo.repoDir, signal);
	if (view.code !== 0) throw new Error(view.stderr.trim() || `gh pr view failed with exit code ${view.code}`);

	const diffArgs = ["pr", "diff", String(prNumber)];
	if (repo.ownerRepo) diffArgs.push("--repo", repo.ownerRepo);
	const diff = await run(pi, "gh", diffArgs, repo.repoDir, signal);
	if (diff.code !== 0) throw new Error(diff.stderr.trim() || `gh pr diff failed with exit code ${diff.code}`);
	const files = parseGhDiff(diff.stdout);

	return {
		pr: JSON.parse(view.stdout) as GhPrView,
		diff: diff.stdout,
		files,
	};
}

function renderGhSummary(repo: RepoContext, pr: GhPrView, files: GhDiffFile[]) {
	const lines: string[] = [];
	lines.push(`# PR #${pr.number}: ${pr.title ?? "(untitled)"}`);
	lines.push("");
	lines.push(`- Repo: ${repo.ownerRepo ?? "(unknown)"}`);
	if (repo.repoDir) lines.push(`- Local repo: ${repo.repoDir}`);
	lines.push(`- State: ${pr.state ?? "unknown"}${pr.isDraft ? " (draft)" : ""}`);
	lines.push(`- Author: ${pr.author?.login ?? pr.author?.name ?? "unknown"}`);
	if (pr.url) lines.push(`- URL: ${pr.url}`);
	if (pr.baseRefName || pr.headRefName) lines.push(`- Branches: ${pr.headRefName ?? "?"} -> ${pr.baseRefName ?? "?"}`);
	if (pr.createdAt) lines.push(`- Created: ${pr.createdAt}`);
	if (pr.updatedAt) lines.push(`- Updated: ${pr.updatedAt}`);
	if (pr.closedAt) lines.push(`- Closed: ${pr.closedAt}`);
	if (pr.mergedAt) lines.push(`- Merged: ${pr.mergedAt}`);
	if (pr.mergeStateStatus) lines.push(`- Merge status: ${pr.mergeStateStatus}`);
	if (typeof pr.additions === "number" || typeof pr.deletions === "number" || typeof pr.changedFiles === "number") {
		lines.push(`- Diff stats: +${pr.additions ?? 0} / -${pr.deletions ?? 0} across ${pr.changedFiles ?? files.length} files`);
	}

	if (pr.body?.trim()) {
		lines.push("");
		lines.push("## Body");
		lines.push(truncate(pr.body.trim(), 4000));
	}

	if (pr.commits?.length) {
		lines.push("");
		lines.push(`## Commits (${pr.commits.length})`);
		for (const commit of pr.commits.slice(0, 40)) {
			const author = commit.authors?.[0]?.login ?? commit.authors?.[0]?.name;
			lines.push(`- ${commit.oid?.slice(0, 7) ?? "???????"} ${commit.messageHeadline ?? ""}${author ? ` — ${author}` : ""}`);
		}
		if (pr.commits.length > 40) lines.push("- ... [truncated]");
	}

	if (files.length) {
		lines.push("");
		lines.push(`## Changed files (${files.length})`);
		for (const file of files.slice(0, 200)) {
			const stats = file.status === "binary" ? "binary" : `+${file.additions} / -${file.deletions}`;
			const rename = file.previousPath ? ` (${file.previousPath} -> ${file.path})` : "";
			lines.push(`- [${file.status}] ${file.path}${rename} — ${stats}`);
		}
		if (files.length > 200) lines.push("- ... [truncated]");
	}

	if (files.length) {
		lines.push("");
		lines.push("## File analysis");
		for (const file of files.slice(0, 10)) {
			lines.push("");
			lines.push(`### ${file.path}`);
			lines.push(`- Status: ${file.status}`);
			if (file.previousPath) lines.push(`- Previous path: ${file.previousPath}`);
			if (file.status !== "binary") lines.push(`- Line changes: +${file.additions} / -${file.deletions}`);
			if (file.hunks.length) {
				lines.push(`- Hunk count: ${file.hunks.length}`);
				lines.push("- Hunk headers:");
				for (const hunk of file.hunks.slice(0, 5)) lines.push(`  ${hunk.header}`);
			}

			const excerptSource = file.patch ? file.patch.split("\n") : [];
			if (excerptSource.length) {
				lines.push("- Diff excerpt:");
				lines.push("```diff");
				for (const excerptLine of truncateLines(excerptSource, 20)) lines.push(excerptLine);
				lines.push("```");
			}
		}
		if (files.length > 10) {
			lines.push("");
			lines.push(`... ${files.length - 10} more files omitted from file analysis`);
		}
	}

	if (repo.notes.length) {
		lines.push("");
		lines.push("## Resolution notes");
		for (const note of repo.notes) lines.push(`- ${note}`);
	}

	return lines.join("\n");
}

function parsePrCommandArgs(args: string) {
	const tokens = args.trim().split(/\s+/).filter(Boolean);
	if (tokens.length === 0) return undefined;

	let prNumber: number | undefined;
	let repo: string | undefined;

	if (/^\d+$/.test(tokens[0])) {
		prNumber = Number(tokens[0]);
		repo = tokens.slice(1).join(" ") || undefined;
	} else if (tokens.length >= 2 && /^\d+$/.test(tokens[tokens.length - 1])) {
		prNumber = Number(tokens[tokens.length - 1]);
		repo = tokens.slice(0, -1).join(" ") || undefined;
	}

	if (!prNumber) return undefined;
	return { prNumber, repo };
}

function buildPrToolPrompt(prNumber: number, repo?: string) {
	return [
		"Use the read_github_pr tool for this request.",
		`prNumber: ${prNumber}`,
		repo ? `repo: ${repo}` : undefined,
		"",
		"Return a plain-text summary of the PR status, key metadata, commits, changed files, and diff-based file analysis.",
	].filter(Boolean).join("\n");
}

async function runPrCommand(args: string, ctx: ExtensionCommandContext, pi: ExtensionAPI) {
	const parsed = parsePrCommandArgs(args);
	if (!parsed) {
		ctx.ui.notify("Usage: /github-pr 3609 [owner/repo-or-local-path]", "warning");
		return;
	}

	pi.sendUserMessage(buildPrToolPrompt(parsed.prNumber, parsed.repo));
}

export default function githubPrReadonlyExtension(pi: ExtensionAPI) {
	pi.on("tool_call", async (event, ctx) => {
		if (event.toolName !== "bash") return undefined;
		const command = String(event.input.command ?? "");
		if (!isForbiddenGhWrite(command)) return undefined;
		if (ctx.hasUI) ctx.ui.notify("Blocked GitHub write operation. PR access is read-only.", "warning");
		return {
			block: true,
			reason: "GitHub PR access is read-only only. Creating, editing, commenting, merging, reviewing, or other write operations are blocked.",
		};
	});

	pi.registerCommand("github-pr", {
		description: "Read a GitHub PR via gh CLI (usage: /github-pr 3609 [owner/repo-or-path])",
		handler: async (args, ctx) => {
			try {
				await runPrCommand(args, ctx, pi);
			} catch (error) {
				ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
			}
		},
	});

	pi.registerCommand("pr", {
		description: "Alias for /github-pr",
		handler: async (args, ctx) => {
			try {
				await runPrCommand(args, ctx, pi);
			} catch (error) {
				ctx.ui.notify(error instanceof Error ? error.message : String(error), "error");
			}
		},
	});

	pi.registerTool({
		name: "read_github_pr",
		label: "Read GitHub PR",
		description: "Read a GitHub pull request using gh CLI. Read-only.",
		promptSnippet: "Inspect a GitHub pull request in read-only mode via gh CLI.",
		promptGuidelines: [
			"Use this tool when the user asks about a GitHub pull request, PR status, changed files, commits, or branch metadata.",
			"Pass repo as owner/repo or a local checkout path when the repository is not obvious from the current working directory.",
			"This tool is strictly read-only and must never create, edit, comment on, merge, review, or otherwise mutate GitHub state.",
			"This tool depends on gh CLI and does not use a local git fallback.",
		],
		parameters: Type.Object({
			prNumber: Type.Number({ description: "Pull request number, e.g. 2669" }),
			repo: Type.Optional(
				Type.String({
					description: "Optional owner/repo (e.g. iTwin/studio) or local repo path used only to resolve the GitHub repo for gh.",
				}),
			),
		}),
		async execute(_toolCallId, params, signal, _onUpdate, ctx) {
			const repo = await resolveRepoContext(pi, ctx.cwd, params.repo, signal);
			const hasGh = await commandExists(pi, "gh", signal);

			if (!hasGh) {
				return {
					content: [{ type: "text", text: `Unable to inspect PR #${params.prNumber}.\n\n- gh CLI not available` }],
					details: { source: "unresolved", repo },
					isError: true,
				};
			}

			if (!repo.ownerRepo && !repo.repoDir) {
				return {
					content: [{ type: "text", text: `Unable to inspect PR #${params.prNumber}.\n\n- Could not resolve a GitHub repository` }],
					details: { source: "unresolved", repo },
					isError: true,
				};
			}

			try {
				const gh = await inspectWithGh(pi, repo, params.prNumber, signal);
				return {
					content: [{ type: "text", text: renderGhSummary(repo, gh.pr, gh.files) }],
					details: { source: "gh", repo, pr: gh.pr, files: gh.files, diff: gh.diff },
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				return {
					content: [{ type: "text", text: `Unable to inspect PR #${params.prNumber}.\n\n- ${message}` }],
					details: { source: "unresolved", repo, error: message },
					isError: true,
				};
			}
		},
	});
}
