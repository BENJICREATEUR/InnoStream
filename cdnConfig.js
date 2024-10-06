require('dotenv').config();

const cdnConfig = {
  // URL de base du CDN
  baseUrl: process.env.CDN_URL || 'https://cdn.innostream.com',

  // Clé d'API du CDN pour les interactions avec le service
  apiKey: process.env.CDN_API_KEY || 'your_cdn_api_key',

  // Paramètres de sécurité pour les contenus multimédias (expiration des liens, signature)
  security: {
    enableSignedUrls: process.env.CDN_ENABLE_SIGNED_URLS === 'true',
    signedUrlSecret: process.env.CDN_SIGNED_URL_SECRET || 'your_signed_url_secret',
    signedUrlExpiration: parseInt(process.env.CDN_SIGNED_URL_EXPIRATION, 10) || 3600, // Durée en secondes
  },

  // Limites des téléchargements de fichiers
  uploadLimits: {
    maxFileSize: parseInt(process.env.CDN_MAX_FILE_SIZE, 10) || 100 * 1024 * 1024, // 100 MB par défaut
    allowedFormats: (process.env.CDN_ALLOWED_FORMATS || 'image/jpeg,image/png,video/mp4,video/mkv')
      .split(','),
  },

  // Paramètres pour le caching
  cache: {
    cacheControlHeader: process.env.CDN_CACHE_CONTROL || 'public, max-age=31536000', // 1 an par défaut
    purgeCacheUrl: process.env.CDN_PURGE_CACHE_URL || 'https://cdn.innostream.com/purge',
    enableAutoCachePurge: process.env.CDN_AUTO_PURGE_CACHE === 'true',
  },

  // Gestion des vidéos (optimisation, qualité, etc.)
  videoConfig: {
    enableTranscoding: process.env.CDN_ENABLE_TRANSCODING === 'true',
    videoFormats: (process.env.CDN_VIDEO_FORMATS || 'mp4,webm').split(','),
    resolutions: (process.env.CDN_VIDEO_RESOLUTIONS || '360,720,1080').split(',').map(Number),
    defaultResolution: parseInt(process.env.CDN_DEFAULT_RESOLUTION, 10) || 720,
  },

  // Répertoires et gestion des chemins de stockage
  storagePaths: {
    images: process.env.CDN_IMAGES_PATH || '/media/images/',
    videos: process.env.CDN_VIDEOS_PATH || '/media/videos/',
    thumbnails: process.env.CDN_THUMBNAILS_PATH || '/media/thumbnails/',
  },

  // Intégration avec le stockage en cloud (optionnel si le CDN travaille avec un cloud storage)
  cloudStorage: {
    provider: process.env.CLOUD_STORAGE_PROVIDER || 'aws_s3',
    bucketName: process.env.CLOUD_STORAGE_BUCKET || 'innostream-media',
    region: process.env.CLOUD_STORAGE_REGION || 'us-west-1',
    accessKeyId: process.env.CLOUD_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_STORAGE_SECRET_ACCESS_KEY,
  },

  // Gestion des logs CDN
  logging: {
    logRequests: process.env.CDN_LOG_REQUESTS === 'true',
    logFilePath: process.env.CDN_LOG_FILE_PATH || './logs/cdn.log',
    logLevel: process.env.CDN_LOG_LEVEL || 'info', // Ajout d'un niveau de log
  },

  // Paramètres avancés pour la gestion des requêtes
  requestHandling: {
    maxConnections: parseInt(process.env.CDN_MAX_CONNECTIONS, 10) || 1000,
    timeout: parseInt(process.env.CDN_REQUEST_TIMEOUT, 10) || 30000, // Timeout des requêtes en millisecondes
    retryOnFail: process.env.CDN_RETRY_ON_FAIL === 'true', // Réessaye en cas d'échec de requête
    retryAttempts: parseInt(process.env.CDN_RETRY_ATTEMPTS, 10) || 3, // Nombre de tentatives en cas d'échec
  },

  // Paramètres pour la surveillance de la santé et de la charge
  monitoring: {
    healthCheckUrl: process.env.CDN_HEALTH_CHECK_URL || 'https://cdn.innostream.com/health',
    enableMonitoring: process.env.CDN_ENABLE_MONITORING === 'true',
    monitoringInterval: parseInt(process.env.CDN_MONITORING_INTERVAL, 10) || 60000, // En millisecondes
  },

  // Notifications pour les erreurs et les événements importants
  notifications: {
    enableEmailAlerts: process.env.CDN_ENABLE_EMAIL_ALERTS === 'true',
    alertEmail: process.env.CDN_ALERT_EMAIL || 'admin@innostream.com',
    slackWebhookUrl: process.env.CDN_SLACK_WEBHOOK_URL, // Pour les alertes sur Slack (optionnel)
  },

  // Optimisations pour le préchargement et les priorités
  optimization: {
    enablePreload: process.env.CDN_ENABLE_PRELOAD === 'true',
    preloadPaths: (process.env.CDN_PRELOAD_PATHS || '/media/images/,/media/videos/').split(','),
    priorityPaths: (process.env.CDN_PRIORITY_PATHS || '/media/thumbnails/').split(','),
  },
};

module.exports = cdnConfig;
