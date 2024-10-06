const Product = require('../models/Product');
const User = require('../models/User');
const NotificationService = require('./notificationService');

class MarketplaceService {
    // Ajouter un produit au marketplace
    static async addProduct(productData, userId) {
        try {
            const product = new Product({
                ...productData,
                userId,
                createdAt: new Date(),
            });
            await product.save();

            // Notification à l'utilisateur que le produit a été ajouté
            await NotificationService.sendNotification(userId, 'Product Added', `Your product "${product.name}" has been added to the marketplace.`);

            return product;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Récupérer tous les produits du marketplace
    static async getAllProducts() {
        try {
            const products = await Product.find().populate('userId', 'username');
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Récupérer un produit par ID
    static async getProductById(productId) {
        try {
            const product = await Product.findById(productId).populate('userId', 'username');
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // Mettre à jour un produit
    static async updateProduct(productId, updateData, userId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.userId.toString() !== userId) {
                throw new Error('Unauthorized');
            }
            Object.assign(product, updateData);
            await product.save();
            return product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Supprimer un produit
    static async deleteProduct(productId, userId) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            if (product.userId.toString() !== userId) {
                throw new Error('Unauthorized');
            }
            await product.remove();
            return { message: 'Product deleted successfully' };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

module.exports = MarketplaceService;