const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

module.exports = {
  // Create a new testimonial
  async createTestimonial(req, res) {
    try {
      const { content, videoUrl } = req.body;

      // Validate input
      if (!content) {
        return res.status(400).json({ message: 'Content is required.' });
      }

      const newTestimonial = new Testimonial({
        content,
        videoUrl, // Optional video URL
        user: req.user.id, // Associate the testimonial with the user
      });

      await newTestimonial.save();

      res.status(201).json({
        message: 'Testimonial submitted successfully',
        testimonial: newTestimonial,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit testimonial', error });
    }
  },

  // Get all testimonials
  async getAllTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.find()
        .populate('user', 'username profilePicture') // Populate user info
        .sort({ createdAt: -1 }); // Sort by creation date

      res.status(200).json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonials', error });
    }
  },

  // Get a testimonial by ID
  async getTestimonialById(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id)
        .populate('user', 'username profilePicture'); // Populate user info

      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      res.status(200).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonial', error });
    }
  },

  // Delete a testimonial
  async deleteTestimonial(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id);

      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      // Check if the user is the owner of the testimonial
      if (testimonial.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this testimonial' });
      }

      await testimonial.remove();
      res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete testimonial', error });
    }
  },
};