# 🚀 Guide de Déploiement - PlayStore Analytics Pro Frontend

## 📋 Prérequis

- Compte Netlify
- Backend déployé sur Render
- Clés API Stripe
- Clé API SerpAPI

## 🔐 Configuration des Variables d'Environnement

### Netlify Environment Variables

Allez dans **Netlify Dashboard → Site settings → Environment variables** et ajoutez :

```env
# SerpAPI (pour la recherche d'apps)
SERPAPI_KEY=votre_clé_serpapi

# Backend API URL
VITE_API_URL=https://votre-backend.onrender.com

# Stripe (clé publique - safe pour le frontend)
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# URLs de redirection
VITE_SUCCESS_URL=https://votre-site.netlify.app/success.html
VITE_CANCEL_URL=https://votre-site.netlify.app/pricing.html
```

## 📝 Étapes de Déploiement

### 1. Connecter le Repo GitHub à Netlify

1. Connectez-vous à [Netlify](https://app.netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Sélectionnez GitHub et autorisez Netlify
4. Choisissez le repo `gplay-scraper-frontend`

### 2. Configurer le Build

- **Build command**: (laisser vide pour site statique)
- **Publish directory**: `/` (racine du projet)
- **Functions directory**: `netlify/functions`

### 3. Ajouter les Variables d'Environnement

Dans **Site settings → Environment variables**, ajoutez toutes les variables listées ci-dessus.

### 4. Déployer

Cliquez sur "Deploy site" !

## 🌐 Configuration du Domaine Personnalisé

### Option 1 : Domaine Netlify (gratuit)

Votre site sera accessible sur `https://votre-site.netlify.app`

### Option 2 : Domaine Personnalisé

1. **Netlify → Domain settings → Add custom domain**
2. Entrez votre domaine : `playstore-analytics.pro`
3. Configurez les DNS chez votre registrar :

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     votre-site.netlify.app
```

4. Netlify génère automatiquement un certificat SSL (Let's Encrypt)

## 🔗 Lier avec le Backend

Le frontend doit pointer vers votre backend Render :

1. Récupérez l'URL de votre backend : `https://gplay-scraper-api.onrender.com`
2. Ajoutez-la dans les variables d'env Netlify : `VITE_API_URL`
3. Redéployez le site

## ✅ Vérifications Post-Déploiement

### 1. Tester la Recherche d'Apps

- Allez sur `/premium.html`
- Tapez le nom d'une app dans la barre de recherche
- Vérifiez que la recherche fonctionne (utilise SerpAPI via Netlify Function)

### 2. Tester l'Analyse

- Sélectionnez une app
- Vérifiez que l'analyse s'affiche (appelle le backend)

### 3. Tester le Paiement Stripe (mode test)

- Allez sur `/pricing.html`
- Cliquez sur "Acheter Premium"
- Utilisez une carte de test Stripe : `4242 4242 4242 4242`
- Vérifiez la redirection vers la page de succès

## 🔍 Débogage

### Erreur : "Failed to fetch"

**Cause** : CORS ou backend non accessible

**Solution** :
1. Vérifiez que le backend est déployé et actif sur Render
2. Vérifiez que `ALLOWED_ORIGINS` dans le backend inclut votre domaine Netlify
3. Testez l'URL du backend directement dans le navigateur

### Erreur : "SerpAPI key missing"

**Cause** : Variable d'environnement non configurée

**Solution** :
1. Allez dans Netlify → Site settings → Environment variables
2. Ajoutez `SERPAPI_KEY`
3. Redéployez le site

### Erreur Stripe : "Invalid key"

**Cause** : Mauvaise clé publique ou non configurée

**Solution** :
1. Vérifiez que `VITE_STRIPE_PUBLIC_KEY` est définie
2. Utilisez la clé **publique** (`pk_test_...` ou `pk_live_...`)
3. Redéployez

## 📊 Monitoring

### Netlify Analytics

Activez Netlify Analytics pour voir :
- Nombre de visiteurs
- Pages les plus visitées
- Erreurs 404
- Temps de chargement

### Netlify Functions Logs

Consultez les logs des Netlify Functions :
```
Netlify Dashboard → Functions → serp-search
```

## 🔄 Mises à Jour

### Déploiement Automatique

Netlify redéploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "Update: ..."
git push origin main
```

Le site sera redéployé en ~2 minutes.

### Déploiement Manuel

Dans Netlify Dashboard :
1. **Deploys** → **Trigger deploy**
2. **Deploy site**

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `assets/styles/landing.css` :

```css
:root {
    --accent: #6366f1;        /* Couleur principale */
    --accent-purple: #8b5cf6; /* Violet */
    --accent-teal: #14b8a6;   /* Turquoise */
}
```

### Modifier les Animations

Éditez `assets/scripts/animations.js` :

```javascript
// Activer/désactiver des animations
// initParallax();        // Parallax scroll
// initTypingEffect();    // Effet typewriter
// initCustomCursor();    // Curseur personnalisé
```

## 🔒 Sécurité

✅ **Bonnes pratiques implémentées** :
- Variables d'environnement pour toutes les clés
- `.env` dans `.gitignore`
- Clés privées uniquement côté backend
- CORS restrictif sur le backend
- HTTPS obligatoire

⚠️ **À NE PAS FAIRE** :
- Committer des clés API dans Git
- Utiliser des clés secrètes Stripe côté frontend
- Exposer des tokens d'accès

## 📞 Support

- **Email** : hello@playstore-analytics.pro
- **Issues** : https://github.com/zeplintor/gplay-scraper-frontend/issues
- **Documentation Netlify** : https://docs.netlify.com

---

**Version** : 2.0
**Dernière mise à jour** : 2025-01-17
