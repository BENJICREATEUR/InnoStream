const express = require('express');
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour envoyer un message privé
router.post('/send', requireAuth, messageController.sendMessage);

// Route pour récupérer les messages d'un chat privé
router.get('/chat/:userId', requireAuth, messageController.getChatMessages);

// Route pour créer un groupe de discussion
router.post('/group/create', requireAuth, messageController.createGroup);

// Route pour envoyer un message dans un groupe
router.post('/group/:groupId/message', requireAuth, messageController.sendGroupMessage);

// Route pour obtenir les messages d'un groupe
router.get('/group/:groupId', requireAuth, messageController.getGroupMessages);

// Route pour signaler un message (pour modération)
router.post('/report/:messageId', requireAuth, messageController.reportMessage);

module.exports = router;