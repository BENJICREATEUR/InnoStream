require('dotenv').config();
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

// Définition des configurations de base de l'application
const appConfig = {
  appName: process.env.APP_NAME || 'InnoStream',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiVersion: process.env.API_VERSION || 'v1',

  // Limite de requêtes par utilisateur (par minute)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // Limite de 100 requêtes par 15 minutes
  },

  // Paramètres de pagination
  pagination: {
    defaultLimit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT, 10) || 10,
    maxLimit: parseInt(process.env.PAGINATION_MAX_LIMIT, 10) || 100,
  },

  // Configuration des fichiers et des médias
  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB par défaut
    allowedFormats: ['image/jpeg', 'image/png', 'video/mp4', 'video/mkv'],
    storagePath: process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads'), // Chemin pour stocker les fichiers
  },

  // Services externes utilisés dans l'application
  externalServices: {
    cdnUrl: process.env.CDN_URL || 'https://cdn.innostream.com',
    cloudStorage: process.env.CLOUD_STORAGE || 'aws_s3', // Exemple: aws_s3, google_cloud_storage
    s3BucketName: process.env.S3_BUCKET_NAME || 'innostream-bucket',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  },

  // Paramètres de sécurité
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    csrfProtection: process.env.CSRF_PROTECTION === 'true', // Protection contre les attaques CSRF
    contentSecurityPolicy: process.env.CSP_POLICY || "default-src 'self'; img-src https:; script-src 'self' 'unsafe-inline'", // Politique de sécurité des contenus
    corsOptions: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE',
    },
  },

  // Paramètres Stripe pour la gestion des paiements
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.STRIPE_CURRENCY || 'USD',
  },

  // Paramètres pour les emails
  email: {
    fromEmail: process.env.FROM_EMAIL || 'no-reply@innostream.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    emailService: process.env.EMAIL_SERVICE || 'Mailtrap', // Ajout d'une configuration de service d'email
  },

  // Gestion des logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    logToFile: process.env.LOG_TO_FILE === 'true',
    logFilePath: process.env.LOG_FILE_PATH || './logs/app.log',
    logToConsole: process.env.LOG_TO_CONSOLE === 'true',
  },

  // Gestion des vidéos
  video: {
    maxResolution: process.env.VIDEO_MAX_RESOLUTION || '1080p',
    allowedFormats: process.env.VIDEO_ALLOWED_FORMATS?.split(',') || ['mp4', 'mkv', 'avi'],
    transcodingService: process.env.TRANSCODING_SERVICE || 'ffmpeg', // Ajout d'un service de transcodage
  },

  // Analyse de la performance
  performanceMonitor: {
    enable: process.env.PERFORMANCE_MONITOR === 'true',
    samplingRate: parseInt(process.env.PERFORMANCE_SAMPLING_RATE, 10) || 1, // Taux d'échantillonnage
  },

  // Services de gestion en temps réel (WebSocket)
  realTime: {
    enable: process.env.REALTIME_ENABLE === 'true',
    webSocketPort: process.env.WEBSOCKET_PORT || 8080,
  },
};

module.exports = appConfig;