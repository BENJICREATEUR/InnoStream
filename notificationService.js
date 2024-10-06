const Notification = require('../models/Notification');

class NotificationService {
    // Envoyer une notification à un utilisateur
    static async sendNotification(userId, title, message) {
        try {
            const notification = new Notification({
                userId,
                title,
                message,
                read: false,
                createdAt: new Date(),
            });
            await notification.save();
            return notification;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    // Récupérer toutes les notifications d'un utilisateur
    static async getUserNotifications(userId) {
        try {
            const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    // Marquer une notification comme lue
    static async markNotificationAsRead(notificationId) {
        try {
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }
            notification.read = true;
            await notification.save();
            return { message: 'Notification marked as read' };
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Supprimer une notification
    static async deleteNotification(notificationId) {
        try {
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                throw new Error('Notification not found');
            }
            await notification.remove();
            return { message: 'Notification deleted successfully' };
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    }
}

module.exports = NotificationService;