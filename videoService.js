const Video = require('../models/Video');
const S3Service = require('./s3Service');
const QueueService = require('./queueService');

class VideoService {
    // Télécharger une vidéo et l'enregistrer dans la base de données
    static async uploadVideo(file, userId, title, description) {
        try {
            // Télécharger la vidéo sur S3
            const videoUrl = await S3Service.uploadFile(file);

            // Créer une nouvelle entrée de vidéo dans la base de données
            const video = new Video({
                userId,
                title,
                description,
                url: videoUrl,
                views: 0,
                likes: 0,
                dislikes: 0,
                createdAt: new Date(),
            });

            await video.save();
            return video;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    }

    // Récupérer toutes les vidéos d'un utilisateur
    static async getUserVideos(userId) {
        try {
            const videos = await Video.find({ userId }).sort({ createdAt: -1 });
            return videos;
        } catch (error) {
            console.error('Error fetching user videos:', error);
            throw error;
        }
    }

    // Récupérer une vidéo par ID
    static async getVideoById(videoId) {
        try {
            const video = await Video.findById(videoId);
            if (!video) {
                throw new Error('Video not found');
            }
            return video;
        } catch (error) {
            console.error('Error fetching video:', error);
            throw error;
        }
    }

    // Incrémenter le nombre de vues d'une vidéo
    static async incrementViews(videoId) {
        try {
            await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
        } catch (error) {
            console.error('Error incrementing views:', error);
            throw error;
        }
    }

    // Ajouter un like à une vidéo
    static async likeVideo(videoId) {
        try {
            await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });
        } catch (error) {
            console.error('Error liking video:', error);
            throw error;
        }
    }

    // Ajouter un dislike à une vidéo
    static async dislikeVideo(videoId) {
        try {
            await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } });
        } catch (error) {
            console.error('Error disliking video:', error);
            throw error;
        }
    }

    // Supprimer une vidéo
    static async deleteVideo(videoId) {
        try {
            const video = await Video.findById(videoId);
            if (!video) {
                throw new Error('Video not found');
            }
            // Supprimer la vidéo de S3
            const fileName = video.url.split('/').pop(); // Extraire le nom du fichier
            await S3Service.deleteFile(fileName);
            await Video.findByIdAndDelete(videoId);
            return { message: 'Video deleted successfully' };
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    }
}

module.exports = VideoService;