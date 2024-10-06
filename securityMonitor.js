const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Limiteur de requêtes pour prévenir les attaques par force brute
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
});

// Middleware pour renforcer la sécurité des en-têtes HTTP
function applySecurityHeaders(app) {
    app.use(helmet());
}

module.exports = {
    limiter,
    applySecurityHeaders
};