const User = require('../models/User');
const { uploadProfileImage } = require('../services/cloudStorageService');
const { handleError } = require('../utils/errorHandler'); // Utilitaire pour gérer les erreurs

module.exports = {
  // Fetch user profile details
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .populate('followers', 'username profilePicture')
        .populate('following', 'username profilePicture');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      handleError(res, 'Failed to fetch profile', error);
    }
  },

  // Update user profile information
  async updateProfile(req, res) {
    try {
      const { username, bio } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.username = username || user.username;
      user.bio = bio || user.bio;

      await user.save();
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      handleError(res, 'Failed to update profile', error);
    }
  },

  // Update profile picture
  async updateProfilePicture(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageUrl = await uploadProfileImage(req.file);
      user.profilePicture = imageUrl;

      await user.save();
      res.json({ message: 'Profile picture updated successfully', profilePicture: imageUrl });
    } catch (error) {
      handleError(res, 'Failed to update profile picture', error);
    }
  },

  // Get user's followers and following details
  async getFollowers(req, res) {
    try {
      const user = await User.findById(req.user.id).populate('followers', 'username profilePicture');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ followers: user.followers });
    } catch (error) {
      handleError(res, 'Failed to fetch followers', error);
    }
  },

  async getFollowing(req, res) {
    try {
      const user = await User.findById(req.user.id).populate('following', 'username profilePicture');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ following: user.following });
    } catch (error) {
      handleError(res, 'Failed to fetch following', error);
    }
  },

  // Follow another user
  async followUser(req, res) {
    try {
      const userToFollow = await User.findById(req.params.userId);
      if (!userToFollow) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = await User.findById(req.user.id);

      if (user.following.includes(userToFollow._id)) {
        return res.status(400).json({ message: 'You are already following this user' });
      }

      user.following.push(userToFollow._id);
      userToFollow.followers.push(user._id);

      await user.save();
      await userToFollow.save();

      res.json({ message: `You are now following ${userToFollow.username}` });
    } catch (error) {
      handleError(res, 'Failed to follow user', error);
    }
  },

  // Unfollow a user
  async unfollowUser(req, res) {
    try {
      const userToUnfollow = await User.findById(req.params.userId);
      if (!userToUnfollow) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = await User.findById(req.user.id);

      if (!user.following.includes(userToUnfollow._id)) {
        return res.status(400).json({ message: 'You are not following this user' });
      }

      user.following = user.following.filter(followId => followId.toString() !== userToUnfollow._id.toString());
      userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId.toString() !== user._id.toString());

      await user.save();
      await userToUnfollow.save();

      res.json({ message: `You have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
      handleError(res, 'Failed to unfollow user', error);
    }
  },

  // Delete account
  async deleteAccount(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Optionally: Remove the user from followers and following lists
      await User.updateMany(
        { $or: [{ followers: user._id }, { following: user._id }] },
        { $pull: { followers: user._id, following: user._id } }
      );

      await user.remove();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      handleError(res, 'Failed to delete account', error);
    }
  },
};