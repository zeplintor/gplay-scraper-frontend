// Configuration
const STRIPE_PUBLIC_KEY = 'pk_test_516gcEPE3C1fEFRcak1XcgQfA4brYmEHCGdW3oK5bm8onVnVq1yiBUs7RwCiTOKuCpFx97ZGvRjVcNWoq9i1do5DI00j7eZfkTq';
const API_URL = 'https://gplay-scraper-backend.onrender.com';

async function buyPremium(plan = 'premium', email = null) {
    try {
        const button = event?.target;
        if (button) {
            button.disabled = true;
            button.textContent = '⏳ Redirection...';
        }

        const response = await fetch(`${API_URL}/api/create-checkout`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({plan: plan, email: email})
        });

        const data = await response.json();

        if (data.success && data.checkout_url) {
            window.location.href = data.checkout_url;
        } else {
            throw new Error(data.error || 'Erreur session');
        }

    } catch (error) {
        console.error('Payment error:', error);
        alert(`Erreur paiement : ${error.message}\n\nContactez hello@playstore-analytics.pro`);

        if (button) {
            button.disabled = false;
            button.textContent = originalButtonText || 'Acheter Premium';
        }
    }
}

function initStripeButtons() {
    const buttons = document.querySelectorAll('.buy-premium-btn, [data-stripe-action="buy"]');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan') || 'premium';
            const emailInput = document.getElementById('customer-email');
            const email = emailInput ? emailInput.value : null;
            window.originalButtonText = this.textContent;
            buyPremium(plan, email);
        });
    });

    console.log(`✅ Buttons initialized (${buttons.length})`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStripeButtons);
} else {
    initStripeButtons();
}

window.buyPremium = buyPremium;
window.initStripeButtons = initStripeButtons;
