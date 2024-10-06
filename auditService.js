const AuditLog = require('../models/AuditLog');

// Service pour enregistrer les logs d'audit
class AuditService {
    static async logAction(userId, action, details) {
        try {
            const auditLog = new AuditLog({
                userId,
                action,
                details,
                timestamp: new Date(),
            });
            await auditLog.save();
            console.log('Audit log saved:', auditLog);
        } catch (error) {
            console.error('Error saving audit log:', error);
        }
    }

    // Service pour récupérer les logs d'audit pour un utilisateur
    static async getUserAuditLogs(userId) {
        try {
            const logs = await AuditLog.find({ userId }).sort({ timestamp: -1 });
            return logs;
        } catch (error) {
            console.error('Error retrieving audit logs:', error);
            throw error;
        }
    }

    // Service pour récupérer tous les logs d'audit (pour admin)
    static async getAllAuditLogs() {
        try {
            const logs = await AuditLog.find().sort({ timestamp: -1 });
            return logs;
        } catch (error) {
            console.error('Error retrieving all audit logs:', error);
            throw error;
        }
    }
}

module.exports = AuditService;