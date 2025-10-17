# 💳 Système de Paiement Stripe - PlayStore Analytics Pro

Documentation complète pour intégrer les paiements Stripe et automatiser la génération de licences.

---

## 🎯 Vue d'ensemble

### Flow utilisateur final :

```
1. Utilisateur clique "Acheter Premium (9,99€)"
   ↓
2. Redirection vers Stripe Checkout (page sécurisée)
   ↓
3. Paiement par CB/Apple Pay/Google Pay
   ↓
4. Stripe envoie un webhook à votre backend
   ↓
5. Backend génère automatiquement une clé PSAP-XXXX-XXXX-XXXX-XXXX
   ↓
6. Backend enregistre la clé dans licenses.json
   ↓
7. Email automatique envoyé avec la clé
   ↓
8. Client entre la clé dans le modal → Premium activé ✅
```

### Avantages de cette architecture :

- ✅ **Aucun changement majeur** dans votre système existant
- ✅ **Automatisation complète** : de l'achat à l'activation
- ✅ **Sécurité maximale** : validation backend + webhook Stripe
- ✅ **Scalable** : peut gérer des milliers de transactions
- ✅ **Conforme** : Stripe gère la compliance PCI-DSS

---

## 📁 Fichiers créés

### Frontend (`/Users/mac/webprojo/gplay-scraper-frontend/`)

1. **`success.html`** - Page de confirmation après paiement
2. **`assets/scripts/stripe-checkout.js`** - Gestion des paiements côté client
3. **Modifications dans** :
   - `pricing.html` : Bouton "Acheter Premium"
   - `premium.html` : 2 boutons d'achat (modal + paywall)

### Backend (`stripe-integration/`)

1. **`stripe_endpoints.py`** - Code Python à intégrer dans `app.py`
   - Endpoint `/api/create-checkout` : Crée une session Stripe
   - Endpoint `/api/webhook/stripe` : Reçoit les paiements et génère les licences
   - Endpoint `/api/checkout-status/<session_id>` : Affiche les détails sur success.html
   - Fonction `generate_license_key()` : Génère des clés PSAP-XXXX-XXXX
   - Fonction `save_license_to_file()` : Enregistre dans licenses.json
   - Fonction `send_license_email()` : Envoie l'email (à configurer)

2. **`.env.example`** - Variables d'environnement requises

---

## 🚀 Étapes d'intégration

### Étape 1 : Créer un compte Stripe

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte (gratuit)
3. Activez le mode "Test" (switch en haut à droite)

### Étape 2 : Récupérer les clés API

#### Clé publique (déjà configurée) :
```
pk_test_516gcEPE3C1fEFRcak1XcgQfA4brYmEHCGdW3oK5bm8onVnVq1yiBUs7RwCiTOKuCpFx97ZGvRjVcNWoq9i1do5DI00j7eZfkTq
```
✅ Déjà intégrée dans `assets/scripts/stripe-checkout.js`

#### Clé secrète (à récupérer) :
1. Dashboard Stripe > Developers > API Keys
2. Copiez la **Secret key** (commence par `sk_test_...`)
3. ⚠️ **Ne la mettez JAMAIS dans Git !**

### Étape 3 : Intégrer le code backend

#### 3.1 - Installer la bibliothèque Stripe

Ajoutez dans votre `requirements.txt` :
```
stripe>=5.0.0
```

Puis sur Render ou en local :
```bash
pip install -r requirements.txt
```

#### 3.2 - Intégrer le code dans app.py

Ouvrez votre fichier `app.py` et ajoutez **AVANT** `if __name__ == '__main__'` :

```python
# Copier tout le contenu de stripe_endpoints.py
# OU importer si vous créez un fichier séparé :
from stripe_endpoints import *
```

**Option recommandée** : Copiez-collez tout le contenu de `stripe_endpoints.py` directement dans `app.py`.

### Étape 4 : Configurer les variables d'environnement

#### Sur Render :

1. Dashboard Render > Votre service backend
2. **Environment** (dans le menu gauche)
3. Ajoutez ces 3 variables :

| Clé | Valeur |
|-----|--------|
| `STRIPE_SECRET_KEY` | `sk_test_VOTRE_CLE...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (étape 5) |
| `FRONTEND_URL` | `https://votre-site.netlify.app` |

4. Cliquez sur **Save Changes** → Render redéploie automatiquement

### Étape 5 : Créer le webhook Stripe

#### 5.1 - Dans le dashboard Stripe :

1. Allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL du webhook : `https://votre-backend.onrender.com/api/webhook/stripe`
4. Événements à écouter : Sélectionnez **`checkout.session.completed`**
5. Cliquez sur **Add endpoint**

#### 5.2 - Récupérer le signing secret :

1. Cliquez sur le webhook que vous venez de créer
2. Dans la section **Signing secret**, cliquez sur **Reveal**
3. Copiez le secret (commence par `whsec_...`)
4. Ajoutez-le dans Render :
   - Variable : `STRIPE_WEBHOOK_SECRET`
   - Valeur : `whsec_...`

### Étape 6 : Tester en mode Test

#### 6.1 - Cartes de test Stripe

Utilisez ces numéros de carte pour tester (mode Test uniquement) :

| Carte | Numéro | Résultat |
|-------|--------|----------|
| **Succès** | `4242 4242 4242 4242` | Paiement réussi ✅ |
| **Échec** | `4000 0000 0000 0002` | Carte refusée ❌ |
| **3D Secure** | `4000 0025 0000 3155` | Authentification requise 🔐 |

- **Date d'expiration** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)
- **Code postal** : N'importe lequel (ex: 75001)

#### 6.2 - Tester le flow complet

1. Ouvrez votre frontend : `https://votre-site.netlify.app/pricing.html`
2. Cliquez sur **"Acheter Premium (9,99€)"**
3. Vous êtes redirigé vers Stripe Checkout
4. Entrez la carte `4242 4242 4242 4242`
5. Validez le paiement
6. Vous êtes redirigé vers `success.html`
7. Vérifiez les logs Render pour voir la génération de clé
8. Vérifiez que la clé est bien dans `licenses.json`

#### 6.3 - Vérifier les logs

Dans Render > Logs, vous devriez voir :

```
[INFO] Checkout session created: cs_test_...
[INFO] Payment successful for client@example.com - License: PSAP-A1B2...
[INFO] License created: PSAP-A1B2...G7H8 for client@example.com
[EMAIL TO SEND to client@example.com:]
Subject: Votre licence PlayStore Analytics Pro Premium
...
```

### Étape 7 : Configurer l'envoi d'emails (optionnel mais recommandé)

Actuellement, la clé de licence est seulement loggée dans la console Render. Pour envoyer un vrai email :

#### Option 1 : SendGrid (Recommandé)

1. Créez un compte sur [sendgrid.com](https://sendgrid.com) (gratuit jusqu'à 100 emails/jour)
2. Créez une clé API : **Settings** > **API Keys** > **Create API Key**
3. Ajoutez la variable d'environnement dans Render :
   - `SENDGRID_API_KEY` = votre clé
4. Décommentez le code SendGrid dans `send_license_email()` :

```python
import sendgrid
from sendgrid.helpers.mail import Mail

def send_license_email(email, license_key):
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))

    message = Mail(
        from_email='noreply@playstore-analytics.pro',
        to_emails=email,
        subject='Votre licence PlayStore Analytics Pro Premium',
        html_content=f"""
            <h1>Merci d'avoir acheté PlayStore Analytics Pro !</h1>
            <p>Voici votre clé de licence :</p>
            <h2 style="background: #f3f4f6; padding: 16px; font-family: monospace;">
                {license_key}
            </h2>
            <p><a href="{FRONTEND_URL}/premium.html">Activer ma licence maintenant</a></p>
        """
    )

    try:
        response = sg.send(message)
        app.logger.info(f"Email sent successfully to {email}")
        return True
    except Exception as e:
        app.logger.error(f"Error sending email: {str(e)}")
        return False
```

#### Option 2 : Gmail SMTP (Simple mais limité)

Utilisez `smtplib` de Python (code à ajouter dans `send_license_email()`).

### Étape 8 : Passer en mode Production

Une fois tous les tests réussis en mode Test :

#### 8.1 - Activer votre compte Stripe

1. Dashboard Stripe > **Activate your account**
2. Fournissez les infos légales de votre entreprise
3. Ajoutez vos coordonnées bancaires
4. Stripe vérifie votre compte (1-2 jours)

#### 8.2 - Basculer en mode Live

1. Dashboard Stripe > Switch to **Live mode** (en haut à droite)
2. Récupérez vos nouvelles clés **Live** :
   - `pk_live_...` (publique)
   - `sk_live_...` (secrète)
3. Créez un nouveau webhook en mode Live
4. Mettez à jour les variables d'environnement Render :
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...` (nouveau secret Live)
5. Mettez à jour `assets/scripts/stripe-checkout.js` :
   ```javascript
   const STRIPE_PUBLIC_KEY = 'pk_live_VOTRE_CLE_LIVE';
   ```

#### 8.3 - Tester avec une vraie carte

⚠️ **Attention** : En mode Live, vous serez vraiment débité !

1. Testez avec une petite somme ou avec votre propre carte
2. Vérifiez que tout fonctionne
3. Remboursez le paiement test : Dashboard Stripe > Payments > Refund

---

## 🔧 Configuration avancée

### Personnaliser la page Stripe Checkout

Dans `stripe_endpoints.py`, vous pouvez personnaliser :

```python
checkout_session = stripe.checkout.Session.create(
    payment_method_types=['card', 'paypal'],  # Ajouter PayPal
    billing_address_collection='required',     # Demander l'adresse
    customer_email=customer_email,
    locale='fr',  # Langue française
    # ... reste du code
)
```

### Ajouter des plans d'abonnement

Pour transformer le paiement unique en abonnement mensuel :

```python
# Créer un produit Stripe
stripe.Product.create(
    name='PlayStore Analytics Pro - Premium',
    description='Analyses illimitées • 65+ métriques'
)

# Créer un prix récurrent
stripe.Price.create(
    product='prod_xxx',
    unit_amount=999,  # 9,99€
    currency='eur',
    recurring={'interval': 'month'}  # Abonnement mensuel
)

# Modifier le checkout
checkout_session = stripe.checkout.Session.create(
    mode='subscription',  # Au lieu de 'payment'
    line_items=[{
        'price': 'price_xxx',  # ID du prix créé ci-dessus
        'quantity': 1
    }]
)
```

### Gérer les remboursements

Depuis le dashboard Stripe ou via API :

```python
stripe.Refund.create(payment_intent='pi_xxx')
```

N'oubliez pas de révoquer la licence dans `licenses.json` :
```json
{
  "key": "PSAP-XXXX-XXXX-XXXX-XXXX",
  "status": "revoked",  // Changer de "active" à "revoked"
  "notes": "Remboursement demandé le 2025-01-15"
}
```

---

## 📊 Monitoring et Analytics

### Dashboard Stripe

- **Payments** : Liste de tous les paiements
- **Customers** : Liste des clients
- **Reports** : Statistiques de revenus
- **Logs** : Historique des webhooks

### Logs Render

Surveillez les logs pour :
- Erreurs de validation
- Licences générées
- Emails envoyés
- Webhooks reçus

### Stripe CLI (pour debug local)

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to localhost
stripe listen --forward-to localhost:5000/api/webhook/stripe

# Déclencher un événement test
stripe trigger checkout.session.completed
```

---

## ❓ FAQ & Troubleshooting

### ❌ Erreur : "No customer email in Stripe session"

**Cause** : L'email n'est pas récupéré dans le webhook.

**Solution** : Dans `stripe_endpoints.py`, ajoutez `customer_email` dans le `create_checkout` :
```python
checkout_session = stripe.checkout.Session.create(
    customer_email=customer_email,  # Ajouter cette ligne
    # ... reste
)
```

### ❌ Erreur : "Invalid signature"

**Cause** : Le `STRIPE_WEBHOOK_SECRET` est incorrect.

**Solution** :
1. Vérifiez que le webhook est créé dans le bon environnement (Test vs Live)
2. Copiez le bon secret depuis Stripe Dashboard > Webhooks
3. Mettez à jour la variable dans Render

### ❌ Les emails ne sont pas envoyés

**Cause** : Le code `send_license_email()` ne fait que logger.

**Solution** : Intégrez SendGrid (voir Étape 7)

### ❌ Le webhook n'est jamais appelé

**Vérifications** :
1. URL du webhook correcte ? `https://votre-backend.onrender.com/api/webhook/stripe`
2. Backend déployé et accessible ?
3. Événement `checkout.session.completed` bien sélectionné ?
4. Webhook en mode Test ou Live selon votre environnement ?

**Test manuel** :
```bash
curl -X POST https://votre-backend.onrender.com/api/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type": "checkout.session.completed"}'
```

### ❌ La page success.html affiche une erreur

**Cause** : Le backend ne répond pas à `/api/checkout-status/<session_id>`.

**Solution** : Vérifiez que l'endpoint est bien intégré dans `app.py` et que Render est déployé.

---

## 📈 Prochaines étapes

Une fois le système en production :

### Court terme
- [ ] Intégrer SendGrid pour les emails automatiques
- [ ] Créer un dashboard admin pour voir les ventes
- [ ] Ajouter Google Analytics sur `success.html`
- [ ] Configurer les emails de confirmation Stripe

### Moyen terme
- [ ] Ajouter PayPal comme méthode de paiement
- [ ] Créer un plan "Équipe" (sur devis)
- [ ] Implémenter des codes promo/coupons
- [ ] Ajouter un programme d'affiliation

### Long terme
- [ ] Passer à un modèle d'abonnement récurrent
- [ ] Créer un système de facturation automatique
- [ ] Intégrer Stripe Tax pour la gestion de la TVA
- [ ] API pour gérer les licences depuis un admin panel

---

## 💰 Coûts Stripe

### Tarification Europe (France) :

- **Par transaction** : 1,4% + 0,25€
- **Exemple** :
  - Prix de vente : 9,99€
  - Frais Stripe : 0,39€ (1,4% × 9,99€ + 0,25€)
  - **Vous recevez** : 9,60€

### Pas de frais mensuels

- ✅ 0€ d'abonnement
- ✅ 0€ de setup
- ✅ Paiement seulement si vous vendez

### Paiements internationaux

- Cartes non-européennes : 2,9% + 0,25€
- Conversion de devises : +1%

---

## 🆘 Support

### Documentation Stripe
- [Stripe Docs](https://stripe.com/docs)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Python Library](https://stripe.com/docs/api?lang=python)

### Besoin d'aide ?

1. **Logs Render** : Première chose à vérifier
2. **Dashboard Stripe** > Webhooks > Logs : Voir les webhooks reçus
3. **Stripe Support** : Très réactif, répond en quelques heures
4. **Email** : hello@playstore-analytics.pro

---

## ✅ Checklist finale avant la production

- [ ] Compte Stripe activé et vérifié
- [ ] Clés Live récupérées (pk_live_... et sk_live_...)
- [ ] Variables d'environnement mises à jour dans Render
- [ ] Webhook créé en mode Live
- [ ] Frontend mis à jour avec la clé publique Live
- [ ] SendGrid configuré pour les emails
- [ ] Test avec une vraie carte effectué
- [ ] Licence générée automatiquement
- [ ] Email reçu avec la clé
- [ ] Clé activable dans le dashboard
- [ ] Page de pricing mise à jour avec les bons prix
- [ ] Mentions légales / CGV créées
- [ ] Politique de remboursement définie

---

**🎉 Félicitations !** Votre système de paiement Stripe est prêt à générer des revenus automatiquement !
