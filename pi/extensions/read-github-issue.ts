/**
 * read_github_issue tool
 *
 * Read a GitHub issue (title, body, and comments) using the gh CLI. Read-only.
 *
 * Usage: pass either a full issue URL or a repo + issue number.
 *   - url:         "https://github.com/nodejs/node/issues/62260"
 *   - repo+number: repo="nodejs/node", issueNumber=62260
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

type GhComment = {
  author: { login: string };
  body: string;
  createdAt: string;
};

type GhIssue = {
  number: number;
  title: string;
  state: string;
  author: { login: string };
  createdAt: string;
  updatedAt: string;
  labels: { name: string }[];
  body: string;
  comments: GhComment[];
};

/** Parse owner/repo and issue number from a full GitHub issue URL. */
function parseIssueUrl(url: string): { repo: string; issueNumber: number } | undefined {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)\/issues\/(\d+)/);
  if (!match) return undefined;
  return { repo: match[1], issueNumber: parseInt(match[2], 10) };
}

function formatIssue(issue: GhIssue): string {
  const labels = issue.labels.map((l) => l.name).join(", ");
  const lines: string[] = [
    `# ${issue.title} (#${issue.number})`,
    `State: ${issue.state}  |  Author: ${issue.author.login}  |  Created: ${issue.createdAt}`,
    labels ? `Labels: ${labels}` : "",
    "",
    issue.body.trim(),
  ];

  if (issue.comments.length > 0) {
    lines.push("", `## Comments (${issue.comments.length})`);
    for (const comment of issue.comments) {
      lines.push(
        "",
        `### ${comment.author.login}  (${comment.createdAt})`,
        comment.body.trim(),
      );
    }
  }

  return lines.filter((l) => l !== undefined).join("\n");
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "read_github_issue",
    label: "Read GitHub Issue",
    description:
      "Read a GitHub issue including its body and all comments using the gh CLI. Read-only. " +
      "Provide either `url` (full issue URL) or both `repo` (owner/repo) and `issueNumber`.",
    parameters: Type.Object({
      url: Type.Optional(
        Type.String({ description: "Full GitHub issue URL, e.g. https://github.com/nodejs/node/issues/62260" }),
      ),
      repo: Type.Optional(
        Type.String({ description: "Repository in owner/repo format, e.g. nodejs/node" }),
      ),
      issueNumber: Type.Optional(
        Type.Number({ description: "Issue number, e.g. 62260" }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      let repo: string;
      let issueNumber: number;

      if (params.url) {
        const parsed = parseIssueUrl(params.url);
        if (!parsed) {
          return {
            content: [{ type: "text", text: `Invalid GitHub issue URL: ${params.url}` }],
            details: {},
            isError: true,
          };
        }
        ({ repo, issueNumber } = parsed);
      } else if (params.repo && params.issueNumber != null) {
        repo = params.repo;
        issueNumber = params.issueNumber;
      } else {
        return {
          content: [{ type: "text", text: "Provide either `url` or both `repo` and `issueNumber`." }],
          details: {},
          isError: true,
        };
      }

      const result = await pi.exec(
        "gh",
        [
          "issue",
          "view",
          String(issueNumber),
          "--repo",
          repo,
          "--json",
          "number,title,state,author,createdAt,updatedAt,labels,body,comments",
        ],
        { cwd: ctx.cwd, timeout: 15_000 },
      );

      if (result.code !== 0) {
        return {
          content: [{ type: "text", text: `gh error: ${result.stderr.trim() || `exit code ${result.code}`}` }],
          details: {},
          isError: true,
        };
      }

      let issue: GhIssue;
      try {
        issue = JSON.parse(result.stdout) as GhIssue;
      } catch {
        return {
          content: [{ type: "text", text: `Failed to parse gh output: ${result.stdout.slice(0, 200)}` }],
          details: {},
          isError: true,
        };
      }

      const text = formatIssue(issue);
      return {
        content: [{ type: "text", text }],
        details: {},
      };
    },
  });
}
