const mongoose = require('mongoose');

// Schéma pour les rôles des utilisateurs
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['user', 'creator', 'moderator', 'admin'], // Rôles possibles sur InnoStream
        required: true
    },
    permissions: {
        canUploadVideo: {
            type: Boolean,
            default: false // Seuls les créateurs et au-dessus peuvent uploader des vidéos
        },
        canLiveStream: {
            type: Boolean,
            default: false // Les créateurs ayant 1 000 abonnés ou plus peuvent streamer
        },
        canAccessMarketplace: {
            type: Boolean,
            default: false // Accès au marketplace pour les créateurs, modérateurs et admins
        },
        canManageMarketplace: {
            type: Boolean,
            default: false // Gestion du marketplace (modérateurs et administrateurs)
        },
        canModerateContent: {
            type: Boolean,
            default: false // Modération des vidéos et des commentaires pour les modérateurs/admins
        },
        canEditProfile: {
            type: Boolean,
            default: true // Tous les rôles peuvent éditer leur profil
        },
        canAccessAdminPanel: {
            type: Boolean,
            default: false // Seulement pour les administrateurs
        },
        canReceivePayments: {
            type: Boolean,
            default: false // Pour les créateurs et les administrateurs
        },
        canManagePayments: {
            type: Boolean,
            default: false // Gestion des paiements réservée aux administrateurs
        },
        canViewStats: {
            type: Boolean,
            default: false // Accès aux statistiques pour les créateurs et administrateurs
        },
        canBanUsers: {
            type: Boolean,
            default: false // Pouvoir de bannir des utilisateurs (modérateurs/admins)
        },
        canViewSensitiveData: {
            type: Boolean,
            default: false // Administrateurs peuvent voir les données sensibles
        },
        canCreateSponsoredContent: {
            type: Boolean,
            default: false // Seuls les créateurs et administrateurs peuvent créer du contenu sponsorisé
        },
        canEditSponsoredContent: {
            type: Boolean,
            default: false // Seuls les administrateurs peuvent éditer du contenu sponsorisé
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour mettre à jour la date à chaque sauvegarde
roleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Méthode pour vérifier les permissions associées à un rôle
roleSchema.methods.hasPermission = function(permission) {
    return this.permissions[permission] === true;
};

// Modèle de rôle
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;