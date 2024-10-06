const Role = require('../models/Role');

class RoleService {
    // Créer un nouveau rôle
    static async createRole(roleName) {
        try {
            const role = new Role({ name: roleName });
            await role.save();
            return role;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    }

    // Récupérer tous les rôles
    static async getAllRoles() {
        try {
            const roles = await Role.find();
            return roles;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    }

    // Assigner un rôle à un utilisateur
    static async assignRoleToUser(userId, roleId) {
        try {
            const role = await Role.findById(roleId);
            if (!role) {
                throw new Error('Role not found');
            }

            // Assuming we have a User model
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.roles.push(role._id);
            await user.save();
            return user;
        } catch (error) {
            console.error('Error assigning role to user:', error);
            throw error;
        }
    }

    // Retirer un rôle d'un utilisateur
    static async removeRoleFromUser(userId, roleId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.roles = user.roles.filter(role => role.toString() !== roleId);
            await user.save();
            return user;
        } catch (error) {
            console.error('Error removing role from user:', error);
            throw error;
        }
    }
}

module.exports = RoleService;