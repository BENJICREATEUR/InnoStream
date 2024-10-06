const Message = require('../models/Message');
const User = require('../models/User');

class MessageService {
    // Envoyer un message
    static async sendMessage(senderId, receiverId, content) {
        try {
            const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                timestamp: new Date(),
            });
            await message.save();
            return message;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Récupérer tous les messages entre deux utilisateurs
    static async getMessagesBetweenUsers(userId1, userId2) {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 },
                ]
            }).sort({ timestamp: 1 });

            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Récupérer tous les messages d'un utilisateur
    static async getMessagesByUser(userId) {
        try {
            const messages = await Message.find({
                $or: [{ sender: userId }, { receiver: userId }],
            }).sort({ timestamp: 1 });

            return messages;
        } catch (error) {
            console.error('Error fetching user messages:', error);
            throw error;
        }
    }

    // Supprimer un message
    static async deleteMessage(messageId, userId) {
        try {
            const message = await Message.findById(messageId);
            if (!message) {
                throw new Error('Message not found');
            }
            if (message.sender.toString() !== userId) {
                throw new Error('Unauthorized');
            }
            await message.remove();
            return { message: 'Message deleted successfully' };
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
}

module.exports = MessageService;