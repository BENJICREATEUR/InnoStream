const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    bio: {
        type: String,
        default: '',
        maxlength: 160
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    stripeCustomerId: {
        type: String, // Identifiant client Stripe pour les paiements et abonnements
        default: null
    },
    twoFactorAuth: {
        isEnabled: {
            type: Boolean,
            default: false
        },
        secret: {
            type: String,
            default: ''
        }
    },
    faceIdEnabled: {
        type: Boolean,
        default: false // Reconnaissance faciale pour la sécurité supplémentaire
    },
    liveStreamAccess: {
        type: Boolean,
        default: false // Accès aux livestreams sponsorisés (pour les créateurs avec 1 000 abonnés)
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    isBanned: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour le hachage du mot de passe avant la sauvegarde
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    // Hacher le mot de passe
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Middleware pour mettre à jour la date lors de chaque modification
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Vérification du mot de passe
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Génération du token JWT
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Génération du token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valide pendant 10 minutes
    return resetToken;
};

// Méthode pour suivre un utilisateur
userSchema.methods.subscribeToUser = function (userId) {
    if (!this.subscriptions.includes(userId)) {
        this.subscriptions.push(userId);
        return true;
    }
    return false;
};

// Méthode pour désabonner un utilisateur
userSchema.methods.unsubscribeFromUser = function (userId) {
    this.subscriptions = this.subscriptions.filter(id => id.toString() !== userId.toString());
};

// Méthode pour activer ou désactiver l'accès aux livestreams
userSchema.methods.toggleLiveStreamAccess = function () {
    this.liveStreamAccess = !this.liveStreamAccess;
};

// Modèle User
const User = mongoose.model('User', userSchema);

module.exports = User;