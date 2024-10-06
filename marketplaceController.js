const MarketplaceItem = require('../models/MarketplaceItem');
const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

// Créer un nouvel article dans le marketplace
const createMarketplaceItem = async (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const newItem = new MarketplaceItem({
      title,
      description,
      price,
      imageUrl,
      user: userId,
      createdAt: new Date(),
      sold: false,
    });

    await newItem.save();

    return res.status(201).json({ message: 'Article créé avec succès.', item: newItem });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article :', error);
    return res.status(500).json({ message: 'Erreur lors de la création de l\'article.' });
  }
};

// Obtenir tous les articles du marketplace
const getAllMarketplaceItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find().populate('user', 'email').sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des articles.' });
  }
};

// Obtenir un article par ID
const getMarketplaceItemById = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await MarketplaceItem.findById(itemId).populate('user', 'email');
    if (!item) {
      return res.status(404).json({ message: 'Article non trouvé.' });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'article.' });
  }
};

// Acheter un article
const purchaseMarketplaceItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Article non trouvé.' });
    }

    if (item.sold) {
      return res.status(400).json({ message: 'L\'article a déjà été vendu.' });
    }

    // Mettre à jour l'état de l'article
    item.sold = true;
    item.buyer = userId; // Assigner l'acheteur
    await item.save();

    // Notifier le vendeur
    const seller = await User.findById(item.user);
    sendNotification(seller.email, `Votre article "${item.title}" a été vendu.`);

    return res.status(200).json({ message: 'Article acheté avec succès.', item });
  } catch (error) {
    console.error('Erreur lors de l\'achat de l\'article :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'achat de l\'article.' });
  }
};

// Mettre à jour un article du marketplace
const updateMarketplaceItem = async (req, res) => {
  const { itemId } = req.params;
  const updates = req.body;

  try {
    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Article non trouvé.' });
    }

    Object.assign(item, updates);
    await item.save();

    return res.status(200).json({ message: 'Article mis à jour avec succès.', item });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article :', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article.' });
  }
};

// Supprimer un article du marketplace
const deleteMarketplaceItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Article non trouvé.' });
    }

    await item.remove();
    return res.status(200).json({ message: 'Article supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'article.' });
  }
};

// Exporter les fonctions
module.exports = {
  createMarketplaceItem,
  getAllMarketplaceItems,
  getMarketplaceItemById,
  purchaseMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
};