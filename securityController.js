const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/emailService');
const { generate2FACode, verify2FACode } = require('../services/twoFactorService');
const { sendAlert } = require('../services/alertService');
const { faceRecognition } = require('../services/faceRecognitionService');

module.exports = {
  // User Registration
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
        username,
      });

      await user.save();

      // Send verification email
      await sendVerificationEmail(user);

      res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error });
    }
  },

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Check if 2FA is enabled
      if (user.twoFAEnabled) {
        const code = generate2FACode();
        await sendVerificationCode(user.email, code);
        user.twoFACode = code;
        await user.save();
        return res.status(200).json({ message: '2FA code sent to your email', token });
      }

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to log in', error });
    }
  },

  // Verify 2FA Code
  async verify2FA(req, res) {
    try {
      const { code } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isVerified = verify2FACode(user.twoFACode, code);
      if (!isVerified) {
        return res.status(401).json({ message: 'Invalid 2FA code' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify 2FA code', error });
    }
  },

  // Enable 2FA
  async enable2FA(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.twoFAEnabled = true;
      await user.save();

      res.status(200).json({ message: '2FA enabled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to enable 2FA', error });
    }
  },

  // Disable 2FA
  async disable2FA(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.twoFAEnabled = false;
      await user.save();

      res.status(200).json({ message: '2FA disabled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to disable 2FA', error });
    }
  },

  // Face Recognition Authentication
  async faceRecognitionLogin(req, res) {
    try {
      const { image } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAuthenticated = await faceRecognition(user.faceData, image);
      if (!isAuthenticated) {
        return res.status(401).json({ message: 'Face recognition failed' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Failed to authenticate user', error });
    }
  },

  // Security Alert for New Device Login
  async alertNewDeviceLogin(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send alert for new device login
      await sendAlert(user.email, 'New device login detected', 'We detected a login from a new device. If this was not you, please secure your account.');

      res.status(200).json({ message: 'Alert sent for new device login' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send alert', error });
    }
  },
};