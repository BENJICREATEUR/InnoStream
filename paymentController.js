const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

// Créer un paiement pour les abonnements
const createSubscription = async (req, res) => {
  const { userId, paymentMethodId, planId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // Enregistrer le paiement dans la base de données
    const payment = new Payment({
      user: userId,
      amount: subscription.latest_invoice.amount / 100, // Convertir en unité monétaire
      currency: subscription.currency,
      status: subscription.status,
      subscriptionId: subscription.id,
    });

    await payment.save();

    return res.status(200).json({ subscription, payment });
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement :', error);
    return res.status(500).json({ message: 'Erreur lors de la création de l\'abonnement.' });
  }
};

// Récupérer les paiements d'un utilisateur
const getUserPayments = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des paiements.' });
  }
};

// Gérer les webhooks de Stripe
const handleStripeWebhook = async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Traiter le paiement réussi
      console.log('PaymentIntent was successful!', paymentIntent);
      break;

    case 'invoice.payment_failed':
      const invoice = event.data.object;
      // Gérer l'échec du paiement
      console.log('Invoice payment failed!', invoice);
      break;

      // Ajouter d'autres types d'événements si nécessaire

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Répondre avec un statut 200 pour indiquer que l'événement a été traité
  res.status(200).json({ received: true });
};

// Exporter les fonctions
module.exports = {
  createSubscription,
  getUserPayments,
  handleStripeWebhook,
};