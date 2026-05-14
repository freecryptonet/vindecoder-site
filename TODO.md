# TODO — vindecoder.site (post-rebuild baseline)

Last refreshed: **2026-05-14**. Baseline: `f408ca6` + post-session commits.
Previous TODO list (in `C:\outrank-vindecoderz-archive-2026\TODO.md`) is **retired** —
it referenced admin/plate/corpus features that no longer exist on prod.

---

## Decide

**Confirmed direction (2026-05-13):**
- **No archive resurrection.** The 370 abandoned commits stay dead.
- **Strategy: outrank vindecoderz.com via SEO + content.** Drives the SEO section below.
- **VPS renewal: monthly €21.49/mo** — auto-renew enabled via Hostinger MCP on 2026-05-13. Next billing 2026-06-03.

**All decisions resolved.** No pending decide items.

---

## Shipped earlier (2026-05-13 session)

- [x] VPS health check (10.35d uptime confirmed)
- [x] **Legacy Business app decommissioned** via hPanel Playwright
- [x] **VPS auto-renew enabled** on monthly subscription
- [x] **SSH access confirmed** — local `~/.ssh/autodtcs_key` matches the attached `autodtcs-dev` pubkey on VM 1639436 (root)
- [x] Dropped dead `not_found_log` table on prod MariaDB
- [x] Removed `not_found_log` CREATE block from `src/lib/db.ts`
- [x] Removed stale `/admin/` from `src/app/robots.ts` disallow
- [x] Deleted unmonitored `/api/health` endpoint
- [x] Built `/complaints` index page (`src/app/complaints/page.tsx` + `getRecentComplaintsFromCache` helper + sitemap + nav)
- [x] Added 301 redirects for abandoned URLs (`/admin`, `/specs`, `/license-plate`, `/compare`, `/problems`) to preserve link equity from external traffic per GA4
- [x] GSC checkup (37 URLs submitted, **0 indexed** — see below)
- [x] GA4 checkup (last 28 days — see below)
- [x] Vindecoderz template-gap audit (see below)

---

## Shipped since last refresh (2026-05-13 → 2026-05-14)

- [x] **All 20 guides written** (verified in `src/lib/guides.ts` — 20 slugs from `how-to-read-a-vin` through `title-washing-explained`).
- [x] **51 state plate-lookup pages** built at `/license-plate/[state]` (commit `a9d695c`). Different URL shape than vindecoderz's `/EN/{State}/license-plate-lookup`, same surface area.
- [x] AdSense readiness: cookie banner, mobile nav, headers, title fixes, state-page differentiation, noindex empty year hubs (commits `bb86691` → `4376017`).
- [x] Tier 1 + Tier 2 visuals: country flags, state badges, NHTSA footer badge, brand logos, fuel/severity icons (commits `92173e4` → `93f7aa5`).
- [x] Favicon + branded OG images wired explicitly (commits `b94304f` → `172b349`).
- [x] NHTSA hygiene: title-case ALL-CAPS leaks, dates not rendering in the future, null-guarded `Summary` in metadata, JSX whitespace fixes.
- [x] Pre-push typecheck hook (`.githooks/pre-push`) committed (commit `55ed939`).

## Ship (still pending)

### SEO / content (validated strategy — invest here)

- [ ] **Pre-warm `vehicle_cache`** for high-traffic make/model/year combos. Sitemap pulls from `getCachedVehicles(5000)` — with cold cache it ships only static + make pages. Cache warmup script could iterate top 200 make/model/year combos. Needs MariaDB tunnel.
- [ ] **Submit fresh sitemap to GSC** after the pre-warm.
- [ ] **Per-make root-level landing pages.** Vindecoderz uses `/EN/{Make}` not `/makes/{make}` — make name closer to root may help ranking. Tradeoff: redirects + canonical churn.
- [ ] **Multi-language variants** (vindecoderz indexes in DE/FR/ES/etc.). Defer until AdSense data justifies the build cost.
- [ ] **Re-check GSC indexing** ~2 weeks after the pre-warm + sitemap resubmit (target: 2026-05-27+).

### Bugs / dead code

(Nothing currently flagged.)

### Cosmetic / hygiene

- [ ] **Prod DB is named `vindecoder_staging`** not `vindecoder` (per the VPS `.env` — `DATABASE_URL=mysql://vindecoder_staging:...@127.0.0.1/vindecoder_staging`). A `vindecoder` DB also exists but appears unused. Verify, then either rename or document. Risk: low; confusion only. (AGENTS.md already notes the naming is intentional — could just close this.)

---

## Watch (passive monitoring)

| | Watch | Trigger to act |
|---|---|---|
| **By 2026-07-25** | Let's Encrypt SSL cert auto-renewal (cert expires 2026-08-01) | If `certbot certificates` shows old expiry, manual renew |
| Ongoing | VPS RAM trend (1.2 → 2.9 GB over a week) | If crosses ~6 GB on 8 GB box, look for Node leak |
| Ongoing | 1.42 GB inbound spike on 2026-05-10 14:38 UTC | Recurring? Pull `/var/log/nginx/access.log` (now have SSH) |
| Ongoing | **2035-user GA4 spike on 2026-05-11** (vs ~25 baseline) | Almost certainly bot traffic — most "direct" sessions appear unattributed. If recurring, investigate UA/IP. |

---

## Checkup snapshots (2026-05-13)

### GSC
- **1 sitemap** submitted 2026-05-07, 37 URLs, **0 indexed**
- Top query: "license plate lookup" — 1 click / 5 impressions / position 31. Everything else is zero-click niche.
- **Quick wins detected: 0** — nothing in positions 4–10 with low CTR. The site has too little indexing to surface ranking opportunities.
- **Take-away:** Indexing is the binding constraint. Pre-warm + resubmit + give Google ~2 weeks. Then re-check.

### GA4 (28d ending 2026-05-12)
- Most traffic is `(direct) / (none)` (3953 sessions / 3736 users) — almost all bot/unattributed
- Real organic: ~17 sessions/28d across Google + Bing + Yandex. Very low.
- **Anomaly:** 2026-05-11 had 2035 users vs ~25 baseline. Suspected bot.
- Top page: `/` (405 PV). Most other top pages are abandoned URLs (`/admin` 28 PV, `/specs` 28 PV, `/license-plate` 18 PV, `/compare` 13 PV, `/problems` 13 PV) — now 301'd to homepage/recalls in this commit.

### Vindecoderz audit
- Root pattern: `/EN/{Make}` and `/EN/{State}/license-plate-lookup` × 50 states
- Multi-language: `/EN/`, `/DE/`, `/FR/`, etc.
- Single sitemap page (`/EN/sitemap`) lists ALL makes + plate-lookup states
- **Biggest gap vs us:** per-state license plate lookup (~50 URLs) and root-level make pages

---

## Notes / parking lot

- The HANDBOOK.md and `tools/salvage/`, `tools/amayama/` in the archive describe a *different site*. Don't grep them for current architecture.
- VM ID for Hostinger MCP: `1639436`. Metrics: `mcp__hostinger__VPS_getMetricsV1`.
- This VPS also hosts `vd-staging` and `zw` (zonewijzer.nl) pm2 apps under the `deploy` user.
- Repo branches `main` and `staging` — same SHA before this session; `main` ahead after.
- Update this file when items ship or new follow-ups appear.
