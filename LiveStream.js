const mongoose = require('mongoose');

// Définition du schéma pour les flux en direct
const liveStreamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true
    },
    title: {
        type: String,
        required: true // Titre du flux en direct
    },
    description: {
        type: String,
        required: false // Description facultative
    },
    thumbnailUrl: {
        type: String,
        required: false // URL de la miniature du flux
    },
    isLive: {
        type: Boolean,
        default: false // Indique si le flux est en direct
    },
    startTime: {
        type: Date,
        required: true // Heure de début du flux
    },
    endTime: {
        type: Date,
        required: false // Heure de fin du flux (facultatif, peut être mis à jour après le flux)
    },
    viewersCount: {
        type: Number,
        default: 0 // Nombre de spectateurs actuels
    },
    liveKey: {
        type: String,
        required: true // Clé de streaming pour le flux
    },
    createdAt: {
        type: Date,
        default: Date.now // Date de création du flux
    },
    updatedAt: {
        type: Date,
        default: Date.now // Date de dernière mise à jour
    }
});

// Middleware pour mettre à jour le champ updatedAt avant la sauvegarde
liveStreamSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Création du modèle LiveStream
const LiveStream = mongoose.model('LiveStream', liveStreamSchema);

module.exports = LiveStream;