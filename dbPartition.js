const mongoose = require('mongoose');

// Fonction pour partitionner la base de données en utilisant Mongoose
async function partitionDatabase(userId) {
    const partition = userId % 10; // Exemple de partitionnement basé sur l'ID utilisateur
    const partitionedDbUri = `${process.env.MONGODB_URI}/partition_${partition}`;
    
    try {
        await mongoose.connect(partitionedDbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to partition_${partition}`);
    } catch (error) {
        console.error('Error connecting to partitioned database:', error.message);
        process.exit(1);
    }
}

// Fonction pour déconnecter une partition de la base de données
async function disconnectPartition() {
    await mongoose.disconnect();
}

module.exports = {
    partitionDatabase,
    disconnectPartition
};