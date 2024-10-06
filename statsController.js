const User = require('../models/User');
const Video = require('../models/Video');
const { getEngagementStats, getVideoPerformanceStats } = require('../services/statsService');

module.exports = {
  // Get user statistics
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate('videos');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const totalVideos = user.videos.length;
      const totalFollowers = user.followers.length;
      const totalEngagement = user.engagement || 0; // Assume engagement is a field in User model

      res.status(200).json({
        totalVideos,
        totalFollowers,
        totalEngagement,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve user statistics', error });
    }
  },

  // Get video statistics
  async getVideoStats(req, res) {
    try {
      const videoId = req.params.videoId;
      const video = await Video.findById(videoId);

      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      const views = video.views || 0;
      const likes = video.likes || 0;
      const shares = video.shares || 0;

      res.status(200).json({
        videoId,
        views,
        likes,
        shares,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve video statistics', error });
    }
  },

  // Get engagement statistics
  async getEngagementStatistics(req, res) {
    try {
      const stats = await getEngagementStats();

      if (!stats) {
        return res.status(404).json({ message: 'No engagement statistics found' });
      }

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve engagement statistics', error });
    }
  },

  // Get performance statistics for a video
  async getVideoPerformance(req, res) {
    try {
      const videoId = req.params.videoId;
      const performanceStats = await getVideoPerformanceStats(videoId);

      if (!performanceStats) {
        return res.status(404).json({ message: 'No performance statistics found for this video' });
      }

      res.status(200).json(performanceStats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve video performance statistics', error });
    }
  },

  // Get overall platform statistics
  async getPlatformStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalVideos = await Video.countDocuments();

      res.status(200).json({
        totalUsers,
        totalVideos,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve platform statistics', error });
    }
  },
};