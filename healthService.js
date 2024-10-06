const mongoose = require('mongoose');

class HealthService {
    static async checkDatabaseConnection() {
        try {
            await mongoose.connection.db.admin().ping();
            return { status: 'ok', message: 'Database is connected' };
        } catch (error) {
            return { status: 'error', message: 'Database is not reachable' };
        }
    }

    static async checkHealth() {
        const dbHealth = await this.checkDatabaseConnection();
        return {
            status: 'ok',
            services: {
                database: dbHealth,
            },
        };
    }
}

module.exports = HealthService;