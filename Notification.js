const mongoose = require('mongoose');

// Définition du schéma pour les notifications
const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur qui reçoit la notification
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur qui a déclenché l'événement (facultatif, dépend du type de notification)
        required: false
    },
    type: {
        type: String,
        enum: [
            'new_follower', // Un nouvel utilisateur a commencé à suivre
            'new_message', // Nouveau message reçu
            'live_start', // Un live stream a commencé
            'transaction_update', // Mise à jour d'une transaction (paiement, abonnement, etc.)
            'suspicious_activity', // Activité suspecte détectée
            'like', // Notification de "J'aime" sur une vidéo ou un commentaire
            'comment', // Notification de commentaire sur une vidéo
            'subscription_renewal', // Renouvellement d'abonnement
            'system_alert' // Notification pour une alerte système (ex: problème de sécurité)
        ],
        required: true
    },
    message: {
        type: String,
        required: true // Message de notification à afficher
    },
    isRead: {
        type: Boolean,
        default: false // Statut de lecture de la notification
    },
    createdAt: {
        type: Date,
        default: Date.now // Date et heure de la notification
    },
    meta: {
        type: Object,
        default: {} // Stocke des métadonnées supplémentaires selon le type de notification
    }
});

// Middleware avant la sauvegarde, peut inclure des traitements comme l'envoi de notification push
notificationSchema.pre('save', async function (next) {
    // Vous pouvez implémenter une logique ici pour envoyer une notification push ou un email.
    next();
});

// Méthode pour marquer une notification comme lue
notificationSchema.methods.markAsRead = async function () {
    this.isRead = true;
    await this.save();
};

// Création du modèle Notification
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;