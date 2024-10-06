const ffmpeg = require('fluent-ffmpeg');

// Fonction pour optimiser une vidéo
async function optimizeVideo(inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .outputOptions('-preset fast')
            .outputOptions('-crf 23') // Taux de compression
            .toFormat('mp4')
            .on('end', () => {
                console.log(`Video optimized and saved to ${outputFilePath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error('Error optimizing video:', err);
                reject(err);
            })
            .save(outputFilePath);
    });
}

// Fonction pour traiter et optimiser une vidéo avant de la sauvegarder
async function processVideo(file) {
    const outputFilePath = `optimized/${file.filename}`;
    await optimizeVideo(file.path, outputFilePath);
    return outputFilePath;
}

module.exports = {
    optimizeVideo,
    processVideo
};