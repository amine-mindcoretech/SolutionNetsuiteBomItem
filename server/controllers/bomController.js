//bomController.js

const bomModel = require('../models/bomModel');

async function getBom(req, res) {
    const bomId = req.params.id;
    try {
        const bom = await bomModel.getBomById(bomId);
        res.json(bom);
    } catch (error) {
        res.status(500).send('Error retrieving BOM');
    }
}

async function createBom(req, res) {
    const bomData = req.body;
    console.log('Received BOM data:', bomData); // Affichez les données reçues
    try {
        const newBom = await bomModel.createBom(bomData);
        res.status(201).json(newBom);
    } catch (error) {
        console.error('Error creating BOM:', error); // Affichez l'erreur complète
        if (error.response && error.response.status === 400) {
            // Propager l'erreur 400 avec les détails de NetSuite
            res.status(400).json({
                error: 'Erreur lors de la création du BOM',
                detail: error.response.data['o:errorDetails'][0].detail
            });
        } else {
            res.status(500).send('Error creating BOM');
        }
    }
}
async function searchBomByName(req, res) {
    const bomName = req.query.name;
    try {
        const bom = await bomModel.searchBomByName(bomName);
        if (bom) {
            res.json(bom);
        } else {
            res.status(404).send('BOM not found');
        }
    } catch (error) {
        res.status(500).send('Error searching BOM');
    }
}

module.exports = { getBom, createBom, searchBomByName };

