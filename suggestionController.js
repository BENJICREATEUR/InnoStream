const Suggestion = require('../models/Suggestion');
const User = require('../models/User');

module.exports = {
  // Create a new suggestion
  async createSuggestion(req, res) {
    try {
      const { title, description } = req.body;

      // Validate input
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
      }

      const newSuggestion = new Suggestion({
        title,
        description,
        user: req.user.id, // Associate the suggestion with the user
      });

      await newSuggestion.save();

      res.status(201).json({
        message: 'Suggestion submitted successfully',
        suggestion: newSuggestion,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to submit suggestion', error });
    }
  },

  // Get all suggestions
  async getAllSuggestions(req, res) {
    try {
      const suggestions = await Suggestion.find()
        .populate('user', 'username profilePicture') // Populate user info
        .sort({ createdAt: -1 }); // Sort by creation date

      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suggestions', error });
    }
  },

  // Get a suggestion by ID
  async getSuggestionById(req, res) {
    try {
      const suggestion = await Suggestion.findById(req.params.id)
        .populate('user', 'username profilePicture'); // Populate user info

      if (!suggestion) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      res.status(200).json(suggestion);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch suggestion', error });
    }
  },

  // Delete a suggestion
  async deleteSuggestion(req, res) {
    try {
      const suggestion = await Suggestion.findById(req.params.id);

      if (!suggestion) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      // Check if the user is the owner of the suggestion
      if (suggestion.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this suggestion' });
      }

      await suggestion.remove();
      res.status(200).json({ message: 'Suggestion deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete suggestion', error });
    }
  },
};