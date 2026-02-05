#!/bin/bash
set -e

GENZ_PATH="../genzjobs"  # Path to genz-jobs project

if [ ! -f "$GENZ_PATH/prisma/schema.prisma" ]; then
  echo "Cannot find genz-jobs schema at $GENZ_PATH"
  echo "Update GENZ_PATH in this script"
  exit 1
fi

cp "$GENZ_PATH/prisma/schema.prisma" ./prisma/schema.prisma
npx prisma generate

echo "Schema synced from genz-jobs"
echo "Run 'npm run dev' to start"
