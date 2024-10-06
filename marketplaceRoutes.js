const express = require('express');
const marketplaceController = require('../controllers/marketplaceController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Route pour lister les produits dans le marketplace
router.get('/products', marketplaceController.listProducts);

// Route pour ajouter un produit (vente par un créateur)
router.post('/product', requireAuth, marketplaceController.addProduct);

// Route pour acheter un produit
router.post('/product/:productId/buy', requireAuth, marketplaceController.buyProduct);

// Route pour supprimer un produit du marketplace
router.delete('/product/:productId', requireAuth, marketplaceController.deleteProduct);

// Route pour lister les produits sponsorisés
router.get('/sponsored', marketplaceController.listSponsoredProducts);

module.exports = router;