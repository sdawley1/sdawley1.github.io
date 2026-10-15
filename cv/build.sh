#!/usr/bin/env bash
# Compile the CV and the one-page résumé with tectonic and copy them into static/uploads/.
# Usage: cv/build.sh   (from anywhere)
# Requires: tectonic (brew install tectonic). First run downloads TeX packages.
set -euo pipefail
cd "$(dirname "$0")"
out="../static/uploads"
mkdir -p "$out"

if grep -n 'TODO' cv.tex resume.tex; then
  echo "ERROR: placeholder text (TODO) found in sources; fix before publishing." >&2
  exit 1
fi

status=0
for pair in "cv.tex:Dawley_CV.pdf" "resume.tex:Dawley_Resume.pdf"; do
  src=${pair%%:*}; dst=${pair##*:}
  base=${src%.tex}
  if tectonic -X compile --keep-logs --outdir . "$src" >"$base.build.log" 2>&1; then
    cp "$base.pdf" "$out/$dst"
    over=$(grep -c 'Overfull \\hbox' "$base.log" 2>/dev/null || true)
    printf '%-5s %-11s -> %s  (overfull=%s)\n' OK "$src" "$out/$dst" "$over"
  else
    echo "FAIL  $src"; grep -m5 -E '^!|error' "$base.build.log" || tail -20 "$base.build.log"
    status=1
  fi
  rm -f "$base.pdf" "$base.log" "$base.aux" "$base.out" "$base.build.log"
done
exit $status
