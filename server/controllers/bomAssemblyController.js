//bomAssemblyController.js
const bomAssemblyModel = require('../models/bomAssemblyModel');

async function linkBomToAssembly(req, res) {
    const { assemblyItemId, bomId } = req.body;

    if (!assemblyItemId || !bomId) {
        return res.status(400).json({ error: "assemblyItemId et bomId sont requis" });
    }

    try {
        const response = await bomAssemblyModel.linkBomToAssembly(assemblyItemId, bomId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la liaison du BOM à l'Assembly" });
    }
}

module.exports = { linkBomToAssembly };
