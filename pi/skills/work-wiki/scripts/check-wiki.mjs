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
  const count = Array.from(text).length; // Unicode code points, not UTF-16 units
  if (count > 4000) errors.push(`${name}: ${count} characters (maximum 4000)`);
  if (/^#{1,6}(?:[ \t]|$)/m.test(text)) errors.push(`${name}: Markdown headings are not allowed`);
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  if (frontmatter === undefined) {
    errors.push(`${name}: missing YAML frontmatter`);
    continue;
  }
  const fields = /^(?:index|log)(?:-.+)?\.md$/.test(name)
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
  console.log("Wiki OK: flat Markdown/Canvas; Markdown frontmatter, no headings, <=4000 characters");
}
