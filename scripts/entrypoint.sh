#!/bin/sh
set -e

echo "==> Waiting for PostgreSQL to be reachable..."
MIGRATE_TRIES=${MIGRATE_TRIES:-20}
i=0
until npx prisma migrate deploy; do
  i=$((i + 1))
  if [ "$i" -ge "$MIGRATE_TRIES" ]; then
    echo "==> Database unreachable after $MIGRATE_TRIES attempts. Aborting."
    exit 1
  fi
  echo "==> DB not ready (attempt $i/$MIGRATE_TRIES), retrying in 5s..."
  sleep 5
done

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "==> Applying seed data..."
  npm run db:seed || echo "==> Seed failed (continuing anyway)"
fi

echo "==> Starting Next.js server on 0.0.0.0:${PORT:-3000}"
exec node server.js