<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Infra (live prod)

- Prod runs on Hostinger VPS `72.62.154.119` (VM ID `1639436`); SSH as `root@`; app user `deploy`; app dir `/home/deploy/app`; pm2 process `vd`. Same VPS also hosts `vd-staging` and `zw` (zonewijzer.nl) — restarts can affect siblings.
- Run pm2 commands as `sudo -u deploy pm2 ...` (root's pm2 is empty).
- Prod MariaDB DB is **`vindecoder_staging`** (intentional naming, NOT a misconfig). A `vindecoder` DB exists but is unused.
- Push to `main` fires `.github/workflows/deploy.yml` → npm ci + next build + pm2 reload vd. Concurrency is queued, not cancelled.
- Hostinger MCP subscription ID for the VPS: `AzZgUtVIXdE50FjqF`.
- Block scrapers in `/etc/nginx/conf.d/bot-blocklist.conf` — defines `$bad_bot` map + `$bad_ip` geo, referenced from every vhost via `if ($bad_bot|$bad_ip) { return 429; }`. Edit this file, not the vhosts.
- `/etc/nginx/sites-enabled/*` is scanned by nginx for any file — leaving `*.bak` there breaks `nginx -t` with "duplicate default server". Stash backups in `/root/nginx-backups/`.

## Code gotchas

- Root layout sets `title.template = "%s | VinDecoder"`. Child page metadata `title` strings must NOT end in "| VinDecoder" (doubles to 79+ chars, past Google's snippet cutoff). Use `title: { absolute: "…" }` to override the template.
- NHTSA fields are nullable. `c.summary`, `r.Summary`, complaint fields can be null — null-guard before `.slice(...)`. Crashes propagate through `generateMetadata` and produce 503s.
- JSX strips whitespace between `{expr}` and adjacent text inside an element. Use a template literal `` {`${expr} text`} `` when you need a guaranteed space.
- `<GoogleAnalytics>` from `@next/third-parties/google` must render inside `<body>`. Placing it between `</body>` and `</html>` is invalid HTML5 and confuses GA4 Tag Diagnostics into flagging pages as "Not tagged".

## Pre-push hook

The repo ships a `.githooks/pre-push` hook that runs `npm run typecheck`
(`tsc --noEmit`) before allowing a push. Activate once per clone:

```
git config core.hooksPath .githooks
```

Catches the missing-import / type-error class of bug that otherwise
fails the GitHub Actions deploy silently after push. Bypass in an
emergency with `git push --no-verify`. Hook degrades gracefully when
`node_modules` isn't installed — it warns and lets the push through.

## Verification & ops patterns

- Smoke prod after each push with `curl -sI` — faster and quieter than the GitHub Actions API (which anon-rate-limits fast).
- Playwright `browser_evaluate` returning `{meta, h1, h2, jsonLdTypes, wordCount, ...}` is the right shape for an SEO audit pass.
- pm2 error log: `sudo -u deploy pm2 logs vd --lines N --err --nostream`.
- Prewarm script lives on VPS at `/tmp/prewarm.sh`. Run with `PARALLEL=2` or lower — concurrent load on the 2-CPU VPS triggers 502/503 cascades.
- `gh` CLI is not installed on the dev machine. Use PowerShell `Invoke-RestMethod` against api.github.com for unauthenticated GitHub REST calls.
- **GSC MCP `submit_sitemap` is NOT working (verified 2026-05-31)** — both servers 403: `mcp__ga4__gsc_submit_sitemap` → "insufficient authentication scopes", `mcp__gsc__submit_sitemap` → "403 Insufficient Permission". The earlier "write OK after 2026-05-16 OAuth bump" note no longer holds (scope lapsed/consented down). GSC MCP **reads** still work (`search_analytics`, `list_sitemaps`, `index_inspect`). For sitemap submit, fall back to Playwright on the GSC UI — but note resubmitting a sitemap does NOT speed up crawling (Google crawls on its own trust/age-driven schedule), so it's rarely worth doing. Indexing API still needs a service account — keep using Playwright on GSC URL Inspector for "Request Indexing".
- GA4 property `533032010` reports in `America/Los_Angeles` — GA4 day boundaries are offset 7–8 h from UTC nginx logs when correlating spikes.
- **Git push uses SSH** (`git@github.com:freecryptonet/vindecoder-site.git`). PAT auth retired 2026-05-16; key is `~/.ssh/github_ed25519`.

## Policy decisions (2026-05-13)

- **Outrank vindecoderz.com via SEO/content** is the confirmed strategy.
- **No archive resurrection.** Pre-rebuild code lives at `C:\outrank-vindecoderz-archive-2026`; treat as historical reference only. Don't propose work on `plateDecoders/`, `/admin/*`, `vin_lookups_review`, etc. without an explicit user trigger.
- Before redirecting a "404'd" URL pattern to `/`, **check GSC byPage analytics first** — `/license-plate/*` had 50+ URLs already indexed and getting impressions; blanket redirect would have killed real traffic.
