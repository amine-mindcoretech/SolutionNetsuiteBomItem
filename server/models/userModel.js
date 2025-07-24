//userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// 🔹 Fonction pour chiffrer les données sensibles
const encryptData = (data) => {
    return data ? CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_SECRET).toString() : null;
};

// 🔹 Fonction pour déchiffrer les données sensibles
const decryptData = (encryptedData) => {
    if (!encryptedData) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// 🔹 Créer un utilisateur avec chiffrement des champs sensibles
const createUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const encryptedConsumerKey = encryptData(userData.consumerKey);
        const encryptedConsumerSecret = encryptData(userData.consumerSecret);
        const encryptedAccessToken = encryptData(userData.accessToken);
        const encryptedTokenSecret = encryptData(userData.tokenSecret);

        const query = `
        INSERT INTO users_netsuite (
            departement, matricule, superviseur_matricule, privilege, nom, prenom, login, password, 
            consumerKey, consumerSecret, accessToken, tokenSecret, statut, entreprise, actif, sexe, adresse, 
            ville, province, pays, codePostal, telephone, telephonePortable, telephone2, compagnieTelephone, 
            contactUrgence1, contactUrgence2, adresseCourriel, adresseCourrielCorporative, app, langue, 
            dateNaissance, dateEmbauche, dateCessation, dateProbation1, dateProbation2, evaluationSalariale, 
            codeCc, typeRemuneration, numeroRamq, syndicatLocal, regleTempsSupp, regleCorrection, regleException, 
            regleFeriee, cumulatifBanques, salaireParDefaut, metier, competence, poste, position,  
            typeDisponibilite, ordreStatut, codeHorodateur, profilSecurite
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            userData.departement || null, userData.matricule || null, userData.superviseur_matricule || null,
            userData.privilege || null, userData.nom || null, userData.prenom || null, userData.login || null,
            hashedPassword || null, encryptedConsumerKey || null, encryptedConsumerSecret || null,
            encryptedAccessToken || null, encryptedTokenSecret || null, userData.statut || null,
            userData.entreprise || null, userData.actif ?? 1, userData.sexe || null, userData.adresse || null,
            userData.ville || null, userData.province || null, userData.pays || null, userData.codePostal || null,
            userData.telephone || null, userData.telephonePortable || null, userData.telephone2 || null,
            userData.compagnieTelephone || null, userData.contactUrgence1 || null, userData.contactUrgence2 || null,
            userData.adresseCourriel || null, userData.adresseCourrielCorporative || null, userData.app || null,
            userData.langue || null, userData.dateNaissance || null, userData.dateEmbauche || null,
            userData.dateCessation || null, userData.dateProbation1 || null, userData.dateProbation2 || null,
            userData.evaluationSalariale || null, userData.codeCc || null, userData.typeRemuneration || null,
            userData.numeroRamq || null, userData.syndicatLocal || null, userData.regleTempsSupp || null,
            userData.regleCorrection || null, userData.regleException || null, userData.regleFeriee || null,
            userData.cumulatifBanques || null, userData.salaireParDefaut || null, userData.metier || null,
            userData.competence || null, userData.poste || null, userData.position || null,
            userData.typeDisponibilite || null, userData.ordreStatut || null, userData.codeHorodateur || null,
            JSON.stringify(userData.profilSecurite || {})
        ];

        console.log("🔹 SQL QUERY:", query);
        console.log("🔹 SQL VALUES:", values);

        await db.execute(query, values);
    } catch (error) {
        console.error("🚨 Erreur MySQL :", error);
        throw error;
    }
};

// 🔹 Récupérer tous les utilisateurs
const getUsers = async (id) => {
    try {
        const [users] = await db.execute('SELECT * FROM users_netsuite');
        if (users.length === 0) return null;

        const user = users[0];
        user.password = decryptData(user.password);
        user.consumerKey = decryptData(user.consumerKey);
        user.consumerSecret = decryptData(user.consumerSecret);
        user.accessToken = decryptData(user.accessToken);
        user.tokenSecret = decryptData(user.tokenSecret);

        return user;
    } catch (error) {
        console.error("🚨 Erreur MySQL (getUsers) :", error);
        throw error;
    }
};


// 🔹 Récupérer un utilisateur et déchiffrer les champs sensibles
const getUserById = async (id) => {
    try {
        const [users] = await db.execute('SELECT * FROM users_netsuite WHERE idUsers = ?', [id]);
        if (users.length === 0) return null;

        const user = users[0];
        user.password = decryptData(user.password);
        user.consumerKey = decryptData(user.consumerKey);
        user.consumerSecret = decryptData(user.consumerSecret);
        user.accessToken = decryptData(user.accessToken);
        user.tokenSecret = decryptData(user.tokenSecret);

        return user;
    } catch (error) {
        console.error("🚨 Erreur MySQL (getUserById) :", error);
        throw error;
    }
};

// 🔹 Mettre à jour un utilisateur
const updateUserById = async (id, userData) => {
    try {
        let updates = [];
        let values = [];

        // Vérifie chaque champ et l'ajoute à la requête SQL si présent
        if (userData.nom) {
            updates.push("nom = ?");
            values.push(userData.nom);
        }
        if (userData.prenom) {
            updates.push("prenom = ?");
            values.push(userData.prenom);
        }
        if (userData.login) {
            updates.push("login = ?");
            values.push(userData.login);
        }
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }
        if (userData.consumerKey) {
            updates.push("consumerKey = ?");
            values.push(encryptData(userData.consumerKey));
        }
        if (userData.consumerSecret) {
            updates.push("consumerSecret = ?");
            values.push(encryptData(userData.consumerSecret));
        }
        if (userData.accessToken) {
            updates.push("accessToken = ?");
            values.push(encryptData(userData.accessToken));
        }
        if (userData.tokenSecret) {
            updates.push("tokenSecret = ?");
            values.push(encryptData(userData.tokenSecret));
        }
        if (userData.adresseCourriel) {
            updates.push("adresseCourriel = ?");
            values.push(userData.adresseCourriel);
        }
        if (userData.ville) {
            updates.push("ville = ?");
            values.push(userData.ville);
        }
        if (userData.province) {
            updates.push("province = ?");
            values.push(userData.province);
        }
        if (userData.pays) {
            updates.push("pays = ?");
            values.push(userData.pays);
        }
        if (userData.telephone) {
            updates.push("telephone = ?");
            values.push(userData.telephone);
        }
        if (userData.poste) {
            updates.push("poste = ?");
            values.push(userData.poste);
        }

        // Vérifie s'il y a des champs à mettre à jour
        if (updates.length === 0) {
            throw new Error("Aucune donnée fournie pour la mise à jour.");
        }

        // Construit la requête SQL dynamique
        const query = `UPDATE users_netsuite SET ${updates.join(", ")} WHERE idUsers = ?`;
        values.push(id); // Ajoute l'ID à la fin des valeurs

        console.log("🔹 SQL UPDATE QUERY:", query);
        console.log("🔹 SQL UPDATE VALUES:", values);

        await db.execute(query, values);
    } catch (error) {
        console.error("🚨 Erreur MySQL (updateUserById) :", error);
        throw error;
    }
};


// 🔹 Supprimer un utilisateur
const deleteUserById = async (id) => {
    try {
        await db.execute('DELETE FROM users_netsuite WHERE idUsers = ?', [id]);
    } catch (error) {
        console.error("🚨 Erreur MySQL (deleteUserById) :", error);
        throw error;
    }
};

module.exports = { createUser, getUserById, updateUserById, deleteUserById, getUsers };
