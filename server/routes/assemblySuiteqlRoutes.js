//assemblySuiteqlRoutes
const express = require('express');
const assemblyController = require('../controllers/assemblySuiteqlController');

const router = express.Router();

// Route pour récupérer tous les Assembly Items
router.get('/assemblies', assemblyController.getAllAssemblies);

// Route pour récupérer un Assembly Item par son ID
router.get('/assembly/:id', assemblyController.getAssemblyById);

module.exports = router;
