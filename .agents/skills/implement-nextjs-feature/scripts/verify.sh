#!/usr/bin/env bash
# Quality gate used by Developer, Reviewer and Tester.
# Runs: install (if needed) -> lint -> typecheck -> unit tests -> production build.
# Usage: bash .agents/skills/implement-react-feature/scripts/verify.sh [--coverage]
set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

if [[ ! -f package.json ]]; then
  echo "ERROR: package.json not found in $ROOT — scaffold the project first." >&2
  exit 1
fi

[[ -d node_modules ]] || npm ci || npm install

has_script() { node -e "process.exit(require('./package.json').scripts?.['$1'] ? 0 : 1)"; }

declare -a RESULTS=()
FAILED=0

run_step() {
  local name="$1"; shift
  echo -e "\n=== $name ==="
  if "$@"; then
    RESULTS+=("PASS  $name")
  else
    RESULTS+=("FAIL  $name")
    FAILED=1
  fi
}

has_script lint      && run_step "lint"      npm run --silent lint
has_script typecheck && run_step "typecheck" npm run --silent typecheck
if [[ "${1:-}" == "--coverage" ]] && has_script test:coverage; then
  run_step "unit tests (coverage)" npm run --silent test:coverage
else
  has_script test && run_step "unit tests" npx vitest run
fi
has_script build     && run_step "build"     npm run --silent build

echo -e "\n=== SUMMARY ==="
printf '%s\n' "${RESULTS[@]}"
if [[ $FAILED -eq 0 ]]; then echo "verify.sh: PASS"; else echo "verify.sh: FAIL"; fi
exit $FAILED

