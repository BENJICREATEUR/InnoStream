const Video = require('../models/Video');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { sendNotification } = require('../services/notificationService');

// Modérer un contenu vidéo
const moderateVideo = async (req, res) => {
  const { videoId } = req.params;
  const { action } = req.body; // action peut être "approve" ou "reject"

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée.' });
    }

    if (action === 'approve') {
      video.isApproved = true;
      await video.save();
      return res.status(200).json({ message: 'Vidéo approuvée avec succès.', video });
    } else if (action === 'reject') {
      await video.remove();
      // Notifier l'utilisateur
      const user = await User.findById(video.user);
      if (user) {
        sendNotification(user.email, `Votre vidéo a été rejetée.`);
      }
      return res.status(200).json({ message: 'Vidéo rejetée avec succès.' });
    } else {
      return res.status(400).json({ message: 'Action non valide.' });
    }
  } catch (error) {
    console.error('Erreur lors de la modération de la vidéo :', error);
    return res.status(500).json({ message: 'Erreur lors de la modération de la vidéo.' });
  }
};

// Modérer un commentaire
const moderateComment = async (req, res) => {
  const { commentId } = req.params;
  const { action } = req.body; // action peut être "approve" ou "reject"

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé.' });
    }

    if (action === 'approve') {
      comment.isApproved = true;
      await comment.save();
      return res.status(200).json({ message: 'Commentaire approuvé avec succès.', comment });
    } else if (action === 'reject') {
      await comment.remove();
      // Notifier l'utilisateur
      const user = await User.findById(comment.user);
      if (user) {
        sendNotification(user.email, `Votre commentaire a été rejeté.`);
      }
      return res.status(200).json({ message: 'Commentaire rejeté avec succès.' });
    } else {
      return res.status(400).json({ message: 'Action non valide.' });
    }
  } catch (error) {
    console.error('Erreur lors de la modération du commentaire :', error);
    return res.status(500).json({ message: 'Erreur lors de la modération du commentaire.' });
  }
};

// Obtenir les contenus non modérés
const getUnmoderatedContent = async (req, res) => {
  try {
    const unmoderatedVideos = await Video.find({ isApproved: false });
    const unmoderatedComments = await Comment.find({ isApproved: false });

    return res.status(200).json({
      unmoderatedVideos,
      unmoderatedComments,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus non modérés :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des contenus non modérés.' });
  }
};

// Exporter les fonctions
module.exports = {
  moderateVideo,
  moderateComment,
  getUnmoderatedContent,
};