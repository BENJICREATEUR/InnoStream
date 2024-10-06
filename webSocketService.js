const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { notifyUsers } = require('../utils/notificationService');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.connectedUsers = new Map();

        this.wss.on('connection', (ws) => {
            const userId = uuidv4(); // Identifier unique pour chaque utilisateur
            this.connectedUsers.set(userId, ws);

            ws.on('message', (message) => {
                this.handleMessage(userId, message);
            });

            ws.on('close', () => {
                this.connectedUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
            });

            console.log(`User ${userId} connected`);
        });
    }

    // Gérer les messages reçus des clients
    handleMessage(userId, message) {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'chat':
                this.broadcast(data);
                break;
            case 'notification':
                notifyUsers(data);
                break;
            default:
                console.error('Unknown message type:', data.type);
        }
    }

    // Diffuser des messages à tous les utilisateurs connectés
    broadcast(data) {
        const message = JSON.stringify(data);
        this.connectedUsers.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(message);
            }
        });
    }
}

module.exports = WebSocketService;