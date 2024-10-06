const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

class AuthService {
    static async register(userData) {
        const { email, password } = userData;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            ...userData,
            password: hashedPassword,
        });

        // Enregistrer l'utilisateur dans la base de données
        await newUser.save();
        
        // Envoyer un email de vérification (si nécessaire)
        await sendEmail(newUser.email, 'Verification Email', 'Please verify your email.');

        return newUser;
    }

    static async login(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        // Créer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return { user, token };
    }

    static async logout(userId) {
        // Logique pour déconnecter l'utilisateur (peut être gérée par le front-end)
        console.log(`User ${userId} logged out`);
    }

    static async verifyEmail(token) {
        // Logique de vérification de l'email
        // Implémentez la vérification ici
    }
}

module.exports = AuthService;