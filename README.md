# gplay-scraper-frontend

Interface web « PlayStore Analytics Pro » permettant de lancer des recherches d'applications Google Play et de générer des rapports premium.

## Aperçu rapide
- **Langage** : HTML/CSS/JS vanilla (fichier principal `premium.html`)
- **Hébergement** : Netlify (statique + fonctions serverless)
- **API externes** :
  - SerpApi (moteur `google_play`) pour l'autocomplétion en temps réel
  - Backend personnalisé (`https://gplay-scraper-backend.onrender.com`) pour l'analyse détaillée

## Structure du dépôt
```
├─ premium.html                  # Interface premium + logique front
├─ index.html                    # Landing de base
├─ netlify.toml                  # Configuration Netlify (répertoire des fonctions)
└─ netlify/functions/
   └─ serp-search.js             # Proxy serverless → SerpApi
```

## Fonctionnement de la recherche
1. **Saisie utilisateur** dans `#appNameSearch`.
2. Debounce (300 ms) puis appel du proxy `/.netlify/functions/serp-search`.
3. La fonction serverless interroge SerpApi (`engine=google_play`, `store=apps`, `hl=fr`, `gl=fr`, `num=8`) et renvoie une liste d'apps normalisée.
4. Si SerpApi ne renvoie rien ou renvoie une erreur, le front tente l'endpoint backend `GET /api/search-by-name?q=...`.
5. Dernier filet de secours : une liste locale d'apps populaires affichées si aucun résultat externe n'est trouvé.

### Fonction `serp-search.js`
- Utilise le module natif `https` (compatible avec l’environnement Node 16 par défaut de Netlify).
- Normalise chaque résultat SerpApi (`appId`, `title`, `developer`, `score`, `icon`).
- Retour JSON : `{ success: true, apps: [...] }`.
- Ajoute des en-têtes CORS permissifs pour que le front Netlify puisse consommer l’API.

## Variables d’environnement
- `SERPAPI_KEY` : clé SerpApi (obligatoire en production).  
  À définir dans Netlify → *Site configuration* → *Environment variables* → `Key = SERPAPI_KEY`.
- Le backend peut également utiliser ses propres variables (non gérées ici).

## Lancer le front en local
1. Installer le [Netlify CLI](https://docs.netlify.com/cli/get-started/) (une seule fois) :
   ```bash
   npm install -g netlify-cli
   ```
2. Se connecter : `netlify login`
3. Lancer l’émulateur :
   ```bash
   netlify dev
   ```
   - Les fichiers statiques sont servis sur `http://localhost:8888`.
   - La fonction `serp-search` est disponible sur `http://localhost:8888/.netlify/functions/serp-search`.
4. Créer un fichier `.env` à la racine (non commité) avec :
   ```
   SERPAPI_KEY=...votre clé...
   ```
   Netlify CLI injecte automatiquement ces variables.

## Déploiement
1. Pousser sur `main`.
2. Netlify déclenche un build statique puis publie le site (aucune compilation supplémentaire).
3. Pour forcer un déploiement : interface Netlify → onglet *Deploys* → **Trigger deploy → Deploy site**.
4. Vérifier la fonction serverless (optionnel) : `https://<site>.netlify.app/.netlify/functions/serp-search?q=test`.

## Maintenance & évolutions
- **Logs** : Netlify → *Site configuration* → *Functions* → `serp-search` → *Logs* (utile pour diagnostiquer les erreurs SerpApi).
- **Sécurité** : la clé SerpApi n’est jamais exposée côté front, elle est lue côté fonction.
- **Améliorations possibles** :
  - Créer un cache (Redis, KV) dans la fonction pour limiter les appels SerpApi.
  - Ajouter un `try/catch` plus granulaire autour du backend Render (`/api/search-by-name`) pour journaliser les 404.
  - Factoriser la logique JS dans des modules séparés si on migre vers un bundler.
  - Documenter les endpoints du backend dans un fichier dédié (`docs/backend.md` par exemple).

## Pour aller plus loin
- **Design/landing** : maquettes Figma + refonte graphique peuvent vivre dans un dossier `design/`.
- **Tests** : envisager des tests end-to-end (Playwright) pour vérifier les flux de recherche et de génération de rapport.
- **Onboarding développeur** : accorder les accès Netlify + Render + SerpApi, fournir la clé via un gestionnaire de secrets.

Pour toute question, le point d’entrée principal reste `premium.html` : rechercher `APP NAME SEARCH FUNCTIONALITY` dans le fichier pour comprendre la logique d’autocomplétion.
