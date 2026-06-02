#!/bin/bash
set -e

echo "Building AnWeChat..."

# Build web frontend
echo "Building web frontend..."
cd packages/web && npm run build && cd ../..

# Build desktop (optional, requires icons)
echo "Web build complete."
echo "Server: cd packages/server && npm start"
echo "Web: cd packages/web && npm run preview"
