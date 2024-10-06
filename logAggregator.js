const fs = require('fs');
const path = require('path');

// Fonction pour agréger les logs
function aggregateLogs() {
    const logDir = path.join(__dirname, '../logs');
    const aggregatedLogFile = path.join(logDir, 'aggregated_logs.log');

    // Lire tous les fichiers de logs et les combiner dans un fichier unique
    fs.readdir(logDir, (err, files) => {
        if (err) throw err;

        const logContents = files
            .filter(file => file.endsWith('.log'))
            .map(file => fs.readFileSync(path.join(logDir, file), 'utf8'))
            .join('\n');

        fs.writeFileSync(aggregatedLogFile, logContents);
        console.log('Logs aggregated successfully.');
    });
}

module.exports = {
    aggregateLogs
};