#!/usr/bin/env bash
# Deploy Next.js app to Vercel (Preview or Production).
# Usage:
#   bash .agents/skills/deploy-vercel/scripts/deploy.sh [--prod] [--confirm] [--skip-verify]
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

IS_PROD=0
CONFIRMED=0
SKIP_VERIFY=0

for arg in "$@"; do
  case "$arg" in
    --prod) IS_PROD=1 ;;
    --confirm) CONFIRMED=1 ;;
    --skip-verify) SKIP_VERIFY=1 ;;
    *) echo "Unknown flag: $arg" >&2; exit 1 ;;
  esac
done

if [[ ! -f package.json ]]; then
  echo "ERROR: package.json not found in $ROOT — scaffold the project first." >&2
  exit 1
fi

# Hard rule: Production requires explicit confirmation
if [[ $IS_PROD -eq 1 && $CONFIRMED -ne 1 ]]; then
  echo "ERROR: Deploying to PRODUCTION requires explicit confirmation." >&2
  echo "Re-run with --confirm only after user approval." >&2
  exit 1
fi

# Pre-flight quality verification gate
if [[ $SKIP_VERIFY -eq 0 ]]; then
  echo "=== Running Pre-Deploy Verification Gate ==="
  if [[ -f .agents/skills/implement-nextjs-feature/scripts/verify.sh ]]; then
    bash .agents/skills/implement-nextjs-feature/scripts/verify.sh
  elif [[ -f .agents/skills/implement-react-feature/scripts/verify.sh ]]; then
    bash .agents/skills/implement-react-feature/scripts/verify.sh
  else
    echo "WARNING: verify.sh not found, skipping quality gate." >&2
  fi
fi

# Check git status
echo -e "\n=== Checking Git Status ==="
if [[ -n "$(git status --porcelain)" ]]; then
  echo "WARNING: Working tree has uncommitted changes:"
  git status --short
fi

# Determine Vercel CLI runner
VERCEL_BIN="npx --yes vercel"
if command -v vercel &>/dev/null; then
  VERCEL_BIN="vercel"
fi

# Check Vercel authentication
echo -e "\n=== Verifying Vercel Auth ==="
if ! $VERCEL_BIN whoami &>/dev/null; then
  echo "ERROR: Not signed into Vercel CLI. Run '$VERCEL_BIN login' or set VERCEL_TOKEN." >&2
  exit 1
fi
echo "Signed in as: $($VERCEL_BIN whoami)"

# Execute deployment
echo -e "\n=== Executing Vercel Deployment ==="
DEPLOY_ARGS=("--yes")
if [[ $IS_PROD -eq 1 ]]; then
  DEPLOY_ARGS+=("--prod")
  echo "Target environment: PRODUCTION"
else
  echo "Target environment: PREVIEW"
fi

DEPLOY_OUTPUT="$($VERCEL_BIN "${DEPLOY_ARGS[@]}")"
echo "$DEPLOY_OUTPUT"

# Extract deployed URL (Vercel prints the URL as the last non-empty line or https://*.vercel.app)
DEPLOYED_URL="$(echo "$DEPLOY_OUTPUT" | grep -E '^https://[a-zA-Z0-9.-]+\.vercel\.app' | tail -n 1 || true)"

if [[ -z "$DEPLOYED_URL" ]]; then
  # Fallback: extract any https:// URL from the output
  DEPLOYED_URL="$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[^ ]+' | grep 'vercel.app' | tail -n 1 || true)"
fi

if [[ -n "$DEPLOYED_URL" ]]; then
  echo -e "\n=== Deployment Successful ==="
  echo "URL: $DEPLOYED_URL"

  # Run post-deployment smoke check
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [[ -f "$SCRIPT_DIR/smoke-deployment.sh" ]]; then
    echo -e "\n=== Running Smoke Test on $DEPLOYED_URL ==="
    bash "$SCRIPT_DIR/smoke-deployment.sh" "$DEPLOYED_URL"
  fi
else
  echo "WARNING: Could not parse deployed URL from Vercel output. Please check Vercel dashboard."
fi

