const mongoose = require('mongoose');

// Schéma pour les produits du marketplace
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'EUR' // Monnaie par défaut
    },
    quantityAvailable: {
        type: Number,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle utilisateur (créateur)
        required: true
    },
    category: {
        type: String,
        enum: ['personal', 'sponsored'], // Types de produits : personnel ou sponsorisé
        required: true
    },
    sponsoredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sponsor', // Référence au modèle Sponsor pour les produits sponsorisés
        default: null
    },
    imageUrl: {
        type: String,
        required: true
    },
    commissionRate: {
        type: Number,
        default: 10, // Commission de 10 % par défaut pour InnoStream
        min: 0,
        max: 100
    },
    salesCount: {
        type: Number,
        default: 0 // Nombre de ventes réalisées
    },
    status: {
        type: String,
        enum: ['available', 'out_of_stock', 'discontinued'], // Statut du produit
        default: 'available'
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

// Méthode pour calculer le montant de la commission
productSchema.methods.calculateCommission = function() {
    const commission = (this.price * this.commissionRate) / 100;
    return commission;
};

// Méthode pour vérifier la disponibilité du produit
productSchema.methods.isAvailable = function() {
    return this.status === 'available' && this.quantityAvailable > 0;
};

// Middleware avant de sauvegarder pour mettre à jour la date
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Modèle de produit
const Product = mongoose.model('Product', productSchema);

module.exports = Product;