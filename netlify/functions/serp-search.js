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

    const query = event.queryStringParameters.q || event.queryStringParameters.query;

    if (!query || !query.trim()) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, message: 'Paramètre q requis' })
        };
    }

    try {
        const apiKey = process.env.SERPAPI_KEY || 'bbfe6148f9e6efe12cb7d3451240a3e1d3ab52c4d4e8838e25d6af043f21d6c7';

        const params = new URLSearchParams({
            engine: 'google_play',
            store: 'apps',
            num: '8',
            gl: 'fr',
            hl: 'fr',
            q: query.trim(),
            api_key: apiKey
        });

        const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);

        if (!response.ok) {
            const message = `SerpApi HTTP ${response.status}`;
            console.error(message);
            return {
                statusCode: response.status,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message })
            };
        }

        const data = await response.json();
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
