#!/usr/bin/env bash
#
# agent-worktree.sh — give each agent run its own git worktree.
#
# WHY (COS-225): multiple concurrent Claude Code runs (one per Linear ticket)
# must never share a single checkout. When runs share one working tree, one
# run's `git checkout`/branch-switch collides with another run's *uncommitted*
# work — git auto-stashes the blocking changes and resets the tree, putting any
# WIP (project notes, half-finished code) at risk. Each run instead gets a
# physically separate worktree branched off *fresh* origin/main, so runs can
# never stash or reset each other.
#
# The shared root checkout (the repo you cloned) is dispatch-only: never edit,
# commit, or branch-switch in it. Always work inside a per-run worktree.
#
# Usage:
#   scripts/agent-worktree.sh new <branch-name> [worktree-name]
#   scripts/agent-worktree.sh cleanup [worktree-name]
#   scripts/agent-worktree.sh list
#
# Examples:
#   scripts/agent-worktree.sh new aled/cos-231-add-contact-form
#   #   -> creates ../awt-cos231 on that branch, off origin/main
#   scripts/agent-worktree.sh cleanup awt-cos231
#   scripts/agent-worktree.sh cleanup            # from inside a worktree
#
set -euo pipefail

# Resolve the *main* working tree (first entry of `git worktree list`), so new
# worktrees are always created as siblings of it regardless of where we run from.
main_worktree() {
  git worktree list --porcelain | awk '/^worktree /{print $2; exit}'
}

# Derive a short worktree dir name from a branch name: pull out cos-NNN and
# render it as awt-cosNNN (matching the existing convention). Falls back to a
# sanitised branch basename if no ticket id is present.
derive_name() {
  local branch="$1" id
  id="$(printf '%s' "$branch" | grep -oiE 'cos-?[0-9]+' | head -n1 || true)"
  if [ -n "$id" ]; then
    printf 'awt-%s' "$(printf '%s' "$id" | tr 'A-Z' 'a-z' | tr -d '-')"
  else
    printf 'awt-%s' "$(basename "$branch" | tr -c 'a-zA-Z0-9' '-' | sed 's/-*$//')"
  fi
}

cmd_new() {
  local branch="${1:-}" name="${2:-}"
  if [ -z "$branch" ]; then
    echo "usage: agent-worktree.sh new <branch-name> [worktree-name]" >&2
    exit 2
  fi
  [ -n "$name" ] || name="$(derive_name "$branch")"

  local parent path
  parent="$(dirname "$(main_worktree)")"
  path="$parent/$name"

  if [ -e "$path" ]; then
    echo "✗ $path already exists — pick another name or clean it up first." >&2
    exit 1
  fi

  echo "→ Fetching origin/main so the new worktree branches off fresh code…"
  git fetch origin main --quiet

  # Reuse the branch if it already exists (local or remote); otherwise create it
  # off origin/main. Never branch off the local root, which may be stale.
  if git show-ref --verify --quiet "refs/heads/$branch" \
     || git show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    git worktree add "$path" "$branch"
  else
    git worktree add -b "$branch" "$path" origin/main
  fi

  echo
  echo "✓ Worktree ready: $path"
  echo "  Next:"
  echo "    cd \"$path\""
  echo "    npm install        # node_modules is NOT shared across worktrees"
  echo "  Do ALL work for this run inside that directory. Never touch the shared root."
}

cmd_cleanup() {
  local name="${1:-}" path
  if [ -n "$name" ]; then
    path="$(dirname "$(main_worktree)")/$name"
  else
    # No name given: assume we're inside the worktree to remove.
    path="$(git rev-parse --show-toplevel)"
    if [ "$path" = "$(main_worktree)" ]; then
      echo "✗ Refusing to remove the shared root. Pass a worktree name, or run from inside the worktree." >&2
      exit 1
    fi
    # `git worktree remove` can't remove the cwd; step out first.
    cd "$(dirname "$(main_worktree)")"
  fi

  # Plain remove (no --force) errors if the worktree has uncommitted changes,
  # which is the desired "auto-remove only if unchanged" behaviour.
  git worktree remove "$path"
  git worktree prune
  echo "✓ Removed worktree: $path"
}

case "${1:-}" in
  new)     shift; cmd_new "$@" ;;
  cleanup) shift; cmd_cleanup "$@" ;;
  list)    git worktree list ;;
  *)
    echo "usage: agent-worktree.sh {new|cleanup|list} [...]" >&2
    echo "  new <branch-name> [worktree-name]   create a per-run worktree off origin/main" >&2
    echo "  cleanup [worktree-name]             remove a worktree (only if unchanged)" >&2
    echo "  list                                show all worktrees" >&2
    exit 2
    ;;
esac
