const mongoose = require('mongoose');

// Définition du schéma pour les paiements
const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence à l'utilisateur qui effectue le paiement
        required: true
    },
    paymentType: {
        type: String,
        enum: [
            'subscription', // Paiement pour un abonnement
            'marketplace_purchase', // Achat sur le marketplace
            'creator_payout', // Rémunération du créateur
            'live_access', // Accès aux lives sponsorisés
            'donation', // Donation ou tip à un créateur
            'ad_revenue' // Revenus générés par des publicités (1 000 vues par exemple)
        ],
        required: true
    },
    amount: {
        type: Number,
        required: true // Montant du paiement
    },
    currency: {
        type: String,
        default: 'EUR' // Devise par défaut, modifiable si nécessaire
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'], // Statut du paiement
        default: 'pending'
    },
    transactionId: {
        type: String, // Identifiant de la transaction généré par Stripe ou autre
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now // Date et heure du paiement
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    meta: {
        type: Object, // Détails supplémentaires liés au paiement (ID de produit, période d'abonnement, etc.)
        default: {}
    }
});

// Middleware avant la sauvegarde, peut inclure une mise à jour des détails de transaction via Stripe
paymentSchema.pre('save', async function (next) {
    // Vous pouvez implémenter ici des vérifications supplémentaires, ou interagir avec une API de paiement comme Stripe
    if (!this.transactionId) {
        // Logique pour générer un identifiant de transaction si manquant
    }
    next();
});

// Méthode pour marquer un paiement comme complété
paymentSchema.methods.markAsCompleted = async function () {
    this.status = 'completed';
    this.updatedAt = Date.now();
    await this.save();
};

// Méthode pour traiter un remboursement
paymentSchema.methods.processRefund = async function () {
    this.status = 'refunded';
    this.updatedAt = Date.now();
    await this.save();
};

// Création du modèle Payment
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;