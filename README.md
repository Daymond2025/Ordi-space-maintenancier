# OrdiSpace — Espace Maintenancier

Application web mobile (Next.js) des techniciens de maintenance OrdiSpace : ils traitent les demandes de SAV des clients, de la prise de rendez-vous à la fin de l'intervention, et disposent d'une boutique d'affiliation.

Elle consomme l'API du dépôt [`Ordi-Space_backend`](https://github.com/Daymond2025/Ordi-Space_backend) (Laravel) via des jetons Bearer (Sanctum).

## Stack technique

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4
- Authentification : téléphone + code OTP reçu par WhatsApp **uniquement** (rôle `technicien_maintenance`). Pas d'inscription : le compte est créé par l'administration.
- Application installable (PWA, service worker, notifications push)

## Fonctionnalités principales

- **Space** — accueil : rendez-vous (Tous / Aujourd'hui / À venir), disponibilité en ligne / hors ligne.
- **Rendez-vous** — accepter, refuser ou reporter une demande ; fiche client.
- **Intervention** — diagnostic, suivi, fin d'intervention (prestations, pièces, coût) ; statuts Demande, Confirmé, En cours, Terminée.
- **Clients** — historique des clients suivis.
- **Boutique** — catalogue de revente, lien de vente affilié, ventes, portefeuille.
- **Compte** — informations, profil, notifications.

Le technicien ne voit que son périmètre (demandes nouvelles ou qui lui sont affectées) ; les pannes sur des produits vendus par un partenaire n'arrivent chez lui que si le partenaire les transfère à OrdiSpace.

## Structure du projet

```text
src/
├── app/
│   ├── connexion/ (verification/)
│   ├── (shell)/               # Pages avec la barre de navigation : accueil, interventions/, compte/
│   ├── rendez-vous/[id]/      # Fiche, diagnostic/, intervention/, terminer/
│   ├── clients/, boutique/, mes-infos/, modifier-profil/, notifications/
├── components/                # auth/, boutique/, compte/, interventions/, space/
├── context/                   # AuthContext
└── lib/                       # api.ts, types.ts, rendezVous.ts (statuts d'affichage), push.ts…
```

## Démarrage

Prérequis : Node.js 20+, et l'API backend lancée.

```bash
npm install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_API_URL
npm run dev -- -p 3004       # http://localhost:3004
```

Le port utilisé doit figurer dans `CORS_ALLOWED_ORIGINS` du backend. En local, sans WhatsApp configuré, le code OTP est renvoyé par l'API (`code_debug`).

### Variables d'environnement

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de base de l'API (ex. `http://127.0.0.1:8000/api/v1` en local, `https://ordisapce.daymondboutique.com/api/v1` en production) |

Aucune clé secrète ne doit se trouver dans cette app.

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |

## Déploiement

Configurer `NEXT_PUBLIC_API_URL` sur l'hébergeur (en production : `https://ordisapce.daymondboutique.com/api/v1`) et ajouter le domaine de l'app à `CORS_ALLOWED_ORIGINS` côté backend.
