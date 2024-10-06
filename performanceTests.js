const axios = require('axios');
const { performance } = require('perf_hooks');

// URL de l'API d'InnoStream
const BASE_URL = 'http://localhost:3000/api';

// Test de performance pour le téléchargement de vidéo
async function testUploadVideo() {
    const startTime = performance.now();
    try {
        const response = await axios.post(`${BASE_URL}/videos/upload`, {
            // Simulation de données de vidéo
            title: 'Test Video',
            description: 'This is a test video.',
            file: 'path/to/test/video.mp4', // Utiliser un fichier valide
        });
        const endTime = performance.now();
        console.log(`Upload Video Response: ${response.data}`);
        console.log(`Upload Video Performance: ${(endTime - startTime).toFixed(2)} ms`);
    } catch (error) {
        console.error('Error uploading video:', error.message);
    }
}

// Test de performance pour la récupération des vidéos d'un utilisateur
async function testGetUserVideos(userId) {
    const startTime = performance.now();
    try {
        const response = await axios.get(`${BASE_URL}/videos/user/${userId}`);
        const endTime = performance.now();
        console.log(`Get User Videos Response: ${response.data}`);
        console.log(`Get User Videos Performance: ${(endTime - startTime).toFixed(2)} ms`);
    } catch (error) {
        console.error('Error fetching user videos:', error.message);
    }
}

// Test de performance pour le streaming vidéo
async function testStreamVideo(videoId) {
    const startTime = performance.now();
    try {
        const response = await axios.get(`${BASE_URL}/videos/stream/${videoId}`);
        const endTime = performance.now();
        console.log(`Stream Video Response: ${response.data}`);
        console.log(`Stream Video Performance: ${(endTime - startTime).toFixed(2)} ms`);
    } catch (error) {
        console.error('Error streaming video:', error.message);
    }
}

// Exécuter les tests
(async function runPerformanceTests() {
    await testUploadVideo();
    await testGetUserVideos('sampleUserId'); // Remplacer par un ID d'utilisateur valide
    await testStreamVideo('sampleVideoId'); // Remplacer par un ID de vidéo valide
})();