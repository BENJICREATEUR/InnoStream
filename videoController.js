const Video = require('../models/Video');
const User = require('../models/User');
const { uploadVideoFile, deleteVideoFile } = require('../services/cloudStorageService');
const { sendNotification } = require('../services/notificationService');

module.exports = {
  // Upload a new video
  async uploadVideo(req, res) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!title || !description || !req.file) {
        return res.status(400).json({ message: 'Title, description, and video file are required.' });
      }

      // Upload the video file
      const videoUrl = await uploadVideoFile(req.file);
      const newVideo = new Video({
        title,
        description,
        videoUrl,
        user: userId,
        createdAt: new Date(),
      });

      await newVideo.save();

      // Update user video count
      await User.findByIdAndUpdate(userId, { $inc: { videoCount: 1 } });

      // Send notification to followers
      await sendNotification(userId, 'New video uploaded', newVideo._id);

      res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload video', error });
    }
  },

  // Get video by ID
  async getVideo(req, res) {
    try {
      const video = await Video.findById(req.params.videoId).populate('user', 'username profilePicture');
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve video', error });
    }
  },

  // Get all videos by user
  async getUserVideos(req, res) {
    try {
      const videos = await Video.find({ user: req.params.userId }).populate('user', 'username profilePicture').sort({ createdAt: -1 });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve videos', error });
    }
  },

  // Update video details
  async updateVideo(req, res) {
    try {
      const { title, description } = req.body;

      // Validate input
      if (!title && !description && !req.file) {
        return res.status(400).json({ message: 'At least one field is required to update.' });
      }

      const video = await Video.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      if (title) video.title = title;
      if (description) video.description = description;

      if (req.file) {
        // Delete the old video file
        await deleteVideoFile(video.videoUrl);
        // Upload the new video file
        video.videoUrl = await uploadVideoFile(req.file);
      }

      await video.save();
      res.json({ message: 'Video updated successfully', video });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update video', error });
    }
  },

  // Delete a video
  async deleteVideo(req, res) {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // Delete the video file from cloud storage
      await deleteVideoFile(video.videoUrl);
      await video.remove();

      // Update user video count
      await User.findByIdAndUpdate(video.user, { $inc: { videoCount: -1 } });

      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete video', error });
    }
  },

  // Get all videos
  async getAllVideos(req, res) {
    try {
      const videos = await Video.find().populate('user', 'username profilePicture').sort({ createdAt: -1 });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve videos', error });
    }
  },

  // Like a video
  async likeVideo(req, res) {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      if (video.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'You have already liked this video' });
      }

      video.likes.push(req.user.id);
      await video.save();

      res.json({ message: 'Video liked successfully', likes: video.likes.length });
    } catch (error) {
      res.status(500).json({ message: 'Failed to like video', error });
    }
  },

  // Unlike a video
  async unlikeVideo(req, res) {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      if (!video.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'You have not liked this video' });
      }

      video.likes = video.likes.filter(userId => userId.toString() !== req.user.id.toString());
      await video.save();

      res.json({ message: 'Video unliked successfully', likes: video.likes.length });
    } catch (error) {
      res.status(500).json({ message: 'Failed to unlike video', error });
    }
  },
};