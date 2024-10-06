const NodeCache = require('node-cache');

// Configuration du cache avec un temps d'expiration par défaut de 1 heure
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Fonction pour mettre en cache une valeur
function setCache(key, value) {
    cache.set(key, value);
}

// Fonction pour obtenir une valeur du cache
function getCache(key) {
    return cache.get(key);
}

// Fonction pour supprimer une valeur du cache
function delCache(key) {
    cache.del(key);
}

// Fonction pour vérifier si une clé existe dans le cache
function hasCache(key) {
    return cache.has(key);
}

module.exports = {
    setCache,
    getCache,
    delCache,
    hasCache
};