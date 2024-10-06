const cache = require('./cache');

// Fonction pour mettre en cache les résultats de l'API
async function cacheApiResponse(key, fetchFunction) {
    if (cache.hasCache(key)) {
        return cache.getCache(key);
    } else {
        const data = await fetchFunction();
        cache.setCache(key, data);
        return data;
    }
}

// Exemple d'utilisation de cacheApiResponse
async function getVideos() {
    const fetchVideos = async () => {
        // Logique pour récupérer les vidéos depuis la base de données
        // Remplacer par la logique réelle
        return [{ id: '1', title: 'Video 1' }, { id: '2', title: 'Video 2' }];
    };
    
    return cacheApiResponse('videos', fetchVideos);
}

module.exports = {
    cacheApiResponse,
    getVideos
};