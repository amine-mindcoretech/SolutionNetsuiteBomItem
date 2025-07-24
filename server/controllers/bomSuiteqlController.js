const bomSuiteqlModel = require('../models/bomSuiteqlModel');

async function getAvailableBOMs(req, res) {
    try {
        const boms = await bomSuiteqlModel.getAvailableBOMs();
        res.json(boms);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des BOMs');
    }
}

module.exports = { getAvailableBOMs };
