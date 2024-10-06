const redis = require('redis');

// Configuration de la connexion Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // Si la connexion est refusée
      console.error('Redis server refused the connection');
      return new Error('Redis server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // Si trop de tentatives en une heure
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      // Après 10 tentatives, abandonner
      return undefined;
    }
    // Reconnecter après 2 secondes
    return Math.min(options.attempt * 100, 3000);
  },
});

// Gestion des événements Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

// Fonction pour stocker une clé dans Redis
const setCache = (key, value, expiry = 3600) => {
  redisClient.set(key, JSON.stringify(value), 'EX', expiry, (err) => {
    if (err) {
      console.error('Error setting cache in Redis: ', err);
    }
  });
};

// Fonction pour récupérer une clé de Redis
const getCache = (key, callback) => {
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error('Error getting cache from Redis: ', err);
      return callback(err);
    }
    if (data) {
      return callback(null, JSON.parse(data));
    } else {
      return callback(null, null);
    }
  });
};

// Fonction pour supprimer une clé de Redis
const clearCache = (key) => {
  redisClient.del(key, (err) => {
    if (err) {
      console.error('Error clearing cache in Redis: ', err);
    }
  });
};

// Configuration pour stocker les sessions utilisateur
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'innostream_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24, // 24 heures
  },
});

// Export des fonctions Redis et middleware de session
module.exports = {
  redisClient,
  setCache,
  getCache,
  clearCache,
  sessionMiddleware,
};