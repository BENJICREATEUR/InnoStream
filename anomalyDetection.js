const redisClient = require('../config/redis'); // Assurez-vous d'importer votre configuration Redis
const { HttpStatus } = require('../utils/httpStatus'); // Module d'utilitaires pour les statuts HTTP

// Configuration des seuils pour la détection d'anomalies
const THRESHOLD_REQUESTS = 50; // Seuil de requêtes pour détecter une anomalie
const TIME_WINDOW = 60 * 15; // Fenêtre de temps de 15 minutes en secondes

// Middleware pour détecter les anomalies
const anomalyDetection = (req, res, next) => {
    const userId = req.user ? req.user.id : 'guest'; // Identifier l'utilisateur, ou 'guest' si non authentifié

    // Stocker l'heure actuelle
    const currentTime = Math.floor(Date.now() / 1000); // Temps en secondes

    // Clé pour stocker les timestamps des requêtes
    const requestKey = `user:${userId}:requests`;

    // Incrémenter le nombre de requêtes et ajouter un timestamp
    redisClient.multi()
        .zadd(requestKey, currentTime, currentTime) // Ajout du timestamp au set trié
        .expire(requestKey, TIME_WINDOW) // Expiration de la clé après 15 minutes
        .exec((err) => {
            if (err) {
                console.error('Redis Error:', err);
                return next();
            }

            // Récupérer le nombre de requêtes dans la fenêtre de temps
            redisClient.zcount(requestKey, currentTime - TIME_WINDOW, currentTime, (err, count) => {
                if (err) {
                    console.error('Redis Error:', err);
                    return next();
                }

                // Détection d'anomalies
                if (count > THRESHOLD_REQUESTS) {
                    console.warn(`Anomalie détectée pour l'utilisateur ${userId}: ${count} requêtes dans les 15 dernières minutes.`);
                    return res.status(HttpStatus.FORBIDDEN).json({
                        status: HttpStatus.FORBIDDEN,
                        error: 'Anomaly detected! Too many requests in a short period.',
                    });
                }

                next(); // Passez au middleware suivant
            });
        });
};

// Middleware pour réinitialiser le compteur
const resetAnomalyDetection = (req, res) => {
    const userId = req.user ? req.user.id : 'guest';
    const requestKey = `user:${userId}:requests`;

    redisClient.del(requestKey, (err) => {
        if (err) {
            console.error('Redis Error:', err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to reset anomaly detection.',
            });
        }

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'Anomaly detection reset successfully.',
        });
    });
};

module.exports = {
    anomalyDetection,
    resetAnomalyDetection,
};