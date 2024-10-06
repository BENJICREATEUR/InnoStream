const promClient = require('prom-client');

// Configuration du registre de Prometheus
const register = new promClient.Registry();

// Initialisation des métriques par défaut de Prometheus
promClient.collectDefaultMetrics({
  app: 'innostream_backend',
  prefix: 'innostream_',
  timeout: 5000, // Fréquence de collecte des métriques (en millisecondes)
  register,
});

// Exemple de métrique personnalisée - compteur HTTP
const httpRequestCounter = new promClient.Counter({
  name: 'innostream_http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status_code'],
});

// Exemple de métrique personnalisée - histogramme des temps de réponse HTTP
const httpRequestDuration = new promClient.Histogram({
  name: 'innostream_http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5], // Buckets de temps de réponse
});

// Middleware pour enregistrer les métriques des requêtes HTTP
const monitoringMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer(); // Commence la mesure de la durée

  res.on('finish', () => {
    // Mise à jour des métriques à la fin de la requête
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });

    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
  });

  next(); // Continue le traitement de la requête
};

// Route pour exposer les métriques à Prometheus
const metricsRoute = (app) => {
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics()); // Expose les métriques
    } catch (err) {
      res.status(500).end(err);
    }
  });
};

module.exports = {
  monitoringMiddleware,
  metricsRoute,
};