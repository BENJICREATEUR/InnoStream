const cors = require('cors');

/**
 * Middleware CORS pour gérer les requêtes cross-origin.
 * Configure les règles d'accès pour l'application InnoStream.
 */
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',  // Origine locale pour le développement
        'https://your-production-domain.com',  // Domaine de production
        // Ajoutez d'autres origines autorisées si nécessaire
    ];

    const origin = req.headers.origin;

    // Vérifiez si l'origine de la requête est dans la liste des origines autorisées
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Pour les requêtes OPTIONS, renvoyer une réponse rapide
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
};

module.exports = corsMiddleware;