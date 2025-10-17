# ⚡ Quick Start - Stripe en 15 minutes

Guide ultra-rapide pour activer les paiements Stripe et commencer à vendre.

---

## ✅ Ce qui est DÉJÀ fait (Frontend)

- ✅ Boutons d'achat configurés sur `pricing.html` et `premium.html`
- ✅ Page de succès `success.html` créée
- ✅ Script `stripe-checkout.js` intégré
- ✅ Clé publique Stripe configurée : `pk_test_516g...`

**Tu peux déjà cliquer sur "Acheter Premium" sur ton site !**

---

## 🔧 Ce qu'il reste à faire (Backend)

### Étape 1 : Récupérer ta clé secrète Stripe (2 min)

1. Va sur [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copie la **Secret key** (commence par `sk_test_...`)
3. **⚠️ Ne la partage JAMAIS publiquement !**

### Étape 2 : Intégrer le code backend (5 min)

```bash
# Dans ton repo backend
cd /chemin/vers/gplay-scraper-backend

# Ajouter la dépendance Stripe
echo "stripe>=5.0.0" >> requirements.txt

# Installer
pip install -r requirements.txt
```

Ouvre ton `app.py` et **colle tout le contenu** de `stripe-integration/stripe_endpoints.py` **AVANT** la ligne `if __name__ == '__main__':`.

### Étape 3 : Configurer les variables d'environnement (3 min)

Sur Render :

1. Dashboard > Ton service backend > **Environment**
2. Ajoute ces 2 variables :

```
STRIPE_SECRET_KEY = sk_test_VOTRE_CLE_SECRETE
FRONTEND_URL = https://votre-site.netlify.app
```

3. Clique sur **Save Changes**

Render va redéployer automatiquement.

### Étape 4 : Créer le webhook Stripe (3 min)

1. Va sur [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Clique **Add endpoint**
3. URL : `https://gplay-scraper-backend.onrender.com/api/webhook/stripe`
4. Événements : Sélectionne **`checkout.session.completed`**
5. Clique **Add endpoint**
6. Copie le **Signing secret** (commence par `whsec_...`)
7. Retourne sur Render > Environment
8. Ajoute une nouvelle variable :

```
STRIPE_WEBHOOK_SECRET = whsec_VOTRE_SECRET
```

9. Save Changes

### Étape 5 : Tester ! (2 min)

1. Va sur ton site : `https://votre-site.netlify.app/pricing.html`
2. Clique **"Acheter Premium (9,99€)"**
3. Tu es redirigé vers Stripe Checkout
4. Entre cette carte de test :
   - **Numéro** : `4242 4242 4242 4242`
   - **Expiration** : `12/25` (n'importe quelle date future)
   - **CVC** : `123` (n'importe quel 3 chiffres)
   - **Email** : ton email
5. Valide le paiement
6. Tu es redirigé vers `success.html` ✅
7. Vérifie les logs Render : tu devrais voir la génération de clé !
8. Va dans ton repo backend et ouvre `licenses.json` : ta nouvelle clé est dedans !

---

## 🧪 Carte de test Stripe

| Action | Carte |
|--------|-------|
| ✅ Paiement réussi | `4242 4242 4242 4242` |
| ❌ Paiement refusé | `4000 0000 0000 0002` |
| 🔐 3D Secure | `4000 0025 0000 3155` |

Toutes les autres infos (date, CVC, code postal) peuvent être n'importe quoi.

---

## 📧 Étape Bonus : Envoyer les emails automatiquement

Pour l'instant, la clé de licence est seulement visible dans les logs Render. Pour envoyer un vrai email :

### Option 1 : SendGrid (Gratuit jusqu'à 100 emails/jour)

```bash
# Ajouter la dépendance
echo "sendgrid>=6.0.0" >> requirements.txt
pip install -r requirements.txt
```

1. Crée un compte sur [sendgrid.com](https://sendgrid.com)
2. Crée une API Key : **Settings** > **API Keys** > **Create API Key**
3. Ajoute dans Render :
   ```
   SENDGRID_API_KEY = SG.VOTRE_CLE
   ```

4. Dans `app.py`, trouve la fonction `send_license_email()` et décommente le code SendGrid (il est déjà écrit, juste commenté).

Maintenant, après chaque paiement, un email sera automatiquement envoyé avec la clé ! 📧

---

## 🚀 Passer en Production (Mode Live)

Une fois que tout fonctionne en mode Test :

### 1. Activer ton compte Stripe

Dashboard Stripe > **Activate your account** (fournir tes infos légales)

### 2. Récupérer les clés Live

Dashboard > Switch to **Live mode** > API keys

- `pk_live_...` (publique)
- `sk_live_...` (secrète)

### 3. Mettre à jour le frontend

Dans `assets/scripts/stripe-checkout.js`, ligne 7 :
```javascript
const STRIPE_PUBLIC_KEY = 'pk_live_VOTRE_CLE_LIVE';
```

### 4. Mettre à jour Render

Variables d'environnement :
```
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_... (nouveau webhook Live)
```

### 5. Créer un nouveau webhook en mode Live

Même processus que l'étape 4, mais en mode Live.

### 6. Commit et push

```bash
git add assets/scripts/stripe-checkout.js
git commit -m "chore: switch to Stripe Live mode"
git push
```

**🎉 Voilà ! Tu peux maintenant accepter de vrais paiements !**

---

## 💰 Revenus

Pour chaque vente à **9,99€** :

- **Frais Stripe** : 0,39€ (1,4% + 0,25€)
- **Tu reçois** : **9,60€**

Les fonds arrivent sur ton compte bancaire sous 2-7 jours.

---

## 🆘 Problèmes ?

### Le bouton "Acheter Premium" ne fait rien

**Vérification** : Ouvre la console du navigateur (F12) → Tu dois voir :
```
✅ Stripe buttons initialized (3 buttons found)
```

Si tu ne vois pas ce message, le script `stripe-checkout.js` n'est pas chargé.

### Erreur "Failed to fetch"

**Cause** : Le backend ne répond pas.

**Solution** : Vérifie que Render est bien déployé et accessible.

### Webhook non reçu

**Vérification** :
1. Dashboard Stripe > Webhooks > Clique sur ton webhook
2. Onglet **Events** : tu dois voir les événements envoyés
3. Si status = "Failed", clique dessus pour voir l'erreur

### La clé n'est pas générée

**Vérification** : Logs Render

Tu dois voir :
```
[INFO] Payment successful for email@example.com
[INFO] License created: PSAP-XXXX...
```

Si tu ne vois rien, le webhook n'arrive pas au backend.

---

## 📊 Dashboard Stripe

Pour voir tes ventes :

- **Payments** : Liste de tous les paiements
- **Customers** : Liste des clients
- **Balance** : Ton solde disponible

Tout est automatique ! 🎯

---

**C'est tout ! Tu as maintenant un système de paiement professionnel et automatisé.**

Questions ? hello@playstore-analytics.pro
