const jwt = require('jsonwebtoken');

// Fonction pour générer un token JWT
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
}

// Fonction pour vérifier un token JWT
function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// Fonction pour anonymiser des données sensibles
function anonymizeData(data) {
    // Remplacer les champs sensibles par des valeurs anonymisées
    return {
        ...data,
        email: 'hidden@example.com'
    };
}

module.exports = {
    generateToken,
    verifyToken,
    anonymizeData
};