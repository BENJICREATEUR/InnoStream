const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration des variables d'environnement
const jwtSecret = process.env.JWT_SECRET || 'innostream_jwt_secret';
const encryptionKey = process.env.ENCRYPTION_KEY || 'innostream_encryption_key';

// 1. Authentification à deux facteurs (2FA)
const generate2FASecret = () => {
  const secret = speakeasy.generateSecret();
  return {
    otpauth_url: secret.otpauth_url,
    base32: secret.base32,
  };
};

const verify2FAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1,
  });
};

const generate2FAQrCode = async (otpauth_url) => {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(otpauth_url);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR Code: ', error);
    throw error;
  }
};

// 2. Hashage et gestion des mots de passe
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// 3. Génération et vérification des tokens JWT
const generateJWT = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '24h' });
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    return null;
  }
};

// 4. Cryptage des données sensibles (au repos et en transit)
const encryptData = (data) => {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// 5. Reconnaissance faciale pour la sécurité supplémentaire
const loadFacialRecognitionModel = () => {
  const modelPath = path.join(__dirname, '../models/facialRecognitionModel.dat');
  if (!fs.existsSync(modelPath)) {
    console.error('Facial recognition model not found.');
    return null;
  }
  // Charger le modèle ici (exemple fictif)
  return 'loaded_facial_recognition_model';
};

const verifyFacialRecognition = (userFaceData, storedFaceData) => {
  // Cette fonction vérifierait si les données faciales correspondent
  return userFaceData === storedFaceData;
};

// 6. Journalisation des connexions suspectes
const logSuspiciousActivity = (userId, ipAddress, activityType) => {
  const logData = {
    userId,
    ipAddress,
    activityType,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync(
    path.join(__dirname, '../logs/security.log'),
    JSON.stringify(logData) + '\n',
    'utf8'
  );
};

// 7. Système d'alerte en temps réel pour les connexions suspectes
const alertSuspiciousActivity = (userEmail) => {
  // Envoyer un email ou une notification pour alerter l'utilisateur d'une activité suspecte
  console.log(`Suspicious activity alert sent to: ${userEmail}`);
};

// Export des fonctions de sécurité
module.exports = {
  generate2FASecret,
  verify2FAToken,
  generate2FAQrCode,
  hashPassword,
  comparePassword,
  generateJWT,
  verifyJWT,
  encryptData,
  decryptData,
  loadFacialRecognitionModel,
  verifyFacialRecognition,
  logSuspiciousActivity,
  alertSuspiciousActivity,
};