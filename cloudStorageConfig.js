require('dotenv').config();
const { Storage } = require('@google-cloud/storage'); // Exemple pour Google Cloud Storage
const AWS = require('aws-sdk'); // Exemple pour AWS S3

// Configuration pour différents fournisseurs de stockage en cloud
const cloudStorageConfig = {
  provider: process.env.CLOUD_STORAGE_PROVIDER || 'aws_s3', // 'aws_s3', 'google_cloud', etc.

  // Configuration pour AWS S3
  awsS3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME || 'innostream-bucket',
    region: process.env.AWS_S3_REGION || 'us-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your_access_key_id',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_access_key',
  },

  // Configuration pour Google Cloud Storage
  googleCloud: {
    bucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || 'innostream-bucket',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your_project_id',
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE || './path/to/keyfile.json',
  },

  // Répertoires de stockage pour les différents types de contenu
  storagePaths: {
    images: '/media/images/', // Chemin pour les images
    videos: '/media/videos/', // Chemin pour les vidéos
    thumbnails: '/media/thumbnails/', // Chemin pour les miniatures
  },

  // Paramètres de sécurité
  security: {
    enableEncryption: process.env.CLOUD_STORAGE_ENCRYPTION === 'true', // Chiffrement des données
    encryptionKey: process.env.CLOUD_STORAGE_ENCRYPTION_KEY || 'your_encryption_key',
    signedUrlExpiration: process.env.CLOUD_SIGNED_URL_EXPIRATION || 3600, // Expiration des URLs signées en secondes
  },

  // Limites des fichiers téléversés
  uploadLimits: {
    maxFileSize: process.env.CLOUD_MAX_FILE_SIZE || 100 * 1024 * 1024, // Limite de 100MB par fichier
    allowedFormats: ['image/jpeg', 'image/png', 'video/mp4', 'video/mkv'], // Formats autorisés
  },

  // Logs des activités de stockage
  logging: {
    logFilePath: process.env.CLOUD_STORAGE_LOG_PATH || './logs/cloudStorage.log', // Chemin pour les logs
    logLevel: process.env.CLOUD_STORAGE_LOG_LEVEL || 'info', // Niveau des logs ('info', 'error', etc.)
  },
};

// Initialisation du client pour AWS S3
let cloudStorageClient;

if (cloudStorageConfig.provider === 'aws_s3') {
  AWS.config.update({
    region: cloudStorageConfig.awsS3.region,
    accessKeyId: cloudStorageConfig.awsS3.accessKeyId,
    secretAccessKey: cloudStorageConfig.awsS3.secretAccessKey,
  });

  cloudStorageClient = new AWS.S3();
}

// Initialisation du client pour Google Cloud Storage
if (cloudStorageConfig.provider === 'google_cloud') {
  cloudStorageClient = new Storage({
    projectId: cloudStorageConfig.googleCloud.projectId,
    keyFilename: cloudStorageConfig.googleCloud.keyFilename,
  });
}

// Fonction pour télécharger des fichiers vers le cloud
async function uploadFile(filePath, destination) {
  const bucketName =
    cloudStorageConfig.provider === 'aws_s3'
      ? cloudStorageConfig.awsS3.bucketName
      : cloudStorageConfig.googleCloud.bucketName;

  if (cloudStorageConfig.provider === 'aws_s3') {
    const params = {
      Bucket: bucketName,
      Key: destination,
      Body: filePath,
    };

    return await cloudStorageClient.upload(params).promise();
  }

  if (cloudStorageConfig.provider === 'google_cloud') {
    const bucket = cloudStorageClient.bucket(bucketName);
    return await bucket.upload(filePath, { destination });
  }
}

// Fonction pour générer une URL signée pour un fichier stocké
async function generateSignedUrl(filePath) {
  const bucketName =
    cloudStorageConfig.provider === 'aws_s3'
      ? cloudStorageConfig.awsS3.bucketName
      : cloudStorageConfig.googleCloud.bucketName;

  if (cloudStorageConfig.provider === 'aws_s3') {
    const params = {
      Bucket: bucketName,
      Key: filePath,
      Expires: parseInt(cloudStorageConfig.security.signedUrlExpiration),
    };
    return cloudStorageClient.getSignedUrl('getObject', params);
  }

  if (cloudStorageConfig.provider === 'google_cloud') {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + parseInt(cloudStorageConfig.security.signedUrlExpiration) * 1000,
    };
    const [url] = await cloudStorageClient
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);
    return url;
  }
}

module.exports = {
  cloudStorageConfig,
  uploadFile,
  generateSignedUrl,
};