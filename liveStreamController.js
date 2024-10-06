const LiveStream = require('../models/LiveStream');
const User = require('../models/User');
const { generateStreamKey } = require('../services/streamService');
const { sendNotification } = require('../services/notificationService');

// Créer un nouveau live stream
const createLiveStream = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const streamKey = generateStreamKey();

    const newLiveStream = new LiveStream({
      title,
      description,
      user: userId,
      streamKey,
      isLive: false,
      viewers: [],
      createdAt: new Date(),
    });

    await newLiveStream.save();

    return res.status(201).json({ message: 'Live stream créé avec succès.', stream: newLiveStream });
  } catch (error) {
    console.error('Erreur lors de la création du live stream :', error);
    return res.status(500).json({ message: 'Erreur lors de la création du live stream.' });
  }
};

// Démarrer un live stream
const startLiveStream = async (req, res) => {
  const { streamId } = req.params;

  try {
    const liveStream = await LiveStream.findById(streamId);
    if (!liveStream) {
      return res.status(404).json({ message: 'Live stream non trouvé.' });
    }

    if (liveStream.isLive) {
      return res.status(400).json({ message: 'Le live stream est déjà en cours.' });
    }

    liveStream.isLive = true;
    await liveStream.save();

    // Notifier les abonnés
    const user = await User.findById(liveStream.user);
    sendNotification(user.email, 'Votre live stream est maintenant en direct.');

    return res.status(200).json({ message: 'Live stream démarré avec succès.', stream: liveStream });
  } catch (error) {
    console.error('Erreur lors du démarrage du live stream :', error);
    return res.status(500).json({ message: 'Erreur lors du démarrage du live stream.' });
  }
};

// Arrêter un live stream
const stopLiveStream = async (req, res) => {
  const { streamId } = req.params;

  try {
    const liveStream = await LiveStream.findById(streamId);
    if (!liveStream) {
      return res.status(404).json({ message: 'Live stream non trouvé.' });
    }

    if (!liveStream.isLive) {
      return res.status(400).json({ message: 'Le live stream n\'est pas en cours.' });
    }

    liveStream.isLive = false;
    await liveStream.save();

    return res.status(200).json({ message: 'Live stream arrêté avec succès.', stream: liveStream });
  } catch (error) {
    console.error('Erreur lors de l\'arrêt du live stream :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'arrêt du live stream.' });
  }
};

// Obtenir tous les live streams
const getAllLiveStreams = async (req, res) => {
  try {
    const liveStreams = await LiveStream.find().populate('user', 'email');
    return res.status(200).json(liveStreams);
  } catch (error) {
    console.error('Erreur lors de la récupération des live streams :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des live streams.' });
  }
};

// Obtenir un live stream par ID
const getLiveStreamById = async (req, res) => {
  const { streamId } = req.params;

  try {
    const liveStream = await LiveStream.findById(streamId).populate('user', 'email');
    if (!liveStream) {
      return res.status(404).json({ message: 'Live stream non trouvé.' });
    }
    return res.status(200).json(liveStream);
  } catch (error) {
    console.error('Erreur lors de la récupération du live stream :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération du live stream.' });
  }
};

// Ajouter un spectateur au live stream
const addViewer = async (req, res) => {
  const { streamId } = req.params;
  const userId = req.user.id;

  try {
    const liveStream = await LiveStream.findById(streamId);
    if (!liveStream) {
      return res.status(404).json({ message: 'Live stream non trouvé.' });
    }

    if (!liveStream.viewers.includes(userId)) {
      liveStream.viewers.push(userId);
      await liveStream.save();
    }

    return res.status(200).json({ message: 'Vous avez rejoint le live stream.', viewers: liveStream.viewers });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un spectateur :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un spectateur.' });
  }
};

// Retirer un spectateur du live stream
const removeViewer = async (req, res) => {
  const { streamId } = req.params;
  const userId = req.user.id;

  try {
    const liveStream = await LiveStream.findById(streamId);
    if (!liveStream) {
      return res.status(404).json({ message: 'Live stream non trouvé.' });
    }

    if (liveStream.viewers.includes(userId)) {
      liveStream.viewers = liveStream.viewers.filter(viewer => viewer.toString() !== userId.toString());
      await liveStream.save();
    }

    return res.status(200).json({ message: 'Vous avez quitté le live stream.', viewers: liveStream.viewers });
  } catch (error) {
    console.error('Erreur lors du retrait d\'un spectateur :', error);
    return res.status(500).json({ message: 'Erreur lors du retrait d\'un spectateur.' });
  }
};

// Exporter les fonctions
module.exports = {
  createLiveStream,
  startLiveStream,
  stopLiveStream,
  getAllLiveStreams,
  getLiveStreamById,
  addViewer,
  removeViewer,
};