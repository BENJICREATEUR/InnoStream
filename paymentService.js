const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

class PaymentService {
    // Créer un paiement
    static async createPayment(amount, currency, userId) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency,
                metadata: { userId },
            });

            const payment = new Payment({
                userId,
                amount,
                currency,
                status: paymentIntent.status,
                paymentIntentId: paymentIntent.id,
                createdAt: new Date(),
            });

            await payment.save();
            return payment;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }

    // Récupérer l'historique des paiements d'un utilisateur
    static async getUserPayments(userId) {
        try {
            const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
            return payments;
        } catch (error) {
            console.error('Error fetching user payments:', error);
            throw error;
        }
    }

    // Confirmer un paiement
    static async confirmPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                throw new Error('Payment not successful');
            }

            const payment = await Payment.findOne({ paymentIntentId });
            if (!payment) {
                throw new Error('Payment not found');
            }

            payment.status = 'succeeded';
            await payment.save();
            return payment;
        } catch (error) {
            console.error('Error confirming payment:', error);
            throw error;
        }
    }

    // Annuler un paiement
    static async cancelPayment(paymentIntentId) {
        try {
            await stripe.paymentIntents.cancel(paymentIntentId);
            const payment = await Payment.findOne({ paymentIntentId });
            if (payment) {
                payment.status = 'canceled';
                await payment.save();
            }
            return { message: 'Payment canceled successfully' };
        } catch (error) {
            console.error('Error canceling payment:', error);
            throw error;
        }
    }
}

module.exports = PaymentService;