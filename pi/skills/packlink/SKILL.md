---
name: packlink
description: "Use packlink to link local packages in pnpm workspaces/monorepos via packed tarballs, avoiding singleton breakage, peer-dependency collisions, and preserving catalog: specifiers."
---

# packlink

`packlink` links local packages by packing them into `.tgz` release tarballs and installing them via `pnpm add file:<tarball>.tgz`. This treats local packages as true external releases, preventing singleton breakage (e.g. React context, iTwin services), avoiding peer-dependency collisions caused by filesystem symlinks (`pnpm link`), and preserving pnpm `catalog:` specifiers on unlink.

## When to Use

- Developing across two local repositories or packages where one consumes the other.
- Consuming project uses `pnpm` (especially with monorepos, `pnpm-workspace.yaml`, or `catalog:` specifiers).
- Standard `pnpm link` fails due to:
  - Duplicate singleton instances / React context collisions.
  - Peer-dependency resolution pulling from the linked package's internal `node_modules`.
  - External linkers (`yalc`, `npm link`) wiping out `catalog:` or `workspace:*` specifiers in `package.json`.

---

## Core Workflow

### 1. Push Package to Local Store (Source Package Repo)
Run inside the package or root of the source repository:

```bash
# Push all packages in a monorepo in topological order:
packlink push

# Push only a single package without internal dependencies:
packlink push --no-deps
```

- In a monorepo (`pnpm-workspace.yaml` or Rush `rush.json`), discovers all publishable workspace packages and packs them in topological order.
- Verifies `package.json` contains a `"build"` script and runs build (skip with `--no-build`).
- Uses dual-pack manifest injection (`npm pack` + `pnpm pack`) to preserve files while resolving `workspace:*` dependency manifests.
- Writes cache-busting timestamped tarballs to the local store (`path.join(tmpdir(), "packlink-store")` or `$PACKLINK_STORE`).

### 2. Link Package into Consumer (Consumer App / Workspace)
Run inside the consuming project or monorepo root:

```bash
# Interactive selection or link a package from a monorepo family:
packlink link
packlink link @itwin/core-frontend
```

- Automatically applies tarball overrides to `pnpm-workspace.yaml` at the workspace root, guaranteeing all subprojects resolve to the exact same physical package instances in pnpm's virtual store.
- Sets required `packageExtensions` for third-party packages with undeclared peer dependencies.
- Runs `pnpm install` at workspace root without polluting individual `package.json` files.
- Backs up original overrides and specifiers into `.packlink.json`.
- Automatically ensures `.packlink.json` is added to `.gitignore`.

### 3. Iterate
When changes are made in the source repository:
1. In source repo: run `packlink push`.
2. In consumer repo: run `packlink link <package-name>` (or simply `packlink link` and select the package). The timestamped tarball prevents pnpm tarball caching issues.

### 4. Unlink and Restore
When finished testing local changes:

```bash
# Interactive selection:
packlink unlink

# Unlink specific package:
packlink unlink <package-name>

# Unlink all linked packages without prompting:
packlink unlink --all
```

- Restores the exact original dependency specifiers (including `catalog:` or `workspace:` specifiers) back into their original sections in `package.json`.
- Automatically executes `pnpm install` to restore registry/catalog dependencies.
- Cleans up `.packlink.json` once all packages are unlinked.

---

## Inspection & Maintenance Commands

### Status / List
View all stored packages in the global local store and inspect which packages are currently linked in the current project:

```bash
packlink list
# or
packlink status
```

### Clean Store
Wipe all cached tarballs from the store and reset the store index:

```bash
packlink clean
```

---

## Environment Variables

- `PACKLINK_STORE` (or `LOCAL_LINKS_STORE`): Custom directory path for storing packed tarballs and `index.json` (defaults to `<tmpdir>/packlink-store`).
