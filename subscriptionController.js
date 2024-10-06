const User = require('../models/User');
const { createSubscription, cancelSubscription, getSubscriptionDetails } = require('../services/subscriptionService');
const { stripe } = require('../config/stripe'); // Assurez-vous d'avoir configuré Stripe

module.exports = {
  // Subscribe a user to a plan
  async subscribe(req, res) {
    try {
      const userId = req.user.id;
      const { planId } = req.body;

      // Create subscription using Stripe
      const subscription = await createSubscription(userId, planId);
      const user = await User.findById(userId);

      user.subscriptionId = subscription.id;
      user.subscriptionStatus = 'active'; // Assume 'active' is a status field for subscriptions
      await user.save();

      res.status(200).json({
        message: 'Subscription successful',
        subscriptionId: subscription.id,
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to subscribe user', error });
    }
  },

  // Cancel a user's subscription
  async cancel(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user || !user.subscriptionId) {
        return res.status(404).json({ message: 'No active subscription found' });
      }

      // Cancel subscription using Stripe
      await cancelSubscription(user.subscriptionId);
      user.subscriptionStatus = 'canceled';
      await user.save();

      res.status(200).json({
        message: 'Subscription canceled successfully',
        subscriptionStatus: user.subscriptionStatus,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to cancel subscription', error });
    }
  },

  // Get the subscription details
  async getDetails(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('subscriptionId subscriptionStatus');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const subscriptionDetails = await getSubscriptionDetails(user.subscriptionId);

      res.status(200).json({
        subscriptionId: user.subscriptionId,
        subscriptionStatus: user.subscriptionStatus,
        details: subscriptionDetails,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve subscription details', error });
    }
  },

  // Update subscription plan
  async updatePlan(req, res) {
    try {
      const userId = req.user.id;
      const { newPlanId } = req.body;
      const user = await User.findById(userId);

      if (!user || !user.subscriptionId) {
        return res.status(404).json({ message: 'No active subscription found' });
      }

      // Update subscription plan using Stripe
      const updatedSubscription = await stripe.subscriptions.update(user.subscriptionId, {
        items: [{
          id: user.subscriptionId,
          plan: newPlanId,
        }],
      });

      user.subscriptionId = updatedSubscription.id; // Update subscription ID if it changes
      await user.save();

      res.status(200).json({
        message: 'Subscription plan updated successfully',
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update subscription plan', error });
    }
  },
};