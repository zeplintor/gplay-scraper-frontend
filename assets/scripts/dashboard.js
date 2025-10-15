const API = 'https://gplay-scraper-backend.onrender.com';
let fullData = null;
let hasLicense = false;
const loadingEl = document.getElementById('loading');
const reportContainer = document.getElementById('reportContainer');
const exportMenu = document.getElementById('exportMenu');
const exportContainer = document.querySelector('.export-container');
const shareBtn = document.getElementById('shareBtn');
const shareMenu = document.getElementById('shareMenu');
const shareContainer = document.querySelector('.actions-dropdown');
const csvInput = document.getElementById('csvInput');
const startBatchBtn = document.getElementById('startBatchBtn');
const batchProgress = document.getElementById('batchProgress');
let batchQueue = [];
let batchRunning = false;

function fmt(n) {
    if (!n) return '0';
    if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
    return n.toString();
}

function toast(msg, type) {
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// ============================================
// LICENSE MANAGEMENT SYSTEM
// ============================================

const VALID_LICENSE_KEYS = [
    'PSAP-TEST-2025-DEMO-KEY1',
    'PSAP-DEMO-FREE-TRIAL-XYZ',
    'PSAP-PROD-LIVE-FULL-ABC',
    'PSAP-GOLD-USER-PREM-123',
    'PSAP-ULTRA-MEGA-SUPER-XYZ'
];

function hashKey(key) {
    // Simple hash for obfuscation (not cryptographic, just to avoid plain text)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        const char = key.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

function validateLicenseFormat(key) {
    // Format: PSAP-XXXX-XXXX-XXXX-XXXX (24 chars with dashes)
    const regex = /^PSAP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(key.toUpperCase());
}

function isValidLicense(key) {
    return VALID_LICENSE_KEYS.includes(key.toUpperCase());
}

function getLicenseData() {
    const data = localStorage.getItem('licenseData');
    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function saveLicenseData(key, email = 'user@example.com') {
    const data = {
        key: key,
        email: email,
        activatedAt: new Date().toISOString(),
        hash: hashKey(key)
    };
    localStorage.setItem('licenseData', JSON.stringify(data));
    localStorage.setItem('license', hashKey(key)); // For backward compatibility
}

function removeLicenseData() {
    localStorage.removeItem('licenseData');
    localStorage.removeItem('license');
}

function checkLicense() {
    const licenseData = getLicenseData();

    if (licenseData && isValidLicense(licenseData.key)) {
        hasLicense = true;
        document.getElementById('licenseStatus').innerHTML =
            '<span class="license-status">✓ Premium Actif</span>';
    } else {
        hasLicense = false;
    }

    updateStatusBanner();
}

function showLicenseModal() {
    const modal = document.getElementById('licenseModal');
    const licenseData = getLicenseData();

    if (licenseData && isValidLicense(licenseData.key)) {
        // Show active license view
        document.getElementById('noLicenseView').style.display = 'none';
        document.getElementById('activeLicenseView').style.display = 'block';

        // Populate license info
        document.getElementById('licenseEmail').textContent = licenseData.email;
        document.getElementById('licenseKey').textContent = licenseData.key;
        document.getElementById('licenseDate').textContent = new Date(licenseData.activatedAt).toLocaleDateString('fr-FR');
    } else {
        // Show activation view
        document.getElementById('noLicenseView').style.display = 'block';
        document.getElementById('activeLicenseView').style.display = 'none';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLicenseModal() {
    const modal = document.getElementById('licenseModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // Reset form
    document.getElementById('licenseKeyInput').value = '';
    document.getElementById('licenseKeyInput').className = 'license-input';
    document.getElementById('licenseError').style.display = 'none';
    document.getElementById('licenseSuccess').style.display = 'none';
}

// ============================================
// FREEMIUM SYSTEM: Daily Analysis Limit
// ============================================

function getDailyAnalysisCount() {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('dailyAnalyses') || '{}');

    if (data.date !== today) {
        // New day, reset counter
        return { date: today, count: 0 };
    }

    return data;
}

function incrementAnalysisCount() {
    const data = getDailyAnalysisCount();
    data.count++;
    localStorage.setItem('dailyAnalyses', JSON.stringify(data));
    updateStatusBanner();
    return data.count;
}

function canAnalyze() {
    if (hasLicense) return true;

    const data = getDailyAnalysisCount();
    return data.count < 3;
}

function getRemainingAnalyses() {
    if (hasLicense) return Infinity;

    const data = getDailyAnalysisCount();
    return Math.max(0, 3 - data.count);
}

function updateStatusBanner() {
    const banner = document.getElementById('statusBanner');
    if (!banner) return;

    if (hasLicense) {
        banner.className = 'status-banner premium';
        banner.innerHTML = `
            <div class="status-banner-left">
                <span class="status-icon">💎</span>
                <div class="status-text">
                    <h3>Premium Actif</h3>
                    <p>Analyses illimitées • Toutes les fonctionnalités débloquées</p>
                </div>
            </div>
        `;
    } else {
        const remaining = getRemainingAnalyses();
        banner.className = 'status-banner free';
        banner.innerHTML = `
            <div class="status-banner-left">
                <span class="status-icon">🆓</span>
                <div class="status-text">
                    <h3>Mode Gratuit</h3>
                    <p>Analyses gratuites aujourd'hui</p>
                </div>
                <span class="status-counter">${remaining}/3 restantes</span>
            </div>
            <a href="https://votresite.gumroad.com/l/playstore-pro" target="_blank" class="status-upgrade-btn">
                💎 Passer Premium
            </a>
        `;
    }
}

function showPaywall() {
    const modal = document.getElementById('paywallModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hidePaywall() {
    const modal = document.getElementById('paywallModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Paywall event listeners
document.getElementById('closePaywall')?.addEventListener('click', hidePaywall);
document.getElementById('paywallWaitTomorrow')?.addEventListener('click', hidePaywall);

// Close paywall when clicking outside
document.getElementById('paywallModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        hidePaywall();
    }
});

// ============================================
// WELCOME ONBOARDING MODAL
// ============================================

function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    localStorage.setItem('hasVisitedDashboard', 'true');
}

// Check if first visit
if (!localStorage.getItem('hasVisitedDashboard')) {
    // Show welcome modal after 500ms
    setTimeout(() => {
        showWelcomeModal();
    }, 500);
}

// Welcome modal event listeners
document.getElementById('closeWelcome')?.addEventListener('click', hideWelcomeModal);
document.getElementById('skipWelcome')?.addEventListener('click', hideWelcomeModal);
document.getElementById('startExploring')?.addEventListener('click', hideWelcomeModal);

// Quickstart buttons
document.querySelectorAll('.quickstart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const appId = this.dataset.appid;
        const appName = this.querySelector('.qs-name').textContent;

        document.getElementById('appId').value = appId;
        hideWelcomeModal();

        // Trigger analysis
        document.getElementById('searchBtn').click();

        toast(`🚀 Analyse de ${appName} lancée !`, 'success');
    });
});

// Close welcome modal when clicking outside
document.getElementById('welcomeModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        hideWelcomeModal();
    }
});

async function fetchAppData(appId) {
    const encodedId = encodeURIComponent(appId);
    const response = await fetch(`${API}/api/analyze/${encodedId}`);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (!payload.success || !payload.data) {
        throw new Error(payload.message || 'Analyse impossible pour cette application');
    }

    return payload.data;
}

// ============================================
// LICENSE MODAL EVENT LISTENERS
// ============================================

// Open license modal
document.getElementById('licenseBtn').onclick = function() {
    showLicenseModal();
};

// Close license modal
document.getElementById('closeLicense')?.addEventListener('click', hideLicenseModal);

// Close when clicking outside
document.getElementById('licenseModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        hideLicenseModal();
    }
});

// Real-time format validation
document.getElementById('licenseKeyInput')?.addEventListener('input', function(e) {
    const key = e.target.value.toUpperCase();
    e.target.value = key; // Auto uppercase

    const errorDiv = document.getElementById('licenseError');
    const successDiv = document.getElementById('licenseSuccess');

    // Clear messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (key.length === 0) {
        e.target.className = 'license-input';
        return;
    }

    if (validateLicenseFormat(key)) {
        e.target.className = 'license-input valid';
    } else {
        e.target.className = 'license-input invalid';
    }
});

// Activate license button
document.getElementById('activateLicenseBtn')?.addEventListener('click', function() {
    const input = document.getElementById('licenseKeyInput');
    const key = input.value.trim().toUpperCase();
    const errorDiv = document.getElementById('licenseError');
    const successDiv = document.getElementById('licenseSuccess');

    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validate format
    if (!validateLicenseFormat(key)) {
        errorDiv.textContent = '❌ Format invalide. Le format attendu est : PSAP-XXXX-XXXX-XXXX-XXXX';
        errorDiv.style.display = 'block';
        input.className = 'license-input invalid';
        return;
    }

    // Validate key
    if (!isValidLicense(key)) {
        errorDiv.textContent = '❌ Clé de licence invalide. Vérifiez votre clé ou contactez le support.';
        errorDiv.style.display = 'block';
        input.className = 'license-input invalid';
        return;
    }

    // Success - activate license
    saveLicenseData(key);
    hasLicense = true;

    successDiv.textContent = '✓ Licence activée avec succès !';
    successDiv.style.display = 'block';
    input.className = 'license-input valid';

    // Update UI
    checkLicense();
    if (fullData) generateReport(fullData);

    // Show success toast and close modal after delay
    toast('✓ Licence Premium activée !', 'success');

    setTimeout(() => {
        hideLicenseModal();
        showLicenseModal(); // Reopen to show active view
    }, 1500);
});

// Deactivate license button
document.getElementById('deactivateLicenseBtn')?.addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir désactiver votre licence Premium ?')) {
        removeLicenseData();
        hasLicense = false;
        checkLicense();

        toast('Licence désactivée', 'success');
        hideLicenseModal();

        // Regenerate report if there's data
        if (fullData) generateReport(fullData);
    }
});

// Test keys - click to copy
document.querySelectorAll('.test-key').forEach(keyElement => {
    keyElement.addEventListener('click', function() {
        const key = this.dataset.key;
        document.getElementById('licenseKeyInput').value = key;
        document.getElementById('licenseKeyInput').dispatchEvent(new Event('input'));
        toast('✓ Clé copiée dans le champ', 'success');
    });
});

document.getElementById('searchBtn').onclick = async function() {
    const id = document.getElementById('appId').value.trim();
    if (!id) {
        toast('Veuillez entrer un ID d\'application', 'error');
        return;
    }

    // ✅ Check freemium limit BEFORE analyzing
    if (!canAnalyze()) {
        showPaywall();
        toast('Limite gratuite atteinte (3/jour)', 'error');
        return;
    }

    if (loadingEl) loadingEl.style.display = 'block';
    if (reportContainer) reportContainer.innerHTML = '';

    try {
        const data = await fetchAppData(id);
        fullData = data;

        // ✅ Increment counter AFTER successful analysis
        if (!hasLicense) {
            incrementAnalysisCount();
        }

        generateReport(data);
        toast('Analyse terminée', 'success');
    } catch (e) {
        console.error('Analyse error:', e);
        toast('Erreur: ' + e.message, 'error');
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
};

function generateReport(data) {
    const container = document.getElementById('reportContainer');
    const histogram = data.histogram || [0,0,0,0,0];
    const maxHist = Math.max(...histogram);

    let html = '';

    // Hero Card
    html += `
        <div class="card">
            <div class="app-hero">
                <img class="app-icon-large" src="${data.icon || ''}" alt="App Icon">
                <div class="app-info">
                    <h1 class="app-title">${data.title || 'N/A'}</h1>
                    <p class="app-developer">${data.developer || 'N/A'}</p>
                    <div class="app-badges">
                        <span class="badge">${data.genre || 'N/A'}</span>
                        <span class="badge free">${data.free ? 'Gratuit' : '$' + (data.price || 'N/A')}</span>
                        ${data.score ? `<span class="badge rating">${data.score.toFixed(1)} ⭐</span>` : ''}
                        ${data.contentRating ? `<span class="badge">${data.contentRating}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Section 1: Statistiques Principales
    html += `
        <div class="card">
            <div class="section-title">
                <span class="section-icon">📊</span>
                Statistiques Principales
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Note Moyenne</div>
                    <div class="stat-value">${data.score ? data.score.toFixed(1) : 'N/A'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Nombre d'Avis</div>
                    <div class="stat-value">${fmt(data.ratings || 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Installations</div>
                    <div class="stat-value">${data.installs || 'N/A'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Reviews Totales</div>
                    <div class="stat-value">${fmt(data.reviews || 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Installs Réelles</div>
                    <div class="stat-value">${fmt(data.realInstalls || 0)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Installs/Jour</div>
                    <div class="stat-value">${fmt(data.dailyInstalls || 0)}</div>
                </div>
            </div>
        </div>
    `;

    // Section 2: Distribution des Notes
    html += `
        <div class="card">
            <div class="section-title">
                <span class="section-icon">⭐</span>
                Distribution des Notes
            </div>
            <div class="chart-container">
                <div class="bar-chart">
    `;
    for (let i = 0; i < 5; i++) {
        const height = maxHist > 0 ? (histogram[i] / maxHist) * 100 : 0;
        html += `
            <div class="bar" style="height:${height}%">
                <div class="bar-value">${fmt(histogram[i])}</div>
                <div class="bar-label">${i + 1} ★</div>
            </div>
        `;
    }
    html += `
                </div>
            </div>
        </div>
    `;

    // Section 3: Informations Temporelles
    html += `
        <div class="card">
            <div class="section-title">
                <span class="section-icon">📅</span>
                Informations Temporelles
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Date de Sortie</div>
                    <div class="info-value">${data.released || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Dernière MAJ</div>
                    <div class="info-value">${data.lastUpdated || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Âge (jours)</div>
                    <div class="info-value">${data.appAgeDays || 0}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Version</div>
                    <div class="info-value">${data.version || 'N/A'}</div>
                </div>
            </div>
        </div>
    `;

    // Section 4: Informations Techniques (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">🔧</span>
                    Informations Techniques
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Android Min</div>
                        <div class="info-value">API ${data.minAndroidApi || '?'}+</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Android Max</div>
                        <div class="info-value">API ${data.maxAndroidApi || '?'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">App Bundle</div>
                        <div class="info-value">${data.appBundle ? '✓ Oui' : '✗ Non'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Publicités</div>
                        <div class="info-value">${data.adSupported ? '✓ Oui' : '✗ Non'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Achats Intégrés</div>
                        <div class="info-value">${data.offersIAP ? '✓ Oui' : '✗ Non'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Prix IAP</div>
                        <div class="info-value">${data.inAppProductPrice || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Section 5: Informations Développeur (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">👨‍💻</span>
                    Informations Développeur
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Developer ID</div>
                        <div class="info-value" style="font-size:0.8125rem;">${data.developerId || 'N/A'}</div>
                    </div>
                    <div class="info-item" style="grid-column:span 2;">
                        <div class="info-label">Email</div>
                        <div class="info-value" style="font-size:0.875rem;">${data.developerEmail || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Website</div>
                        <div class="info-value">${data.developerWebsite ? '✓ Disponible' : 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Privacy Policy</div>
                        <div class="info-value">${data.privacyPolicy ? '✓ Oui' : '✗ Non'}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Section 6: SEO & ASO (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">🔍</span>
                    Analyse SEO & ASO
                </div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Mots-Clés Uniques</div>
                        <div class="info-value">${data.uniqueKeywords || 0}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Mots</div>
                        <div class="info-value">${data.totalWords || 0}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Score Lisibilité</div>
                        <div class="info-value">${data.readability?.flesch_score?.toFixed(1) || 'N/A'}</div>
                    </div>
                </div>
    `;

    if (data.topKeywords && Object.keys(data.topKeywords).length > 0) {
        html += `
            <div class="keywords-container">
                <div class="keywords-title">Top Keywords</div>
                <div class="keywords-grid">
        `;
        const topK = Object.entries(data.topKeywords).slice(0, 10);
        topK.forEach(([key, val]) => {
            html += `<span class="keyword-tag">${key} (${val})</span>`;
        });
        html += `</div></div>`;
    }

    if (data.topBigrams && Object.keys(data.topBigrams).length > 0) {
        html += `
            <div class="keywords-container">
                <div class="keywords-title" style="color:#8b5cf6;">Top Bigrams</div>
                <div class="keywords-grid">
        `;
        const topB = Object.entries(data.topBigrams).slice(0, 8);
        topB.forEach(([key, val]) => {
            html += `<span class="keyword-tag bigram">${key} (${val})</span>`;
        });
        html += `</div></div>`;
    }

    html += `</div></div>`;

    // Section 7: Médias (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">🖼️</span>
                    Médias & Visuels
                </div>
    `;

    if (data.screenshots && data.screenshots.length > 0) {
        html += `
            <div>
                <div style="font-weight:600;font-size:0.875rem;color:#6b7280;margin-bottom:12px;">Screenshots (${data.screenshots.length})</div>
                <div class="screenshots-grid">
        `;
        data.screenshots.slice(0, 6).forEach(url => {
            html += `<img src="${url}" class="screenshot-img" alt="Screenshot">`;
        });
        html += `</div></div>`;
    }

    if (data.headerImage) {
        html += `
            <div style="margin-top:24px;">
                <div style="font-weight:600;font-size:0.875rem;color:#6b7280;margin-bottom:12px;">Header Image</div>
                <img src="${data.headerImage}" class="header-image" alt="Header">
            </div>
        `;
    }

    html += `</div></div>`;

    // Section 8: Permissions (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">🔐</span>
                    Permissions & Sécurité
                </div>
    `;

    if (data.permissions && Object.keys(data.permissions).length > 0) {
        html += `<div>`;
        for (let perm in data.permissions) {
            html += `
                <div class="permission-item">
                    <div class="permission-category">${perm}</div>
                    <ul class="permission-list">
            `;
            data.permissions[perm].forEach(p => {
                html += `<li>${p}</li>`;
            });
            html += `</ul></div>`;
        }
        html += `</div>`;
    }

    html += `</div></div>`;

    // Section 9: Reviews (PREMIUM)
    html += `
        <div class="card section ${!hasLicense ? 'premium' : ''}">
            ${!hasLicense ? '<div class="unlock-overlay"><div class="unlock-icon">🔒</div><div class="unlock-text">Section Premium</div><div class="unlock-price">9,99€</div></div>' : ''}
            <div class="card-content">
                <div class="section-title">
                    <span class="section-icon">💬</span>
                    Reviews Récentes
                </div>
    `;

    if (data.reviewsData && data.reviewsData.length > 0) {
        data.reviewsData.slice(0, 3).forEach(review => {
            html += `
                <div class="review-card">
                    <div class="review-header">
                        ${review.avatar ? `<img src="${review.avatar}" class="review-avatar" alt="Avatar">` : ''}
                        <div>
                            <div class="review-user">${review.user || 'Utilisateur'}</div>
                            <div class="review-stars">${'⭐'.repeat(review.rating || 0)}</div>
                        </div>
                    </div>
                    <p class="review-text">${review.text || ''}</p>
                    ${review.version ? `<div class="review-meta">Version: ${review.version}</div>` : ''}
                </div>
            `;
        });
    } else {
        html += `<p style="text-align:center;color:#9ca3af;font-size:0.875rem;">Aucune review disponible</p>`;
    }

    html += `</div></div>`;

    // CTA Final
    if (!hasLicense) {
        html += `
            <div class="cta-final">
                <h2>Débloquez TOUTES les Données Premium</h2>
                <div class="cta-price">9,99€</div>
                <p style="font-size:1.125rem;margin:16px 0;font-weight:500;">
                    65+ Métriques • Screenshots • Reviews • Keywords • Permissions
                </p>
                <ul class="features-premium">
                    <li>Statistiques détaillées</li>
                    <li>Analyse ASO complète</li>
                    <li>Keywords & bigrams</li>
                    <li>Screenshots complets</li>
                    <li>Reviews avec avatars</li>
                    <li>Permissions détaillées</li>
                    <li>Export PDF professionnel</li>
                    <li>Support prioritaire</li>
                </ul>
                <div class="cta-buttons">
                    <a href="https://votresite.gumroad.com/l/playstore-pro" target="_blank">
                        <button class="cta-btn-primary">Acheter sur Gumroad</button>
                    </a>
                </div>
                <p class="guarantee">
                    ✓ Paiement sécurisé • Accès instantané • Garantie 30 jours
                </p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============ EXPORT & SHARE FUNCTIONS ============

const exportBtn = document.getElementById('exportBtn');
if (exportBtn && exportMenu) {
    exportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        exportMenu.classList.toggle('active');
    });
}

if (shareBtn && shareMenu) {
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        shareMenu.classList.toggle('active');
    });
}

document.addEventListener('click', function(e) {
    if (exportMenu && exportContainer && !exportContainer.contains(e.target)) {
        exportMenu.classList.remove('active');
    }

    if (shareMenu && shareContainer && !shareContainer.contains(e.target)) {
        shareMenu.classList.remove('active');
    }
});

document.querySelectorAll('.export-menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const format = this.dataset.format;
        if (exportMenu) exportMenu.classList.remove('active');

        if (!fullData) {
            toast('Veuillez d\'abord analyser une application', 'error');
            return;
        }

        handleExport(format);
    });
});

document.querySelectorAll('.share-menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const action = this.dataset.share;
        if (shareMenu) shareMenu.classList.remove('active');
        handleShare(action);
    });
});

async function handleExport(format) {
    toast('Génération en cours...', 'success');

    try {
        switch(format) {
            case 'json':
                exportJSON();
                break;
            case 'csv':
                exportCSV();
                break;
            case 'pdf':
                await exportPDF();
                break;
            case 'png':
                await exportPNG();
                break;
            case 'html':
                exportHTML();
                break;
        }
        setTimeout(() => toast('Export réussi', 'success'), 500);
    } catch(e) {
        toast('Erreur lors de l\'export: ' + e.message, 'error');
        console.error('Export error:', e);
    }
}

function handleShare(action) {
    if (!fullData) {
        toast('Analysez une application avant de partager', 'error');
        return;
    }

    if (action === 'email') {
        const subject = encodeURIComponent(`Rapport PlayStore – ${fullData.title || fullData.appId || 'Application'}`);
        const summary = buildReportSummary();
        const body = encodeURIComponent(summary + '\n\nGénéré avec PlayStore Analytics Pro.');
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        return;
    }

    if (action === 'clipboard') {
        const summary = buildReportSummary();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summary)
                .then(() => toast('Résumé copié dans le presse-papiers', 'success'))
                .catch(() => fallbackCopy(summary));
        } else {
            fallbackCopy(summary);
        }
    }
}

function buildReportSummary() {
    const appIdInput = document.getElementById('appId');
    const appId = fullData.appId || (appIdInput ? appIdInput.value : '');
    const lines = [
        `Rapport PlayStore – ${fullData.title || appId || 'Application'}`,
        `ID : ${appId || 'N/A'}`,
        `Note moyenne : ${fullData.score ? fullData.score.toFixed(1) : 'N/A'}`,
        `Avis : ${fmt(fullData.ratings || 0)}`,
        `Installations : ${fullData.installs || 'N/A'}`,
        fullData.genre ? `Catégorie : ${fullData.genre}` : null,
        appId ? `Lien : https://play.google.com/store/apps/details?id=${appId}` : null
    ].filter(Boolean);
    return lines.join('\n');
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-1000px';
    textarea.style.top = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        toast('Résumé copié dans le presse-papiers', 'success');
    } catch (err) {
        toast('Impossible de copier automatiquement', 'error');
    } finally {
        document.body.removeChild(textarea);
    }
}

function exportJSON() {
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            appId: document.getElementById('appId').value,
            hasLicense: hasLicense,
            version: '1.0'
        },
        data: fullData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(blob, `${fullData.title || 'app'}_data.json`);
}

function exportCSV() {
    const data = fullData;
    let csv = 'Métrique,Valeur,Catégorie\n';

    csv += `Note moyenne,${data.score || 'N/A'},Statistiques\n`;
    csv += `Nombre d'avis,${data.ratings || 0},Statistiques\n`;
    csv += `Installations,${data.installs || 'N/A'},Statistiques\n`;
    csv += `Reviews totales,${data.reviews || 0},Statistiques\n`;
    csv += `Installations réelles,${data.realInstalls || 0},Statistiques\n`;
    csv += `Installations/jour,${data.dailyInstalls || 0},Statistiques\n`;
    csv += `Date de sortie,${data.released || 'N/A'},Temporel\n`;
    csv += `Dernière MAJ,${data.lastUpdated || 'N/A'},Temporel\n`;
    csv += `Âge (jours),${data.appAgeDays || 0},Temporel\n`;
    csv += `Version actuelle,${data.version || 'N/A'},Temporel\n`;

    if (hasLicense) {
        csv += `Android minimum,API ${data.minAndroidApi || '?'},Technique\n`;
        csv += `Publicités,${data.adSupported ? 'Oui' : 'Non'},Technique\n`;
        csv += `Achats intégrés,${data.offersIAP ? 'Oui' : 'Non'},Technique\n`;
        csv += `Mots-clés uniques,${data.uniqueKeywords || 0},SEO\n`;
        csv += `Total mots,${data.totalWords || 0},SEO\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${data.title || 'app'}_stats.csv`);
}

// EXPORT PDF AMÉLIORÉ ET COMPLET
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const data = fullData;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 20;

    // PAGE DE GARDE
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('PlayStore Analytics Pro', pageWidth/2, 30, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('Rapport Premium Détaillé', pageWidth/2, 45, { align: 'center' });

    // Watermark pour version gratuite
    if (!hasLicense) {
        doc.setTextColor(239, 68, 68);
        doc.setFontSize(50);
        doc.setFont(undefined, 'bold');
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.text('VERSION GRATUITE', pageWidth/2, pageHeight/2, {
            align: 'center',
            angle: 45
        });
        doc.restoreGraphicsState();
    }

    yPos = 75;
    doc.setTextColor(0, 0, 0);

    // Info App
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text(data.title || 'N/A', margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Développeur: ${data.developer || 'N/A'}`, margin, yPos);
    yPos += 7;
    doc.text(`Genre: ${data.genre || 'N/A'}`, margin, yPos);
    yPos += 7;
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);
    yPos += 15;

    // TABLE DES MATIÈRES
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('Table des Matières', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    const toc = [
        '1. Statistiques Principales',
        '2. Distribution des Notes',
        '3. Informations Temporelles',
        '4. Informations Techniques (Premium)',
        '5. Informations Développeur (Premium)',
        '6. Analyse SEO & ASO (Premium)',
        '7. Médias & Visuels (Premium)',
        '8. Permissions & Sécurité (Premium)',
        '9. Reviews Récentes (Premium)'
    ];

    toc.forEach(item => {
        if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(item, margin + 5, yPos);
        yPos += 6;
    });

    // NOUVELLE PAGE - STATISTIQUES PRINCIPALES
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('1. Statistiques Principales', margin, yPos);
    yPos += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Stats en colonnes (2 colonnes)
    const stats = [
        ['Note moyenne', `${data.score?.toFixed(1) || 'N/A'} ⭐`],
        ['Nombre d\'avis', fmt(data.ratings || 0)],
        ['Installations', data.installs || 'N/A'],
        ['Reviews totales', fmt(data.reviews || 0)],
        ['Installations réelles', fmt(data.realInstalls || 0)],
        ['Installations/jour', fmt(data.dailyInstalls || 0)],
        ['Installations/mois', fmt(data.monthlyInstalls || 0)],
        ['Installations min', fmt(data.minInstalls || 0)]
    ];

    const colWidth = (pageWidth - 2 * margin) / 2;
    let col = 0;
    let baseY = yPos;

    stats.forEach(([label, value], idx) => {
        if (idx > 0 && idx % 4 === 0) {
            col = 1;
            yPos = baseY;
        }

        const xPos = margin + (col * colWidth);

        // Box pour chaque stat
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(xPos, yPos - 5, colWidth - 5, 12, 2, 2, 'F');
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(xPos, yPos - 5, colWidth - 5, 12, 2, 2, 'S');

        doc.setFont(undefined, 'bold');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text(label.toUpperCase(), xPos + 3, yPos);

        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.setTextColor(99, 102, 241);
        doc.text(String(value), xPos + 3, yPos + 5);

        yPos += 14;
    });

    yPos = baseY + (4 * 14) + 10;

    // DISTRIBUTION DES NOTES (GRAPHIQUE)
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('2. Distribution des Notes', margin, yPos);
    yPos += 12;

    const histogram = data.histogram || [0,0,0,0,0];
    const maxHist = Math.max(...histogram);
    const chartWidth = pageWidth - 2 * margin;
    const chartHeight = 50;
    const barWidth = chartWidth / 5 - 4;

    for (let i = 0; i < 5; i++) {
        const barHeight = maxHist > 0 ? (histogram[i] / maxHist) * chartHeight : 0;
        const xBar = margin + (i * (barWidth + 4));
        const yBar = yPos + chartHeight - barHeight;

        // Dessiner barre
        doc.setFillColor(99, 102, 241);
        doc.roundedRect(xBar, yBar, barWidth, barHeight, 2, 2, 'F');

        // Valeur au-dessus
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(fmt(histogram[i]), xBar + barWidth/2, yBar - 3, { align: 'center' });

        // Label en-dessous
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text(`${i + 1} ★`, xBar + barWidth/2, yPos + chartHeight + 5, { align: 'center' });
    }

    yPos += chartHeight + 15;

    // INFORMATIONS TEMPORELLES
    if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(99, 102, 241);
    doc.text('3. Informations Temporelles', margin, yPos);
    yPos += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const temporal = [
        ['Date de sortie', data.released || 'N/A'],
        ['Dernière MAJ', data.lastUpdated || 'N/A'],
        ['Âge de l\'app', `${data.appAgeDays || 0} jours`],
        ['Version actuelle', data.version || 'N/A']
    ];

    temporal.forEach(([label, value]) => {
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'F');
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'S');

        doc.setFont(undefined, 'bold');
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        doc.text(label, margin + 3, yPos);

        doc.setFont(undefined, 'normal');
        doc.setTextColor(17, 24, 39);
        doc.text(value, margin + 60, yPos);

        yPos += 12;
    });

    // SECTIONS PREMIUM (si licence active)
    if (hasLicense) {
        // INFORMATIONS TECHNIQUES
        doc.addPage();
        yPos = 20;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('4. Informations Techniques', margin, yPos);
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        const technical = [
            ['Android minimum', `API ${data.minAndroidApi || '?'}+`],
            ['Android maximum', `API ${data.maxAndroidApi || '?'}`],
            ['Version Android', data.androidVersion || 'N/A'],
            ['App Bundle', data.appBundle ? 'Oui' : 'Non'],
            ['Publicités', data.adSupported ? 'Oui' : 'Non'],
            ['Contient des Ads', data.containsAds ? 'Oui' : 'Non'],
            ['Achats intégrés', data.offersIAP ? 'Oui' : 'Non'],
            ['Prix IAP', data.inAppProductPrice || 'N/A']
        ];

        technical.forEach(([label, value]) => {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFillColor(249, 250, 251);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'S');

            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            doc.text(label, margin + 3, yPos);

            doc.setFont(undefined, 'normal');
            doc.setTextColor(17, 24, 39);
            doc.text(String(value), margin + 60, yPos);

            yPos += 12;
        });

        // DÉVELOPPEUR
        yPos += 8;
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('5. Informations Développeur', margin, yPos);
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        const devInfo = [
            ['Developer ID', data.developerId || 'N/A'],
            ['Email', data.developerEmail || 'N/A'],
            ['Website', data.developerWebsite ? 'Disponible' : 'N/A'],
            ['Privacy Policy', data.privacyPolicy ? 'Oui' : 'Non']
        ];

        devInfo.forEach(([label, value]) => {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFillColor(249, 250, 251);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'S');

            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            doc.text(label, margin + 3, yPos);

            doc.setFont(undefined, 'normal');
            doc.setTextColor(17, 24, 39);
            doc.setFontSize(8);
            const maxWidth = pageWidth - margin - 70;
            const splitValue = doc.splitTextToSize(String(value), maxWidth);
            doc.text(splitValue, margin + 60, yPos);

            yPos += 12;
        });

        // SEO & ASO
        doc.addPage();
        yPos = 20;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('6. Analyse SEO & ASO', margin, yPos);
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        const seoInfo = [
            ['Mots-clés uniques', String(data.uniqueKeywords || 0)],
            ['Total mots', String(data.totalWords || 0)],
            ['Score lisibilité', data.readability?.flesch_score?.toFixed(1) || 'N/A'],
            ['Niveau lecture', data.readability?.flesch_level || 'N/A']
        ];

        seoInfo.forEach(([label, value]) => {
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'F');
            doc.setDrawColor(229, 231, 235);
            doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 10, 2, 2, 'S');

            doc.setFont(undefined, 'bold');
            doc.setFontSize(9);
            doc.setTextColor(107, 114, 128);
            doc.text(label, margin + 3, yPos);

            doc.setFont(undefined, 'normal');
            doc.setTextColor(17, 24, 39);
            doc.text(value, margin + 60, yPos);

            yPos += 12;
        });

        // TOP KEYWORDS
        if (data.topKeywords && Object.keys(data.topKeywords).length > 0) {
            yPos += 8;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('Top Keywords', margin, yPos);
            yPos += 8;

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);

            const topK = Object.entries(data.topKeywords).slice(0, 15);
            let xKeyword = margin;
            let keywordLine = yPos;

            topK.forEach(([key, val], idx) => {
                const text = `${key} (${val})`;
                const textWidth = doc.getTextWidth(text) + 8;

                if (xKeyword + textWidth > pageWidth - margin) {
                    xKeyword = margin;
                    keywordLine += 8;
                }

                if (keywordLine > pageHeight - 20) {
                    doc.addPage();
                    keywordLine = 20;
                    xKeyword = margin;
                }

                doc.setFillColor(99, 102, 241);
                doc.roundedRect(xKeyword, keywordLine - 5, textWidth, 6, 1, 1, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text(text, xKeyword + 4, keywordLine);

                xKeyword += textWidth + 3;
            });

            yPos = keywordLine + 8;
        }

        // TOP BIGRAMS
        if (data.topBigrams && Object.keys(data.topBigrams).length > 0) {
            yPos += 8;
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(139, 92, 246);
            doc.text('Top Bigrams', margin, yPos);
            yPos += 8;

            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            const topB = Object.entries(data.topBigrams).slice(0, 10);
            let xBigram = margin;
            let bigramLine = yPos;

            topB.forEach(([key, val]) => {
                const text = `${key} (${val})`;
                const textWidth = doc.getTextWidth(text) + 8;

                if (xBigram + textWidth > pageWidth - margin) {
                    xBigram = margin;
                    bigramLine += 8;
                }

                if (bigramLine > pageHeight - 20) {
                    doc.addPage();
                    bigramLine = 20;
                    xBigram = margin;
                }

                doc.setFillColor(139, 92, 246);
                doc.roundedRect(xBigram, bigramLine - 5, textWidth, 6, 1, 1, 'F');
                doc.setTextColor(255, 255, 255);
                doc.text(text, xBigram + 4, bigramLine);

                xBigram += textWidth + 3;
            });

            yPos = bigramLine + 8;
        }

        // MÉDIAS
        doc.addPage();
        yPos = 20;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('7. Médias & Visuels', margin, yPos);
        yPos += 12;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        doc.text(`Screenshots: ${data.screenshots?.length || 0}`, margin, yPos);
        yPos += 7;
        doc.text(`Header Image: ${data.headerImage ? 'Disponible' : 'Non disponible'}`, margin, yPos);
        yPos += 7;
        doc.text(`Vidéo: ${data.video ? 'Disponible' : 'Non disponible'}`, margin, yPos);

        // PERMISSIONS
        if (data.permissions && Object.keys(data.permissions).length > 0) {
            doc.addPage();
            yPos = 20;

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('8. Permissions & Sécurité', margin, yPos);
            yPos += 12;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);

            for (let perm in data.permissions) {
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFont(undefined, 'bold');
                doc.setTextColor(245, 158, 11);
                doc.text(perm, margin, yPos);
                yPos += 7;

                doc.setFont(undefined, 'normal');
                doc.setFontSize(9);
                doc.setTextColor(107, 114, 128);

                data.permissions[perm].forEach(p => {
                    if (yPos > pageHeight - 15) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(`• ${p}`, margin + 5, yPos);
                    yPos += 5;
                });

                yPos += 5;
                doc.setFontSize(10);
            }
        }

        // REVIEWS
        if (data.reviewsData && data.reviewsData.length > 0) {
            doc.addPage();
            yPos = 20;

            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(99, 102, 241);
            doc.text('9. Reviews Récentes', margin, yPos);
            yPos += 12;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);

            data.reviewsData.slice(0, 5).forEach(review => {
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFillColor(249, 250, 251);
                const boxHeight = 25;
                doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, boxHeight, 2, 2, 'F');
                doc.setDrawColor(229, 231, 235);
                doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, boxHeight, 2, 2, 'S');

                doc.setFont(undefined, 'bold');
                doc.setFontSize(10);
                doc.setTextColor(17, 24, 39);
                doc.text(review.user || 'Utilisateur', margin + 3, yPos);

                doc.setTextColor(245, 158, 11);
                doc.text('⭐'.repeat(review.rating || 0), pageWidth - margin - 20, yPos);

                yPos += 6;
                doc.setFont(undefined, 'normal');
                doc.setFontSize(9);
                doc.setTextColor(107, 114, 128);
                const reviewText = doc.splitTextToSize(review.text || '', pageWidth - 2 * margin - 6);
                doc.text(reviewText.slice(0, 2), margin + 3, yPos);

                yPos += boxHeight;
            });
        }
    } else {
        // Message premium
        doc.addPage();
        yPos = 80;
        doc.setFontSize(18);
        doc.setTextColor(99, 102, 241);
        doc.setFont(undefined, 'bold');
        doc.text('Sections Premium', pageWidth/2, yPos, { align: 'center' });
        yPos += 15;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text('Débloquez toutes les données premium pour 9,99€', pageWidth/2, yPos, { align: 'center' });
        yPos += 10;
        doc.text('Informations Techniques • Développeur • SEO & ASO', pageWidth/2, yPos, { align: 'center' });
        yPos += 6;
        doc.text('Médias • Permissions • Reviews', pageWidth/2, yPos, { align: 'center' });
    }

    // PAGINATION sur toutes les pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.setFont(undefined, 'normal');
        doc.text(`Page ${i} / ${totalPages}`, pageWidth/2, pageHeight - 10, { align: 'center' });
        doc.text('PlayStore Analytics Pro', pageWidth/2, pageHeight - 5, { align: 'center' });
    }

    doc.save(`${data.title || 'app'}_report.pdf`);
}

async function exportPNG() {
    const container = document.getElementById('reportContainer');
    if (!container || !container.innerHTML) {
        toast('Aucun rapport à exporter', 'error');
        return;
    }

    let watermark = null;
    if (!hasLicense) {
        watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.textContent = 'VERSION GRATUITE';
        document.body.appendChild(watermark);
    }

    const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
    });

    if (watermark) {
        watermark.remove();
    }

    canvas.toBlob(blob => {
        downloadFile(blob, `${fullData.title || 'app'}_report.png`);
    });
}

function exportHTML() {
    const data = fullData;
    const container = document.getElementById('reportContainer');

    if (!container || !container.innerHTML) {
        toast('Aucun rapport à exporter', 'error');
        return;
    }

    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                return '';
            }
        })
        .join('\n');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'App'} - PlayStore Analytics Report</title>
    <style>
        ${styles}
        body {
            margin: 0;
            padding: 20px;
            background: #fafbfc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        ${!hasLicense ? `
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 5rem;
            font-weight: 900;
            color: rgba(239, 68, 68, 0.06);
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
        }
        ` : ''}
    </style>
</head>
<body>
    ${!hasLicense ? '<div class="watermark">VERSION GRATUITE</div>' : ''}
    <div class="container">
        <div style="text-align:center;margin-bottom:24px;padding:32px;background:#6366f1;color:white;border-radius:8px;">
            <h1 style="margin:0 0 8px 0;font-size:2rem;">PlayStore Analytics Pro</h1>
            <p style="margin:0;font-size:1rem;">Rapport généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        ${container.innerHTML}
        <div style="text-align:center;margin-top:32px;padding:16px;color:#6b7280;border-top:1px solid #e5e7eb;">
            <p>Généré par <strong>PlayStore Analytics Pro</strong></p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    downloadFile(blob, `${data.title || 'app'}_report.html`);
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============ APP NAME SEARCH FUNCTIONALITY ============

let searchTimeout = null;
const appNameInput = document.getElementById('appNameSearch');
const suggestionsDiv = document.getElementById('searchSuggestions');
const SERPAPI_FUNCTION = '/.netlify/functions/serp-search';

// Close suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!suggestionsDiv.contains(e.target) && e.target !== appNameInput) {
        suggestionsDiv.style.display = 'none';
    }
});

// Search apps by name
appNameInput.addEventListener('input', function() {
    const query = this.value.trim();

    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);

    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    // Show loading
    suggestionsDiv.style.display = 'block';
    suggestionsDiv.innerHTML = '<div class="search-loading">🔍 Recherche en cours...</div>';

    // Debounce search
    searchTimeout = setTimeout(async () => {
        // Try SerpApi live results via proxy first
        try {
            const serpApps = await searchSerpProxy(query);

            if (serpApps.length > 0) {
                displaySuggestions(serpApps);
                return;
            }
        } catch (error) {
            console.error('Erreur proxy SerpApi', error);
        }

        // Fallback to backend search if available
        try {
            const res = await fetch(`${API}/api/search-by-name?q=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (data.success && data.apps && data.apps.length > 0) {
                displaySuggestions(data.apps);
                return;
            }
        } catch (e) {
            console.error('Erreur backend recherche', e);
        }

        // Final fallback: local list
        searchLocalApps(query);
    }, 300);
});

if (csvInput) {
    csvInput.addEventListener('change', handleCSVImport);
}

if (startBatchBtn) {
    startBatchBtn.addEventListener('click', () => {
        if (!batchQueue.length || batchRunning) {
            if (!batchQueue.length) {
                toast('Importez un fichier CSV avant de lancer l\'analyse en série', 'error');
            } else if (batchRunning) {
                toast('Une analyse est déjà en cours', 'error');
            }
            return;
        }
        runBatchQueue();
    });
}

function handleCSVImport(event) {
    if (batchRunning) {
        toast('Une analyse est déjà en cours. Patientez avant de réimporter un CSV.', 'error');
        event.target.value = '';
        return;
    }

    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
        try {
            const content = target?.result || '';
            const ids = parseCsvContent(String(content));

            if (!ids.length) {
                toast('CSV vide ou colonne appId introuvable', 'error');
                resetBatchUI();
                return;
            }

            renderBatchList(ids);
            toast(`${ids.length} application${ids.length > 1 ? 's' : ''} détectée${ids.length > 1 ? 's' : ''}`, 'success');
        } catch (err) {
            console.error('CSV parse error:', err);
            toast('Impossible de lire ce fichier CSV', 'error');
            resetBatchUI();
        }
    };
    reader.onerror = () => {
        toast('Erreur lors de la lecture du fichier CSV', 'error');
        resetBatchUI();
    };
    reader.readAsText(file);
}

function parseCsvContent(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!lines.length) return [];

    let startIndex = 0;
    let targetIndex = 0;
    const firstParts = splitCsvLine(lines[0]);
    if (firstParts.length > 1 || /[a-zA-Z]/.test(firstParts[0])) {
        const headers = firstParts.map(part => part.toLowerCase());
        const possible = ['appid', 'app_id', 'id'];
        targetIndex = headers.findIndex((header) => possible.includes(header));
        if (targetIndex === -1) targetIndex = 0;
        startIndex = 1;
    }

    const ids = [];
    for (let i = startIndex; i < lines.length; i++) {
        const parts = splitCsvLine(lines[i]);
        const candidate = (parts[targetIndex] || '').trim();
        if (candidate) ids.push(candidate);
    }

    return Array.from(new Set(ids));
}

function splitCsvLine(line) {
    const segments = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            segments.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    segments.push(current.trim());

    return segments;
}

function renderBatchList(appIds) {
    if (!batchProgress) return;

    batchProgress.innerHTML = '';
    batchQueue = appIds.map((appId) => {
        const item = document.createElement('div');
        item.className = 'batch-item';
        item.innerHTML = `
            <div class="batch-info">
                <span class="batch-title">${appId}</span>
                <span class="batch-status">En attente</span>
            </div>
            <div class="batch-bar">
                <div class="batch-bar-fill"></div>
            </div>
        `;

        batchProgress.appendChild(item);

        return {
            appId,
            element: item,
            statusEl: item.querySelector('.batch-status'),
            barEl: item.querySelector('.batch-bar-fill'),
            data: null
        };
    });

    if (startBatchBtn) {
        startBatchBtn.disabled = batchQueue.length === 0;
        startBatchBtn.textContent = batchQueue.length
            ? `Démarrer l'analyse (${batchQueue.length})`
            : `Démarrer l'analyse`;
    }
}

function resetBatchUI() {
    batchQueue = [];
    if (batchProgress) batchProgress.innerHTML = '';
    if (startBatchBtn) {
        startBatchBtn.disabled = true;
        startBatchBtn.textContent = `Démarrer l'analyse`;
    }
    if (csvInput) {
        csvInput.value = '';
    }
}

async function runBatchQueue() {
    if (!batchQueue.length) return;

    batchRunning = true;
    if (startBatchBtn) {
        startBatchBtn.disabled = true;
        startBatchBtn.textContent = 'Analyse en cours...';
    }

    for (const item of batchQueue) {
        await processBatchItem(item);
    }

    batchRunning = false;
    if (startBatchBtn) {
        startBatchBtn.disabled = false;
        startBatchBtn.textContent = 'Relancer l\'analyse';
    }

    toast('Analyse en série terminée', 'success');
}

async function processBatchItem(item) {
    updateBatchStatus(item, 'Analyse en cours...', null);
    updateBatchProgress(item, 20);

    try {
        const data = await fetchAppData(item.appId);
        item.data = data;
        updateBatchProgress(item, 100);
        updateBatchStatus(item, 'Succès', 'success');
        item.barEl?.classList.remove('error');

        if (!item.element.dataset.bound) {
            item.element.dataset.bound = '1';
            item.element.classList.add('clickable');
            item.element.addEventListener('click', () => {
                if (item.data) {
                    fullData = item.data;
                    generateReport(item.data);
                    toast(`Rapport chargé : ${item.data.title || item.appId}`, 'success');
                }
            });
        }

        fullData = data;
        generateReport(data);
    } catch (error) {
        console.error(`Erreur analyse batch (${item.appId})`, error);
        updateBatchProgress(item, 100);
        updateBatchStatus(item, 'Échec', 'error');
        item.barEl?.classList.add('error');
        toast(`Échec pour ${item.appId}`, 'error');
    }
}

function updateBatchProgress(item, value) {
    if (item?.barEl) {
        item.barEl.style.width = `${Math.min(Math.max(value, 0), 100)}%`;
    }
}

function updateBatchStatus(item, text, statusClass) {
    if (!item?.statusEl) return;
    item.statusEl.textContent = text;
    item.statusEl.classList.remove('success', 'error');
    if (statusClass) {
        item.statusEl.classList.add(statusClass);
    }
}

async function searchSerpProxy(query) {
    const response = await fetch(`${SERPAPI_FUNCTION}?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
        throw new Error(`Proxy SerpApi HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.success && Array.isArray(data.apps)) {
        return data.apps;
    }

    return [];
}

// Fallback: Search in popular apps list
function searchLocalApps(query) {
    const popularApps = [
        { appId: 'com.roblox.client', title: 'Roblox', developer: 'Roblox Corporation', score: 4.5, icon: 'https://play-lh.googleusercontent.com/WNWZaxi9RdJKe2GQM3vqXIAkk69mnIl4Cc8EyZcir2SKlVOxeUv9tZGfNTmNaLC717Ht=s48' },
        { appId: 'com.instagram.android', title: 'Instagram', developer: 'Instagram', score: 4.4, icon: 'https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM=s48' },
        { appId: 'com.zhiliaoapp.musically', title: 'TikTok', developer: 'TikTok Pte. Ltd.', score: 4.5, icon: 'https://play-lh.googleusercontent.com/z5nin6HN5R1K4UvDZSbZXsVxXvwP-sZLGXBfAzgCTyhFbk2jc9FKCFJ9Ky9K3jbjEcw=s48' },
        { appId: 'com.whatsapp', title: 'WhatsApp', developer: 'WhatsApp LLC', score: 4.2, icon: 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s48' },
        { appId: 'com.facebook.katana', title: 'Facebook', developer: 'Meta Platforms, Inc.', score: 3.6, icon: 'https://play-lh.googleusercontent.com/ccWDU4A7fX1R24v-vvT480ySh26AYp97g1VrIB_FIdjRcuQB2JP2WdY7h_wVVAeSpg=s48' },
        { appId: 'com.snapchat.android', title: 'Snapchat', developer: 'Snap Inc', score: 4.1, icon: 'https://play-lh.googleusercontent.com/KxeSAjPTKliCErbivNiXrd6cTwfbqUJcbSRPe_IBVK_YmwckfMRS1VIHz-5cgT09yMo=s48' },
        { appId: 'com.twitter.android', title: 'X (Twitter)', developer: 'X Corp.', score: 3.8, icon: 'https://play-lh.googleusercontent.com/7Ak4Ye7wNUtheIvSKnVgGL_OIZWjGPZNV6TP_3XLxHC-sDHLSE45aDg41dFNmL5COA=s48' },
        { appId: 'com.spotify.music', title: 'Spotify', developer: 'Spotify AB', score: 4.4, icon: 'https://play-lh.googleusercontent.com/eN0IexSzxpUDMfFtm-OyM-nNs44Y74Q3k51bxAMhTFYgNbPfp4R8R2D7T3CEr6tN4wso=s48' },
        { appId: 'com.netflix.mediaclient', title: 'Netflix', developer: 'Netflix, Inc.', score: 4.3, icon: 'https://play-lh.googleusercontent.com/384jyLRgWNxRsLq_SwH7Ay4ULxg-kMoL7LGBwxmGCYm3HQc_qZzjAZqQP3XYqN-8y5w=s48' },
        { appId: 'com.disney.disneyplus', title: 'Disney+', developer: 'Disney', score: 4.3, icon: 'https://play-lh.googleusercontent.com/xoGGYH2LgLibLDBoxMg-ZE16b-RNfITw_OgXBWRAPin2FZY7FVPx-AAJBlRPRzeVI6s=s48' },
        { appId: 'com.google.android.youtube', title: 'YouTube', developer: 'Google LLC', score: 4.1, icon: 'https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc=s48' },
        { appId: 'com.google.android.apps.maps', title: 'Google Maps', developer: 'Google LLC', score: 4.2, icon: 'https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA=s48' },
        { appId: 'com.amazon.mShop.android.shopping', title: 'Amazon Shopping', developer: 'Amazon Mobile LLC', score: 4.5, icon: 'https://play-lh.googleusercontent.com/3C-hB-KWoyWzZjUnRsXUPu-bqB3HUHARMLjUe9OmPoHa6dQdtJNW30VrvwQ1m7Pln3A=s48' },
        { appId: 'com.duolingo', title: 'Duolingo', developer: 'Duolingo', score: 4.6, icon: 'https://play-lh.googleusercontent.com/BMRP3ZhVb5P1P6YFfXT7NBVWHI8PrR7hhLvYp7vLoBz5w0WlnDxLq_PFfzLPl0r2bpQ=s48' },
        { appId: 'com.supercell.clashofclans', title: 'Clash of Clans', developer: 'Supercell', score: 4.6, icon: 'https://play-lh.googleusercontent.com/LByrur1lKw3gnTSI4yPw3eeHN0L8YsCdzHiGOWmSAZe1BbP7UHaOLzSL6hj5Lej2tyM=s48' },
        { appId: 'com.mojang.minecraftpe', title: 'Minecraft', developer: 'Mojang', score: 4.5, icon: 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=s48' },
        { appId: 'com.android.chrome', title: 'Chrome', developer: 'Google LLC', score: 4.2, icon: 'https://play-lh.googleusercontent.com/KwUBNPbMTk9jDXYS2AeX3illtVRTkrKVh5xR1Mg4WHd0CG2tV4mrh1z3kXi5z_warlk=s48' },
        { appId: 'com.ubercab', title: 'Uber', developer: 'Uber Technologies, Inc.', score: 4.2, icon: 'https://play-lh.googleusercontent.com/Qfa-s0-ZaFdM02Pje7fh5IYCmGQdXvbG7ZDVj0qcz7n2_5A_kDq6g5Qc8-8Qh8-8Q=s48' },
        { appId: 'com.canva.editor', title: 'Canva', developer: 'Canva', score: 4.7, icon: 'https://play-lh.googleusercontent.com/zHFv5xC75XIqbADq1Q_4OAkpUY4xk5lPU8Pz1z_p1z_p1z_p1z_p1z_p1z_p1z_p1z=s48' },
        { appId: 'com.pinterest', title: 'Pinterest', developer: 'Pinterest', score: 4.5, icon: 'https://play-lh.googleusercontent.com/d_0Hi7dwp8DYDUz8oU4G8Rn1xDc4WS9UcfbPd_8w8w8w8w8w8w8w8w8w8w8w8w8w8w=s48' }
    ];

    const filtered = popularApps.filter(app =>
        app.title.toLowerCase().includes(query.toLowerCase()) ||
        app.developer.toLowerCase().includes(query.toLowerCase()) ||
        app.appId.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
        displaySuggestions(filtered);
    } else {
        suggestionsDiv.innerHTML = '<div class="search-empty">💡 Aucune correspondance trouvée.<br>Essayez : Roblox, Instagram, TikTok, WhatsApp...</div>';
    }
}

function displaySuggestions(apps) {
    let html = '';

    apps.slice(0, 8).forEach(app => {
        html += `
            <div class="suggestion-item" data-appid="${app.appId || ''}">
                <img src="${app.icon || ''}" class="suggestion-icon" alt="${app.title || ''}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%23e5e7eb%22 width=%2248%22 height=%2248%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2224%22%3E📱%3C/text%3E%3C/svg%3E'">
                <div class="suggestion-details">
                    <div class="suggestion-title">${app.title || 'N/A'}</div>
                    <div class="suggestion-developer">${app.developer || 'N/A'}</div>
                </div>
                <div class="suggestion-rating">
                    ⭐ ${app.score ? app.score.toFixed(1) : 'N/A'}
                </div>
            </div>
        `;
    });

    suggestionsDiv.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const appId = this.dataset.appid;
            const appTitle = this.querySelector('.suggestion-title').textContent;

            document.getElementById('appId').value = appId;
            document.getElementById('appNameSearch').value = appTitle;
            suggestionsDiv.style.display = 'none';

            toast(`✓ ${appTitle} sélectionné`, 'success');
        });
    });
}

checkLicense();
