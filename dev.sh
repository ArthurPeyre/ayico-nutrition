#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="docker compose -f $BASE_DIR/docker-compose.yml"

usage() {
    cat <<EOF
Usage: $(basename "$0") <commande>

Commandes:
  up       Demarre le serveur Metro/Expo (rebuild l'image si besoin)
  down     Arrete le conteneur
  logs     Suit les logs (QR code, URL Metro, erreurs bundler)
  shell    Ouvre un shell dans le conteneur (ex: pour installer un package npm)
EOF
}

case "${1:-}" in
    up)
        $COMPOSE up -d --build
        ;;
    down)
        $COMPOSE down
        ;;
    logs)
        $COMPOSE logs -f
        ;;
    shell)
        $COMPOSE exec nutrition sh
        ;;
    *)
        usage
        exit 1
        ;;
esac
