#!/usr/bin/env bash
# Prewarm vehicle_cache by hitting top URLs.
# Each page render performs NHTSA fetches that populate vehicle_cache,
# which the sitemap then includes — growing the URL surface Google sees.
#
# Usage:  bash tools/prewarm.sh [BASE_URL]
#         bash tools/prewarm.sh https://vindecoder.site   # default
#         bash tools/prewarm.sh http://127.0.0.1:3000     # local dev
#
# Designed to run on the VPS via SSH — keeps the DB hot from the same box.

set -uo pipefail

BASE="${1:-https://vindecoder.site}"
LOG="/tmp/prewarm-$(date +%s).log"
PARALLEL="${PARALLEL:-5}"

echo "Prewarming ${BASE} (parallel=${PARALLEL}, log=${LOG})"

# ---------- URL list ----------
urls=(
  "${BASE}/"
  "${BASE}/makes"
  "${BASE}/recalls"
  "${BASE}/complaints"
  "${BASE}/license-plate"
  "${BASE}/guides"
  "${BASE}/wmi"
  "${BASE}/vin-year-chart"
  "${BASE}/vehicle-types"
)

# Per-state license-plate pages (50 + DC)
states=(alabama alaska arizona arkansas california colorado connecticut delaware
  district-of-columbia florida georgia hawaii idaho illinois indiana iowa
  kansas kentucky louisiana maine maryland massachusetts michigan minnesota
  mississippi missouri montana nebraska nevada new-hampshire new-jersey
  new-mexico new-york north-carolina north-dakota ohio oklahoma oregon
  pennsylvania rhode-island south-carolina south-dakota tennessee texas utah
  vermont virginia washington west-virginia wisconsin wyoming)
for s in "${states[@]}"; do urls+=("${BASE}/license-plate/${s}"); done

# Make hubs — hit a broad set to seed make-level caches
makes=(toyota honda ford chevrolet nissan jeep bmw mercedes-benz audi tesla
  ram gmc dodge subaru mazda hyundai kia volkswagen acura lexus volvo
  lincoln cadillac buick chrysler infiniti porsche mitsubishi mini fiat
  alfa-romeo lucid rivian polestar)
for m in "${makes[@]}"; do urls+=("${BASE}/makes/${m}"); done

# Top models per top-10 makes × top years — seeds vehicle_cache rows
# that feed the sitemap's dynamic URL list.
years=(2019 2020 2021 2022 2023 2024 2025)
declare -A models=(
  [toyota]="camry corolla rav4 highlander tacoma 4runner sienna prius tundra"
  [honda]="civic accord cr-v pilot odyssey ridgeline hr-v passport"
  [ford]="f-150 mustang explorer escape edge expedition bronco maverick"
  [chevrolet]="silverado-1500 equinox malibu tahoe traverse colorado suburban camaro"
  [nissan]="altima sentra rogue murano frontier titan pathfinder"
  [jeep]="grand-cherokee wrangler cherokee compass renegade gladiator"
  [bmw]="3-series 5-series x3 x5 x7 4-series 7-series"
  [mercedes-benz]="c-class e-class glc gle s-class gla glb"
  [audi]="a4 a6 q5 q7 a3 q3 a5"
  [tesla]="model-3 model-y model-s model-x"
)
for m in "${!models[@]}"; do
  for model in ${models[$m]}; do
    for y in "${years[@]}"; do
      urls+=("${BASE}/makes/${m}/${model}/${y}")
    done
  done
done

echo "Total URLs queued: ${#urls[@]}"

# ---------- fetch ----------
printf '%s\n' "${urls[@]}" | xargs -P "${PARALLEL}" -I {} sh -c '
  code=$(curl -sk -o /dev/null -w "%{http_code} %{time_total}" "$1")
  echo "$code $1"
' _ {} 2>&1 | tee "${LOG}"

# ---------- summary ----------
total=$(wc -l < "${LOG}")
ok=$(awk '$1 == "200"' "${LOG}" | wc -l)
non200=$(( total - ok ))
echo ""
echo "------------------------------------"
echo "Prewarm complete: ${ok}/${total} returned 200, ${non200} non-200"
echo "Slowest 10:"
sort -k2 -gr "${LOG}" | head -10
echo "------------------------------------"
echo "Full log: ${LOG}"
