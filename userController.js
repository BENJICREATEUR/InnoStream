const User = require('../models/User');
const { uploadProfileImage } = require('../services/cloudStorageService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  // User registration
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error });
    }
  },

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to login', error });
    }
  },

  // Fetch user profile details
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profile', error });
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
      res.status(500).json({ message: 'Failed to update profile', error });
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
      res.status(500).json({ message: 'Failed to update profile picture', error });
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
      res.status(500).json({ message: 'Failed to fetch followers', error });
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
      res.status(500).json({ message: 'Failed to fetch following', error });
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
      res.status(500).json({ message: 'Failed to follow user', error });
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
      res.status(500).json({ message: 'Failed to unfollow user', error });
    }
  },

  // Delete account
  async deleteAccount(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.remove();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete account', error });
    }
  },
};