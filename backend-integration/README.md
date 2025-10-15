# 🔑 Intégration du système de licences - Backend

Ce dossier contient tous les fichiers nécessaires pour intégrer la validation de licences côté backend avec votre Flask API déployée sur Render.

## 📋 Vue d'ensemble

Le système de licences fonctionne maintenant en deux couches :
- **Frontend** : Gestion de l'UI, stockage localStorage, validation de format
- **Backend** : Validation réelle des clés via API REST + fichier JSON

## 📁 Fichiers fournis

### 1. `licenses.json`
Base de données des licences au format JSON. Contient 7 clés de test :
- ✅ 5 clés actives (dont 1 avec expiration)
- ❌ 1 clé révoquée
- ⏰ 1 clé expirée

**Structure :**
```json
{
  "licenses": [
    {
      "key": "PSAP-TEST-2025-DEMO-KEY1",
      "email": "demo@playstore-analytics.pro",
      "created_at": "2025-10-15T10:00:00Z",
      "expires_at": null,
      "status": "active",
      "plan": "premium",
      "notes": "Description de la licence"
    }
  ]
}
```

### 2. `license_endpoint.py`
Code Python Flask à intégrer dans votre `app.py` existant.

**Endpoints fournis :**
- `POST /api/validate-license` - Valide une clé de licence
- `GET /api/license-stats` - Statistiques (bonus, pour admin)

## 🚀 Étapes d'intégration

### Étape 1 : Préparer votre backend local

```bash
# Clonez votre backend
git clone https://github.com/zeplintor/gplay-scraper-backend.git
cd gplay-scraper-backend

# Copiez le fichier licenses.json à la racine
cp /path/to/frontend/backend-integration/licenses.json .
```

### Étape 2 : Intégrer le code dans app.py

Ouvrez votre fichier `app.py` et ajoutez le code de `license_endpoint.py` **avant** la ligne `if __name__ == '__main__':`.

Le code comprend :
1. Deux fonctions helper : `load_licenses()` et `is_license_expired()`
2. Un endpoint principal : `/api/validate-license`
3. Un endpoint bonus : `/api/license-stats`

### Étape 3 : Tester en local

```bash
# Démarrez votre serveur Flask
python app.py

# Dans un autre terminal, testez l'endpoint
curl -X POST http://localhost:5000/api/validate-license \
     -H "Content-Type: application/json" \
     -d '{"key": "PSAP-TEST-2025-DEMO-KEY1"}'
```

**Réponse attendue :**
```json
{
  "success": true,
  "valid": true,
  "message": "Licence valide",
  "data": {
    "email": "demo@playstore-analytics.pro",
    "created_at": "2025-10-15T10:00:00Z",
    "expires_at": null,
    "plan": "premium"
  }
}
```

### Étape 4 : Déployer sur Render

```bash
# Ajoutez les fichiers au git
git add licenses.json app.py
git commit -m "feat: add license validation endpoint"
git push origin main
```

Render va automatiquement redéployer votre application.

### Étape 5 : Tester en production

```bash
# Remplacez par votre URL Render
curl -X POST https://votre-backend.onrender.com/api/validate-license \
     -H "Content-Type: application/json" \
     -d '{"key": "PSAP-TEST-2025-DEMO-KEY1"}'
```

### Étape 6 : Vérifier l'intégration frontend

Le frontend est **déjà configuré** pour utiliser cet endpoint !

Ouvrez [premium.html](../premium.html) et :
1. Cliquez sur "Gérer la licence"
2. Entrez une clé de test : `PSAP-TEST-2025-DEMO-KEY1`
3. Cliquez sur "Activer la licence"
4. Le frontend va appeler votre backend pour valider la clé

## 🔐 Clés de test disponibles

| Clé | Status | Description |
|-----|--------|-------------|
| `PSAP-TEST-2025-DEMO-KEY1` | ✅ Active | Pas d'expiration |
| `PSAP-DEMO-FREE-TRIAL-XYZ` | ✅ Active | Expire en 2026 |
| `PSAP-PROD-LIVE-FULL-ABC` | ✅ Active | Client premium |
| `PSAP-GOLD-USER-PREM-123` | ✅ Active | Utilisateur gold |
| `PSAP-ULTRA-MEGA-SUPER-XYZ` | ✅ Active | VIP lifetime |
| `PSAP-REVOKED-TEST-CANCEL` | ❌ Révoquée | Pour tester le rejet |
| `PSAP-EXPIRED-OLD-KEY-ABC` | ⏰ Expirée | Expirée en 2025-01-01 |

## 🛡️ Sécurité

### Mécanismes implémentés :
- ✅ Validation côté serveur (impossible à contourner)
- ✅ Masquage des clés dans les logs (`PSAP-TEST...KEY1`)
- ✅ Vérification du format (PSAP-XXXX-XXXX-XXXX-XXXX)
- ✅ Vérification du statut (active/revoked)
- ✅ Vérification de l'expiration (ISO 8601)
- ✅ Fallback frontend si backend indisponible
- ✅ CORS configuré pour votre domaine

### Limitations acceptables (Render Free) :
- ❌ Pas de base de données (fichier JSON suffit pour démarrage)
- ❌ Pas d'authentification admin (ajoutez plus tard si nécessaire)
- ✅ Fichier JSON versionné avec Git (acceptable pour MVP)

## 📊 Monitoring

### Vérifier les logs Render

Dans votre dashboard Render, vous verrez :
```
[2025-10-15 12:34:56] INFO License validation attempt: PSAP-TEST...KEY1
[2025-10-15 12:34:56] INFO License valid: PSAP-TEST...KEY1
```

### Endpoint de statistiques (bonus)

```bash
curl https://votre-backend.onrender.com/api/license-stats
```

**Réponse :**
```json
{
  "success": true,
  "stats": {
    "total": 7,
    "active": 5,
    "expired": 1,
    "revoked": 1,
    "other": 0
  }
}
```

## 🔄 Génération de nouvelles clés

Pour créer de nouvelles clés de licence, vous pouvez :

### Option 1 : Manuellement
```json
{
  "key": "PSAP-XXXX-XXXX-XXXX-XXXX",
  "email": "client@example.com",
  "created_at": "2025-10-15T10:00:00Z",
  "expires_at": null,
  "status": "active",
  "plan": "premium",
  "notes": "Description"
}
```

### Option 2 : Script Python (à créer)
```python
import random
import string
from datetime import datetime

def generate_license_key():
    """Génère une clé au format PSAP-XXXX-XXXX-XXXX-XXXX"""
    parts = []
    for _ in range(4):
        part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        parts.append(part)
    return f"PSAP-{'-'.join(parts)}"

# Exemple
key = generate_license_key()
print(f"Nouvelle clé : {key}")
# Output: PSAP-A3B9-K7L2-M4N8-P1Q5
```

## 🎯 Prochaines étapes (optionnelles)

### Court terme :
- [ ] Créer un script de génération de clés
- [ ] Ajouter plus de clés de test
- [ ] Documenter le processus de vente (Gumroad, etc.)

### Moyen terme :
- [ ] Migrer vers une vraie base de données (PostgreSQL sur Render)
- [ ] Ajouter un dashboard admin pour gérer les licences
- [ ] Implémenter un système de webhooks pour Gumroad
- [ ] Ajouter des analytics (qui utilise quelle clé, quand, etc.)

### Long terme :
- [ ] Système de quotas par licence (X analyses/mois)
- [ ] Licences d'équipe (plusieurs utilisateurs par clé)
- [ ] Renouvellement automatique
- [ ] API publique pour vérifier les licences depuis d'autres apps

## 🆘 Support & Dépannage

### Le frontend ne valide pas les clés

**Vérifiez :**
1. Votre backend est bien déployé sur Render
2. L'URL du backend est correcte dans `dashboard.js` (ligne ~2)
3. Les CORS sont bien configurés dans votre `app.py`
4. Le fichier `licenses.json` est bien présent à la racine du backend

**Ouvrez la console du navigateur :**
```javascript
// Devrait afficher l'URL de votre backend
console.log(API);
// Exemple : https://gplay-scraper-backend.onrender.com
```

### Erreur 503 "Service temporairement indisponible"

Le fichier `licenses.json` n'a pas été trouvé ou est invalide.

**Solution :**
```bash
# Vérifiez que le fichier existe
ls -la licenses.json

# Vérifiez que le JSON est valide
python -m json.tool licenses.json
```

### Les logs montrent "licenses.json not found"

Le fichier doit être à la **racine** du projet backend, au même niveau que `app.py`.

```
gplay-scraper-backend/
├── app.py              ← Votre code Flask
├── licenses.json       ← Doit être ici !
├── requirements.txt
└── ...
```

## 📞 Contact

Pour toute question sur l'intégration :
- 📧 Email : hello@playstore-analytics.pro
- 🐛 Issues : [GitHub Issues](https://github.com/zeplintor/gplay-scraper-backend/issues)

---

**✅ Frontend déjà configuré • ✅ Backend prêt à déployer • ✅ Clés de test fournies**
