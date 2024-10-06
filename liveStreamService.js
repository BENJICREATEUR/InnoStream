const LiveStream = require('../models/LiveStream');
const User = require('../models/User');
const NotificationService = require('./notificationService');

class LiveStreamService {
    // Créer un nouveau live stream
    static async createLiveStream(streamData, userId) {
        try {
            const stream = new LiveStream({
                ...streamData,
                userId,
                createdAt: new Date(),
            });
            await stream.save();

            // Notification à l'utilisateur que le live a été créé
            await NotificationService.sendNotification(userId, 'Live Stream Created', `Your live stream "${stream.title}" has been created successfully.`);

            return stream;
        } catch (error) {
            console.error('Error creating live stream:', error);
            throw error;
        }
    }

    // Récupérer tous les live streams
    static async getAllLiveStreams() {
        try {
            const streams = await LiveStream.find().populate('userId', 'username');
            return streams;
        } catch (error) {
            console.error('Error fetching live streams:', error);
            throw error;
        }
    }

    // Récupérer un live stream par ID
    static async getLiveStreamById(streamId) {
        try {
            const stream = await LiveStream.findById(streamId).populate('userId', 'username');
            if (!stream) {
                throw new Error('Live stream not found');
            }
            return stream;
        } catch (error) {
            console.error('Error fetching live stream:', error);
            throw error;
        }
    }

    // Mettre à jour un live stream
    static async updateLiveStream(streamId, updateData, userId) {
        try {
            const stream = await LiveStream.findById(streamId);
            if (!stream) {
                throw new Error('Live stream not found');
            }
            if (stream.userId.toString() !== userId) {
                throw new Error('Unauthorized');
            }
            Object.assign(stream, updateData);
            await stream.save();
            return stream;
        } catch (error) {
            console.error('Error updating live stream:', error);
            throw error;
        }
    }

    // Supprimer un live stream
    static async deleteLiveStream(streamId, userId) {
        try {
            const stream = await LiveStream.findById(streamId);
            if (!stream) {
                throw new Error('Live stream not found');
            }
            if (stream.userId.toString() !== userId) {
                throw new Error('Unauthorized');
            }
            await stream.remove();
            return { message: 'Live stream deleted successfully' };
        } catch (error) {
            console.error('Error deleting live stream:', error);
            throw error;
        }
    }
}

module.exports = LiveStreamService;