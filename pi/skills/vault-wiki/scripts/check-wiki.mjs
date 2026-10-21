import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const wiki = resolve(process.argv[2] ?? "Wiki");
const errors = [];

for (const entry of readdirSync(wiki, { withFileTypes: true })) {
  if (entry.name.startsWith(".")) continue; // macOS sidecars are not Wiki content
  const name = entry.name;
  if (!entry.isFile()) {
    errors.push(`${name}: Wiki files must be flat`);
    continue;
  }
  const text = readFileSync(join(wiki, name), "utf8");
  if (name.endsWith(".canvas")) {
    try {
      JSON.parse(text);
    } catch {
      errors.push(`${name}: invalid JSON Canvas`);
    }
    continue;
  }
  if (!name.endsWith(".md")) {
    errors.push(`${name}: only Markdown and Canvas files belong in Wiki`);
    continue;
  }
  if (/^(?:index|log)-.+\.md$/.test(name)) {
    errors.push(`${name}: index/log shards are not allowed; use index.md or log.md`);
  }
  if (/^#{1,6}(?:[ \t]|$)/m.test(text)) errors.push(`${name}: Markdown headings are not allowed`);
  const frontmatterMatch = text.match(/^---\n([\s\S]*?)\n---\n/);
  const frontmatter = frontmatterMatch?.[1];
  if (frontmatter === undefined) {
    errors.push(`${name}: missing YAML frontmatter`);
    continue;
  }
  const isIndexOrLog = name === "index.md" || name === "log.md";
  if (!isIndexOrLog) {
    const body = text.slice(frontmatterMatch[0].length);
    const count = Array.from(body).length; // Unicode code points, not UTF-16 units
    if (count > 5000) errors.push(`${name}: ${count} body characters (maximum 5000, excluding frontmatter)`);
  }
  const fields = isIndexOrLog
    ? ["okf_version"]
    : ["type", "title", "description", "generated", "tags", "resource"];
  for (const field of fields) {
    if (!new RegExp(`^${field}:`, "m").test(frontmatter)) {
      errors.push(`${name}: missing ${field} property`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Wiki OK: flat Markdown/Canvas; frontmatter and headings valid; ordinary Markdown bodies <=5000 characters; index/log exempt");
}
