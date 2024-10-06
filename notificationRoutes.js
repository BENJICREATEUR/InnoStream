const express = require('express');
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour obtenir les notifications de l'utilisateur
router.get('/', requireAuth, notificationController.getUserNotifications);

// Route pour marquer une notification comme lue
router.post('/mark-as-read/:notificationId', requireAuth, notificationController.markNotificationAsRead);

// Route pour supprimer une notification
router.delete('/:notificationId', requireAuth, notificationController.deleteNotification);

// Route pour créer une notification (pour les administrateurs)
router.post('/', requireAuth, notificationController.createNotification);

module.exports = router;