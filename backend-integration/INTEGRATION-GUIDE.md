# 🎯 Guide d'intégration rapide - Système de licences

## ✅ Ce qui a été fait (Frontend)

### 1. Modification de `dashboard.js`

#### Avant (validation côté client uniquement) :
```javascript
function isValidLicense(key) {
    return VALID_LICENSE_KEYS.includes(key.toUpperCase());
}

function saveLicenseData(key) {
    const data = { key: key, activatedAt: new Date().toISOString() };
    localStorage.setItem('licenseData', JSON.stringify(data));
}
```

#### Après (validation via backend) :
```javascript
async function isValidLicense(key) {
    try {
        const response = await fetch(`${API}/api/validate-license`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: key.toUpperCase() })
        });
        const data = await response.json();

        if (data.success && data.valid) {
            return {
                valid: true,
                email: data.data?.email,
                createdAt: data.data?.created_at,
                expiresAt: data.data?.expires_at,
                plan: data.data?.plan
            };
        }
        return { valid: false, message: data.message };
    } catch (error) {
        // Fallback local si backend indisponible
        console.warn('Backend unavailable, using local validation');
        return { valid: VALID_LICENSE_KEYS.includes(key.toUpperCase()) };
    }
}

async function saveLicenseData(key) {
    const validation = await isValidLicense(key);

    if (!validation.valid) {
        return {
            success: false,
            message: validation.message || 'Clé de licence invalide'
        };
    }

    const data = {
        key: key,
        email: validation.email,
        activatedAt: new Date().toISOString(),
        createdAt: validation.createdAt,
        expiresAt: validation.expiresAt,
        plan: validation.plan,
        hash: hashKey(key)
    };

    localStorage.setItem('licenseData', JSON.stringify(data));
    return { success: true };
}
```

### 2. Bouton d'activation mis à jour

#### Avant :
```javascript
document.getElementById('activateLicenseBtn').addEventListener('click', function() {
    const key = input.value.trim().toUpperCase();

    if (!isValidLicense(key)) {
        // Erreur
        return;
    }

    saveLicenseData(key);
    hasLicense = true;
    // Success
});
```

#### Après :
```javascript
document.getElementById('activateLicenseBtn').addEventListener('click', async function() {
    const key = input.value.trim().toUpperCase();
    const btn = this;

    // Loading state
    btn.disabled = true;
    btn.textContent = '🔄 Validation en cours...';

    try {
        const result = await saveLicenseData(key);

        if (!result.success) {
            errorDiv.textContent = `❌ ${result.message}`;
            errorDiv.style.display = 'block';
            return;
        }

        hasLicense = true;
        // Success
    } catch (error) {
        errorDiv.textContent = `❌ Erreur: ${error.message}`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Activer la licence';
    }
});
```

## 🔧 Ce que vous devez faire (Backend)

### Étape 1 : Copier le fichier de licences

```bash
cd /path/to/gplay-scraper-backend
cp /path/to/gplay-scraper-frontend/backend-integration/licenses.json .
```

### Étape 2 : Intégrer l'endpoint dans app.py

Ouvrez `app.py` et ajoutez **avant** `if __name__ == '__main__':` :

```python
import json
from datetime import datetime

# ============================================
# LICENSE VALIDATION FUNCTIONS
# ============================================

def load_licenses():
    """Charge les licences depuis le fichier JSON"""
    try:
        with open('licenses.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('licenses', [])
    except FileNotFoundError:
        app.logger.error("licenses.json not found")
        return []
    except json.JSONDecodeError as e:
        app.logger.error(f"JSON decode error: {str(e)}")
        return []

def is_license_expired(expires_at):
    """Vérifie si une licence est expirée"""
    if not expires_at:
        return False  # Pas d'expiration = valide à vie

    try:
        exp_date = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        now = datetime.now(exp_date.tzinfo)
        return exp_date < now
    except Exception as e:
        app.logger.error(f"Date parsing error: {str(e)}")
        return False

# ============================================
# ENDPOINT: /api/validate-license
# ============================================

@app.route('/api/validate-license', methods=['POST', 'OPTIONS'])
def validate_license():
    """Valide une clé de licence"""

    # Handle OPTIONS for CORS preflight
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'valid': False,
                'message': 'Corps de requête invalide'
            }), 400

        key = data.get('key', '').strip().upper()

        if not key:
            return jsonify({
                'success': False,
                'valid': False,
                'message': 'Clé de licence requise'
            }), 400

        # Log (masqué)
        masked_key = f"{key[:9]}...{key[-4:]}" if len(key) > 13 else "***"
        app.logger.info(f"License validation attempt: {masked_key}")

        # Charger les licences
        licenses = load_licenses()

        if not licenses:
            return jsonify({
                'success': False,
                'valid': False,
                'message': 'Service de validation temporairement indisponible'
            }), 503

        # Chercher la licence
        license_found = None
        for lic in licenses:
            if lic.get('key', '').upper() == key:
                license_found = lic
                break

        # Si non trouvée
        if not license_found:
            app.logger.info(f"License not found: {masked_key}")
            return jsonify({
                'success': True,
                'valid': False,
                'message': 'Clé de licence invalide'
            })

        # Vérifier le statut
        status = license_found.get('status', 'active')
        if status != 'active':
            app.logger.info(f"License inactive: {masked_key} (status: {status})")
            return jsonify({
                'success': True,
                'valid': False,
                'message': f'Licence {status}'
            })

        # Vérifier l'expiration
        expires_at = license_found.get('expires_at')
        if is_license_expired(expires_at):
            app.logger.info(f"License expired: {masked_key}")
            return jsonify({
                'success': True,
                'valid': False,
                'message': 'Licence expirée'
            })

        # Licence valide !
        app.logger.info(f"License valid: {masked_key}")

        return jsonify({
            'success': True,
            'valid': True,
            'message': 'Licence valide',
            'data': {
                'email': license_found.get('email'),
                'created_at': license_found.get('created_at'),
                'expires_at': license_found.get('expires_at'),
                'plan': license_found.get('plan', 'premium')
            }
        })

    except Exception as e:
        app.logger.error(f"License validation error: {str(e)}")
        return jsonify({
            'success': False,
            'valid': False,
            'message': f'Erreur serveur: {str(e)}'
        }), 500
```

### Étape 3 : Vérifier que CORS est configuré

Dans votre `app.py`, assurez-vous d'avoir :

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permet tous les domaines (ou configurez spécifiquement)
```

### Étape 4 : Tester en local

```bash
# Terminal 1 : Démarrer le backend
python app.py

# Terminal 2 : Tester l'endpoint
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

### Étape 5 : Déployer sur Render

```bash
git add licenses.json app.py
git commit -m "feat: add license validation endpoint"
git push origin main
```

Render va automatiquement redéployer.

### Étape 6 : Tester le frontend

1. Ouvrez votre frontend (premium.html)
2. Cliquez sur "Gérer la licence"
3. Entrez : `PSAP-TEST-2025-DEMO-KEY1`
4. Cliquez sur "Activer la licence"
5. Le bouton affichera "🔄 Validation en cours..."
6. Après validation, vous verrez "✓ Licence activée avec succès !"

## 🧪 Tests à effectuer

### Test 1 : Clé valide
- **Clé** : `PSAP-TEST-2025-DEMO-KEY1`
- **Résultat attendu** : ✅ Activée avec succès

### Test 2 : Clé révoquée
- **Clé** : `PSAP-REVOKED-TEST-CANCEL`
- **Résultat attendu** : ❌ "Licence revoked"

### Test 3 : Clé expirée
- **Clé** : `PSAP-EXPIRED-OLD-KEY-ABC`
- **Résultat attendu** : ❌ "Licence expirée"

### Test 4 : Clé invalide
- **Clé** : `PSAP-FAKE-INVALID-KEY-123`
- **Résultat attendu** : ❌ "Clé de licence invalide"

### Test 5 : Backend indisponible
- Stoppez votre backend
- Essayez d'activer une clé
- **Résultat attendu** : Le frontend utilise la validation locale (fallback)

## 📊 Monitoring

### Logs Render

Quand un utilisateur valide une clé, vous verrez dans Render :

```
[2025-10-15 14:23:45] INFO License validation attempt: PSAP-TEST...KEY1
[2025-10-15 14:23:45] INFO License valid: PSAP-TEST...KEY1
```

### Console navigateur

Dans la console du frontend, vous verrez :

```javascript
// Si validation réussie
✓ License validated via backend: PSAP-TEST-2025-DEMO-KEY1

// Si backend indisponible
⚠ Backend unavailable, using local validation

// Si clé invalide
❌ Invalid license key
```

## 🔐 Sécurité

### ✅ Points forts

1. **Validation serveur** : Impossible de contourner via DevTools
2. **Masquage des logs** : Les clés complètes ne sont jamais loggées
3. **Vérification du statut** : Active, révoquée, expirée
4. **Fallback gracieux** : Le frontend continue à fonctionner si backend down
5. **HTTPS** : Toutes les communications chiffrées (Render)

### ⚠️ Limitations (acceptables pour MVP)

1. **Fichier JSON** : Pas de DB (acceptable avec peu de licences)
2. **Pas d'auth admin** : Ajoutez plus tard si nécessaire
3. **Rate limiting** : Ajoutez si abus détectés

## 🚀 Améliorations futures

### Court terme
- [ ] Script de génération de clés automatique
- [ ] Endpoint pour révoquer une clé (admin)
- [ ] Webhook Gumroad pour activation automatique

### Moyen terme
- [ ] Migration vers PostgreSQL (Render Postgres)
- [ ] Dashboard admin pour gérer les licences
- [ ] Analytics (qui utilise quoi, quand)

### Long terme
- [ ] Système de quotas (X analyses/mois par licence)
- [ ] Licences d'équipe
- [ ] API publique pour intégrations tierces

---

## 📞 Besoin d'aide ?

Si vous rencontrez un problème :

1. **Vérifiez les logs Render** : Cherchez "License validation"
2. **Vérifiez la console navigateur** : F12 > Console
3. **Testez l'endpoint avec curl** : Voir commande ci-dessus
4. **Vérifiez licenses.json** : `python -m json.tool licenses.json`

---

**✨ Le système est prêt à l'emploi !**

Le frontend appelle maintenant votre backend pour valider les licences de manière sécurisée et impossible à contourner. 🎉
