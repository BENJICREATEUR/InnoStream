const Message = require('../models/Message');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

// Envoyer un message
const sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user.id;

  try {
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
      createdAt: new Date(),
    });

    await message.save();

    // Notifier le destinataire
    const recipient = await User.findById(recipientId);
    if (recipient) {
      sendNotification(recipient.email, `Vous avez reçu un nouveau message de ${req.user.email}.`);
    }

    return res.status(201).json({ message: 'Message envoyé avec succès.', message });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'envoi du message.' });
  }
};

// Obtenir tous les messages d'un utilisateur
const getUserMessages = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate('sender', 'email')
      .populate('recipient', 'email')
      .sort({ createdAt: -1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
  }
};

// Obtenir les messages entre deux utilisateurs
const getMessagesBetweenUsers = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .populate('sender', 'email')
      .populate('recipient', 'email')
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages entre utilisateurs :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des messages.' });
  }
};

// Supprimer un message
const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    // Vérifier si l'utilisateur a le droit de supprimer le message
    if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission de supprimer ce message.' });
    }

    await message.remove();
    return res.status(200).json({ message: 'Message supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression du message.' });
  }
};

// Exporter les fonctions
module.exports = {
  sendMessage,
  getUserMessages,
  getMessagesBetweenUsers,
  deleteMessage,
};