# Decommission: Legacy Hostinger Business Node.js app

**Goal:** stop the old Passenger-managed Next.js app on the Hostinger Business
plan and free Business-plan process budget for autodtcs.com WordPress + email + DNS.

**Date written:** 2026-05-13 (state verified live before writing).

---

## Verified current state

| | |
|---|---|
| **DNS** | `vindecoder.site` A → `72.62.154.119` (VPS) ✅ — public traffic does NOT go to the Business plan |
| **Business-plan IP** | `46.202.156.34` (SSH endpoint; web traffic to autodtcs.com routes via separate Hostinger IPs) |
| **Business-plan SSH** | `ssh autodtcs` works (alias for `u289452321@46.202.156.34:65002` with `~/.ssh/autodtcs_key`) |
| **Legacy app dir** | `/home/u289452321/domains/vindecoder.site/nodejs/` — 61 MB |
| **Live processes** | None right now |
| **Last hPanel deploy** | 2026-05-07T18:16Z (235 deployments total in history) |
| **Recent respawn** | Passenger cold-started the app on **2026-05-11 16:42 UTC** — still actively respawning |
| **hPanel website state** | `vindecoder.site` is an active addon domain (`is_enabled: true`) |
| **Other domains on plan (DO NOT TOUCH)** | `autodtcs.com`, `servicereset.net` |
| **Passenger config location** | `~/domains/vindecoder.site/public_html/.htaccess` (only one location) |
| **Secret leak** | `.htaccess` contains plaintext `ADMIN_TOKEN=zM9obHePVlBEhJFxM2Zf0DgTEwMxowfM` — see "Side action" below |

---

## Pick an approach

### Option A — Delete the addon domain in hPanel (recommended)

One click in hPanel removes the domain, the Node.js app, and all files in one
operation. DNS is unaffected (DNS lives elsewhere) so `vindecoder.site` keeps
serving from the VPS.

1. hpanel.hostinger.com → Hosting → manage the Business plan
2. **Websites** (or **Domains** → Addon Domains) → find `vindecoder.site`
3. `…` menu → **Remove domain / Delete website**
4. Confirm

Done. The Node.js app, `.htaccess`, `.builds/`, and `nodejs/` directory all go
in one shot. Verify with the checks in [Final verification](#final-verification).

> **Caveat:** if you ever want to host *anything* on `46.202.156.34` for
> `vindecoder.site` again (e.g. a temporary static page during VPS downtime),
> you'd have to re-add the addon domain. Option B preserves that ability.

### Option B — Keep the addon, kill only the Node.js app

Use this if you want to keep the option of serving from the Business plan
later (e.g. as an emergency fallback if the VPS dies).

```bash
# 1. Stop the Node.js app in hPanel:
#    hPanel → Business plan → Advanced → Node.js → vindecoder.site → Stop → Delete
#    Doing this through hPanel ensures Passenger's own config is cleaned up.
#    (Manually killing PIDs leaves orphaned Passenger config that respawns.)

# 2. Strip Passenger lines from .htaccess (keep canonical redirect):
ssh autodtcs '
  cd ~/domains/vindecoder.site/public_html
  cp .htaccess .htaccess.pre-decom-2026-05-13.bak
  # Remove every Passenger* directive, every SetEnv that fed the Node app,
  # and the .builds protection rule. Keep the WWW canonical redirect.
  sed -i.tmp -E "
    /^Passenger[A-Za-z]+/d;
    /^SetEnv (NODE_OPTIONS|LSNODE_CONSOLE_LOG|TOKIO_WORKER_THREADS|ADMIN_TOKEN)/d;
    /^RewriteRule \^\\.builds/d;
    /^# Process-cap mitigation/d;
    /^# Phusion Passenger was spawning/d;
    /^# pushing account-wide process count/d;
  " .htaccess
  rm -f .htaccess.tmp
  echo "=== Resulting .htaccess ==="
  cat .htaccess
'

# 3. Backup nodejs/ + .builds/ before deletion:
ssh autodtcs '
  cd ~/domains/vindecoder.site/
  tar czf ~/backup-vindecoder-2026-05-13.tar.gz nodejs/ public_html/.builds/
  ls -lh ~/backup-vindecoder-2026-05-13.tar.gz
'
# Expect ~30-50 MB. If it is empty or wildly small, abort.

# 4. Delete:
ssh autodtcs '
  rm -rf ~/domains/vindecoder.site/nodejs/
  rm -rf ~/domains/vindecoder.site/public_html/.builds/
'
```

---

## Final verification

Run regardless of which option you picked. All four should pass.

```bash
# 1. DNS still resolves to VPS
nslookup vindecoder.site
# expect: 72.62.154.119

# 2. VPS still serves prod
curl -sI https://vindecoder.site/
# expect: HTTP/2 200, nginx/Next.js headers

# 3. autodtcs.com WordPress still works
curl -sI https://autodtcs.com/
# expect: HTTP/2 200

# 4. No Node processes on Business plan
ssh autodtcs 'ps -u $USER -o pid,cmd | grep -i node | grep -v grep || echo "(clean)"'
# expect: (clean)
```

Optional follow-up: re-check Hostinger MCP — `mcp__hostinger__hosting_listJsDeployments`
for `vindecoder.site` should return no new deployments after today, and
`mcp__hostinger__hosting_listWebsitesV1?domain=vindecoder.site` should return empty
(Option A) or still-listed-but-no-Node (Option B).

---

## Rollback

If `vindecoder.site` goes down or `autodtcs.com` breaks immediately after either
option:

**Option A rollback:** re-add the addon domain in hPanel pointing at
`/home/u289452321/domains/vindecoder.site/public_html`. Then restore the .htaccess
from your local copy at this commit (`git show HEAD:docs/decommission-legacy-business-app.md`
contains the original Passenger block embedded above for reference if needed).
Note: you cannot restore `nodejs/` after Option A — hPanel deletes the dir.

**Option B rollback:**
```bash
# Restore .htaccess:
ssh autodtcs 'cp ~/domains/vindecoder.site/public_html/.htaccess.pre-decom-2026-05-13.bak \
              ~/domains/vindecoder.site/public_html/.htaccess'

# Restore files:
ssh autodtcs 'cd ~/domains/vindecoder.site/ && tar xzf ~/backup-vindecoder-2026-05-13.tar.gz'

# Re-create the Node.js app in hPanel → Advanced → Node.js → Create
```

---

## Side action — rotate `ADMIN_TOKEN`

The token `zM9obHePVlBEhJFxM2Zf0DgTEwMxowfM` was sitting in plaintext in
`.htaccess` on a multi-tenant Business plan since at least April 2026. Apache
blocks public HTTP access to `.htaccess` files by default, but treat it as
compromised anyway since multi-tenant filesystems are not a strong boundary.

```bash
# Generate replacement
openssl rand -hex 24

# On the VPS (once you have SSH access there — see TODO.md):
# 1. Update /home/deploy/app/.env: ADMIN_TOKEN=<new_value>
# 2. Restart pm2:  pm2 restart vd --update-env
# 3. Update any local .env or GitHub Actions secret that also stores it
```

This is independent of the decommission — do it whether or not you proceed
with Option A or B.

---

## Cleanup after a week of confidence

- Delete `~/backup-vindecoder-2026-05-13.tar.gz` on the Business plan
- Mark this item complete in `TODO.md`
- This doc can stay as historical reference, or be deleted — its job is done
