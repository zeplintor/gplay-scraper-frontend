# ✅ Intégration Stripe Terminée - Configuration Finale

Le code frontend ET backend est déjà déployé sur GitHub. Il ne reste plus que **2 étapes de configuration** pour activer les paiements !

---

## 🎉 Ce qui est DÉJÀ fait

### ✅ Frontend (gplay-scraper-frontend)
- [x] Boutons "Acheter Premium" sur pricing.html et premium.html
- [x] Script stripe-checkout.js avec ta clé publique (`pk_test_516g...`)
- [x] Page success.html pour afficher la confirmation
- [x] **Commit et push : FAIT ✅**

### ✅ Backend (gplay-scraper-backend)
- [x] Dépendance `stripe>=5.0.0` ajoutée dans requirements.txt
- [x] Code Stripe intégré dans app.py (200+ lignes)
- [x] 3 endpoints créés : /api/create-checkout, /api/webhook/stripe, /api/checkout-status
- [x] Génération automatique de clés PSAP-XXXX-XXXX
- [x] Enregistrement dans licenses.json
- [x] **Commit et push : FAIT ✅**

**Render va automatiquement redéployer ton backend avec les nouvelles modifications.**

---

## 🔧 Configuration Finale (10 minutes)

### Étape 1 : Récupérer ta clé secrète Stripe (2 min)

1. Va sur [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Connecte-toi avec ton compte Stripe
3. Vérifie que tu es en mode **Test** (switch en haut à droite)
4. Copie la **Secret key** (commence par `sk_test_...`)
   - ⚠️ **NE LA PARTAGE JAMAIS !**

### Étape 2 : Configurer les variables d'environnement Render (3 min)

1. Va sur [dashboard.render.com](https://dashboard.render.com)
2. Clique sur ton service **gplay-scraper-backend**
3. Dans le menu gauche, clique sur **Environment**
4. Clique sur **Add Environment Variable**
5. Ajoute ces 2 variables :

**Variable 1 :**
```
Key: STRIPE_SECRET_KEY
Value: sk_test_VOTRE_CLE_SECRETE (celle de l'étape 1)
```

**Variable 2 :**
```
Key: FRONTEND_URL
Value: https://votre-site.netlify.app
```
*(Remplace par l'URL réelle de ton frontend déployé)*

6. Clique sur **Save Changes**

Render va automatiquement redéployer le backend avec les nouvelles variables (ça prend 2-3 minutes).

### Étape 3 : Créer le webhook Stripe (3 min)

1. Va sur [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Clique sur **Add endpoint**
3. Remplis les champs :
   - **Endpoint URL** : `https://gplay-scraper-backend.onrender.com/api/webhook/stripe`
   - **Description** : `PlayStore Analytics Pro - Génération de licences`
4. Dans **Select events to listen to**, cherche et coche :
   - ☑️ `checkout.session.completed`
5. Clique sur **Add endpoint**
6. Tu es redirigé vers les détails du webhook
7. Dans la section **Signing secret**, clique sur **Reveal**
8. Copie le secret (commence par `whsec_...`)
9. Retourne sur Render > Environment
10. Ajoute une 3ème variable :

**Variable 3 :**
```
Key: STRIPE_WEBHOOK_SECRET
Value: whsec_VOTRE_SECRET (celui que tu viens de copier)
```

11. Clique sur **Save Changes**

Render redéploie encore une fois (2-3 minutes).

### Étape 4 : Tester le paiement ! (2 min)

Attend que Render finisse de redéployer (tu verras "Live" en vert), puis :

1. Va sur ton site : `https://votre-site.netlify.app/pricing.html`
2. Clique sur **"💳 Acheter Premium (9,99€)"**
3. Tu es redirigé vers une page Stripe Checkout professionnelle
4. Entre ces informations de test :
   - **Email** : ton-email@example.com (n'importe lequel)
   - **Numéro de carte** : `4242 4242 4242 4242`
   - **Date d'expiration** : `12/25` (n'importe quelle date future)
   - **CVC** : `123` (n'importe quel 3 chiffres)
   - **Nom** : Ton nom
   - **Pays** : France
   - **Code postal** : `75001` (n'importe lequel)
5. Clique sur **Payer 9,99€**
6. Tu es redirigé vers `success.html` avec le message "✓ Paiement réussi !"

**🎉 Félicitations ! Le paiement est passé !**

### Étape 5 : Vérifier que la licence est générée (1 min)

1. Va sur [dashboard.render.com](https://dashboard.render.com)
2. Clique sur ton service **gplay-scraper-backend**
3. Clique sur **Logs** dans le menu gauche
4. Tu devrais voir ces lignes dans les derniers logs :

```
[INFO] Checkout session created: cs_test_...
[INFO] Payment successful for ton-email@example.com - License: PSAP-XXXX-XXXX-XXXX-XXXX
[INFO] License created: PSAP-XXXX...XXXX for ton-email@example.com
[INFO] EMAIL TO SEND to ton-email@example.com:
[INFO] Subject: Votre licence PlayStore Analytics Pro Premium
[INFO]
Bonjour,

Merci d'avoir acheté PlayStore Analytics Pro Premium !

Voici votre clé de licence :

PSAP-XXXX-XXXX-XXXX-XXXX
...
```

5. **IMPORTANT** : Copie la clé de licence depuis les logs (format `PSAP-XXXX-XXXX-XXXX-XXXX`)

6. Va sur GitHub : [https://github.com/zeplintor/gplay-scraper-backend/blob/main/licenses.json](https://github.com/zeplintor/gplay-scraper-backend/blob/main/licenses.json)

7. Vérifie que ta nouvelle licence est bien enregistrée :

```json
{
  "key": "PSAP-XXXX-XXXX-XXXX-XXXX",
  "email": "ton-email@example.com",
  "status": "active",
  "plan": "premium",
  "notes": "Achat Stripe le 2025-XX-XX XX:XX:XX"
}
```

**✅ Si tu vois ta clé dans les logs ET dans licenses.json, tout fonctionne parfaitement !**

### Étape 6 : Tester l'activation de la licence (1 min)

1. Va sur ton site : `https://votre-site.netlify.app/premium.html`
2. Clique sur **"Gérer la licence"**
3. Entre la clé que tu as copiée depuis les logs : `PSAP-XXXX-XXXX-XXXX-XXXX`
4. Clique sur **"Activer la licence"**
5. Tu devrais voir :
   - ✓ "Licence activée avec succès !"
   - Le modal affiche "Licence Premium Active"
   - Le statut dans le header change

**🎉 C'est parfait ! Ton système de paiement fonctionne de bout en bout !**

---

## 📧 Étape Bonus : Envoyer les emails automatiquement (Optionnel)

Pour l'instant, la clé de licence est seulement visible dans les logs Render. Pour envoyer un vrai email au client :

### Option : SendGrid (Gratuit jusqu'à 100 emails/jour)

1. Crée un compte sur [sendgrid.com](https://sendgrid.com)
2. Vérifie ton email
3. Crée une API Key :
   - Dashboard > **Settings** > **API Keys** > **Create API Key**
   - Nom : `PlayStore Analytics Pro`
   - Permissions : **Full Access**
   - Copie la clé (commence par `SG.`)
4. Ajoute dans Render > Environment :
   ```
   SENDGRID_API_KEY = SG.VOTRE_CLE
   ```
5. Ajoute la dépendance dans ton `requirements.txt` du backend :
   ```
   sendgrid>=6.0.0
   ```
6. Dans `app.py`, modifie la fonction `send_license_email()` :

```python
def send_license_email(email, license_key):
    """Envoie un email avec la clé de licence via SendGrid"""
    try:
        import sendgrid
        from sendgrid.helpers.mail import Mail

        sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))

        message = Mail(
            from_email='noreply@playstore-analytics.pro',
            to_emails=email,
            subject='Votre licence PlayStore Analytics Pro Premium',
            html_content=f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #6366f1;">Merci pour votre achat !</h1>
                    <p>Voici votre clé de licence Premium :</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; font-size: 20px; font-family: monospace; text-align: center; margin: 20px 0;">
                        <strong>{license_key}</strong>
                    </div>
                    <p><strong>Pour activer votre licence :</strong></p>
                    <ol>
                        <li>Rendez-vous sur <a href="{FRONTEND_URL}/premium.html">votre dashboard</a></li>
                        <li>Cliquez sur "Gérer la licence"</li>
                        <li>Entrez votre clé de licence</li>
                        <li>Profitez de toutes les fonctionnalités Premium !</li>
                    </ol>
                    <p>Besoin d'aide ? Répondez à cet email ou contactez-nous à hello@playstore-analytics.pro</p>
                    <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">L'équipe PlayStore Analytics Pro</p>
                </div>
            """
        )

        response = sg.send(message)
        logger.info(f"Email sent successfully to {email} (status: {response.status_code})")
        return True

    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        # Fallback : logger quand même l'email
        logger.info(f"EMAIL FALLBACK for {email}: License key = {license_key}")
        return False
```

7. Commit et push :
```bash
git add app.py requirements.txt
git commit -m "feat: ajout envoi email SendGrid"
git push origin main
```

Maintenant, après chaque paiement, un email sera automatiquement envoyé avec la clé ! 📧

---

## 🚀 Passer en Mode Production (Quand tu es prêt)

Pour accepter de vrais paiements :

### 1. Activer ton compte Stripe

1. Dashboard Stripe > **Activate your account**
2. Fournis les informations légales de ton entreprise
3. Ajoute tes coordonnées bancaires
4. Stripe vérifie ton compte (1-2 jours)

### 2. Récupérer les clés Live

1. Dashboard > Switch to **Live mode** (en haut à droite)
2. **Developers** > **API keys**
3. Copie :
   - `pk_live_...` (clé publique)
   - `sk_live_...` (clé secrète)

### 3. Mettre à jour le frontend

Modifie `assets/scripts/stripe-checkout.js` ligne 7 :
```javascript
const STRIPE_PUBLIC_KEY = 'pk_live_VOTRE_CLE_LIVE_ICI';
```

Commit et push :
```bash
git add assets/scripts/stripe-checkout.js
git commit -m "chore: switch to Stripe Live mode"
git push origin main
```

### 4. Mettre à jour Render

Dashboard Render > Environment :
```
STRIPE_SECRET_KEY = sk_live_... (nouvelle clé Live)
```

### 5. Créer un nouveau webhook en mode Live

1. Dashboard Stripe (mode **Live**) > **Webhooks** > **Add endpoint**
2. URL : `https://gplay-scraper-backend.onrender.com/api/webhook/stripe`
3. Événements : `checkout.session.completed`
4. Copie le nouveau secret (`whsec_...`)
5. Render > Environment :
   ```
   STRIPE_WEBHOOK_SECRET = whsec_... (nouveau secret Live)
   ```

### 6. Tester avec une vraie carte

⚠️ **Attention** : En mode Live, tu seras vraiment débité !

- Teste avec ta propre carte
- Vérifie que tout fonctionne
- Rembourse le paiement test : Dashboard Stripe > Payments > Refund

**🎉 Voilà ! Tu peux maintenant accepter de vrais paiements !**

---

## 💰 Finances

### Revenus par vente

**Prix de vente** : 9,99€
**Frais Stripe** : 1,4% + 0,25€ = **0,39€**
**Tu reçois** : **9,60€** (net)

Les fonds arrivent sur ton compte bancaire sous **2-7 jours**.

### Voir tes revenus

Dashboard Stripe > **Home** :
- **Balance** : Montant disponible
- **Payments** : Liste de toutes les ventes
- **Reports** : Graphiques et statistiques

---

## 📊 Statistiques & Monitoring

### Dashboard Stripe

- **Payments** : Liste des paiements
- **Customers** : Liste des clients
- **Disputes** : Litiges (remboursements)
- **Logs** : Historique des webhooks

### Logs Render

Pour chaque vente, tu verras :
```
✅ Checkout session created
✅ Payment successful
✅ License created: PSAP-XXXX...
✅ Email sent (ou logged si SendGrid pas configuré)
```

### Vérifier licenses.json

Sur GitHub : [licenses.json](https://github.com/zeplintor/gplay-scraper-backend/blob/main/licenses.json)

Toutes les licences générées sont stockées ici.

---

## ❓ Problèmes Courants

### Le bouton "Acheter Premium" ne fait rien

**Vérifications** :
1. Ouvre la console du navigateur (F12)
2. Cherche des erreurs JavaScript
3. Tu dois voir : `✅ Stripe buttons initialized (X buttons found)`

### Erreur "Failed to fetch"

**Cause** : Le backend ne répond pas.

**Solution** :
- Vérifie que Render est en "Live" (pas "Building" ou "Failed")
- Teste l'URL : `https://gplay-scraper-backend.onrender.com/`

### Le webhook ne reçoit rien

**Vérifications** :
1. Dashboard Stripe > Webhooks > Ton webhook > **Events**
2. Tu dois voir les événements envoyés
3. Si status = "Failed", clique dessus pour voir l'erreur

**Solutions courantes** :
- URL incorrecte (doit se terminer par `/api/webhook/stripe`)
- Événement non sélectionné (`checkout.session.completed`)
- Webhook en mode Test alors que tu payes en mode Live (ou inverse)

### La clé n'apparaît pas dans licenses.json

**Vérifications** :
1. Logs Render : cherche "License created"
2. Si tu vois l'erreur "Error saving license", le fichier n'est pas accessible
3. Pull les derniers changements : `git pull origin main`

---

## 🎯 Récapitulatif

### ✅ Frontend
- Code déployé sur GitHub
- Clé publique Stripe configurée
- 3 boutons "Acheter Premium" fonctionnels

### ✅ Backend
- Code déployé sur GitHub et Render
- Stripe intégré avec 3 endpoints
- Génération automatique de licences

### 🔧 À faire (Configuration uniquement)
1. Ajouter `STRIPE_SECRET_KEY` dans Render
2. Ajouter `FRONTEND_URL` dans Render
3. Créer webhook Stripe
4. Ajouter `STRIPE_WEBHOOK_SECRET` dans Render
5. Tester avec carte `4242 4242 4242 4242`

**Temps estimé** : 10 minutes

---

## 📞 Besoin d'aide ?

- **Email** : hello@playstore-analytics.pro
- **Documentation Stripe** : [stripe.com/docs](https://stripe.com/docs)
- **Support Stripe** : Très réactif, répond en quelques heures

---

**🚀 Ton système de paiement est prêt ! Il ne reste plus qu'à configurer les 3 variables d'environnement et tu pourras commencer à vendre !**
