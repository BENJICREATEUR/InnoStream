const mongoose = require('mongoose');

// Définition du schéma pour les logs d'audit
const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User
        required: true
    },
    action: {
        type: String,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'], // Actions possibles
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Date et heure de l'action
    },
    details: {
        type: String, // Détails supplémentaires sur l'action
        required: false
    },
    ipAddress: {
        type: String, // Adresse IP de l'utilisateur
        required: true
    },
    deviceInfo: {
        type: String, // Informations sur le dispositif utilisé
        required: false
    }
});

// Création du modèle AuditLog
const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;