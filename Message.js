const mongoose = require('mongoose');

// Définition du schéma pour les messages
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'expéditeur du message
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au destinataire du message, peut être null pour les messages de groupe
        required: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group', // Référence à un groupe, si le message est envoyé dans un groupe
        required: false
    },
    content: {
        type: String,
        required: true // Contenu du message
    },
    translatedContent: {
        type: String,
        required: false // Contenu traduit du message selon la langue du destinataire
    },
    language: {
        type: String,
        required: false, // Langue originale du message (pour la traduction automatique)
        default: 'en' // Par défaut, en anglais
    },
    createdAt: {
        type: Date,
        default: Date.now // Date d'envoi du message
    },
    isRead: {
        type: Boolean,
        default: false // Indique si le message a été lu par le destinataire
    },
    attachments: [{
        url: {
            type: String,
            required: false // URL d'un fichier ou d'une image attachée au message
        },
        fileType: {
            type: String,
            required: false // Type du fichier attaché (image, vidéo, document, etc.)
        }
    }]
});

// Middleware pour mettre à jour les champs nécessaires avant la sauvegarde
messageSchema.pre('save', async function (next) {
    if (this.isModified('content')) {
        // Exemple d'intégration de la traduction automatique des messages ici
        // Vous pouvez appeler un service de traduction comme Google Translate API pour générer 'translatedContent'
        // Par exemple : this.translatedContent = await translateService.translate(this.content, targetLanguage);
    }
    next();
});

// Création du modèle Message
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;