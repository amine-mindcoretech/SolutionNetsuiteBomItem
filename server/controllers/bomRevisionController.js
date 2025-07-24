// controllers/bomRevisionController.js

const bomRevisionModel = require('../models/bomRevisionModel');

async function createBomRevision(req, res) {
    const bomRevisionData = req.body;
    console.log('Received BOM Revision data:', JSON.stringify(bomRevisionData, null, 2)); // Debug log

    try {
        const newBomRevision = await bomRevisionModel.createBomRevision(bomRevisionData);
        res.status(201).json(newBomRevision);
    } catch (error) {
        console.error('Error creating BOM Revision:', error);
        res.status(500).send('Error creating BOM Revision');
    }
}

module.exports = { createBomRevision };
