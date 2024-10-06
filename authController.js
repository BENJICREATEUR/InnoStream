const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService');
const { sendTwoFactorCode } = require('../services/twoFactorService');

// Générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      isVerified: false,
      twoFactorEnabled: false,
    });

    await user.save();

    // Envoyer l'email de vérification
    sendVerificationEmail(user.email, user._id);

    return res.status(201).json({ message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  const { email, password, twoFactorCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier l'authentification à deux facteurs
    if (user.twoFactorEnabled) {
      const isValidCode = await sendTwoFactorCode(user.email, twoFactorCode);
      if (!isValidCode) {
        return res.status(401).json({ message: 'Code d\'authentification à deux facteurs invalide' });
      }
    }

    // Générer le token JWT
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};

// Vérification de l'email
const verifyEmail = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email vérifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'email :', error);
    return res.status(500).json({ message: 'Erreur lors de la vérification de l\'email.' });
  }
};

// Activer l'authentification à deux facteurs
const enableTwoFactor = async (req, res) => {
  const { userId } = req.user; // Supposé que le middleware de vérification du token JWT a attaché l'utilisateur à req.user

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.twoFactorEnabled = true;
    await user.save();

    return res.status(200).json({ message: 'Authentification à deux facteurs activée.' });
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'authentification à deux facteurs :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'activation de l\'authentification à deux facteurs.' });
  }
};

// Désactiver l'authentification à deux facteurs
const disableTwoFactor = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.twoFactorEnabled = false;
    await user.save();

    return res.status(200).json({ message: 'Authentification à deux facteurs désactivée.' });
  } catch (error) {
    console.error('Erreur lors de la désactivation de l\'authentification à deux facteurs :', error);
    return res.status(500).json({ message: 'Erreur lors de la désactivation de l\'authentification à deux facteurs.' });
  }
};

// Exporter les fonctions
module.exports = {
  register,
  login,
  verifyEmail,
  enableTwoFactor,
  disableTwoFactor,
};