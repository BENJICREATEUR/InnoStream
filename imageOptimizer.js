const sharp = require('sharp');

// Fonction pour optimiser une image
async function optimizeImage(inputBuffer) {
    return sharp(inputBuffer)
        .resize({ width: 800, height: 800, fit: 'inside' }) // Redimensionner l'image
        .toFormat('jpeg', { quality: 80 }) // Convertir en JPEG avec qualité de 80
        .toBuffer();
}

// Fonction pour traiter et optimiser une image avant de la sauvegarder
async function processImage(file) {
    const optimizedImage = await optimizeImage(file.buffer);
    return optimizedImage;
}

module.exports = {
    optimizeImage,
    processImage
};