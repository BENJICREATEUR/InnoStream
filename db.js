const mongoose = require('mongoose');

// Connexion à la base de données MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
}

// Fonction pour fermer la connexion à la base de données
async function disconnectDB() {
    await mongoose.disconnect();
}

module.exports = {
    connectDB,
    disconnectDB
};