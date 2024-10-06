const express = require('express');
const moderationController = require('../controllers/moderationController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour modérer le contenu (signaler un utilisateur, vidéo, etc.)
router.post('/report/user/:userId', requireAuth, moderationController.reportUser);
router.post('/report/video/:videoId', requireAuth, moderationController.reportVideo);
router.post('/report/comment/:commentId', requireAuth, moderationController.reportComment);

// Route pour obtenir les rapports de modération
router.get('/reports', requireAuth, requireAdmin, moderationController.getReports);

// Route pour prendre des mesures sur un rapport
router.post('/action/:reportId', requireAuth, requireAdmin, moderationController.takeActionOnReport);

// Route pour gérer les utilisateurs suspendus
router.post('/suspend/:userId', requireAuth, requireAdmin, moderationController.suspendUser);
router.post('/unsuspend/:userId', requireAuth, requireAdmin, moderationController.unsuspendUser);

module.exports = router;