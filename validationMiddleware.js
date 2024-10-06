const { validationResult } = require('express-validator');

/**
 * Middleware pour valider les données des requêtes.
 * @param {Array} validations - Un tableau de validations express-validator à appliquer.
 */
const validationMiddleware = (validations) => {
    return async (req, res, next) => {
        // Exécutez les validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Vérifiez les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Erreurs de validation', 
                errors: errors.array() 
            });
        }

        next(); // Passez au middleware suivant si aucune erreur
    };
};

module.exports = validationMiddleware;