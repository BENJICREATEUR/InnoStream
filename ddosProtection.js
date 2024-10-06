const rateLimit = require('express-rate-limit');

/**
 * Middleware de protection contre les DDoS.
 * Limite le nombre de requêtes d'un même IP dans un délai défini.
 */
const ddosProtection = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre de temps
    message: 'Trop de requêtes effectuées à partir de cette adresse IP, veuillez réessayer plus tard.',
    headers: true, // Inclure des en-têtes de limite dans la réponse
});

/**
 * Appliquer la protection DDoS sur toutes les routes de l'API.
 */
const applyDdosProtection = (app) => {
    app.use(ddosProtection);
};

module.exports = applyDdosProtection;