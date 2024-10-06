const compression = require('compression');

/**
 * Middleware de compression pour les réponses HTTP
 * Utilise Gzip pour compresser les réponses et réduire la taille des données envoyées au client.
 */
const compressionMiddleware = (req, res, next) => {
    // Vérifiez si la requête accepte la compression
    const acceptsEncoding = req.headers['accept-encoding'] || '';
    if (acceptsEncoding.includes('gzip')) {
        // Utiliser le middleware de compression
        compression()(req, res, next);
    } else {
        // Si la compression n'est pas acceptée, passez simplement au middleware suivant
        next();
    }
};

module.exports = compressionMiddleware;