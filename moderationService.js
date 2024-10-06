const Video = require('../models/Video');
const Message = require('../models/Message');
const User = require('../models/User');

class ModerationService {
    // Modérer un contenu vidéo
    static async moderateVideo(videoId, action) {
        try {
            const video = await Video.findById(videoId);
            if (!video) {
                throw new Error('Video not found');
            }

            if (action === 'delete') {
                await video.remove();
                return { message: 'Video deleted successfully' };
            } else if (action === 'suspend') {
                video.isSuspended = true;
                await video.save();
                return { message: 'Video has been suspended' };
            } else {
                throw new Error('Invalid action');
            }
        } catch (error) {
            console.error('Error moderating video:', error);
            throw error;
        }
    }

    // Modérer un message
    static async moderateMessage(messageId, action) {
        try {
            const message = await Message.findById(messageId);
            if (!message) {
                throw new Error('Message not found');
            }

            if (action === 'delete') {
                await message.remove();
                return { message: 'Message deleted successfully' };
            } else {
                throw new Error('Invalid action');
            }
        } catch (error) {
            console.error('Error moderating message:', error);
            throw error;
        }
    }

    // Suspendre un utilisateur
    static async suspendUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.isSuspended = true;
            await user.save();
            return { message: 'User suspended successfully' };
        } catch (error) {
            console.error('Error suspending user:', error);
            throw error;
        }
    }

    // Lever la suspension d'un utilisateur
    static async unsuspendUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.isSuspended = false;
            await user.save();
            return { message: 'User unsuspended successfully' };
        } catch (error) {
            console.error('Error unsuspending user:', error);
            throw error;
        }
    }
}

module.exports = ModerationService;