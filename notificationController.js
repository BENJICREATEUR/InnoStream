const Notification = require('../models/Notification');
const User = require('../models/User');

// Créer une nouvelle notification
const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      isRead: false,
      createdAt: new Date(),
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification :', error);
    throw new Error('Erreur lors de la création de la notification.');
  }
};

// Obtenir les notifications pour un utilisateur
const getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des notifications.' });
  }
};

// Marquer une notification comme lue
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée.' });
    }

    notification.isRead = true;
    await notification.save();
    return res.status(200).json({ message: 'Notification marquée comme lue.', notification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification :', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification.' });
  }
};

// Supprimer une notification
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée.' });
    }

    await notification.remove();
    return res.status(200).json({ message: 'Notification supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la notification.' });
  }
};

// Exporter les fonctions
module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
};