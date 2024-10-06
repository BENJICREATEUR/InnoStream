const axios = require('axios');

// URL de l'API d'InnoStream
const BASE_URL = 'http://localhost:3000/api';

// Test de sécurité pour l'authentification des utilisateurs
async function testUserAuthentication() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'test@example.com',
            password: 'testPassword',
        });
        console.log(`Authentication Response: ${response.data}`);
    } catch (error) {
        console.error('Authentication failed:', error.response.data);
    }
}

// Test de sécurité pour la protection contre les injections SQL
async function testSQLInjection() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: "' OR '1'='1",
            password: "' OR '1'='1",
        });
        console.log('SQL Injection Response:', response.data);
    } catch (error) {
        console.error('SQL Injection attempt:', error.response.data);
    }
}

// Test de sécurité pour la protection CSRF
async function testCSRFProtection() {
    try {
        const csrfToken = 'sampleCsrfToken'; // Simuler un token CSRF valide
        const response = await axios.post(`${BASE_URL}/videos/upload`, {
            title: 'Test Video',
            description: 'This is a test video.',
        }, {
            headers: { 'X-CSRF-Token': csrfToken }
        });
        console.log('CSRF Protection Response:', response.data);
    } catch (error) {
        console.error('CSRF Protection failed:', error.response.data);
    }
}

// Exécuter les tests
(async function runSecurityTests() {
    await testUserAuthentication();
    await testSQLInjection();
    await testCSRFProtection();
})();