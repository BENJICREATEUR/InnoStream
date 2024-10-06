const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis'); // Assurez-vous d'importer votre configuration Redis
const { HttpStatus } = require('../utils/httpStatus'); // Importez un module d'utilitaires pour les statuts HTTP

// Configuration du limiteur de taux
const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    expiry: 60 * 60, // Durée de vie des clés en secondes
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP par fenêtre
  message: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    error: 'Too many requests, please try again later.',
  },
});

// Middleware de limitation de taux avancé
const advancedRateLimiting = (req, res, next) => {
  limiter(req, res, next);
};

// Fonction de mise à jour des limites pour des utilisateurs spécifiques
const updateRateLimitForUser = (userId) => {
  redisClient.incr(`user:${userId}:requests`, (err) => {
    if (err) {
      console.error('Redis Error:', err);
    }
  });

  // Définir l'expiration pour la clé utilisateur
  redisClient.expire(`user:${userId}:requests`, 15 * 60); // Expiration dans 15 minutes
};

// Middleware pour vérifier le quota d'un utilisateur
const checkUserRateLimit = (req, res, next) => {
  const userId = req.user ? req.user.id : null; // Assume que l'utilisateur est attaché à la requête

  if (userId) {
    redisClient.get(`user:${userId}:requests`, (err, requests) => {
      if (err) {
        console.error('Redis Error:', err);
        return next();
      }

      if (requests >= 100) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          status: HttpStatus.TOO_MANY_REQUESTS,
          error: 'You have exceeded your request limit. Please try again later.',
        });
      }

      next();
    });
  } else {
    next(); // Si l'utilisateur n'est pas connecté, passer
  }
};

module.exports = {
  advancedRateLimiting,
  updateRateLimitForUser,
  checkUserRateLimit,
};