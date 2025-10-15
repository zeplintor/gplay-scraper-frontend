"""
License Validation Endpoint for Flask Backend
==============================================

Ajoutez ce code à votre fichier app.py existant.

Installation:
1. Copiez licenses.json dans le dossier racine de votre backend
2. Ajoutez ce code à la fin de app.py (avant app.run())
3. Déployez sur Render

"""

import json
from datetime import datetime
from flask import jsonify, request

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
    except Exception as e:
        app.logger.error(f"Error loading licenses: {str(e)}")
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
        return False  # En cas d'erreur, on considère non expiré

# ============================================
# ENDPOINT: /api/validate-license
# ============================================

@app.route('/api/validate-license', methods=['POST', 'OPTIONS'])
def validate_license():
    """
    Valide une clé de licence

    Request Body:
    {
        "key": "PSAP-XXXX-XXXX-XXXX-XXXX"
    }

    Response:
    {
        "success": true,
        "valid": true,
        "data": {
            "email": "user@example.com",
            "created_at": "2025-10-15T10:00:00Z",
            "expires_at": null,
            "plan": "premium"
        }
    }
    """

    # Handle OPTIONS for CORS preflight
    if request.method == 'OPTIONS':
        return '', 204

    try:
        # Récupérer la clé depuis le body
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

        # Log de la tentative de validation (sans révéler la clé complète)
        masked_key = f"{key[:9]}...{key[-4:]}" if len(key) > 13 else "***"
        app.logger.info(f"License validation attempt: {masked_key}")

        # Charger les licences
        licenses = load_licenses()

        if not licenses:
            app.logger.warning("No licenses loaded from file")
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

# ============================================
# ENDPOINT: /api/license-stats (BONUS)
# ============================================

@app.route('/api/license-stats', methods=['GET'])
def license_stats():
    """
    Statistiques sur les licences (pour admin)

    Response:
    {
        "total": 7,
        "active": 5,
        "expired": 1,
        "revoked": 1
    }
    """
    try:
        licenses = load_licenses()

        stats = {
            'total': len(licenses),
            'active': 0,
            'expired': 0,
            'revoked': 0,
            'other': 0
        }

        for lic in licenses:
            status = lic.get('status', 'active')

            if status == 'revoked':
                stats['revoked'] += 1
            elif is_license_expired(lic.get('expires_at')):
                stats['expired'] += 1
            elif status == 'active':
                stats['active'] += 1
            else:
                stats['other'] += 1

        return jsonify({
            'success': True,
            'stats': stats
        })

    except Exception as e:
        app.logger.error(f"License stats error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# ============================================
# INSTRUCTIONS D'INTÉGRATION
# ============================================

"""
ÉTAPE 1: Copiez licenses.json dans votre dossier backend (même niveau que app.py)

ÉTAPE 2: Ajoutez ce code à la fin de votre app.py (avant if __name__ == '__main__')

ÉTAPE 3: Testez localement:
    curl -X POST http://localhost:5000/api/validate-license \
         -H "Content-Type: application/json" \
         -d '{"key": "PSAP-TEST-2025-DEMO-KEY1"}'

ÉTAPE 4: Déployez sur Render
    git add licenses.json app.py
    git commit -m "Add license validation endpoint"
    git push

ÉTAPE 5: Testez en production:
    curl -X POST https://votre-backend.onrender.com/api/validate-license \
         -H "Content-Type: application/json" \
         -d '{"key": "PSAP-TEST-2025-DEMO-KEY1"}'

ÉTAPE 6: Le frontend est déjà configuré pour utiliser cet endpoint !
"""
