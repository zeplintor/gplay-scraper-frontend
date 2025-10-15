const https = require('https');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async function(event) {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: corsHeaders };
    }

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Méthode non supportée' })
        };
    }

    const query = (event.queryStringParameters.q || event.queryStringParameters.query || '').trim();

    if (!query) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Paramètre q requis' })
        };
    }

    const apiKey = process.env.SERPAPI_KEY || 'bbfe6148f9e6efe12cb7d3451240a3e1d3ab52c4d4e8838e25d6af043f21d6c7';

    if (!apiKey) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Clé SerpApi manquante' })
        };
    }

    const params = new URLSearchParams({
        engine: 'google_play',
        store: 'apps',
        num: '8',
        gl: 'fr',
        hl: 'fr',
        q: query,
        api_key: apiKey
    });

    const url = `https://serpapi.com/search.json?${params.toString()}`;

    try {
        const { statusCode, rawBody } = await requestJson(url);

        if (statusCode < 200 || statusCode >= 300) {
            const message = `SerpApi HTTP ${statusCode}`;
            console.error(message, rawBody);
            return {
                statusCode,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message })
            };
        }

        const data = JSON.parse(rawBody);
        const results = Array.isArray(data.organic_results) ? data.organic_results : [];

        const apps = results
            .map(normalizeResult)
            .filter(app => app.appId && app.title);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ success: true, apps })
        };
    } catch (error) {
        console.error('Erreur proxy SerpApi', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Erreur interne' })
        };
    }
};

function requestJson(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, res => {
                let rawBody = '';
                res.setEncoding('utf8');

                res.on('data', chunk => {
                    rawBody += chunk;
                });

                res.on('end', () => {
                    resolve({ statusCode: res.statusCode || 500, rawBody });
                });
            })
            .on('error', reject);
    });
}

function normalizeResult(result) {
    let appId = '';

    if (result.app_id) {
        appId = result.app_id;
    } else if (result.link) {
        try {
            const url = new URL(result.link);
            appId = url.searchParams.get('id') || '';
        } catch (err) {
            appId = '';
        }
    }

    const ratingRaw = result.rating;
    let score = null;

    if (typeof ratingRaw === 'number') {
        score = ratingRaw;
    } else if (typeof ratingRaw === 'string') {
        const parsed = parseFloat(ratingRaw.replace(',', '.'));
        if (!Number.isNaN(parsed)) {
            score = parsed;
        }
    }

    return {
        appId,
        title: result.title || result.app_id || '',
        developer: result.developer || result.author || result.offered_by || '',
        score,
        icon: result.thumbnail || result.favicon || ''
    };
}
