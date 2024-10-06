const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

// Fonction pour créer un client Stripe
const createStripeCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer: ', error);
    throw error;
  }
};

// Fonction pour créer un paiement unique
const createPayment = async (amount, currency, customerId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment: ', error);
    throw error;
  }
};

// Fonction pour créer un abonnement
const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription: ', error);
    throw error;
  }
};

// Fonction pour récupérer un client Stripe
const getStripeCustomer = async (customerId) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Error retrieving Stripe customer: ', error);
    throw error;
  }
};

// Fonction pour gérer les webhooks Stripe
const handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Error verifying Stripe webhook: ', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      // Handle successful payment
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Invoice payment succeeded!', invoice);
      // Handle successful invoice payment
      break;
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      console.log('Subscription updated:', subscription);
      // Handle subscription update
      break;
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription deleted:', deletedSubscription);
      // Handle subscription cancellation
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Fonction pour créer un paiement par carte
const createCardPayment = async (amount, currency, customerId, source) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: source,
      confirmation_method: 'automatic',
      confirm: true,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating card payment: ', error);
    throw error;
  }
};

// Export des fonctions Stripe
module.exports = {
  createStripeCustomer,
  createPayment,
  createSubscription,
  getStripeCustomer,
  handleWebhook,
  createCardPayment,
};