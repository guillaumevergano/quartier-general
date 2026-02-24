# 🚀 Guide de déploiement — Quartier Général

## Prérequis

- Compte [Vercel](https://vercel.com)
- Projet Supabase configuré avec les tables (voir brief)
- Domaine `qg.contingent.pro` (optionnel)

## Déploiement sur Vercel

### 1. Connecter le repo GitHub

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer `guillaumevergano/quartier-general`
3. Framework : **Next.js** (auto-détecté)

### 2. Variables d'environnement

Configurer dans Vercel → Settings → Environment Variables :

```
NEXT_PUBLIC_SUPABASE_URL=https://hagdaqlnwpvasnkxwygz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<clé anon>
SUPABASE_SERVICE_ROLE_KEY=<clé service role>
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://qg.contingent.pro
```

### 3. Domaine custom

1. Vercel → Settings → Domains → Ajouter `qg.contingent.pro`
2. DNS : CNAME `qg` → `cname.vercel-dns.com`

### 4. Déployer

Chaque push sur `main` déclenche un déploiement automatique.

## Créer un admin

Insérer dans la table `admin_users` via Supabase SQL Editor :

```sql
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$...'); -- hash bcrypt du mot de passe
```

Générer le hash : `npx bcryptjs-cli hash "votre-mot-de-passe"`

Ou via Node.js :
```js
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('votre-mot-de-passe', 10));
```
