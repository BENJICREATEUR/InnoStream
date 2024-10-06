/**
 * Middleware pour vérifier les rôles des utilisateurs.
 * @param {Array} allowedRoles - Un tableau des rôles autorisés pour accéder à la route.
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Vérifiez si l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
        }

        // Vérifiez si l'utilisateur a l'un des rôles autorisés
        const userRoles = req.user.roles || [];
        const hasAccess = userRoles.some(role => allowedRoles.includes(role));

        if (!hasAccess) {
            return res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.' });
        }

        next(); // L'utilisateur a l'accès, passer au middleware suivant
    };
};

module.exports = roleMiddleware;