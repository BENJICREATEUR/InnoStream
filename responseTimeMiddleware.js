/**
 * Middleware pour mesurer et ajouter le temps de réponse à chaque requête.
 */
const responseTimeMiddleware = (req, res, next) => {
    const start = process.hrtime(); // Enregistrer le temps de début

    // Écouter l'événement 'finish' pour capturer le temps de réponse
    res.on('finish', () => {
        const elapsedTime = process.hrtime(start); // Calculer le temps écoulé
        const duration = (elapsedTime[0] * 1e3 + elapsedTime[1] * 1e-6).toFixed(3); // Convertir en millisecondes

        // Ajouter le temps de réponse dans l'en-tête de réponse
        res.setHeader('X-Response-Time', `${duration} ms`);
    });

    next(); // Passer au middleware suivant
};

module.exports = responseTimeMiddleware;