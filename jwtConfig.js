require('dotenv').config();
const jwt = require('jsonwebtoken');

// Configuration des paramètres JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'superSecretKey', // Clé secrète pour signer les tokens
  expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Durée de validité du token (ex : '1h', '7d')
};

// Fonction pour générer un token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

// Fonction pour vérifier et décoder un token JWT
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return reject(err); // Si le token n'est pas valide ou expiré, on rejette l'erreur
      }
      resolve(decoded); // Si tout est correct, on retourne le payload décodé
    });
  });
};

// Middleware pour protéger les routes (vérification du token)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupération du token à partir des en-têtes

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
  }

  verifyToken(token)
    .then((decoded) => {
      req.user = decoded; // On attache le payload du token à l'objet req pour l'utiliser dans les routes
      next(); // Passe à la prochaine fonction middleware
    })
    .catch((error) => {
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    });
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};