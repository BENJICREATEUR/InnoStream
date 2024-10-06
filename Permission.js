const mongoose = require('mongoose');

// Schéma de permission
const permissionSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'creator', 'moderator', 'admin'], // Rôles d'utilisateur
        required: true
    },
    permissions: {
        canUploadVideo: {
            type: Boolean,
            default: false // Par défaut, seuls les créateurs, modérateurs et administrateurs peuvent uploader
        },
        canLiveStream: {
            type: Boolean,
            default: false // Par défaut, seuls les créateurs avec au moins 1 000 abonnés peuvent streamer en live
        },
        canAccessMarketplace: {
            type: Boolean,
            default: false // Accès limité au marketplace pour certains rôles
        },
        canManageMarketplace: {
            type: Boolean,
            default: false // Gestion du marketplace (modérateurs, administrateurs)
        },
        canModerateContent: {
            type: Boolean,
            default: false // Modération de contenu (uniquement pour les modérateurs et admins)
        },
        canEditProfile: {
            type: Boolean,
            default: true // Par défaut, tous les rôles peuvent éditer leur profil
        },
        canAccessAdminPanel: {
            type: Boolean,
            default: false // Accès au panel administrateur (uniquement admin)
        },
        canReceivePayments: {
            type: Boolean,
            default: false // Paiements reçus (pour créateurs et admins)
        },
        canManagePayments: {
            type: Boolean,
            default: false // Gestion des paiements (administrateurs uniquement)
        },
        canViewStats: {
            type: Boolean,
            default: false // Vue des statistiques (créateurs et admins)
        },
        canViewSensitiveData: {
            type: Boolean,
            default: false // Accès aux données sensibles (administrateurs uniquement)
        },
        canBanUsers: {
            type: Boolean,
            default: false // Bannir des utilisateurs (modérateurs, administrateurs)
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

// Middleware avant de sauvegarder
permissionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Méthode pour vérifier si un utilisateur a une permission spécifique
permissionSchema.methods.hasPermission = function (permission) {
    return this.permissions[permission] === true;
};

// Modèle Permission
const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;