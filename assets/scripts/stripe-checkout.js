/**
 * Gestion des paiements Stripe pour PlayStore Analytics Pro
 * À inclure sur les pages avec des boutons d'achat
 */

// Configuration
const STRIPE_PUBLIC_KEY = 'pk_test_516gcEPE3C1fEFRcak1XcgQfA4brYmEHCGdW3oK5bm8onVnVq1yiBUs7RwCiTOKuCpFx97ZGvRjVcNWoq9i1do5DI00j7eZfkTq';
const API_URL = 'https://gplay-scraper-backend.onrender.com'; // Remplacez par votre URL backend

/**
 * Initialise un achat Premium via Stripe
 * @param {string} plan - Le plan à acheter ('premium' par défaut)
 * @param {string} email - Email du client (optionnel)
 */
async function buyPremium(plan = 'premium', email = null) {
    try {
        // Afficher un loader sur le bouton
        const button = event?.target;
        if (button) {
            button.disabled = true;
            button.textContent = '⏳ Redirection vers Stripe...';
        }

        // Créer la session Stripe via le backend
        const response = await fetch(`${API_URL}/api/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plan: plan,
                email: email
            })
        });

        const data = await response.json();

        if (data.success && data.checkout_url) {
            // Rediriger vers Stripe Checkout
            window.location.href = data.checkout_url;
        } else {
            throw new Error(data.error || 'Erreur lors de la création de la session');
        }

    } catch (error) {
        console.error('Erreur Stripe:', error);
        alert(`❌ Erreur lors du paiement : ${error.message}\n\nVeuillez réessayer ou nous contacter à hello@playstore-analytics.pro`);

        // Réactiver le bouton
        if (button) {
            button.disabled = false;
            button.textContent = originalButtonText || 'Acheter Premium';
        }
    }
}

/**
 * Attache les event listeners aux boutons d'achat
 * Appellé automatiquement au chargement de la page
 */
function initStripeButtons() {
    // Sélectionner tous les boutons avec la classe 'buy-premium-btn'
    const buttons = document.querySelectorAll('.buy-premium-btn, [data-stripe-action="buy"]');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Récupérer le plan depuis l'attribut data-plan (par défaut: premium)
            const plan = this.getAttribute('data-plan') || 'premium';

            // Récupérer l'email depuis un input si disponible
            const emailInput = document.getElementById('customer-email');
            const email = emailInput ? emailInput.value : null;

            // Sauvegarder le texte original du bouton
            window.originalButtonText = this.textContent;

            // Lancer l'achat
            buyPremium(plan, email);
        });
    });

    console.log(`✅ Stripe buttons initialized (${buttons.length} buttons found)`);
}

// Initialiser automatiquement au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStripeButtons);
} else {
    initStripeButtons();
}

// Exporter les fonctions pour utilisation manuelle
window.buyPremium = buyPremium;
window.initStripeButtons = initStripeButtons;
