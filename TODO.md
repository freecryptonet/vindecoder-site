# TODO — vindecoder.site (post-rebuild baseline)

Today: **2026-05-13**. Baseline: `f408ca6` (the simple post-rebuild site).
Previous TODO list (in `C:\outrank-vindecoderz-archive-2026\TODO.md`) is **retired** —
it referenced admin/plate/corpus features that no longer exist on prod.

---

## Decide

**Confirmed direction (2026-05-13):**
- **No archive resurrection.** The 370 abandoned commits stay dead. Don't propose license-plate / problems / admin / plateDecoders work without a fresh trigger.
- **Strategy: outrank vindecoderz.com via SEO + content.** Drives the "Ship — SEO/content" section below.

**Still pending:**

| | Decision | Why |
|---|---|---|
| **By 2026-05-31** | VPS auto-renewal: monthly €21.99 / 12-mo €14.99 / 24-mo €7.99 / cancel | Subscription expires 2026-06-03, auto-renew currently OFF. ~18 days to act. |

---

## Ship (do this work)

### Infrastructure (carryover from archive — survives the rebuild)

- [x] ~~Decommission legacy Hostinger Business Node.js app~~ — **DONE 2026-05-13.** Deleted the vindecoder.site addon via hPanel (Playwright-driven). `~/domains/vindecoder.site/` removed from Business plan, no Node processes, autodtcs.com + servicereset.net unaffected, VPS still serving prod.
- [ ] **Rotate exposed credentials.** While in hPanel deployment settings I saw the legacy app had these env vars stored unencrypted (previously also in `.htaccess` on a multi-tenant Business plan). The env-var store was deleted with the addon, but values may still be live elsewhere:
  - `DATABASE_URL` (MariaDB on VPS, password `R3kmqwpy5bJfXm*`) — **still in active use on VPS.** Rotate: ALTER USER on MariaDB, update `/home/deploy/app/.env`, `pm2 restart vd --update-env`.
  - `ADMIN_TOKEN` (`zM9obHePVlBEhJFxM2Zf0DgTEwMxowfM`) — `/admin/*` is currently 404 on prod, so this token may no longer gate anything. Confirm not referenced anywhere in the rebuilt site, then either rotate or remove from `.env`.
  - `DATABASE_URL_NEON_BACKUP` (Neon Postgres, leftover from pre-rebuild) — site no longer uses Neon. Log into Neon console once: if the project still exists, delete it (kills the credential and any residual billing); if already deleted, ignore.
- [ ] **Set up SSH access to VPS from this PC.** Currently the `deploy@72.62.154.119` key lives only in the GitHub Actions secret. Generate a local key, add pubkey to `/home/deploy/.ssh/authorized_keys`. Unblocks pm2 checks, log audits, manual deploys. — *No date; needed before next health audit and the secret rotation above.*

### Bugs / dead code (from the audit)

- [x] ~~`not_found_log` table~~ — **DONE 2026-05-13.** Removed `CREATE TABLE` block from `src/lib/db.ts` (no read path, write-only was pointless). Follow-up: `DROP TABLE not_found_log;` on prod once SSH is set up.
- [x] ~~`robots.ts` disallows `/admin/`~~ — **DONE 2026-05-13.** Removed `/admin/` from disallow list. `/api/` stays (don't want crawlers hitting `/api/health`).
- [ ] **`/api/health` is unmonitored** — confirmed no scheduled workflow, no cron, no other code references it. Either add UptimeRobot (free 5-min checks + email alert on 503/timeout) or delete the endpoint as dead code. User unsure if anything external pings it — assume not until proven otherwise.

### SEO / content (validated strategy — invest here)

Outrank-vindecoderz.com is the confirmed direction. These items map directly to that.

- [ ] **Backfill guides 6–20**. The current site has 5 guides (`src/lib/guides.ts` + `src/app/guides/[slug]/page.tsx`); 20 were originally planned. Each guide is long-tail SEO + AdSense surface area. Write fresh (don't copy from archive — those were tied to the abandoned stack).
- [ ] **Pre-warm the `vehicle_cache`** for high-traffic make/model/year combos so the sitemap covers more than the trickle of organically-visited pages. The sitemap pulls from `getCachedVehicles(5000)`; with an empty/cold cache it ships only the static + make pages.
- [ ] **Submit fresh sitemap to GSC** after the pre-warm so Google sees the expanded URL set.
- [ ] **Add a `/complaints` index page** sourcing from `vehicle_cache.complaints_data` — currently complaints only appear inline on VIN-decode pages, so the URL has no dedicated landing target.
- [ ] **Audit what vindecoderz.com ranks for that we don't.** Pull their top 20–50 ranking pages (GSC competitor analysis or Ahrefs/Semrush) and identify URL patterns we're missing entirely (per-model problems pages? safety-rating landings? recall-by-year landings?). Use to plan the next batch of URL templates.

---

## Watch (passive monitoring, no action unless triggered)

| | Watch | Trigger to act |
|---|---|---|
| **By 2026-07-25** | Let's Encrypt SSL cert auto-renewal (cert expires 2026-08-01) | If `certbot certificates` shows old expiry, manual renew |
| Ongoing | VPS RAM trend (currently 1.2 → 2.9 GB over last week) | If it crosses ~6 GB on the 8 GB box, look for Node leak |
| Ongoing | 1.42 GB inbound spike on 2026-05-10 14:38 UTC | Recurring? Pull `/var/log/nginx/access.log` once SSH is set up |

---

## Notes / parking lot

- The HANDBOOK.md and `tools/salvage/`, `tools/amayama/` in the archive describe a *different site* (the pre-rebuild one). Don't grep them for current architecture.
- VM ID for Hostinger MCP is `1639436`. CPU/RAM/disk metrics queryable via `mcp__hostinger__VPS_getMetricsV1`.
- Repo branches `main` and `staging` both point to `f408ca6` — no in-flight branches on origin.
- Update this file when items ship or new follow-ups appear. Dated items >30 days out are good `/schedule` candidates.
