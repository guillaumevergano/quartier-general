# 🏛 Quartier Général

**Tableau de bord de commandement pour l'écosystème multi-agents OpenClaw.**

Interface de supervision avec identité visuelle napoléonienne, connectée à Supabase pour le suivi en temps réel des agents IA.

## Stack technique

- **Next.js 15** (App Router, SSR, TypeScript)
- **Tailwind CSS** + composants custom napoléoniens
- **Recharts** pour les graphiques
- **Supabase** (PostgreSQL, Realtime)
- **NextAuth.js** (authentification credentials)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Tableau de Campagne — Dashboard KPIs + graphiques |
| `/marechaux` | Les Maréchaux — Fiches agents |
| `/journal` | Journal de Campagne — Historique actions filtrable |
| `/tresor` | Trésor de Guerre — Suivi dépenses/tokens |
| `/depeches` | Dépêches — Alertes système |
| `/etat-major` | État-Major — Configuration |
| `/aide` | Aide de Camp — Documentation |

## Développement local

```bash
cp .env.example .env.local
# Remplir les variables Supabase + NextAuth
npm install
npm run dev
```

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (serveur uniquement) |
| `NEXTAUTH_SECRET` | Secret JWT NextAuth |
| `NEXTAUTH_URL` | URL de l'application |

## Architecture

```
VPS OpenClaw → Hook → Edge Function Supabase → PostgreSQL → Next.js (Vercel)
```

---

*Par ordre du Commandement. Vive l'Empereur ! 🦅*
