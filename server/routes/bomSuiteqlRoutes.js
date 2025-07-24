const express = require('express');
const bomSuiteqlController = require('../controllers/bomSuiteqlController');

const router = express.Router();

// Route pour récupérer les BOM disponibles pour tous les assemblages
router.get('/boms', bomSuiteqlController.getAvailableBOMs);

module.exports = router;
