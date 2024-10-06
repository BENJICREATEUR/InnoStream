const express = require('express');
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour initier un paiement
router.post('/initiate', requireAuth, paymentController.initiatePayment);

// Route pour traiter le paiement (via webhook Stripe)
router.post('/webhook', paymentController.handleStripeWebhook);

// Route pour récupérer l'historique des paiements de l'utilisateur
router.get('/history', requireAuth, paymentController.getPaymentHistory);

// Route pour rembourser un paiement
router.post('/refund/:paymentId', requireAuth, paymentController.refundPayment);

module.exports = router;