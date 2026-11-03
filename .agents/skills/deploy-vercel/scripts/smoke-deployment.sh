#!/usr/bin/env bash
# Smoke test for Vercel Next.js deployments.
# Usage:
#   bash .agents/skills/deploy-vercel/scripts/smoke-deployment.sh <DEPLOYMENT_URL> [ROUTE]
set -euo pipefail

TARGET_URL="${1:-}"
ROUTE="${2:-/}"

if [[ -z "$TARGET_URL" ]]; then
  echo "Usage: $0 <DEPLOYMENT_URL> [ROUTE]" >&2
  exit 1
fi

# Ensure URL has protocol
if [[ ! "$TARGET_URL" =~ ^https?:// ]]; then
  TARGET_URL="https://$TARGET_URL"
fi

FULL_URL="${TARGET_URL%/}${ROUTE}"
echo "Running smoke check against: $FULL_URL"

declare -a SMOKE_RESULTS=()
SMOKE_FAILED=0

# 1. Check HTTP Status
HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" -L --connect-timeout 10 --max-time 30 "$FULL_URL" || echo "000")"
echo "HTTP response status (following redirects): $HTTP_CODE"

if [[ "$HTTP_CODE" == "200" ]]; then
  SMOKE_RESULTS+=("PASS  HTTP 200 OK received")
elif [[ "$HTTP_CODE" =~ ^(301|302|307|308)$ ]]; then
  SMOKE_RESULTS+=("PASS  HTTP $HTTP_CODE Redirect received")
else
  SMOKE_RESULTS+=("FAIL  Unexpected HTTP status $HTTP_CODE")
  SMOKE_FAILED=1
fi

# 2. Check Raw Response Headers
HEADERS="$(curl -sI -L --connect-timeout 10 --max-time 15 "$FULL_URL" || true)"

# Check for Next.js / Vercel caching or serving header
if echo "$HEADERS" | grep -iq "x-vercel-id"; then
  SMOKE_RESULTS+=("PASS  x-vercel-id header verified (served via Vercel Edge Network)")
else
  SMOKE_RESULTS+=("WARN  x-vercel-id header not detected")
fi

# Check Security Headers
if echo "$HEADERS" | grep -iq "x-content-type-options"; then
  SMOKE_RESULTS+=("PASS  X-Content-Type-Options header present")
else
  SMOKE_RESULTS+=("WARN  X-Content-Type-Options header missing")
fi

if echo "$HEADERS" | grep -iq "x-frame-options"; then
  SMOKE_RESULTS+=("PASS  X-Frame-Options header present")
else
  SMOKE_RESULTS+=("WARN  X-Frame-Options header missing")
fi

# 3. Check Body Content
BODY="$(curl -s -L --connect-timeout 10 --max-time 15 "$FULL_URL" || true)"
BODY_LEN=${#BODY}

if [[ $BODY_LEN -gt 100 ]]; then
  SMOKE_RESULTS+=("PASS  Response body received (${BODY_LEN} bytes)")
else
  SMOKE_RESULTS+=("FAIL  Response body is suspiciously empty (${BODY_LEN} bytes)")
  SMOKE_FAILED=1
fi

echo -e "\n=== SMOKE TEST SUMMARY ==="
printf '%s\n' "${SMOKE_RESULTS[@]}"

if [[ $SMOKE_FAILED -eq 0 ]]; then
  echo -e "\nsmoke-deployment.sh: PASS"
  exit 0
else
  echo -e "\nsmoke-deployment.sh: FAIL"
  exit 1
fi

