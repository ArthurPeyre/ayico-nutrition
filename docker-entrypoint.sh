#!/bin/sh
set -e

if [ ! -x node_modules/.bin/expo ]; then
    echo "node_modules absent ou incomplet, installation..."
    npm ci
fi

exec "$@"
