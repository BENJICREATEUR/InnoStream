const helmet = require('helmet');

/**
 * Middleware CSP pour gérer la politique de sécurité de contenu.
 * Configure les en-têtes CSP pour l'application InnoStream.
 */
const cspMiddleware = (req, res, next) => {
    res.setHeader("Content-Security-Policy", `
        default-src 'self';  // Autoriser les ressources par défaut uniquement depuis la même origine
        script-src 'self' https://trusted-scripts.example.com;  // Autoriser les scripts depuis la même origine et un domaine de confiance
        style-src 'self' https://trusted-styles.example.com;  // Autoriser les styles depuis la même origine et un domaine de confiance
        img-src 'self' https://trusted-images.example.com data:;  // Autoriser les images depuis la même origine, un domaine de confiance et les images inline
        connect-src 'self' https://api.example.com;  // Autoriser les connexions (XHR, WebSockets) uniquement vers la même origine et un API de confiance
        font-src 'self' https://fonts.example.com;  // Autoriser les polices depuis la même origine et un domaine de confiance
        object-src 'none';  // Ne pas autoriser les objets
        base-uri 'self';  // Autoriser les balises <base> uniquement depuis la même origine
        frame-ancestors 'none';  // Interdire l'intégration dans des cadres
    `);

    next();
};

module.exports = cspMiddleware;