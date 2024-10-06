require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Hôte de la base de données
  port: process.env.DB_PORT || 5432, // Port de connexion à la base de données (par défaut PostgreSQL)
  username: process.env.DB_USERNAME || 'root', // Nom d'utilisateur de la base de données
  password: process.env.DB_PASSWORD || 'password', // Mot de passe pour la base de données
  database: process.env.DB_NAME || 'innostream_db', // Nom de la base de données
  dialect: process.env.DB_DIALECT || 'postgres', // Dialecte de la base de données (postgres, mysql, sqlite, etc.)
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10, // Maximum de connexions simultanées
    min: parseInt(process.env.DB_POOL_MIN) || 0, // Minimum de connexions dans le pool
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000, // Temps maximum (en ms) d'acquisition d'une connexion
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000, // Temps maximum d'inactivité avant de libérer une connexion
  },
  logging: process.env.DB_LOGGING === 'true', // Active ou désactive les logs des requêtes SQL
};

// Initialisation de Sequelize avec les paramètres de la base de données
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: dbConfig.logging ? console.log : false, // Affiche les requêtes SQL dans la console si activé
  }
);

// Fonction pour tester la connexion à la base de données
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testDbConnection,
};