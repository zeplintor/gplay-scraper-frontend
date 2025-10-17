"""
Endpoints Stripe pour PlayStore Analytics Pro
À intégrer dans votre app.py existant
"""

import os
import stripe
import json
import secrets
import string
from datetime import datetime
from flask import jsonify, request

# ============================================
# CONFIGURATION STRIPE
# ============================================

# Ces clés doivent être définies dans les variables d'environnement Render
# Ne jamais les commit dans le code !
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')  # sk_test_...
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')  # whsec_...

# URL de votre frontend (à adapter selon votre déploiement)
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://votre-site.netlify.app')

# Prix des plans (en centimes)
PRICING = {
    'premium': {
        'amount': 999,  # 9,99€
        'currency': 'eur',
        'name': 'PlayStore Analytics Pro - Premium',
        'description': 'Analyses illimitées • 65+ métriques • Export PDF • Support prioritaire'
    }
}


# ============================================
# FONCTION : Générer une clé de licence unique
# ============================================

def generate_license_key():
    """
    Génère une clé de licence au format PSAP-XXXX-XXXX-XXXX-XXXX
    Exemple : PSAP-A3B9-K7L2-M4N8-P1Q5
    """
    parts = []
    for _ in range(4):
        # Génère 4 caractères aléatoires (lettres majuscules + chiffres)
        part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
        parts.append(part)

    return f"PSAP-{'-'.join(parts)}"


# ============================================
# FONCTION : Enregistrer une licence
# ============================================

def save_license_to_file(license_key, email, plan='premium'):
    """
    Enregistre une nouvelle licence dans licenses.json
    """
    try:
        # Charger les licences existantes
        with open('licenses.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Créer la nouvelle licence
        new_license = {
            'key': license_key,
            'email': email,
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'expires_at': None,  # Pas d'expiration pour Premium
            'status': 'active',
            'plan': plan,
            'notes': f'Achat Stripe le {datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")}'
        }

        # Ajouter à la liste
        data['licenses'].append(new_license)

        # Sauvegarder
        with open('licenses.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        app.logger.info(f"License created: {license_key[:9]}...{license_key[-4:]} for {email}")
        return True

    except Exception as e:
        app.logger.error(f"Error saving license: {str(e)}")
        return False


# ============================================
# FONCTION : Envoyer un email avec la clé
# ============================================

def send_license_email(email, license_key):
    """
    Envoie un email avec la clé de licence

    OPTIONS :
    1. SendGrid (recommandé) : https://sendgrid.com/
    2. Mailgun : https://www.mailgun.com/
    3. SMTP Gmail/Outlook
    4. Pour l'instant : Log dans la console (à remplacer)
    """

    # TODO: Intégrer un vrai service d'email
    # Pour l'instant, on log juste (visible dans les logs Render)

    email_body = f"""
    Bonjour,

    Merci d'avoir acheté PlayStore Analytics Pro Premium !

    Voici votre clé de licence :

    {license_key}

    Pour l'activer :
    1. Rendez-vous sur {FRONTEND_URL}/premium.html
    2. Cliquez sur "Gérer la licence"
    3. Entrez votre clé de licence
    4. Profitez de toutes les fonctionnalités Premium !

    Besoin d'aide ? Répondez à cet email ou contactez-nous à hello@playstore-analytics.pro

    L'équipe PlayStore Analytics Pro
    """

    app.logger.info(f"EMAIL TO SEND to {email}:")
    app.logger.info(f"Subject: Votre licence PlayStore Analytics Pro Premium")
    app.logger.info(email_body)

    # TODO: Remplacer par un vrai envoi d'email
    # Exemple avec SendGrid :
    # import sendgrid
    # sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
    # message = Mail(from_email='noreply@playstore-analytics.pro', to_emails=email, subject='...', html_content=email_body)
    # sg.send(message)

    return True


# ============================================
# ENDPOINT 1 : Créer une session Stripe Checkout
# ============================================

@app.route('/api/create-checkout', methods=['POST'])
def create_checkout_session():
    """
    Crée une session Stripe Checkout pour un achat Premium

    Body JSON attendu :
    {
        "plan": "premium",
        "email": "client@example.com" (optionnel)
    }
    """
    try:
        data = request.get_json() or {}
        plan = data.get('plan', 'premium')
        customer_email = data.get('email', None)

        if plan not in PRICING:
            return jsonify({'error': 'Plan invalide'}), 400

        plan_info = PRICING[plan]

        # Créer la session Checkout Stripe
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': plan_info['currency'],
                    'product_data': {
                        'name': plan_info['name'],
                        'description': plan_info['description'],
                    },
                    'unit_amount': plan_info['amount'],
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{FRONTEND_URL}/success.html?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/pricing.html?canceled=true",
            customer_email=customer_email,
            metadata={
                'plan': plan
            }
        )

        app.logger.info(f"Checkout session created: {checkout_session.id}")

        return jsonify({
            'success': True,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })

    except Exception as e:
        app.logger.error(f"Error creating checkout: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================
# ENDPOINT 2 : Webhook Stripe (génération auto de licence)
# ============================================

@app.route('/api/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """
    Reçoit les événements Stripe (notamment checkout.session.completed)
    et génère automatiquement une licence lors d'un paiement réussi
    """
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        # Vérifier la signature Stripe (sécurité)
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        app.logger.error(f"Invalid payload: {str(e)}")
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        app.logger.error(f"Invalid signature: {str(e)}")
        return jsonify({'error': 'Invalid signature'}), 400

    # Gérer l'événement
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        # Extraire les infos
        customer_email = session.get('customer_email') or session.get('customer_details', {}).get('email')
        plan = session.get('metadata', {}).get('plan', 'premium')

        if not customer_email:
            app.logger.error("No customer email in Stripe session")
            return jsonify({'error': 'No email'}), 400

        # Générer une clé de licence unique
        license_key = generate_license_key()

        # Enregistrer dans licenses.json
        success = save_license_to_file(license_key, customer_email, plan)

        if success:
            # Envoyer l'email avec la clé
            send_license_email(customer_email, license_key)

            app.logger.info(f"Payment successful for {customer_email} - License: {license_key}")

            return jsonify({
                'success': True,
                'message': 'License created and sent'
            })
        else:
            app.logger.error(f"Failed to save license for {customer_email}")
            return jsonify({'error': 'Failed to save license'}), 500

    # Autres événements Stripe (optionnels)
    elif event['type'] == 'payment_intent.payment_failed':
        app.logger.warning(f"Payment failed: {event['data']['object']}")

    return jsonify({'success': True})


# ============================================
# ENDPOINT 3 : Vérifier le statut d'une session (optionnel)
# ============================================

@app.route('/api/checkout-status/<session_id>', methods=['GET'])
def checkout_status(session_id):
    """
    Vérifie le statut d'une session Stripe Checkout
    Utilisé sur la page success.html pour afficher la clé
    """
    try:
        session = stripe.checkout.Session.retrieve(session_id)

        return jsonify({
            'success': True,
            'status': session.payment_status,
            'customer_email': session.customer_email or session.customer_details.get('email'),
            'amount_total': session.amount_total / 100,  # Convertir centimes en euros
            'currency': session.currency
        })

    except Exception as e:
        app.logger.error(f"Error retrieving session: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
