<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# One worktree per run (concurrency)

Several agent runs work this repo in parallel, one per Linear ticket. If runs share a single checkout, one run's branch-switch silently auto-stashes and resets another run's uncommitted work (this happened — see COS-225). To prevent it, **every run gets its own git worktree** and the shared root is treated as dispatch-only.

**Rules — follow these at the start of any ticket that changes files:**

1. **Never edit, commit, or branch-switch (`git checkout` / `git switch`) in the shared root** (`/Users/aledpritchard/aledpritchard-com`). Treat it as read-only.
2. **Create your own worktree first**, then do all work inside it:
   ```sh
   scripts/agent-worktree.sh new <gitBranchName>   # e.g. aled/cos-231-add-contact-form
   ```
   This branches off **fresh `origin/main`** (never the local root, which may be stale) into a sibling dir `../awt-cosNNN`. `cd` there and run `npm install` — `node_modules` is **not** shared across worktrees.
3. **Branch always off `origin/main`**, never the local root `main`.
4. **On completion** (after the PR is merged, or if the run is abandoned with no changes worth keeping):
   ```sh
   scripts/agent-worktree.sh cleanup               # run from inside the worktree
   ```
   This removes the worktree only if it has no uncommitted changes (so you can never lose WIP by cleaning up).

`scripts/agent-worktree.sh list` shows all active worktrees.
