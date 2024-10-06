const fs = require('fs');
const path = require('path');

// Fonction pour obtenir la version de l'application
function getVersion() {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
}

module.exports = {
    getVersion
};