# ayico-nutrition

Application mobile React Native (Expo) de gestion de sa nutrition.

L'app dialogue directement avec l'API (`~/api`) hebergee sur le meme
Raspberry Pi, en HTTP sur le reseau local.

## Prerequis

- Docker + Docker Compose sur le Pi (deja en place pour `api`/`infra`).
- L'app [Expo Go](https://expo.dev/go) installee sur ton telephone.
- Telephone et Pi sur le **meme reseau local**.
- L'API doit tourner (`~/docker-manage.sh up api`).

## Configuration

Copier `.env.example` en `.env` et renseigner l'IP LAN du Pi (celle que ton
telephone utilise pour le joindre) :

```bash
cp .env.example .env
```

Verifier l'IP actuelle du Pi avec `ip -brief addr` si besoin (elle peut
changer selon le bail DHCP) :

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
```

## Demarrer le serveur de dev (Metro/Expo)

```bash
./dev.sh up      # build + demarre le conteneur
./dev.sh logs    # affiche le QR code a scanner avec Expo Go
./dev.sh down    # arrete le conteneur
./dev.sh shell   # shell dans le conteneur (ex: npm install <package>)
```

Le conteneur tourne en `network_mode: host` : le bundler Metro annonce donc
directement l'IP LAN reelle du Pi, ce qui permet a Expo Go de le joindre sans
configuration reseau supplementaire.

Ouvrir Expo Go sur le telephone et scanner le QR code affiche par
`./dev.sh logs`.

## Installer un package npm

Le projet entier est monte en volume dans le conteneur (hot-reload), et
`node_modules` est installe directement dessus au premier demarrage (voir
`docker-entrypoint.sh`) : il est donc aussi visible cote hote, ce qui permet
a l'editeur/TypeScript de resoudre les imports normalement. Pour ajouter une
dependance :

```bash
./dev.sh shell
npm install <package>
exit
```

Pas besoin de rebuild : Metro et l'editeur voient directement le nouveau
`node_modules` grace au volume.

## Structure

- `App.tsx` / `index.ts` — point d'entree de l'app.
- `app.json` — configuration Expo.
- `docker-compose.yml`, `Dockerfile`, `docker-entrypoint.sh` — environnement de dev conteneurise.
- `.env` — URL de l'API (non versionne).

Ce projet est detecte automatiquement par `~/docker-manage.sh` (au meme
titre que `api` et `infra`).
