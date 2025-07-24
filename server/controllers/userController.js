//userController.js
const userModel = require('../models/userModel');

const register = async (req, res) => {
    try {
        await userModel.createUser(req.body);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur' });
    }
};

const getUsers = async (req, res) => {
    try {
        const user = await userModel.getUsers(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur' });
    }
};


const updateUser = async (req, res) => {
    try {
        await userModel.updateUserById(req.params.id, req.body);
        res.json({ message: 'Utilisateur mis à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l’utilisateur' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userModel.deleteUserById(req.params.id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’utilisateur' });
    }
};

module.exports = { register, getUser, updateUser, deleteUser, getUsers };
