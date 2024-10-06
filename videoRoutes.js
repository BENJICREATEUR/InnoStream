const express = require('express');
const videoController = require('../controllers/videoController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour télécharger une vidéo
router.post('/upload', requireAuth, videoController.uploadVideo);

// Route pour obtenir les détails d'une vidéo
router.get('/:videoId', videoController.getVideoDetails);

// Route pour récupérer la liste des vidéos d'un utilisateur
router.get('/user/:userId', requireAuth, videoController.getUserVideos);

// Route pour supprimer une vidéo
router.delete('/:videoId', requireAuth, videoController.deleteVideo);

// Route pour liker ou disliker une vidéo
router.post('/:videoId/like', requireAuth, videoController.likeVideo);
router.post('/:videoId/dislike', requireAuth, videoController.dislikeVideo);

// Route pour commenter une vidéo
router.post('/:videoId/comment', requireAuth, videoController.commentOnVideo);

// Route pour signaler une vidéo
router.post('/:videoId/report', requireAuth, videoController.reportVideo);

module.exports = router;