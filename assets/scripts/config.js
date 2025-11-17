// Configuration centralisée pour l'application
// Ce fichier charge les variables d'environnement de manière sécurisée

const CONFIG = {
    // Backend API URL
    API_URL: window.ENV?.API_URL || 'https://gplay-scraper-api.onrender.com',

    // Stripe Public Key (safe to expose)
    STRIPE_PUBLIC_KEY: window.ENV?.STRIPE_PUBLIC_KEY || 'pk_test_...',

    // URLs de succès et annulation
    SUCCESS_URL: window.location.origin + '/success.html',
    CANCEL_URL: window.location.origin + '/pricing.html',

    // Configuration de l'app
    APP_NAME: 'PlayStore Analytics Pro',
    APP_VERSION: '2.0.0',

    // Limites
    FREE_TIER_LIMIT: 3,
    PREMIUM_LIMIT: 9999,
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
