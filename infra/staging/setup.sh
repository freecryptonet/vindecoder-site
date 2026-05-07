#!/bin/bash
# One-shot bootstrap for the staging.vindecoder.site environment on the VPS.
# Idempotent — re-running is safe. Run as the `deploy` user.
#
# Prerequisites: nginx + certbot already installed (production already uses
# them); pm2 already running; Node 20+ on PATH. DNS A record
# staging.vindecoder.site → 72.62.154.119 must already resolve before TLS
# issuance.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/freecryptonet/vindecoder-site.git}"
APP_DIR="/home/deploy/staging-app"
BRANCH="staging"
PORT="3001"
PM2_NAME="vd-staging"

echo "==> 1/6  clone or fetch staging branch"
if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"

echo "==> 2/6  install deps"
npm ci --no-audit --no-fund --prefer-offline --include=optional

echo "==> 3/6  next build"
rm -rf .next
NODE_OPTIONS=--max-old-space-size=6144 npm run build

echo "==> 4/6  ensure .env.staging exists"
if [ ! -f "$APP_DIR/.env" ]; then
  cat > "$APP_DIR/.env" <<EOF
DATABASE_URL=mysql://vindecoder:CHANGE_ME@127.0.0.1:3306/vindecoder_staging
ADMIN_TOKEN=$(openssl rand -hex 16)
NODE_ENV=production
PORT=$PORT
EOF
  echo "  wrote stub .env — fill in real DATABASE_URL before next reload"
fi

echo "==> 5/6  pm2 register $PM2_NAME on port $PORT"
if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
  pm2 reload "$PM2_NAME" --update-env
else
  PORT="$PORT" pm2 start npm --name "$PM2_NAME" -- start
fi
pm2 save

echo "==> 6/6  install nginx vhost (manual sudo step)"
echo "  sudo cp infra/staging/nginx-staging.conf /etc/nginx/sites-available/staging.vindecoder.site"
echo "  sudo ln -sf /etc/nginx/sites-available/staging.vindecoder.site /etc/nginx/sites-enabled/"
echo "  sudo certbot --nginx -d staging.vindecoder.site --redirect --agree-tos -m timgvk@gmail.com -n"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo
echo "Then verify:  curl -sf https://staging.vindecoder.site/api/health"
