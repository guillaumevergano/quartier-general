# 🚀 **DÉPLOIEMENT QG - SECTION ARMÉE**

## ⚡ **DÉMARRAGE RAPIDE**

### **1. Configuration Supabase**
```bash
# Copier les variables d'environnement
cp .env.example .env.local

# Éditer .env.local avec vos clés Supabase :
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service
```

### **2. Migration Base de Données**
1. Ouvrir **Supabase Dashboard** → SQL Editor
2. Copier/coller le contenu de `migrations/001_create_army_members.sql`
3. Exécuter le script

### **3. Installation & Lancement**
```bash
# Installation des dépendances
npm install

# Lancement en dev
npm run dev

# Build pour production
npm run build
npm start
```

## 🎯 **POINTS DE VÉRIFICATION**

- [ ] Variables Supabase configurées
- [ ] Table `army_members` créée
- [ ] Application démarre sur http://localhost:3000
- [ ] Navigation "Armée" visible
- [ ] Cards membres s'affichent
- [ ] Modal d'édition fonctionnel

## 🔧 **TROUBLESHOOTING**

### **Erreur Supabase**
```bash
# Vérifier les variables d'environnement
cat .env.local

# Tester la connexion
npm run dev
```

### **Erreur de compilation**
```bash
# Nettoyer et réinstaller
rm -rf .next node_modules
npm install
npm run build
```

### **Migration échoue**
1. Vérifier les permissions Supabase
2. Utiliser la clé `service_role_key`
3. Exécuter ligne par ligne si nécessaire

---

**En cas de problème** : vauban@contingent.pro 🏗️