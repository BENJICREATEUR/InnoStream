const express = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour la vérification de l'email
router.get('/verify-email/:token', authController.verifyEmail);

// Route pour l'authentification à deux facteurs (2FA)
router.post('/2fa/verify', requireAuth, authController.verify2FA);

// Route pour la réinitialisation de mot de passe
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Authentification via OAuth (Google, Facebook, etc.)
router.get('/oauth/:provider', authController.oauthRedirect);
router.get('/oauth/:provider/callback', authController.oauthCallback);

// Route pour la déconnexion
router.post('/logout', requireAuth, authController.logout);

module.exports = router;