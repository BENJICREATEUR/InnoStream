const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { applySecurityHeaders, limiter } = require('./utils/securityMonitor');
const authRoutes = require('./routes/authRoutes');
const liveStreamRoutes = require('./routes/liveStreamRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const videoRoutes = require('./routes/videoRoutes');
const moderationRoutes = require('./routes/moderationRoutes');
const { monitorPerformance } = require('./utils/performanceMonitor');
const { getVersion } = require('./utils/versioning');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
applySecurityHeaders(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/moderation', moderationRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
    const performanceData = await monitorPerformance();
    res.status(200).json({
        status: 'healthy',
        version: getVersion(),
        performance: performanceData
    });
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});