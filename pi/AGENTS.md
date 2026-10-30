# Global AGENTS
- To search, always use `fffind`/`ffgrep` in a scoped directory.
- Only run `git` commands that inspect the local repository, such as `git diff`, `git status`, or `git log`. Only run `git add` or `git commit` if given permission to do so. NEVER run `git push` or any command that affects remote repositories.
- Never leave inline comments or comments that reference details from chats.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
- Fail-first and fail-fast: surface errors immediately rather than swallowing them, adding fallbacks, or working around them silently.
- Follow the spirit of NASA's Power of Ten Rules for Safety-Critical Code by Gerard J. Holzmann.
- Put a limit on everything because everything has a limit.
- Assert arguments, returns, and invariants: what you expect and don't expect, the positive and negative space, not only contract but breach.
- Fuzz testing is your best friend.
- Design logical interfaces: push control flow up and data flow down, minimize surface area.
- Think about performance from the outset (network, storage, memory, compute). It's hard to fix a system after implementation, and the gains are less.
- Naming: append qualifiers to names, sort by most significant word (big endian naming), don't abbreviate.
- Write tests before implementing changes to ensure correctness and prevent regressions. If fixing a bug, write a test that reproduces it first, then make it pass.
- Correctness above all.
- Use engineering diagramming tools like mermaid diagrams (process or sequence diagrams, state or flow charts, etc.) to help the user understand complex flows or relationships in the code.

