//assemblySuiteqlController
const assemblyModel = require('../models/assemblySuiteModel');

async function getAllAssemblies(req, res) {
    try {
        const assemblies = await assemblyModel.getAssemblyItems();
        res.json(assemblies);
    } catch (error) {
        console.error('Erreur lors de la récupération des Assembly Items:', error);
        res.status(500).send('Erreur lors de la récupération des Assembly Items');
    }
}

async function getAssemblyById(req, res) {
    const id = req.params.id;
    try {
        const assembly = await assemblyModel.getAssemblyItemById(id);
        res.json(assembly);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'Assembly Item:', error);
        res.status(500).send('Erreur lors de la récupération de l\'Assembly Item');
    }
}

module.exports = { getAllAssemblies, getAssemblyById };
