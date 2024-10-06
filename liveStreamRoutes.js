const express = require('express');
const liveStreamController = require('../controllers/liveStreamController');
const { requireAuth, checkLiveStreamAccess } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour créer un live stream personnel
router.post('/create', requireAuth, liveStreamController.createLiveStream);

// Route pour rejoindre un live stream (clé numérique pour accès sponsorisé)
router.post('/join/:liveStreamId', requireAuth, checkLiveStreamAccess, liveStreamController.joinLiveStream);

// Route pour mettre fin à un live stream
router.post('/end/:liveStreamId', requireAuth, liveStreamController.endLiveStream);

// Route pour obtenir les statistiques d'un live stream
router.get('/stats/:liveStreamId', requireAuth, liveStreamController.getLiveStreamStats);

// Route pour signaler un live stream
router.post('/report/:liveStreamId', requireAuth, liveStreamController.reportLiveStream);

// Route pour lister tous les live streams disponibles (publics)
router.get('/public', liveStreamController.listPublicLiveStreams);

module.exports = router;